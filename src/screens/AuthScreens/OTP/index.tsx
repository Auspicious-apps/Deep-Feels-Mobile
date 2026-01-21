import React, { FC, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import IMAGES from "../../../assets/Images";
import { CustomText } from "../../../components/CustomText";
import { KeyboardAvoidingContainer } from "../../../components/KeyboardScrollView";
import PrimaryButton from "../../../components/PrimaryButton";
import { OtpVerificationScreenProps } from "../../../typings/route";
import { PALETTE } from "../../../utils/Colors";
import { useThemedStyles } from "./styles";
import { postData } from "../../../service/ApiService";
import ENDPOINTS from "../../../service/ApiEndpoints";
import AuthSuccessModal from "../../../components/Modals/AuthSuccessModal";
import { RegisterOTPVerificationAPI } from "../../../service/ApiResponses/RegisterOTpVerificationAPI";
import { storeLocalStorageData } from "../../../utils/Helpers";
import STORAGE_KEYS from "../../../utils/Storage";
import { horizontalScale } from "../../../utils/Metrics";

const OTP: FC<OtpVerificationScreenProps> = ({ navigation, route }) => {
  const styles = useThemedStyles();

  const { isFrom, email } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [registerToken, setRegisterToken] = useState<string | null>(null);

  // Validate OTP (all 6 digits filled)
  const isOtpValid = otp.every((digit) => digit.length === 1);

  const handleInputChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter only numbers",
      });
      return; // Ignore input if it's not a number
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      // Changed from 6 to 5 to match 0-based index
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        // If the current box has a value, clear it but stay in the same box
        newOtp[index] = "";
      } else if (index > 0) {
        // If moving back and the previous box has a value, clear it & move back
        if (otp[index - 1]) {
          newOtp[index - 1] = "";
        }
        inputs.current[index - 1]?.focus();
      }

      setOtp(newOtp);
    }
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      if (isFrom === "forgotPassword") {
        const response = await postData<{ token: string }>(
          ENDPOINTS.verifyResetOtp,
          {
            value: email.toLowerCase(),
            otp: otp.map((otp) => otp).join(""),
          }
        );

        if (response.data.success) {
          navigation.navigate("NewPasswordScreen", {
            token: response.data.data.token,
          });
        }
      } else {
        const response = await postData<RegisterOTPVerificationAPI>(
          ENDPOINTS.verifyOtp,
          {
            otp: otp.map((otp) => otp).join(""),
            value: email.toLowerCase(),
            userType: "USER",
          }
        );
        if (response.data.success) {
          setIsSuccessModal(true);
          setRegisterToken(response.data.data.token);
        }
      }
    } catch (error: any) {
      console.error("OTP verification error error:", error);
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      Toast.show({
        type: "error",
        text1: "Verification Failed!",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const response = await postData<{ token: string }>(ENDPOINTS.resendOtp, {
        value: email.toLowerCase(),
        purpose: isFrom === "register" ? "SIGNUP" : "FORGOT_PASSWORD",
      });

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.data.message,
        });
      }
    } catch (error: any) {
      console.error("OTP verification error error:", error);
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      Toast.show({
        type: "error",
        text1: "Verification Failed!",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      setIsResending(false);
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
              Enter OTP
            </CustomText>
            <CustomText fontSize={14} fontFamily="medium">
              Enter the OTP received on your associated email address.
            </CustomText>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputFieldContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  maxFontSizeMultiplier={1.3}
                  key={index}
                  ref={(ref: any) => (inputs.current[index] = ref)}
                  style={styles.inputWrapper}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleInputChange(value, index)}
                  onKeyPress={(event) => handleKeyPress(event, index)}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <PrimaryButton
              title={"Verify"}
              onPress={handleVerify}
              disabled={isLoading || !isOtpValid}
              isLoading={isLoading}
            />
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
              justifyContent: "center",
              opacity: isResending ? 0.7 : 1,
            }}
            disabled={isResending}
            onPress={handleResendOtp}
          >
            {isResending && <ActivityIndicator size={"small"} />}
            <CustomText color={PALETTE.sacredGold} fontSize={14}>
              Resend OTP
            </CustomText>
          </TouchableOpacity>
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

          <AuthSuccessModal
            isVisible={isSuccessModal}
            setIsVisible={setIsSuccessModal}
            title="Account Created Successfully!"
            subTitle="Your Email has been successfully verified and account has been created."
            buttonTitle="Start Your Personalized Journey"
            onContinue={async () => {
              setIsSuccessModal(false);
              await storeLocalStorageData(STORAGE_KEYS.TOKEN, registerToken);
              navigation.replace("setupStack", {
                screen: "userDetailsSetupScreen",
              });
            }}
          />
        </SafeAreaView>
      </KeyboardAvoidingContainer>
    </ImageBackground>
  );
};

export default OTP;
