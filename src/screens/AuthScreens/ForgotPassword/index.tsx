import React, { FC, useState } from "react";
import { Image, ImageBackground, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message"; // Import Toast
import ICONS from "../../../assets/Icons";
import IMAGES from "../../../assets/Images";
import CustomIcon from "../../../components/CustomIcon";
import { CustomText } from "../../../components/CustomText";
import { KeyboardAvoidingContainer } from "../../../components/KeyboardScrollView";
import PrimaryButton from "../../../components/PrimaryButton";
import { ForgotPassweordScreenProps } from "../../../typings/route";
import { PALETTE } from "../../../utils/Colors";
import { emailRegex } from "../../../utils/Helpers";
import { useThemedStyles } from "./styles";
import { verticalScale } from "../../../utils/Metrics";
import { postData } from "../../../service/ApiService";
import ENDPOINTS from "../../../service/ApiEndpoints";

const ForgotPassword: FC<ForgotPassweordScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();

  // State for email input
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (inputEmail: string): boolean => {
    if (!inputEmail.trim()) {
      setEmailError("Email is required.");
      Toast.show({
        // Add toast here for empty email
        type: "error",
        text1: "Validation Error",
        text2: "Email address cannot be empty.",
      });
      return false;
    }
    if (!emailRegex.test(inputEmail)) {
      setEmailError("Please enter a valid email address.");
      Toast.show({
        // Add toast here for invalid format
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a valid email address.",
      });
      return false;
    }
    setEmailError(""); // Clear error if valid
    return true;
  };

  const handleForgotPassword = async () => {
    const isValid = validateEmail(email);

    if (isValid) {
      setIsLoading(true);

      try {
        const response = await postData(ENDPOINTS.forgotPassword, {
          email: email,
        });

        if (response.data.success) {
          Toast.show({
            type: "success",
            text1: "Success!",
            text2: "A verification code has been sent to your email.",
          });

          navigation.navigate("OtpVerificationScreen", {
            isFrom: "forgotPassword",
            email: email,
          });
        }
      } catch (error) {
        console.error("Forgot password error:", error);
        Toast.show({
          type: "error",
          text1: "Error!",
          text2: "Failed to send verification code. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
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
              Forgot Password?
            </CustomText>
            <CustomText fontSize={14} fontFamily="medium">
              Enter the email associated with your account.
            </CustomText>
          </View>

          <View style={styles.formContainer}>
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
                  style={styles.textInput}
                  value={email}
                  placeholderTextColor={PALETTE.PlaceHolderText}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) {
                      validateEmail(text);
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
            <PrimaryButton
              title={"Send Verification Code"}
              onPress={handleForgotPassword}
              disabled={isLoading}
              isLoading={isLoading}
              gradientStyle={{ marginTop: verticalScale(10) }}
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
      </KeyboardAvoidingContainer>
    </ImageBackground>
  );
};

export default ForgotPassword;
