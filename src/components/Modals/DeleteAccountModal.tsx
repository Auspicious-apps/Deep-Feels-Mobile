import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../assets/Icons";
import IMAGES from "../../assets/Images";
import { useAppSelector } from "../../redux/store";
import ENDPOINTS from "../../service/ApiEndpoints";
import { postData } from "../../service/ApiService";
import { PALETTE } from "../../utils/Colors";
import { deleteLocalStorageData } from "../../utils/Helpers";
import { horizontalScale, verticalScale, wp } from "../../utils/Metrics";
import STORAGE_KEYS from "../../utils/Storage";
import toastConfig from "../../utils/ToastConfigs";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";

type DeleteAccountModalProps = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onContinue: () => void;
};

const DeleteAccountModal: FC<DeleteAccountModalProps> = ({
  isVisible,
  setIsVisible,
  onContinue,
}) => {
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [passwordError, setPasswordError] = useState<null | string>(null);

  const { userData } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setPassword("");
    setIsVisible(false);
  };

  const handleDeletePress = async () => {
    if (userData?.user.authType === "EMAIL") {
      if (!password.trim()) {
        setPasswordError("Please enter your password.");
        Toast.show({
          type: "error",
          text1: "Validation error",
          text2: "Please enter your password.",
        });
        return;
      }
    }

    // Basic validation: ensure password is not empty
    setIsLoading(true);

    const payload = userData?.user.authType === "EMAIL" ? { password } : {}; // If GOOGLE, don't send password

    try {
      const response = await postData(ENDPOINTS.deleteAccount, payload);
      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.data.message,
        });

        await deleteLocalStorageData(STORAGE_KEYS.REMEMBERED_EMAIL);
        await deleteLocalStorageData(STORAGE_KEYS.REMEMBERED_PASSWORD);
        await deleteLocalStorageData(STORAGE_KEYS.REMEMBER_ME_KEY);
        await deleteLocalStorageData(STORAGE_KEYS.TOKEN);
        await deleteLocalStorageData(STORAGE_KEYS.MOOD_LOG_KEY);

        onContinue();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to toggle journal encryption.",
        });
      }
    } catch (error: any) {
      console.error("Toggle Journal Encryption error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={closeModal}
      animationType="fade"
    >
      <KeyboardAvoidingView // <-- Added KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={closeModal} // This handles the background tap
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <Image source={IMAGES.LogoWithTitle} style={styles.logo} />
            <View style={styles.headerTextContainer}>
              <CustomText
                color={PALETTE.lightSkin}
                fontFamily="belganAesthetic"
                fontSize={26}
                style={{ textAlign: "center" }}
              >
                Are you sure you want to delete your account?
              </CustomText>
              <CustomText
                fontSize={11}
                fontFamily="bold"
                style={{ textAlign: "center" }}
              >
                Note : Your account will be marked for deletion and you will be
                logged out. All your data will be permanently erased after a
                14 days grace period. You can reactivate your account at any time
                within this period by logging back in..
              </CustomText>
            </View>

            {userData?.user.authType === "EMAIL" && (
              <View style={styles.inputWrapper}>
                <View
                  style={[
                    styles.inputContainer,
                    passwordError
                      ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                      : {},
                  ]}
                >
                  <TextInput
                    maxFontSizeMultiplier={1.3}
                    placeholder="Enter your password"
                    placeholderTextColor={PALETTE.PlaceHolderText}
                    style={styles.textInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible} // Fix: secureTextEntry should be the inverse of isPasswordVisible
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.eyeIcon}
                  >
                    <CustomIcon
                      Icon={
                        isPasswordVisible ? ICONS.EyeOffIcon : ICONS.EyeOnIcon
                      }
                      height={18}
                      width={20}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.overlay} />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Delete Account"
                onPress={handleDeletePress}
                style={styles.deleteButton}
                isArrowIcon={false}
                isLoading={isLoading}
              />
              <PrimaryButton
                title="Cancel"
                onPress={closeModal}
                style={styles.cancelButton}
                isArrowIcon={false}
                bgColor={["transparent", "transparent"]}
              />
            </View>
          </View>
        </TouchableOpacity>
        <Toast
          config={toastConfig}
          visibilityTime={4000}
          autoHide={true}
          topOffset={insets.top + 20}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default DeleteAccountModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(10),
  },
  modalContent: {
    width: "100%",
    backgroundColor: PALETTE.mysticPurple,
    borderRadius: 28,
    padding: verticalScale(25),
    // The key change: The modal content now contains all elements, including the buttons.
  },
  logo: {
    width: horizontalScale(160),
    height: verticalScale(100),
    alignSelf: "center",
    resizeMode: "contain",
  },
  headerTextContainer: {
    alignItems: "center",
    gap: verticalScale(10),
    marginVertical: verticalScale(10),
  },
  inputWrapper: {
    width: "100%",
    position: "relative",
    marginVertical: verticalScale(10), // Added spacing for better layout
  },
  inputContainer: {
    paddingHorizontal: horizontalScale(15),
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 20,
    minHeight: verticalScale(45),
    gap: horizontalScale(5),
    zIndex: 1,
    borderWidth: 0.5,
    borderColor: PALETTE.inputBorder,
  },
  overlay: {
    opacity: 0.1,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    position: "absolute",
    borderRadius: 20,
  },
  textInput: {
    flex: 1,
    color: PALETTE.white,
  },
  eyeIcon: {
    padding: horizontalScale(5), // Add padding for easier tapping
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deleteButton: {
    width: wp(50), // Adjusted button width
  },
  cancelButton: {
    width: wp(30), // Adjusted button width
  },
});
