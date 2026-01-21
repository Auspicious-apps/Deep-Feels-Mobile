import React, { FC, useState } from "react";
import { ImageBackground, Platform, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import PrimaryButton from "../../../../components/PrimaryButton";
import ENDPOINTS from "../../../../service/ApiEndpoints";
import { patchData } from "../../../../service/ApiService";
import { ChangePasswordScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { horizontalScale, verticalScale } from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const ChangePassword: FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();

  // State for all password fields and their errors
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    oldPasswordError: "",
    newPasswordError: "",
    confirmPasswordError: "",
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Reusable password validation logic
  const validatePassword = (
    key: "oldPassword" | "newPassword" | "confirmPassword",
    label: string,
    value: string,
    newPassValue?: string
  ) => {
    let error = "";
    if (!value.trim()) {
      error = `${label} is required.`;
    } else if (key === "newPassword" && value.length < 8) {
      error = "New password must be at least 8 characters.";
    } else if (key === "confirmPassword" && value !== newPassValue) {
      error = "Passwords do not match.";
    }
    return error;
  };

  const handleInputChange = (name: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the current field as the user types
    setErrors((prev) => ({ ...prev, [`${name}Error`]: "" }));
  };

  const handleChangePassword = async () => {
    // Reset all errors at the start of validation
    setErrors({
      oldPasswordError: "",
      newPasswordError: "",
      confirmPasswordError: "",
    });

    const oldPasswordError = validatePassword(
      "oldPassword",
      "Old Password",
      passwords.oldPassword
    );
    const newPasswordError = validatePassword(
      "newPassword",
      "New Password",
      passwords.newPassword
    );
    const confirmPasswordError = validatePassword(
      "confirmPassword",
      "Confirm Password",
      passwords.confirmPassword,
      passwords.newPassword
    );

    const newErrors = {
      oldPasswordError,
      newPasswordError,
      confirmPasswordError,
    };
    setErrors(newErrors);

    if (oldPasswordError || newPasswordError || confirmPasswordError) {
      const firstError =
        oldPasswordError || newPasswordError || confirmPasswordError;
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: firstError,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await patchData(ENDPOINTS.changePassword, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Password changed successfully!",
        });
      }
      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to change password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordField = (
    label: string,
    name: "oldPassword" | "newPassword" | "confirmPassword",
    placeholder: string,
    secureTextEntry: boolean,
    toggleVisibility: () => void,
    error: string | undefined
  ) => (
    <View style={styles.inputFieldContainer}>
      <CustomText fontSize={12} fontFamily="medium">
        {label}
      </CustomText>
      <View style={[styles.inputWrapper]}>
        <View
          style={[
            styles.inputContainer,
            error ? { borderColor: PALETTE.dangerRed, borderWidth: 1 } : {},
          ]}
        >
          <TextInput
            maxFontSizeMultiplier={1.3}
            placeholder={placeholder}
            placeholderTextColor={PALETTE.PlaceHolderText}
            style={styles.textInput}
            value={passwords[name]}
            onChangeText={(value) => handleInputChange(name, value)}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <CustomIcon
            onPress={toggleVisibility}
            Icon={secureTextEntry ? ICONS.EyeOffIcon : ICONS.EyeOnIcon}
            height={18}
            width={20}
          />
        </View>
        <View style={styles.overlay} />
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Platform.select({
              android: verticalScale(100),
              ios: insets.top + verticalScale(70),
            }),
            paddingTop: verticalScale(30),
            paddingHorizontal: horizontalScale(15),
            gap: verticalScale(20),
          }}
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <CustomIcon
              Icon={ICONS.GradientBackButtonIcon}
              height={verticalScale(36)}
              width={verticalScale(36)}
              onPress={() => navigation.goBack()}
            />
            <CustomText
              fontFamily="belganAesthetic"
              fontSize={30}
              color={PALETTE.heading}
            >
              Change Password
            </CustomText>
          </View>

          <View style={styles.formContainer}>
            {renderPasswordField(
              "Old Password",
              "oldPassword",
              "Enter old password",
              !showPassword.old,
              () => setShowPassword((prev) => ({ ...prev, old: !prev.old })),
              errors.oldPasswordError
            )}
            {renderPasswordField(
              "New Password",
              "newPassword",
              "Enter new password",
              !showPassword.new,
              () => setShowPassword((prev) => ({ ...prev, new: !prev.new })),
              errors.newPasswordError
            )}
            {renderPasswordField(
              "Confirm Password",
              "confirmPassword",
              "Confirm new password",
              !showPassword.confirm,
              () =>
                setShowPassword((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                })),
              errors.confirmPasswordError
            )}
          </View>

          <PrimaryButton
            title="Change Password"
            onPress={handleChangePassword}
            isLoading={isLoading}
            gradientStyle={{
              marginTop: verticalScale(20),
            }}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ChangePassword;
