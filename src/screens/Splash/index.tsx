import React, { FC, useEffect, useRef } from "react";
import { Animated, ImageBackground, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import IMAGES from "../../assets/Images"; // Adjust path as needed
import { setUser } from "../../redux/slices/UserSlice";
import { useAppDispatch } from "../../redux/store";
import ENDPOINTS from "../../service/ApiEndpoints";
import { GetUserDataApiResponse } from "../../service/ApiResponses/GetUSerDataApiResponse";
import { fetchData } from "../../service/ApiService";
import {
  validateAndroidSubscription,
  validateIOSReceipt,
} from "../../service/SubscriptionService";
import { SplashScreenProps } from "../../typings/route";
import { PALETTE } from "../../utils/Colors";
import {
  deleteLocalStorageData,
  getLocalStorageData,
} from "../../utils/Helpers";
import STORAGE_KEYS from "../../utils/Storage";
import { useThemedStyles } from "./styles";

const Splash: FC<SplashScreenProps> = ({ navigation, route }) => {
  const styles = useThemedStyles();
  const dispatch = useAppDispatch();
  const fadeImageAnim = useRef(new Animated.Value(0)).current; // Initial opacity for image
  const fadeTextAnim = useRef(new Animated.Value(0)).current; // Initial opacity for text

  const getUserData = async () => {
    const token = await getLocalStorageData(STORAGE_KEYS.TOKEN);

    if (token) {
      try {
        const response = await fetchData<GetUserDataApiResponse>(
          ENDPOINTS.getUSerData
        );

        if (response.data.success) {
          dispatch(setUser(response.data.data));

          // if user cosmic profile is not created
          if (!response.data.data.user.isUserInfoComplete) {
            navigation.replace("setupStack", {
              screen: "userDetailsSetupScreen",
            });
            return;
          }

          // Initial case if user hasnt even buy plan yet (not case of buy plan again and seeting up payment method)
          if (
            response?.data?.data?.subscription === null &&
            response?.data?.data?.user?.isUserInfoComplete
          ) {
            if (Platform.OS === "ios") {
              const result = await validateIOSReceipt();
              if (result && result.subscription) {
                dispatch(setUser(result));
                navigation.replace("bottomTabStack", {
                  screen: "homeTab",
                });
              } else {
                navigation.replace("setupStack", {
                  screen: "subscriptionPlanScreen",
                  params: {
                    isBuyAgain: false,
                  },
                });
              }
              return;
            } else {
              const result = await validateAndroidSubscription();
              if (result && result.subscription) {
                dispatch(setUser(result));
                navigation.replace("bottomTabStack", {
                  screen: "homeTab",
                });
              } else {
                navigation.replace("setupStack", {
                  screen: "subscriptionPlanScreen",
                  params: {
                    isBuyAgain: false,
                  },
                });
              }
              return;
            }
          }

          // If user has active subscription
          if (
            response.data?.data?.user.isUserInfoComplete &&
            response.data?.data?.subscription &&
            response.data?.data?.subscription.status === "active"
          ) {
            navigation.replace("bottomTabStack", {
              screen: "homeTab",
            });
            return;
          }
          if (
            response.data?.data?.user.isUserInfoComplete &&
            response.data?.data?.subscription &&
            response.data?.data?.subscription.status === "trialing"
          ) {
            navigation.replace("bottomTabStack", {
              screen: "homeTab",
            });
            return;
          }

          // if user subscription has ended
          if (
            response.data?.data?.user.isUserInfoComplete &&
            response.data?.data?.subscription &&
            response.data?.data?.subscription.status === "expired"
          ) {
            navigation.replace("setupStack", {
              screen: "subscriptionPlanScreen",
              params: {
                isBuyAgain: true,
              },
            });
            return;
          }

          // this case is when user has an active subscription but he has cancelled renewing of memebershop
          if (
            response.data?.data?.user.isUserInfoComplete &&
            response.data?.data?.subscription &&
            response.data?.data?.subscription.status === "cancelling"
          ) {
            navigation.replace("bottomTabStack", {
              screen: "homeTab",
            });
            return;
          }

          // this case is when user has no active membership and has to buy a new one
          if (
            response.data?.data?.user.isUserInfoComplete &&
            response.data?.data?.subscription &&
            response.data?.data?.subscription.status === "cancelled"
          ) {
            navigation.replace("setupStack", {
              screen: "subscriptionPlanScreen",
              params: {
                isBuyAgain: true,
              },
            });
            return;
          }

          if (
            response.data?.data?.user.isUserInfoComplete &&
            response.data?.data?.subscription &&
            response.data?.data?.subscription.status === "on_hold"
          ) {
            navigation.replace("setupStack", {
              screen: "subscriptionPlanScreen",
              params: {
                isBuyAgain: true,
              },
            });
            return;
          }

          if (
            response.data?.data?.user.isUserInfoComplete &&
            response.data?.data?.subscription &&
            response.data?.data?.subscription.status === "grace_period"
          ) {
            navigation.replace("bottomTabStack", {
              screen: "homeTab",
            });
            return;
          }
        }
      } catch (error: any) {
        console.error("Get User Info error:", error);
        __DEV__ &&
          Toast.show({
            type: "error",
            text1: "Get User Info Failed!",
            text2: error.message || "Something went wrong.",
          });
        await deleteLocalStorageData(STORAGE_KEYS.TOKEN);
        navigation.replace("authStack", {
          screen: "LoginScreen",
        });
      }
    } else {
      navigation.replace("authStack", {
        screen: "LoginScreen",
      });
    }
  };

  // Start fade-in animations
  useEffect(() => {
    const animate = () => {
      Animated.parallel([
        Animated.timing(fadeImageAnim, {
          toValue: 1,
          duration: 1000, // 1 second for image fade-in
          useNativeDriver: true, // Use native driver for better performance
        }),
        Animated.timing(fadeTextAnim, {
          toValue: 1,
          duration: 1000, // 1 second for text fade-in
          useNativeDriver: true,
        }),
      ]).start();
    };

    animate();

    // Navigate to LoginScreen after animation completes
    const timeout = setTimeout(() => {
      getUserData();
    }, 1200); // Wait for animation (1000ms) + slight buffer

    return () => clearTimeout(timeout);
  }, [navigation, fadeImageAnim, fadeTextAnim]);

  return (
    <ImageBackground
      source={IMAGES.authBackground}
      style={styles.background}
      imageStyle={{
        backgroundColor: PALETTE.midnightIndigo,
      }}
    >
      <SafeAreaView style={styles.container}>
        <Animated.Image
          source={IMAGES.SplashLogo}
          style={[styles.logo, { opacity: fadeImageAnim }]}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Splash;
