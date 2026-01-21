import React, { FC, useState } from "react";
import {
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../../assets/Icons"; // Adjust path
import IMAGES from "../../../assets/Images"; // Adjust path
import CustomIcon from "../../../components/CustomIcon"; // Adjust path
import { CustomText } from "../../../components/CustomText"; // Adjust path
import { KeyboardAvoidingContainer } from "../../../components/KeyboardScrollView"; // Adjust path
import AuthSuccessModal from "../../../components/Modals/AuthSuccessModal";
import PrimaryButton from "../../../components/PrimaryButton"; // Adjust path
import ENDPOINTS from "../../../service/ApiEndpoints";
import { postData } from "../../../service/ApiService";
import { NewPasswordScreenProps } from "../../../typings/route";
import { PALETTE } from "../../../utils/Colors";
import { verticalScale } from "../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const NewPassword: FC<NewPasswordScreenProps> = ({ navigation, route }) => {
  const styles = useThemedStyles();
  const { token } = route.params;

  // State for input fields
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isSuccessModal, setIsSuccessModal] = useState(false);

  // State for input errors
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  // Other states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- Validation Functions (now return error messages or null) ---
  const validatePassword = (inputPassword: string): string | null => {
    if (!inputPassword.trim()) {
      return "Password is required.";
    }
    // Re-enabled the password regex for robust validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(inputPassword)) {
      return "Password must be at least 8 characters, including 1 uppercase, 1 lowercase, and 1 number.";
    }
    return null;
  };

  const validateConfirmPassword = (
    inputConfirmPassword: string,
    pass: string
  ): string | null => {
    if (!inputConfirmPassword.trim()) {
      return "Confirm password is required.";
    }
    if (inputConfirmPassword !== pass) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleResetPassword = async () => {
    // Clear all previous errors at the start
    setPasswordError("");
    setConfirmPasswordError("");

    // Perform sequential validation and return on the first error
    const passwordErrorMsg = validatePassword(password);
    if (passwordErrorMsg) {
      setPasswordError(passwordErrorMsg);
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: passwordErrorMsg,
      });
      return;
    }

    const confirmPasswordErrorMsg = validateConfirmPassword(
      confirmPassword,
      password
    );
    if (confirmPasswordErrorMsg) {
      setConfirmPasswordError(confirmPasswordErrorMsg);
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: confirmPasswordErrorMsg,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await postData(
        ENDPOINTS.resetPassword,
        {
          password: confirmPassword,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        setIsSuccessModal(true);
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      Toast.show({
        type: "error",
        text1: "Password Reset Failed!",
        text2: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              Reset Password
            </CustomText>
            <CustomText fontSize={14} fontFamily="medium">
              Enter your new password to continue.
            </CustomText>
          </View>

          <View style={styles.formContainer}>
            {/* Password Input Field */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                New Password
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

            {/* Confirm Password Input Field */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Confirm Password
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
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  {showConfirmPassword ? (
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

            <PrimaryButton
              title="Change Password"
              onPress={handleResetPassword}
              disabled={isLoading}
              isLoading={isLoading}
              gradientStyle={{
                marginTop: verticalScale(10),
              }}
            />
          </View>

          <CustomText fontSize={12} style={styles.loginPromptText}>
            Already Have an Account?{"  "}
            <CustomText
              onPress={() => navigation.navigate("LoginScreen")}
              fontSize={12}
              color={PALETTE.sacredGold}
            >
              Login
            </CustomText>
          </CustomText>
        </SafeAreaView>
        <AuthSuccessModal
          isVisible={isSuccessModal}
          setIsVisible={setIsSuccessModal}
          title="Password Updated Successfully!"
          subTitle="Your password has been updated successfully. Please login to continue."
          buttonTitle="Login"
          onContinue={() => {
            navigation.pop(3);
            setTimeout(() => {
              setIsSuccessModal(false);
              navigation.goBack();
            }, 40);
          }}
        />
      </KeyboardAvoidingContainer>
    </ImageBackground>
  );
};

export default NewPassword;
