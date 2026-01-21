import React, { FC, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../../assets/Icons"; // Adjust path
import IMAGES from "../../../assets/Images"; // Adjust path
import CustomIcon from "../../../components/CustomIcon"; // Adjust path
import { CustomText } from "../../../components/CustomText"; // Adjust path
import { KeyboardAvoidingContainer } from "../../../components/KeyboardScrollView";
import PrimaryButton from "../../../components/PrimaryButton"; // Adjust path
import { useAppSelector } from "../../../redux/store";
import ENDPOINTS from "../../../service/ApiEndpoints";
import { RegisterApiResponse } from "../../../service/ApiResponses/RegisterApiResponse";
import { postData } from "../../../service/ApiService";
import { RegisterScreenProps } from "../../../typings/route"; // Adjust path
import { PALETTE } from "../../../utils/Colors";
import { createRandomAvatarName, emailRegex } from "../../../utils/Helpers"; // Adjust path
import { horizontalScale, verticalScale } from "../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const Register: FC<RegisterScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();

  const { fcmToken } = useAppSelector((state) => state.user);

  // --- Input States ---
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // --- Error States ---
  const [fullNameError, setFullNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  // --- Other States ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- Country Picker States ---
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [country, setCountry] = useState<Country | null>({
    cca2: "US",
    callingCode: ["1"],
    name: "United States",
    flag: "🇺🇸",
    region: "Americas",
    subregion: "North America",
    currency: ["USD"],
  });

  // --- TextInput Refs ---
  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  // --- Country Picker Handler ---
  const onSelect = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry);
    setShowCountryPicker(false);
    phoneInputRef.current?.focus(); // Restore focus to phone input
  };

  // --- Validation Functions ---
  const validateFullName = (inputName: string): string | null => {
    if (!inputName.trim()) return "Full name is required.";
    if (inputName.length < 2)
      return "Full name must be at least 2 characters long.";
    return null;
  };

  const validateEmail = (inputEmail: string): string | null => {
    if (!inputEmail.trim()) return "Email is required.";
    if (!emailRegex.test(inputEmail))
      return "Please enter a valid email address.";
    return null;
  };

  const validatePhoneNumber = (inputNumber: string): string | null => {
    if (!inputNumber.trim()) return "Phone number is required.";
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(inputNumber))
      return "Please enter a valid phone number (7-15 digits).";
    return null;
  };

  const validatePassword = (inputPassword: string): string | null => {
    if (!inputPassword.trim()) return "Password is required.";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(inputPassword))
      return "Password must be at least 8 characters, including 1 uppercase, 1 lowercase, and 1 number.";
    return null;
  };

  const validateConfirmPassword = (
    inputConfirmPassword: string
  ): string | null => {
    if (!inputConfirmPassword.trim()) return "Confirm password is required.";
    if (inputConfirmPassword !== password) return "Passwords do not match.";
    return null;
  };

  // --- Handle Register ---
  const handleRegister = async () => {
    setFullNameError("");
    setEmailError("");
    // setPhoneNumberError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let error = validateFullName(fullName);
    if (error) {
      setFullNameError(error);
      Toast.show({ type: "error", text1: "Validation Error", text2: error });
      return;
    }

    error = validateEmail(email);
    if (error) {
      setEmailError(error);
      Toast.show({ type: "error", text1: "Validation Error", text2: error });
      return;
    }

    // error = validatePhoneNumber(phoneNumber);
    // if (error) {
    //   setPhoneNumberError(error);
    //   Toast.show({ type: "error", text1: "Validation Error", text2: error });
    //   return;
    // }

    error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      Toast.show({ type: "error", text1: "Validation Error", text2: error });
      return;
    }

    error = validateConfirmPassword(confirmPassword);
    if (error) {
      setConfirmPasswordError(error);
      Toast.show({ type: "error", text1: "Validation Error", text2: error });
      return;
    }

    setIsLoading(true);
    try {
      const response = await postData<RegisterApiResponse>(ENDPOINTS.register, {
        fullName,
        password,
        countryCode: country?.callingCode[0],
        fcmToken: fcmToken || "NOT PROVIDED",
        phone: phoneNumber || "",
        email: email.toLowerCase(),
        image: createRandomAvatarName(),
      });

      if (response.data.success) {
        navigation.navigate("OtpVerificationScreen", {
          isFrom: "register",
          email,
        });
        Toast.show({
          type: "success",
          text1: "Registration Successful!",
          text2:
            "OTP sent to your registered email successfully. Please verify",
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      Toast.show({
        type: "error",
        text1: "Registration Failed!",
        text2:
          error.message ||
          "An error occurred during registration. Please try again.",
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
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingContainer
          style={{
            flexGrow: 1,
            gap: verticalScale(20),
            paddingVertical: horizontalScale(30),
            paddingHorizontal: horizontalScale(15),
          }}
        >
          <Image source={IMAGES.LogoWithTitle} style={styles.logo} />

          <View style={styles.headerContainer}>
            <CustomText
              color={PALETTE.lightSkin}
              fontFamily="belganAesthetic"
              fontSize={26}
            >
              Register Account
            </CustomText>
            <CustomText fontSize={14} fontFamily="medium">
              Create a new account to continue.
            </CustomText>
          </View>

          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Full Name
              </CustomText>
              <View
                style={[
                  styles.textInputWrapper,
                  fullNameError
                    ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                    : {},
                ]}
              >
                <CustomIcon Icon={ICONS.UserIcon} height={18} width={20} />
                <TextInput
                  maxFontSizeMultiplier={1.3}
                  placeholder="Enter your full name"
                  placeholderTextColor={PALETTE.PlaceHolderText}
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Email
              </CustomText>
              <View
                style={[
                  styles.textInputWrapper,
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
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Phone Number
              </CustomText>
              <View
                style={[
                  styles.phoneInputWrapper,
                  phoneNumberError
                    ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                    : {},
                ]}
              >
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(true)}
                  style={styles.countryPickerButton}
                >
                  <CountryPicker
                    countryCode={countryCode}
                    withFlag={true}
                    withFilter={true}
                    withCallingCode={true}
                    withCountryNameButton={false}
                    onSelect={onSelect}
                    visible={showCountryPicker}
                    onClose={() => setShowCountryPicker(false)}
                    theme={{
                      onBackgroundTextColor: PALETTE.DarkGrey,
                      flagSizeButton: 16,
                    }}
                  />
                  <CustomIcon
                    Icon={ICONS.DownArrowIcon}
                    height={10}
                    width={10}
                  />
                </TouchableOpacity>
                {country?.callingCode && (
                  <CustomText fontSize={14} color={PALETTE.white}>
                    (+{country.callingCode[0]})
                  </CustomText>
                )}
                <TextInput
                  maxFontSizeMultiplier={1.3}
                  ref={phoneInputRef}
                  placeholder="000-0000"
                  placeholderTextColor={PALETTE.PlaceHolderText}
                  keyboardType="number-pad"
                  style={styles.textInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
            </View>

            {/* Set Password Input */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Set Password
              </CustomText>
              <View
                style={[
                  styles.textInputWrapper,
                  passwordError
                    ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                    : {},
                ]}
              >
                <CustomIcon Icon={ICONS.LockIcon} height={18} width={20} />
                <TextInput
                  maxFontSizeMultiplier={1.3}
                  ref={passwordInputRef}
                  placeholder="Enter your password"
                  placeholderTextColor={PALETTE.PlaceHolderText}
                  style={[styles.textInput, styles.passwordTextInput]}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(!showPassword);
                    passwordInputRef.current?.focus();
                  }}
                >
                  <CustomIcon
                    Icon={showPassword ? ICONS.EyeOffIcon : ICONS.EyeOnIcon}
                    height={18}
                    width={20}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Confirm Password
              </CustomText>
              <View
                style={[
                  styles.textInputWrapper,
                  confirmPasswordError
                    ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                    : {},
                ]}
              >
                <CustomIcon Icon={ICONS.LockIcon} height={18} width={20} />
                <TextInput
                  maxFontSizeMultiplier={1.3}
                  ref={confirmPasswordInputRef}
                  placeholder="Confirm your password"
                  placeholderTextColor={PALETTE.PlaceHolderText}
                  style={[styles.textInput, styles.passwordTextInput]}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                    confirmPasswordInputRef.current?.focus();
                  }}
                >
                  <CustomIcon
                    Icon={
                      showConfirmPassword ? ICONS.EyeOffIcon : ICONS.EyeOnIcon
                    }
                    height={18}
                    width={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <PrimaryButton
            title={isLoading ? "Registering..." : "Register"}
            onPress={handleRegister}
            disabled={isLoading}
            isLoading={isLoading}
          />

          <CustomText fontSize={12} style={styles.loginPromptText}>
            Already Have an Account?{" "}
            <CustomText
              onPress={() => navigation.navigate("LoginScreen")}
              fontSize={12}
              color={PALETTE.sacredGold}
            >
              Login
            </CustomText>
          </CustomText>
        </KeyboardAvoidingContainer>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Register;
