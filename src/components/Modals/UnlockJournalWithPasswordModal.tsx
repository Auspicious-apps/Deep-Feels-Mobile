import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../assets/Icons";
import ENDPOINTS from "../../service/ApiEndpoints";
import { fetchData } from "../../service/ApiService";
import { PALETTE } from "../../utils/Colors";
import { storeLocalStorageData } from "../../utils/Helpers";
import { horizontalScale, verticalScale } from "../../utils/Metrics";
import STORAGE_KEYS from "../../utils/Storage";
import toastConfig from "../../utils/ToastConfigs";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useNavigation } from "@react-navigation/native";

type UnlockJournalWithPasswordModalProps = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};

const UnlockJournalWithPasswordModal: FC<
  UnlockJournalWithPasswordModalProps
> = ({ isVisible, setIsVisible, setSelectedIndex }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState<null | string>(null);

  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setPassword("");
    setPasswordError(null);
    setIsVisible(false);
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
      Toast.show({
        type: "error",
        text1: "Validation Error!",
        text2: "Password is required",
      });
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleCheckPassword = async () => {
    const isPasswordValid = validatePassword();

    if (isPasswordValid) {
      setIsLoading(true);
      try {
        const response = await fetchData(ENDPOINTS.checkJournalPssword, {
          password,
        });
        if (response.data.success) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Journal unlocked successfully.",
          });

          await storeLocalStorageData(
            STORAGE_KEYS.JOURNAL_UNLOCK_TIMESTAMP_KEY,
            String(Date.now())
          );
          closeModal();
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to unlock journal.",
          });
        }
      } catch (error: any) {
        console.error("Error while unlocking Journal:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Something went wrong.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const exitFromJournal = () => {
    closeModal();
    navigation.goBack()
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={exitFromJournal}
      animationType="fade"
    >
      <KeyboardAvoidingView // <-- Added KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          onPress={exitFromJournal}
          activeOpacity={1}
          style={styles.container}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true} // Capture touch events
            onResponderRelease={(e) => e.stopPropagation()} // Prevent propagation
          >
            <CustomText
              fontSize={12}
              onPress={exitFromJournal}
              style={{ textAlign: "right" }}
            >
              Cancel
            </CustomText>

            <CustomIcon
              style={{ alignSelf: "center" }}
              Icon={ICONS.GirlWithBowIcon}
              height={verticalScale(100)}
              width={horizontalScale(80)}
            />
            <View
              style={{
                alignItems: "center",
                gap: verticalScale(10),
                marginVertical: verticalScale(20),
              }}
            >
              <CustomText
                color={PALETTE.lightSkin}
                fontFamily="belganAesthetic"
                fontSize={24}
                style={{
                  textAlign: "center",
                }}
              >
                Enter Lock Password
              </CustomText>
            </View>

            {/* Password Input */}
            <View>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: passwordError
                      ? PALETTE.dangerRed
                      : PALETTE.inputBorder,
                    borderWidth: passwordError ? 1 : 0.5,
                  },
                ]}
              >
                <TextInput
                  maxFontSizeMultiplier={1.3}
                  placeholder="Password"
                  placeholderTextColor={PALETTE.PlaceHolderText}
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onBlur={validatePassword} // Validate on blur
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

            <PrimaryButton
              title="Confirm"
              onPress={handleCheckPassword}
              disabled={isLoading}
              isLoading={isLoading}
            />
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

export default UnlockJournalWithPasswordModal;

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
    gap: verticalScale(15),
    borderRadius: 28,
    overflow: "hidden",
    padding: verticalScale(25),
  },
  logo: {
    width: horizontalScale(160),
    height: verticalScale(100),
    alignSelf: "center",
  },
  inputWrapper: {
    width: "100%",
    position: "relative",
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
});
