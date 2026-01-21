import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  Platform,
  View,
} from "react-native";
import * as RNIap from "react-native-iap";
import {
  acknowledgePurchaseAndroid,
  ErrorCode,
  fetchProducts,
  getAvailablePurchases,
  ProductSubscription,
  ProductSubscriptionAndroid,
  ProductSubscriptionIOS,
  PurchaseError,
  useIAP,
} from "react-native-iap";
import { SafeAreaView } from "react-native-safe-area-context";
import FONTS from "../../../assets/Fonts";
import IMAGES from "../../../assets/Images";
import { CustomText } from "../../../components/CustomText";
import { KeyboardAvoidingContainer } from "../../../components/KeyboardScrollView";
import PlanCard from "../../../components/PlanCard";
import PrimaryButton from "../../../components/PrimaryButton";
import { setUser } from "../../../redux/slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import ENDPOINTS from "../../../service/ApiEndpoints";
import { GetUserDataApiResponse } from "../../../service/ApiResponses/GetUSerDataApiResponse";
import { fetchData, postData } from "../../../service/ApiService";
import { subscriptionPlanScreenProps } from "../../../typings/route";
import { PALETTE } from "../../../utils/Colors";
import {
  deleteLocalStorageData,
  getLocalStorageData,
} from "../../../utils/Helpers";
import STORAGE_KEYS from "../../../utils/Storage";
import { useThemedStyles } from "./styles";
import Toast from "react-native-toast-message";

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

const SubscriptionOnboarding: FC<subscriptionPlanScreenProps> = ({
  navigation,
  route,
}) => {
  const styles = useThemedStyles();
  const dispatch = useAppDispatch();

  const { isBuyAgain } = route.params;
  const { userData } = useAppSelector((state) => state.user);

  // Added requestSubscription and currentPurchase from IAP hook
  const { connected, requestPurchase, validateReceipt, finishTransaction } =
    useIAP({
      onPurchaseSuccess: async (purchase) => {
        const token = await getLocalStorageData(STORAGE_KEYS.TOKEN);
        try {
          const validation = await validateReceipt(purchase.productId, {
            packageName: "com.deepfeels",
            productToken: purchase?.purchaseToken!,
            accessToken: token,
            isSub: true,
          });
          if (validation) {
            if (Platform.OS === "android") {
              const savePurchaseData = await postData<GetUserDataApiResponse>(
                ENDPOINTS.saveSubscriptioData,
                purchase
              );
              if (savePurchaseData?.data?.success) {
                dispatch(setUser(savePurchaseData.data.data));
                if (Platform.OS === "android" && purchase.purchaseToken) {
                  const acknowledgePurchaseonAndroid =
                    await acknowledgePurchaseAndroid(purchase?.purchaseToken);
                  if (acknowledgePurchaseonAndroid) {
                    if (isBuyAgain) {
                      navigation.replace("bottomTabStack", {
                        screen: "homeTab",
                      });
                    } else {
                      navigation.replace("onBoarding", {
                        startAndSignsData:
                          savePurchaseData?.data?.data?.additionalInfo,
                      });
                    }
                  }
                }
              }
            } else {
              // Finish transaction for iOS after successful verification and hit backend API for creating subcription
              await finishTransaction({ purchase }).then(async () => {
                const createSubscription =
                  await postData<GetUserDataApiResponse>(
                    ENDPOINTS.validateIosReciept,
                    {
                      receiptData: validation?.jwsRepresentation,
                    }
                  );
                if (createSubscription?.data?.data) {
                  if (
                    createSubscription.data?.data?.subscription &&
                    createSubscription.data?.data?.subscription?.status !==
                      "cancelled"
                  ) {
                    dispatch(setUser(createSubscription.data.data));
                    // Navigate to the next screen
                    if (isBuyAgain) {
                      navigation.replace("bottomTabStack", {
                        screen: "homeTab",
                      });
                    } else {
                      navigation.replace("onBoarding", {
                        startAndSignsData:
                          createSubscription.data?.data?.additionalInfo,
                      });
                    }
                  }
                }
              });
            }
          }
        } catch (error: any) {
          console.error("Purchase Error:", error);
          // Finish transaction even on error to prevent stuck pending transactions
          await finishTransaction({ purchase }).then(async () => {
            if (
              error.message ===
                "User UUID does not match apple account token" &&
              Platform.OS === "ios"
            ) {
              Alert.alert(
                "Apple ID Linked to Another Account",
                `This Apple ID is linked to "${error?.data?.matchedUserEmail}".\n\nPlease log in with that account to access your subscription.\n\nApple ties one subscription per Apple ID to one app account.`,
                [
                  {
                    text: "Login with That Account",
                    onPress: () => {
                      navigation.replace("authStack", {
                        screen: "LoginScreen",
                      });
                    },
                  },
                  { text: "Got It" },
                ]
              );
            } else {
              Toast.show({
                type: "error",
                text1: "Oops!! Something went wrong.",
                text2: error.message,
              });
            }
          });
        } finally {
          setIsCheckOutLoading(false);
        }
      },
      onPurchaseError: async (error) => {
        // Always show the loading state is finished
        setIsCheckOutLoading(false);
        console.error("IAP Purchase Failed:", error.code, error.message);
        const isItemAlreadyOwnedError =
          error.message === "Item is already owned";
        if (Platform.OS === "android" && isItemAlreadyOwnedError) {
          Toast.show({
            type: "info",
            text1: error.message,
            text2:
              "You already have an active subscription associated with you apple account. Please restore purchase to get access to the app.",
          });
          return;
        } else if (
          error.code === "developer-error" &&
          error.message === "Invalid arguments provided to the API" &&
          Platform.OS === "android"
        ) {
          setTimeout(() => {
            Alert.alert(
              "Subscription Conflict Detected",
              "This device has a recently cancelled subscription linked to a **different** Google Play account. Please ensure the correct account is logged into the Play Store, or wait for the existing subscription to fully expire to make a new purchase.",
              [
                {
                  text: "Got It",
                },
                {
                  text: "Manage Play Accounts",
                  onPress: async () => {
                    await RNIap.deepLinkToSubscriptions({
                      skuAndroid: error.productId,
                      packageNameAndroid: "com.deepfeels", // Your app's package name
                    });
                  },
                },
              ]
            );
          }, 400);
          return;
        } else if (
          error.message === "Item already owned" &&
          Platform.OS === "ios"
        ) {
          // Default error handling for all other genuine errors
          Toast.show({
            type: "info",
            text1: error.message,
            text2:
              "You already have an active subscription associated with you apple account. Please restore purchase to get access to the app.",
          });
        } else if (error.code !== ErrorCode.UserCancelled) {
          // Default error handling for all other genuine errors
          Toast.show({
            type: "error",
            text1: "Oops, Something went wrong.",
            text2: error.message,
          });
        }
      },
    });

  const [isLoading, setIsLoading] = useState(false);

  // Track selected plan by title for UI display
  const [selectedPlanTitle, setSelectedPlanTitle] = useState<string | null>(
    null
  );

  const [isCheckOutLoading, setIsCheckOutLoading] = useState(false);

  const [subscriptionsList, setSubscriptionsList] = useState<
    ProductSubscription[] | null
  >([]);

  const [isRestoring, setIsRestoring] = useState(false);

  // Tracks the BasePlanId (Android) or Product ID (iOS) and OfferToken (Android)
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState<{
    productId: string; // The base plan ID or iOS product ID
    offerToken?: string; // The specific Android offer token
    planTitle: string; // The plan display name
  } | null>(null);

  const handlePlanSelect = (
    purchaseDetails: typeof selectedPurchaseDetails
  ) => {
    if (selectedPlanTitle === purchaseDetails?.planTitle) {
      setSelectedPlanTitle(null);
      setSelectedPurchaseDetails(null);
    } else {
      setSelectedPlanTitle(purchaseDetails?.planTitle || null);
      setSelectedPurchaseDetails(purchaseDetails);
    }
  };

  const handleRestorePurchase = useCallback(async () => {
    if (!connected) {
      Alert.alert("Error", "Billing service not connected. Please try again.");
      return;
    }

    setIsRestoring(true);

    try {
      const purchases = await getAvailablePurchases();

      if (purchases.length === 0) {
        Alert.alert(
          "Restore Failed",
          "No active or previous purchases found for this store account."
        );
        return;
      }

      if (purchases && purchases.length > 0) {
        // Find the most recent, relevant subscription purchase
        const activeSubscription = purchases.find((p) =>
          productIds?.includes(p.productId)
        );

        if (activeSubscription) {
          if (Platform.OS === "android") {
            const verifySubscription = await postData<GetUserDataApiResponse>(
              ENDPOINTS.restorePurchase,
              {
                purchaseToken: activeSubscription.purchaseToken,
                packageName: "com.deepfeels",
                productId: activeSubscription.productId,
                data: {
                  platform: "android",
                },
              }
            );

            if (verifySubscription.data.success) {
              dispatch(setUser(verifySubscription.data.data));
              if (isBuyAgain) {
                navigation.replace("bottomTabStack", {
                  screen: "homeTab",
                });
              } else {
                navigation.replace("onBoarding", {
                  startAndSignsData:
                    verifySubscription.data.data?.additionalInfo,
                });
              }
            } else {
              Alert.alert(
                "Restore Failed",
                "No active subscription found for this account."
              );
            }
            await finishTransaction({ purchase: activeSubscription });
          } else {
            try {
              const validation = await validateReceipt(
                activeSubscription.productId
              );

              if (validation) {
                await finishTransaction({ purchase: activeSubscription }).then(
                  async () => {
                    const createSubscription =
                      await postData<GetUserDataApiResponse>(
                        ENDPOINTS.validateIosReciept,
                        {
                          receiptData: validation.jwsRepresentation,
                        }
                      );

                    if (createSubscription.data.data) {
                      if (
                        createSubscription.data.data.subscription &&
                        createSubscription.data.data.subscription.status !==
                          "cancelled"
                      ) {
                        dispatch(setUser(createSubscription.data.data));

                        // Navigate to the next screen
                        if (isBuyAgain) {
                          navigation.replace("bottomTabStack", {
                            screen: "homeTab",
                          });
                        } else {
                          navigation.replace("onBoarding", {
                            startAndSignsData:
                              createSubscription.data.data?.additionalInfo,
                          });
                        }
                      }
                    }
                  }
                );
              }
            } catch (error: any) {
              console.log(error);
              // Finish transaction even on error to prevent stuck pending transactions
              if (
                error.message ===
                  "User UUID does not match apple account token" &&
                Platform.OS === "ios"
              ) {
                Alert.alert(
                  "Apple ID Linked to Another Account",
                  `This Apple ID is linked to "${error.data.matchedUserEmail}".\n\nPlease log in with that account to access your subscription.\n\nApple ties one subscription per Apple ID to one app account.`,
                  [
                    {
                      text: "Login with That Account",
                      onPress: () => {
                        navigation.replace("authStack", {
                          screen: "LoginScreen",
                        });
                      },
                    },
                    { text: "Got It" },
                  ]
                );
              } else {
                Toast.show({
                  type: "error",
                  text1: "Oops! Something went wrong.",
                  text2: error.message,
                });
              }
            } finally {
              setIsCheckOutLoading(false);
            }
          }
        } else {
          Alert.alert(
            "Restore Failed",
            "No active subscription found for this account."
          );
        }
      }
    } catch (error: any) {
      console.error("Restore Purchase Error:", error);
      if (
        error.message === "User UUID does not match apple account token" &&
        Platform.OS === "ios"
      ) {
        Alert.alert(
          "Apple ID Linked to Another Account",
          `This Apple ID is linked to "${error.data.matchedUserEmail}".\n\nPlease log in with that account to access your subscription.\n\nApple ties one subscription per Apple ID to one app account.`,
          [
            {
              text: "Login with That Account",
              onPress: () => {
                navigation.replace("authStack", { screen: "LoginScreen" });
              },
            },
            { text: "Got It" },
          ]
        );
      } else {
        Alert.alert(
          "Restore Error",
          "Could not check for past purchases. Please check your connection."
        );
      }
    } finally {
      setIsRestoring(false);
    }
  }, [connected]);

  const getPriceDetails = (
    subscription: ProductSubscriptionAndroid | ProductSubscriptionIOS
  ) => {
    if (Platform.OS === "ios") {
      const iosSubscription = subscription as ProductSubscriptionIOS;

      return {
        mainPrice: iosSubscription.displayPrice,
        introductoryPrice: iosSubscription.introductoryPriceAsAmountIOS,
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

  const handleSubscription = useCallback(
    (itemId: string, offerToken?: string) => {
      if (!subscriptionsList) return;
      setIsCheckOutLoading(true);

      // allow adding subscriptionOffers on Android by using a looser type
      const androidPayload: RNIap.RequestSubscriptionAndroidProps = {
        skus: [itemId],
        obfuscatedAccountIdAndroid: userData?.user._id,
        obfuscatedProfileIdAndroid: userData?.user._id,
      };

      if (Platform.OS === "android" && offerToken) {
        androidPayload.subscriptionOffers = [
          {
            sku: itemId, // use the selected itemId as the sku
            offerToken: offerToken, // Use the specific SELECTED offer token
          },
        ];
      }

      void requestPurchase({
        request: {
          ios: {
            sku: itemId,
            appAccountToken: userData?.user?.uuid,
          },
          android: androidPayload,
        },
        type: "subs",
      }).catch((err: PurchaseError) => {
        console.warn("requestPurchase failed:", err);
        setIsCheckOutLoading(false);
        Alert.alert("Subscription Failed", err.message);
      });
    },
    [subscriptionsList]
  );

  const loadSubscriptions = async () => {
    setIsLoading(true);
    try {
      const subscriptions = await fetchProducts({
        skus: productIds as string[], // Use the defined productIds
        type: "subs",
      });

      setSubscriptionsList(subscriptions as ProductSubscription[]);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connected) {
      if (Platform.OS === "ios") {
        RNIap.clearTransactionIOS()
          .then(() => console.log("Cleared stuck iOS transactions."))
          .catch((e) => console.warn("Failed to clear iOS transactions:", e));
      }

      loadSubscriptions();

      getAvailablePurchases()
        .then((purchases) => {
          purchases.forEach((purchase) => {
            console.log("Finishing pending transaction for:", purchase);
            finishTransaction({ purchase });
          });
        })
        .catch((e) => console.error("Error checking available purchases", e));
    }
  }, [connected]);

  useEffect(() => {
    const getUserData = async () => {
      const token = await getLocalStorageData(STORAGE_KEYS.TOKEN);
      if (token) {
        try {
          const response = await fetchData<GetUserDataApiResponse>(
            ENDPOINTS.getUSerData
          );

          if (response.data.success) {
            dispatch(setUser(response.data.data));
          }
        } catch (error: any) {
          console.error("Get User Info error:", error);
        }
      }
    };
    getUserData();
  }, []);

  // useEffect(() => {
  //   // 1. Set up the listener on app start
  //   const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
  //     async (purchase) => {
  //       // purchase.transactionState will be 'purchased' or 'restored' for a completed payment
  //       // For Android, it can also be 'pending'

  //       try {
  //         // ... (Your logic to verify receipt on your server) ...

  //         // 2. DELIVER THE CONTENT to the user

  //         // 3. FINISH THE TRANSACTION after content is delivered
  //         await finishTransaction({ purchase });
  //       } catch (error) {
  //         // If content delivery or verification fails, do NOT finish the transaction.
  //         // It will be re-delivered when the app starts next time.
  //         console.error("Failed to process purchase:", error);
  //       }
  //     }
  //   );

  //   return () => {
  //     // 4. Clean up the listener when component unmounts
  //     purchaseUpdateSubscription.remove();
  //   };
  // }, []);

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
      imageStyle={{
        backgroundColor: PALETTE.midnightIndigo,
      }}
    >
      <KeyboardAvoidingContainer>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <CustomText
              color={PALETTE.lightSkin}
              fontFamily="belganAesthetic"
              fontSize={26}
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
          <View style={styles.plansContainer}>
            {isLoading ? (
              <ActivityIndicator />
            ) : subscriptionsList && subscriptionsList.length > 0 ? (
              subscriptionsList.map((plan: ProductSubscription) => {
                const {
                  mainPrice,
                  introductoryPrice,
                  introductoryPeriod,
                  purchaseId,
                  offerToken,
                  length,
                } = getPriceDetails(plan);

                // SIMPLIFIED BUTTON TITLE: Show only the main recurring price.
                let buttonDisplayTitle = `${mainPrice}/${
                  length
                    ? length.charAt(0).toUpperCase() + length.slice(1)
                    : "Month"
                }`;

                // DYNAMIC FEATURES: Create feature list
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

                const purchaseDetails = {
                  productId: plan.id,
                  offerToken,
                  planTitle,
                };
                return (
                  <PlanCard
                    key={plan.id}
                    id={purchaseId}
                    title={planTitle}
                    price={0}
                    buttonTitle={buttonDisplayTitle}
                    features={planFeatures}
                    selected={selectedPlanTitle === planTitle}
                    onSelect={() => handlePlanSelect(purchaseDetails)}
                    handleCheckout={() => {}}
                    isDisabled={false}
                  />
                );
              })
            ) : (
              <CustomText color={PALETTE.white} fontSize={16}>
                No plans available.
              </CustomText>
            )}

            {isBuyAgain && (
              <CustomText fontSize={12}>
                <CustomText fontSize={12} fontFamily="bold">
                  Note:
                </CustomText>{" "}
                Your account with this email{" "}
                <CustomText fontSize={12} fontFamily="bold">
                  {userData?.user.email}
                </CustomText>{" "}
                has no active subsriptions. Please buy a subscription to
                continue accessing all the features.
              </CustomText>
            )}

            {/* SCENARIO: ON Hold */}
            {userData?.subscription?.status === "on_hold" && (
              <View style={styles.detailCard}>
                <CustomText
                  fontFamily="medium"
                  color={PALETTE.lightTextColor}
                  fontSize={12}
                >
                  Payment Failed: Please Update Billing Info
                </CustomText>
                <CustomText
                  fontFamily="bold"
                  color={PALETTE.white}
                  fontSize={12}
                >
                  Your access has been temporarily suspended due to a payment
                  issue.
                </CustomText>
              </View>
            )}
          </View>
          {userData?.subscription?.status !== "on_hold" && (
            <PrimaryButton
              title={"Continue"}
              onPress={() =>
                selectedPurchaseDetails &&
                handleSubscription(
                  selectedPurchaseDetails?.productId,
                  selectedPurchaseDetails?.offerToken
                )
              }
              disabled={
                isLoading || isCheckOutLoading || !selectedPurchaseDetails
              }
              isLoading={isCheckOutLoading}
            />
          )}
          {userData?.subscription?.status === "on_hold" && (
            <PrimaryButton
              title={"Buy Again"}
              onPress={async () => {
                if (Platform.OS === "ios") {
                  Linking.openURL(
                    "https://apps.apple.com/account/subscriptions"
                  );
                } else if (Platform.OS === "android") {
                  await RNIap.deepLinkToSubscriptions({
                    skuAndroid: userData?.subscription.productId,
                    packageNameAndroid: "com.deepfeels",
                  });
                }
              }}
            />
          )}

          <PrimaryButton
            title={"Restore Purchase"}
            onPress={handleRestorePurchase}
            disabled={isLoading || isCheckOutLoading || isRestoring}
            isLoading={isRestoring}
            isArrowIcon={false}
            isFullWidth={false}
            bgColor={["transparent", "transparent"]}
            textColor={PALETTE.gold}
            textStyle={{
              fontFamily: FONTS.bold,
            }}
          />

          <CustomText style={{ textAlign: "center" }} fontSize={12}>
            Not your account?{" "}
            <CustomText
              fontSize={12}
              fontFamily="bold"
              color={PALETTE.sacredGold}
              onPress={async () => {
                await deleteLocalStorageData(STORAGE_KEYS.TOKEN);
                if (Platform.OS === "ios") {
                } else {
                  await GoogleSignin.signOut();
                }
                navigation.replace("authStack", {
                  screen: "LoginScreen",
                });
              }}
            >
              Login.
            </CustomText>
          </CustomText>

          <View style={styles.policyLinksContainer}>
            <CustomText
              style={styles.policyLink}
              onPress={() =>
                Linking.openURL("https://www.deepfeels.net/privacy-policy")
              }
              fontSize={12}
              fontFamily="semiBold"
            >
              Privacy Policy
            </CustomText>
            <CustomText style={styles.policySeparator}>|</CustomText>
            <CustomText
              style={styles.policyLink}
              onPress={() =>
                Linking.openURL(
                  "https://www.deepfeels.net/terms-and-conditions"
                )
              }
              fontSize={12}
              fontFamily="semiBold"
            >
              Terms of Use
            </CustomText>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingContainer>
    </ImageBackground>
  );
};

export default SubscriptionOnboarding;
