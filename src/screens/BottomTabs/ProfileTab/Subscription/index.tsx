import { useIsFocused } from "@react-navigation/native";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  ImageBackground,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import * as RNIap from "react-native-iap";
import {
  deepLinkToSubscriptions,
  ErrorCode,
  fetchProducts,
  ProductSubscription,
  ProductSubscriptionAndroid,
  ProductSubscriptionIOS,
  useIAP,
} from "react-native-iap";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import CancelSubscriptionConfirmModal from "../../../../components/Modals/CancelSubscriptionConfirmModal";
import PlanCard from "../../../../components/PlanCard";
import PrimaryButton from "../../../../components/PrimaryButton";
import ENDPOINTS from "../../../../service/ApiEndpoints";
import { GetSubscriptionDataAPiResponse } from "../../../../service/ApiResponses/GetUserSubscriptionData";
import { fetchData } from "../../../../service/ApiService";
import { SubscriptionScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { formatDate } from "../../../../utils/Helpers";
import { verticalScale } from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const productIds = Platform.select({
  ios: ["org.reactjs.native.deepfeels.membership"],
  android: ["com_deepfeels_monthly"],
});

const STATIC_PLAN_FEATURES = [
  "✦    Unlimited journal entries",
  "✦    Daily nervous-system informed insights",
  "✦    Connection + communication guidance for the people in your life",
  "✦    Personalized reminders to help you stay grounded",
  "✦    Weekly emotional pattern overview",
];

const SubScription: FC<SubscriptionScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();
  const isFocused = useIsFocused();

  const [isCancelSubscriptionModal, setIsCancelSubscriptionModal] =
    useState(false);

  // Renamed to initialLoad to clearly separate it from refreshing
  const [initialLoad, setInitialLoad] = useState(true);

  const [subscriptionData, setSubscriptionData] =
    useState<GetSubscriptionDataAPiResponse | null>(null);

  const [subscriptionsList, setSubscriptionsList] = useState<
    ProductSubscription[] | null
  >([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isCancelling, setIsCancelling] = useState(false);

  const [appState, setAppState] = useState(AppState.currentState);

  const { getActiveSubscriptions } = useIAP({
    onPurchaseSuccess: async (purchase) => {},
    onPurchaseError: async (error) => {
      console.error("IAP Purchase Failed:", error.code, error.message);
      if (error.code !== ErrorCode.UserCancelled) {
        Alert.alert("Error", error.message);
      }
    },
  });

  // 1. Modified getSubscriptionDetails to handle loading outside
  const getSubscriptionDetails = useCallback(async () => {
    try {
      const response = await fetchData<GetSubscriptionDataAPiResponse>(
        ENDPOINTS.getSubscriptionDetails
      );

      if (response.data.success) {
        setSubscriptionData(response.data.data);
      }
      return true;
    } catch (error: any) {
      console.error("Get Subscription Details error:", error);
      // Removed Toast for clean return/app state refresh
      return false;
    }
  }, []);

  // 2. Modified loadSubscriptions to handle loading outside
  const loadSubscriptions = useCallback(async () => {
    try {
      const subscriptions = await fetchProducts({
        skus: productIds as string[],
        type: "subs",
      });

      setSubscriptionsList(subscriptions as ProductSubscription[]);
      return true;
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      return false;
    }
  }, []);

  const initialDataLoad = async () => {
    setInitialLoad(true);
    await Promise.all([loadSubscriptions(), getSubscriptionDetails()]);
    setInitialLoad(false);
  };

  const getPriceDetails = (
    subscription: ProductSubscriptionAndroid | ProductSubscriptionIOS
  ) => {
    if (Platform.OS === "ios") {
      const iosSubscription = subscription as ProductSubscriptionIOS;

      return {
        mainPrice: iosSubscription.displayPrice,
        introductoryPrice: iosSubscription.introductoryPriceIOS,
        introductoryPeriod:
          iosSubscription.introductoryPriceSubscriptionPeriodIOS,
        currency: iosSubscription.currency,
        purchaseId: iosSubscription.id,
        length: iosSubscription.subscriptionPeriodUnitIOS,
      };
    } else {
      const androidSubscription = subscription as ProductSubscriptionAndroid;

      // Android: Find both introductory and recurring phases
      let mainPrice = androidSubscription.displayPrice;
      let introOffer: { price: string; period: string } | null = null;
      let offerToken: string | undefined = undefined; // New field for Android purchase
      let purchaseId = androidSubscription.id; // Default to main ID

      const offerDetails =
        (androidSubscription.subscriptionOfferDetailsAndroid || [])[0];

      if (offerDetails) {
        const pricingPhases = offerDetails.pricingPhases?.pricingPhaseList;
        offerToken = offerDetails.offerToken; // Get the offer token
        purchaseId = offerDetails.basePlanId; // Use base plan ID

        if (pricingPhases && pricingPhases.length > 0) {
          const introductoryPhase = pricingPhases.find(
            (phase) => phase.recurrenceMode === 2
          );

          if (introductoryPhase) {
            introOffer = {
              price: introductoryPhase.formattedPrice,
              period: introductoryPhase.billingPeriod,
            };
          }

          const recurringPhase = pricingPhases.find(
            (phase) => phase.recurrenceMode === 1
          );

          if (recurringPhase) {
            mainPrice = recurringPhase.formattedPrice;
          } else {
            mainPrice = pricingPhases[pricingPhases.length - 1].formattedPrice;
          }
        }
      }

      return {
        mainPrice,
        introductoryPrice: introOffer?.price,
        introductoryPeriod: introOffer?.period,
        currency: androidSubscription.currency,
        offerToken, // Added offerToken
        purchaseId, // Added purchaseId (Base Plan ID)
        length: "Month",
      };
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsCancelling(true);
      if (Platform.OS === "ios") {
        Linking.openURL("https://apps.apple.com/account/subscriptions");
      } else if (Platform.OS === "android") {
        await deepLinkToSubscriptions({
          skuAndroid: subscriptionData?.subscription.productId,
          packageNameAndroid: "com.deepfeels",
        });
      }
    } catch (error) {
      console.error("Failed to open subscription management:", error);
    } finally {
      setIsCancelling(false);
      setIsCancelSubscriptionModal(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([loadSubscriptions(), getSubscriptionDetails()]);
    setIsRefreshing(false);
  }, [loadSubscriptions, getSubscriptionDetails]);

  const handleResubscribe = async () => {
    if (!subscriptionData || !subscriptionData.subscription.productId) {
      Alert.alert("Error", "Subscription details are missing.");
      return;
    }

    try {
      if (Platform.OS === "android") {
        // Use the deep link helper from react-native-iap
        await RNIap.deepLinkToSubscriptions({
          skuAndroid: subscriptionData.subscription.productId,
          packageNameAndroid: "com.deepfeels", // Your app's package name
        });
      } else {
        Linking.openURL("https://apps.apple.com/account/subscriptions");
      }
    } catch (error) {
      console.error(
        "Failed to open Play Store subscription management:",
        error
      );
      Alert.alert(
        "Error",
        "Could not open the Play Store subscription page. Please open the Play Store app, go to 'Payments & subscriptions', and select 'DeepFeels' to resubscribe."
      );
    }
  };

  const handleAppStateChange = useCallback(
    (nextAppState: any) => {
      // Check if the app is coming from inactive/background state to active
      if (
        appState.match(/inactive|background/) &&
        nextAppState === "active" &&
        isFocused
      ) {
        // Only refresh the status, not the initial plans list
        getSubscriptionDetails();
      }
      setAppState(nextAppState);
    },
    [appState, isFocused, getSubscriptionDetails]
  );

  useEffect(() => {
    getActiveSubscriptions();
  }, [getActiveSubscriptions]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  useEffect(() => {
    initialDataLoad();
  }, []);

  // Use initialLoad to gate the entire content rendering
  if (initialLoad) {
    return (
      <ImageBackground
        source={IMAGES.mainBackground}
        style={styles.backgroundImage}
      >
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={PALETTE.white} />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // Content rendering starts here after initialLoad is false
  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollViewContent,
            {
              paddingBottom: Platform.select({
                android: verticalScale(100),
                ios: verticalScale(100),
              }),
              paddingTop: verticalScale(30),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={PALETTE.white}
            />
          }
        >
          <View style={styles.headerContainer}>
            <CustomIcon
              Icon={ICONS.GradientBackButtonIcon}
              height={verticalScale(34)}
              width={verticalScale(34)}
              onPress={() => navigation.goBack()}
            />
            <CustomText
              fontFamily="belganAesthetic"
              fontSize={30}
              color={PALETTE.heading}
            >
              Subscription
            </CustomText>
          </View>

          {/* This section provides general app info and is always visible */}
          <View>
            <CustomText
              fontFamily="belganAesthetic"
              fontSize={22}
              color={PALETTE.heading}
            >
              Daily support for your nervous system and emotional health
            </CustomText>
            <CustomText
              fontFamily="medium"
              color={PALETTE.lightTextColor}
              fontSize={14}
            >
              Unlock deeper daily guidance, unlimited journaling, and
              personalized tools to grow with you.
            </CustomText>
          </View>

          <>
            {subscriptionsList && subscriptionsList.length > 0 ? (
              subscriptionsList.map((plan: ProductSubscription) => {
                const {
                  mainPrice,
                  introductoryPrice,
                  introductoryPeriod,
                  purchaseId,
                  offerToken,
                  length,
                } = getPriceDetails(plan);

                let buttonDisplayTitle = `${mainPrice}/${
                  length
                    ? length.charAt(0).toUpperCase() + length.slice(1)
                    : "Month"
                }`;

                let planFeatures = [...STATIC_PLAN_FEATURES];

                if (
                  introductoryPrice &&
                  introductoryPeriod &&
                  (introductoryPrice === "Free" ||
                    introductoryPrice === "0" ||
                    introductoryPrice === "$0.00") // Check for "Free" (Android) or "$0.00" (iOS)
                ) {
                  let formattedPeriod;

                  // Format the period for display (Handle RNIap's specific formats)
                  if (Platform.OS === "android") {
                    formattedPeriod =
                      introductoryPeriod === "P1W"
                        ? "1 Week"
                        : introductoryPeriod;
                  } else {
                    // iOS case (introductoryPeriod is usually "week", "month", etc.)
                    formattedPeriod =
                      introductoryPeriod === "week"
                        ? "1 Week"
                        : introductoryPeriod;
                  }

                  // Add the trial feature to the list
                  planFeatures.unshift(`✦    ${formattedPeriod} FREE Trial!`);

                  // Update the button title to emphasize the trial
                  //  buttonDisplayTitle = `Start ${formattedPeriod} FREE Trial`;
                }

                const planTitle = plan.displayName || plan.title;

                return (
                  <PlanCard
                    key={plan.id}
                    id={purchaseId}
                    title={planTitle}
                    price={0}
                    selected={true}
                    buttonTitle={buttonDisplayTitle}
                    features={planFeatures}
                    onSelect={() => {}}
                    handleCheckout={() => {}}
                    isDisabled={false}
                    activeOpacity={1}
                  />
                );
              })
            ) : (
              <CustomText color={PALETTE.white} fontSize={16}>
                No plans available.
              </CustomText>
            )}
            {subscriptionData && (
              <View style={styles.subscriptionStatusContainer}>
                {/* SCENARIO: ON TRIAL */}
                {subscriptionData.subscription.status === "trialing" && (
                  <View style={styles.detailCard}>
                    <CustomText
                      fontFamily="medium"
                      color={PALETTE.lightTextColor}
                      fontSize={12}
                    >
                      Trial Ends On:
                    </CustomText>
                    <CustomText
                      fontFamily="bold"
                      color={PALETTE.white}
                      fontSize={12}
                    >
                      {formatDate(subscriptionData.subscription.expiryDate)}
                    </CustomText>
                  </View>
                )}

                {subscriptionData.subscription.status === "cancelling" && (
                  // !isDatePassed(subscriptionData.subscription.expiryDate) && (
                  <View style={styles.detailCard}>
                    <CustomText
                      fontFamily="medium"
                      color={PALETTE.lightTextColor}
                      fontSize={12}
                    >
                      Membership Ends On:
                    </CustomText>
                    <CustomText
                      fontFamily="bold"
                      color={PALETTE.white}
                      fontSize={12}
                    >
                      {formatDate(subscriptionData.subscription.expiryDate)}
                    </CustomText>
                  </View>
                )}

                {/* SCENARIO: ACTIVE PAID SUBSCRIPTION */}
                {subscriptionData.subscription.status === "active" && (
                  <View style={styles.detailCard}>
                    <CustomText
                      fontFamily="medium"
                      color={PALETTE.lightTextColor}
                      fontSize={12}
                    >
                      Renews On:
                    </CustomText>
                    <CustomText
                      fontFamily="bold"
                      color={PALETTE.white}
                      fontSize={12}
                    >
                      {formatDate(subscriptionData.subscription.expiryDate)}
                    </CustomText>
                  </View>
                )}

                {/* SCENARIO: ON GRACE PERIOD */}
                {subscriptionData.subscription.status === "grace_period" && (
                  <>
                    <View style={styles.detailCard}>
                      <CustomText
                        fontFamily="medium"
                        color={PALETTE.lightTextColor}
                        fontSize={12}
                      >
                        Membership Ends On:
                      </CustomText>
                      <CustomText
                        fontFamily="bold"
                        color={PALETTE.white}
                        fontSize={12}
                      >
                        {formatDate(subscriptionData.subscription.expiryDate)}
                      </CustomText>
                    </View>
                    <View style={styles.detailCard}>
                      <CustomText
                        fontFamily="medium"
                        color={PALETTE.lightTextColor}
                        fontSize={12}
                      >
                        ACTION REQUIRED: Payment Failed
                      </CustomText>
                      <CustomText
                        fontFamily="bold"
                        color={PALETTE.white}
                        fontSize={12}
                      >
                        Your last renewal attempt failed. You are currently in a
                        grace period. Update your billing details now to prevent
                        losing access on the expiry date.
                      </CustomText>
                      <CustomText
                        fontFamily="bold"
                        color={PALETTE.white}
                        fontSize={12}
                      >
                        Grace Period Ends On:{" "}
                        {formatDate(
                          subscriptionData.subscription.gracePeriodEndDate!
                        )}
                      </CustomText>
                    </View>
                  </>
                )}
              </View>
            )}

            {/* Button to resubscribe when canceled but not yet expired */}
            {subscriptionData?.subscription.status === "cancelling" && (
              <PrimaryButton
                title="Resubscribe"
                onPress={handleResubscribe}
                disabled={isRefreshing}
              />
            )}

            {/* Button to Cancel subscription if subscriptions status is ACTIVE */}
            {subscriptionData?.subscription.status === "active" && (
              <PrimaryButton
                title="Cancel Subscription"
                onPress={() => {
                  setIsCancelSubscriptionModal(true);
                }}
                disabled={isRefreshing}
              />
            )}
            {subscriptionData?.subscription.status === "trialing" && (
              <PrimaryButton
                title="Cancel Subscription"
                onPress={() => {
                  setIsCancelSubscriptionModal(true);
                }}
                disabled={isRefreshing}
              />
            )}
          </>
        </ScrollView>
      </SafeAreaView>
      {subscriptionData && (
        <CancelSubscriptionConfirmModal
          isVisible={isCancelSubscriptionModal}
          setIsVisible={setIsCancelSubscriptionModal}
          isCancelling={isCancelling}
          setIsCancelling={setIsCancelling}
          onContinue={handleManageSubscription}
          subscriptionDetails={subscriptionData}
        />
      )}
    </ImageBackground>
  );
};

export default SubScription;
