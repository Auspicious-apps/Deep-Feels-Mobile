import appleAuth from "@invertase/react-native-apple-authentication";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import React, { FC, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message"; // Import Toast
import ICONS from "../../../assets/Icons";
import IMAGES from "../../../assets/Images";
import CustomIcon from "../../../components/CustomIcon";
import { CustomText } from "../../../components/CustomText";
import { KeyboardAvoidingContainer } from "../../../components/KeyboardScrollView";
import PrimaryButton from "../../../components/PrimaryButton";
import { setUser } from "../../../redux/slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import ENDPOINTS from "../../../service/ApiEndpoints";
import {
  GoogleLoginApiResponse,
  LoginApiResponse,
} from "../../../service/ApiResponses/LoginApiResonse";
import { postData } from "../../../service/ApiService";
import { validateSubscriptionOnAppLaunch } from "../../../service/SubscriptionService";
import { LoginScreenProps } from "../../../typings/route";
import { PALETTE } from "../../../utils/Colors";
import {
  createRandomAvatarName,
  deleteLocalStorageData,
  emailRegex,
  getLocalStorageData,
  storeLocalStorageData,
} from "../../../utils/Helpers"; // Assuming emailRegex is exported from Helpers
import STORAGE_KEYS from "../../../utils/Storage";
import { useThemedStyles } from "./styles";

const Login: FC<LoginScreenProps> = ({ navigation, route }) => {
  const styles = useThemedStyles();
  const { fcmToken } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // State for input fields
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // State for input errors
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // Other states
  const [showPassword, setShowPassword] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  // --- Validation Functions ---
  const validateEmail = (inputEmail: string): boolean => {
    if (!inputEmail.trim()) {
      setEmailError("Email is required.");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Email address cannot be empty.",
      });
      return false;
    }
    if (!emailRegex.test(inputEmail)) {
      setEmailError("Please enter a valid email address.");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a valid email address.",
      });
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (inputPassword: string): boolean => {
    if (!inputPassword.trim()) {
      setPasswordError("Password is required.");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password cannot be empty.",
      });
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateLoginForm = (): boolean => {
    // 1. Validate Email first
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      // If email is not valid, stop here and assume UI will show email error
      return false;
    }

    // 2. If email is valid, then validate Password
    const isPasswordValid = validatePassword(password);
    if (!isPasswordValid) {
      // If password is not valid, stop here and assume UI will show password error
      return false;
    }

    // 3. If both are valid, return true
    return true;
  };

  const handleLogin = async () => {
    if (validateLoginForm()) {
      setIsLoading(true);

      try {
        const response = await postData<LoginApiResponse>(ENDPOINTS.login, {
          email: email,
          password: password,
          fcmToken: fcmToken || "NOT PROVIDED",
        });

        if (response.data.success) {
          if (isRememberMe) {
            await storeLocalStorageData(STORAGE_KEYS.REMEMBER_ME_KEY, "true");
            await storeLocalStorageData(STORAGE_KEYS.REMEMBERED_EMAIL, email);
            await storeLocalStorageData(
              STORAGE_KEYS.REMEMBERED_PASSWORD,
              password
            );
          } else {
            await deleteLocalStorageData(STORAGE_KEYS.REMEMBER_ME_KEY);
            await deleteLocalStorageData(STORAGE_KEYS.REMEMBERED_EMAIL);
            await deleteLocalStorageData(STORAGE_KEYS.REMEMBERED_PASSWORD);
          }

          await storeLocalStorageData(
            STORAGE_KEYS.TOKEN,
            response.data.data.token
          );

          dispatch(setUser(response.data.data as any));

          if (response.data.data.reactivated) {
            Toast.show({
              text1: "Welcome Back!",
              text2: "Your account has been successfully reactivated.",
            });
          }

          // if user cosmic profile is not created
          if (!response.data.data.user.isUserInfoComplete) {
            navigation.replace("setupStack", {
              screen: "userDetailsSetupScreen",
            });
            return;
          }

          // Initial case if user hasnt even buy plan yet (not case of buy plan again and seeting up payment method)
          if (
            response.data.data.subscription === null &&
            response.data.data.user.isUserInfoComplete
          ) {
            // Check if user has any available purchases on device that need to be restored
            try {
              const validationResult = await validateSubscriptionOnAppLaunch();

              if (validationResult && validationResult.subscription) {
                const isActive =
                  validationResult.subscription.status !== "cancelled" &&
                  validationResult.subscription.status !== "expired";

                if (isActive) {
                  console.log(
                    "[Login] Found active subscription on device, updating user data"
                  );
                  // Update user data with the validated subscription
                  dispatch(setUser(validationResult));

                  // Navigate to home since subscription is now active
                  navigation.replace("bottomTabStack", {
                    screen: "homeTab",
                  });
                  return;
                }
              } else {
                navigation.replace("setupStack", {
                  screen: "subscriptionPlanScreen",
                  params: {
                    isBuyAgain: false,
                  },
                });
              }
            } catch (error: any) {
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
                return;
              } else {
                console.error(
                  "[Login] Error validating subscription on login:",
                  error
                );
                Toast.show({
                  type: "info",
                  text1: "Oops!",
                  text2: error.message || "Subscription validation failed.",
                });

                // Continue to subscription onboarding if validation fails
                navigation.replace("setupStack", {
                  screen: "subscriptionPlanScreen",
                  params: {
                    isBuyAgain: false,
                  },
                });
                return;
              }
            }
          }

          // If user is on trial but hasn't set up payment method
          if (
            response.data.data?.user.isUserInfoComplete &&
            response.data.data.subscription &&
            response.data.data.subscription.status === "active"
          ) {
            navigation.replace("bottomTabStack", {
              screen: "homeTab",
            });
            return;
          }

          // if user is on Free trial
          if (
            response.data.data?.user.isUserInfoComplete &&
            response.data.data.subscription &&
            response.data.data.subscription.status === "trialing"
          ) {
            navigation.replace("bottomTabStack", {
              screen: "homeTab",
            });
            return;
          }

          // if user subscription has ended
          if (
            response.data.data?.user.isUserInfoComplete &&
            response.data.data.subscription &&
            response.data.data.subscription.status === "expired"
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
            response.data.data?.user.isUserInfoComplete &&
            response.data.data.subscription &&
            response.data.data.subscription.status === "cancelling"
          ) {
            navigation.replace("bottomTabStack", {
              screen: "homeTab",
            });
            return;
          }

          // this case is when user has no active membership and has to buy a new one
          if (
            response.data.data?.user.isUserInfoComplete &&
            response.data.data.subscription &&
            response.data.data.subscription.status === "cancelled"
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
            response.data.data?.user.isUserInfoComplete &&
            response.data.data.subscription &&
            response.data.data.subscription.status === "on_hold"
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
            response.data.data?.user.isUserInfoComplete &&
            response.data.data.subscription &&
            response.data.data.subscription.status === "grace_period"
          ) {
            navigation.replace("bottomTabStack", {
              screen: "homeTab",
            });
            return;
          }
        }
      } catch (error: any) {
        console.error("Login error:", error);
        Toast.show({
          type: "error",
          text1: "Login Failed!",
          text2: error.message || "Something went wrong.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      // Check for Play services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Attempt Google Sign-In
      const userInfo = await GoogleSignin.signIn();

      // Check for cancellation
      if (userInfo?.type === "cancelled") {
        throw new Error("You cancelled the Google sign-in process.");
      }

      // Check for ID token
      if (!userInfo?.data.idToken) {
        throw new Error("No ID token found from Google Sign-In");
      }

      // Send token to backend
      const backendResponse = await postData<GoogleLoginApiResponse>(
        ENDPOINTS.socialLogin,
        {
          idToken: userInfo.data.idToken,
          authType: "GOOGLE",
          fcmToken: fcmToken || "NOT PROVIDED",
          deviceType: Platform.OS.toUpperCase(),
          image: createRandomAvatarName(),
        }
      );

      // Handle backend response
      if (!backendResponse?.data) {
        throw new Error("No data received from backend");
      }

      dispatch(setUser(backendResponse.data.data as any));

      if (backendResponse.data.success) {
        await storeLocalStorageData(
          STORAGE_KEYS.TOKEN,
          backendResponse.data.data.token
        );

        if (backendResponse.data.data.reactivated) {
          Toast.show({
            text1: "Welcome Back!",
            text2: "Your account has been successfully reactivated.",
          });
        }

        // if user cosmic profile is not created
        if (!backendResponse.data.data.user.isUserInfoComplete) {
          navigation.replace("setupStack", {
            screen: "userDetailsSetupScreen",
          });
          return;
        }

        // Initial case if user hasnt even buy plan yet (not case of buy plan again and seeting up payment method)
        if (
          backendResponse.data.data.subscription === null &&
          backendResponse.data.data.user.isUserInfoComplete
        ) {
          try {
            const validationResult = await validateSubscriptionOnAppLaunch();
            console.log(validationResult, "MMMM");

            if (validationResult && validationResult.subscription) {
              const isActive =
                validationResult.subscription.status !== "cancelled" &&
                validationResult.subscription.status !== "expired";

              if (isActive) {
                console.log(
                  "[Login] Found active subscription on device, updating user data"
                );
                // Update user data with the validated subscription
                dispatch(setUser(validationResult));

                // Navigate to home since subscription is now active
                navigation.replace("bottomTabStack", {
                  screen: "homeTab",
                });
                return;
              }
            } else {
              navigation.replace("setupStack", {
                screen: "subscriptionPlanScreen",
                params: {
                  isBuyAgain: false,
                },
              });
            }
          } catch (error: any) {
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
              return;
            } else {
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
                return;
              } else {
                console.error(
                  "[Login] Error validating subscription on login:",
                  error
                );
                Toast.show({
                  type: "info",
                  text1: "Oops!",
                  text2: error.message || "Subscription validation failed.",
                });

                // Continue to subscription onboarding if validation fails
                navigation.replace("setupStack", {
                  screen: "subscriptionPlanScreen",
                  params: {
                    isBuyAgain: false,
                  },
                });
                return;
              }
            }
          }
        }

        // If user is on trial but hasn't set up payment method
        if (
          backendResponse.data.data?.user.isUserInfoComplete &&
          backendResponse.data.data.subscription &&
          backendResponse.data.data.subscription.status === "active"
        ) {
          navigation.replace("bottomTabStack", {
            screen: "homeTab",
          });
          return;
        }

        // if user is on Free trial
        if (
          backendResponse.data.data?.user.isUserInfoComplete &&
          backendResponse.data.data.subscription &&
          backendResponse.data.data.subscription.status === "trialing"
        ) {
          navigation.replace("bottomTabStack", {
            screen: "homeTab",
          });
          return;
        }

        // if user subscription has ended
        if (
          backendResponse.data.data?.user.isUserInfoComplete &&
          backendResponse.data.data.subscription &&
          backendResponse.data.data.subscription.status === "expired"
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
          backendResponse.data.data?.user.isUserInfoComplete &&
          backendResponse.data.data.subscription &&
          backendResponse.data.data.subscription.status === "cancelling"
        ) {
          navigation.replace("bottomTabStack", {
            screen: "homeTab",
          });
          return;
        }

        // this case is when user has no active membership and has to buy a new one
        if (
          backendResponse.data.data?.user.isUserInfoComplete &&
          backendResponse.data.data.subscription &&
          backendResponse.data.data.subscription.status === "cancelled"
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
          backendResponse.data.data?.user.isUserInfoComplete &&
          backendResponse.data.data.subscription &&
          backendResponse.data.data.subscription.status === "on_hold"
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
          backendResponse.data.data?.user.isUserInfoComplete &&
          backendResponse.data.data.subscription &&
          backendResponse.data.data.subscription.status === "grace_period"
        ) {
          navigation.replace("bottomTabStack", {
            screen: "homeTab",
          });
          return;
        }
      } else {
        await GoogleSignin.signOut();
        throw new Error(backendResponse.data.message || "Social login failed");
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      await GoogleSignin.signOut();
      // Handle cancellation error
      if (error.message === "You cancelled the Google sign-in process.") {
        Toast.show({
          type: "info", // Use "info" for user-initiated cancellations
          text1: "Sign-In Cancelled",
          text2: "You cancelled the Google sign-in process.",
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          type: "error",
          text1: "Sign-In In Progress",
          text2: "Please wait, sign-in is already in progress.",
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: "error",
          text1: "Play Services Issue",
          text2: "Please update Google Play Services to continue.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Sign-In Failed",
          text2:
            error.message || "An unexpected error occurred during sign-in.",
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    try {
      // 1. Start the sign-in request with Apple
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // 2. Ensure identityToken is returned
      const { identityToken, nonce, fullName } = appleAuthRequestResponse;
      if (!identityToken) {
        throw new Error("Apple Sign-In failed - no identity token returned.");
      }

      // 3. Send the Firebase ID token to your backend
      const backendResponse = await postData<GoogleLoginApiResponse>(
        ENDPOINTS.socialLogin,
        {
          idToken: identityToken,
          authType: "APPLE",
          fcmToken: fcmToken || "NOT PROVIDED",
          deviceType: Platform.OS.toUpperCase(),
          image: createRandomAvatarName(),
          ...(fullName?.givenName && {
            fullName: `${fullName.givenName} ${fullName.familyName}`,
          }),
        }
      );

      // 4. Handle the backend response
      if (!backendResponse?.data) {
        throw new Error("No data received from backend.");
      }
      if (backendResponse.data.success) {
        await storeLocalStorageData(
          STORAGE_KEYS.TOKEN,
          backendResponse.data.data.token
        );

        dispatch(setUser(backendResponse.data.data as any));

        if (backendResponse.data.data.reactivated) {
          Toast.show({
            text1: "Welcome Back!",
            text2: "Your account has been successfully reactivated.",
          });
        }

        // if user cosmic profile is not created
        if (!backendResponse.data.data.user.isUserInfoComplete) {
          navigation.replace("setupStack", {
            screen: "userDetailsSetupScreen",
          });
          return;
        }

        // Initial case if user hasnt even buy plan yet (not case of buy plan again and seeting up payment method)
        if (
          backendResponse.data?.data?.subscription === null &&
          backendResponse.data?.data?.user.isUserInfoComplete
        ) {
          try {
            const validationResult = await validateSubscriptionOnAppLaunch();

            if (validationResult && validationResult.subscription) {
              const isActive =
                validationResult.subscription.status !== "cancelled" &&
                validationResult.subscription.status !== "expired";

              if (isActive) {
                console.log(
                  "[Login] Found active subscription on device, updating user data"
                );
                // Update user data with the validated subscription
                dispatch(setUser(validationResult));

                // Navigate to home since subscription is now active
                navigation.replace("bottomTabStack", {
                  screen: "homeTab",
                });
                return;
              }
            } else {
              navigation.replace("setupStack", {
                screen: "subscriptionPlanScreen",
                params: {
                  isBuyAgain: false,
                },
              });
            }
          } catch (error: any) {
            console.error(
              "[Login] Error validating subscription on login:",
              error
            );
            Toast.show({
              type: "info",
              text1: "Oops!",
              text2: error.message || "Subscription validation failed.",
            });

            // Continue to subscription onboarding if validation fails
            navigation.replace("setupStack", {
              screen: "subscriptionPlanScreen",
              params: {
                isBuyAgain: false,
              },
            });
            return;
          }
        }

        // If user is on trial but hasn't set up payment method
        if (
          backendResponse.data?.data?.user.isUserInfoComplete &&
          backendResponse.data?.data?.subscription &&
          backendResponse.data?.data?.subscription.status === "active"
        ) {
          navigation.replace("bottomTabStack", {
            screen: "homeTab",
          });
          return;
        }

        // if user is on Free trial
        if (
          backendResponse.data?.data?.user.isUserInfoComplete &&
          backendResponse.data?.data?.subscription &&
          backendResponse.data?.data?.subscription.status === "trialing"
        ) {
          navigation.replace("bottomTabStack", {
            screen: "homeTab",
          });
          return;
        }

        // if user subscription has ended
        if (
          backendResponse.data?.data?.user.isUserInfoComplete &&
          backendResponse.data?.data?.subscription &&
          backendResponse.data?.data?.subscription.status === "expired"
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
          backendResponse.data?.data?.user.isUserInfoComplete &&
          backendResponse.data?.data?.subscription &&
          backendResponse.data?.data?.subscription.status === "cancelling"
        ) {
          navigation.replace("bottomTabStack", {
            screen: "homeTab",
          });
          return;
        }

        // this case is when user has no active membership and has to buy a new one
        if (
          backendResponse.data?.data?.user.isUserInfoComplete &&
          backendResponse.data?.data?.subscription &&
          backendResponse.data?.data?.subscription.status === "cancelled"
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
          backendResponse.data?.data?.user.isUserInfoComplete &&
          backendResponse.data?.data?.subscription &&
          backendResponse.data?.data?.subscription.status === "on_hold"
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
          backendResponse.data?.data?.user.isUserInfoComplete &&
          backendResponse.data?.data?.subscription &&
          backendResponse.data?.data?.subscription.status === "grace_period"
        ) {
          navigation.replace("bottomTabStack", {
            screen: "homeTab",
          });
          return;
        }
      } else {
        throw new Error(backendResponse.data.message || "Social login failed.");
      }
    } catch (error: any) {
      console.error("Apple Sign-In Error:", error);
      if (error.code === appleAuth.Error.CANCELED) {
        Toast.show({
          type: "info",
          text1: "Sign-In Cancelled",
          text2: "You cancelled the Apple sign-in process.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Sign-In Failed",
          text2:
            error.message || "An unexpected error occurred during sign-in.",
        });
      }
    } finally {
      setIsAppleLoading(false);
    }
  };

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const rememberMeValue = await getLocalStorageData(
          STORAGE_KEYS.REMEMBER_ME_KEY
        );
        if (rememberMeValue === "true") {
          const savedEmail = await getLocalStorageData(
            STORAGE_KEYS.REMEMBERED_EMAIL
          );
          const savedPassword = await getLocalStorageData(
            STORAGE_KEYS.REMEMBERED_PASSWORD
          );
          setIsRememberMe(true);
          if (savedEmail) setEmail(savedEmail);
          if (savedPassword) setPassword(savedPassword);
        }
      } catch (error) {
        console.log("Failed to load remembered credentials:", error);
      }
    };

    loadRememberedCredentials();
  }, []);

  return (
    <ImageBackground
      source={IMAGES.authBackground}
      style={styles.backgroundImage}
      imageStyle={{
        backgroundColor: PALETTE.midnightIndigo,
      }}
    >
      <KeyboardAvoidingContainer>
        <SafeAreaView style={styles.safeArea}>
          <Image source={IMAGES.LogoWithTitle} style={styles.logo} />
          <View style={styles.headerContainer}>
            <CustomText
              color={PALETTE.lightSkin}
              fontFamily="belganAesthetic"
              fontSize={26}
            >
              Sign in to your Account!
            </CustomText>
            <CustomText fontSize={14} fontFamily="medium">
              Enter your credentials to continue.
            </CustomText>
          </View>

          <View style={styles.formContainer}>
            {/* Email Input Field */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Email
              </CustomText>
              <View
                style={[
                  styles.inputWrapper,
                  emailError
                    ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                    : {},
                ]}
              >
                <CustomIcon Icon={ICONS.UserIcon} height={18} width={20} />
                <TextInput
                  maxFontSizeMultiplier={1.3}
                  placeholder="Enter your email"
                  placeholderTextColor={PALETTE.PlaceHolderText}
                  style={styles.textInput}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input Field */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Password
              </CustomText>
              <View
                style={[
                  styles.inputWrapper,
                  passwordError
                    ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                    : {},
                ]}
              >
                <CustomIcon Icon={ICONS.LockIcon} height={18} width={20} />
                <TextInput
                  maxFontSizeMultiplier={1.3}
                  placeholder="Enter your password"
                  placeholderTextColor={PALETTE.PlaceHolderText}
                  style={[styles.textInput, styles.passwordInput]}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? (
                    <CustomIcon
                      Icon={ICONS.EyeOffIcon}
                      height={18}
                      width={20}
                    />
                  ) : (
                    <CustomIcon Icon={ICONS.EyeOnIcon} height={18} width={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                onPress={() => {
                  setIsRememberMe(!isRememberMe);
                }}
                style={styles.rememberMeContainer}
              >
                {isRememberMe ? (
                  <View style={styles.checkboxChecked}>
                    <CustomIcon Icon={ICONS.CheckIcon} height={10} width={10} />
                  </View> // Moved CheckIcon inside checked state
                ) : (
                  <View style={styles.checkboxUnchecked} /> // Empty view for unchecked
                )}
                <CustomText fontSize={12}>Remember me</CustomText>
              </TouchableOpacity>
              <Pressable
                onPress={() => {
                  navigation.navigate("ForgotPassweordScreen");
                }}
              >
                <CustomText fontSize={12} color={PALETTE.blue}>
                  Forgot Password?
                </CustomText>
              </Pressable>
            </View>
          </View>

          <PrimaryButton
            title={isLoading ? "Logging In..." : "Login"}
            onPress={handleLogin} // Call the new handleLogin function
            disabled={isLoading || isGoogleLoading}
            isLoading={isLoading}
          />

          <CustomText fontSize={12} fontFamily="medium" style={styles.orText}>
            - Or -
          </CustomText>

          <View style={styles.socialLoginContainer}>
            {Platform.select({
              android: (
                <PrimaryButton
                  bgColor={["#381C58", "#381C58"]}
                  title="Continue with Google"
                  onPress={handleGoogleSignIn}
                  isArrowIcon={false}
                  leftIcon={ICONS.GoogleIcon}
                  isLoading={isGoogleLoading}
                  disabled={isGoogleLoading || isLoading}
                />
              ),
              ios: (
                <PrimaryButton
                  bgColor={["#381C58", "#381C58"]}
                  title="Continue with Apple"
                  onPress={handleAppleSignIn}
                  isArrowIcon={false}
                  leftIcon={ICONS.AppleIcon}
                  isLoading={isAppleLoading}
                  disabled={isAppleLoading || isLoading}
                />
              ),
            })}

            <PrimaryButton
              bgColor={["#381C58", "#381C58"]}
              title="Register a New Account"
              onPress={() => {
                navigation.navigate("RegisterScreen");
              }}
              isArrowIcon={false}
              leftIcon={ICONS.NewAccountUserIcon}
              disabled={isLoading || isGoogleLoading}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingContainer>
    </ImageBackground>
  );
};

export default Login;
