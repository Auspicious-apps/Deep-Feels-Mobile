import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  KeyboardAvoidingView,
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
import { PALETTE } from "../../utils/Colors";
import { horizontalScale, verticalScale } from "../../utils/Metrics";
import toastConfig from "../../utils/ToastConfigs";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";

type CreateJournalModalProps = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onContinue: (title: string) => void;
};

const CreateJournalNameModal: FC<CreateJournalModalProps> = ({
  isVisible,
  setIsVisible,
  onContinue,
}) => {
  const insets = useSafeAreaInsets();

  const [journalName, setJournalName] = useState("");

  const [journalNameError, setJournalNameError] = useState<null | string>(null);

  const validateName = () => {
    const trimmed = journalName.trim();

    if (!trimmed) {
      setJournalNameError("Name is required");
      Toast.show({
        type: "error",
        text1: "Validation Error!",
        text2: "Name is required",
      });
      return false;
    }
    if (trimmed.length < 3) {
      setJournalNameError("Please enter a name with at least 3 characters.");
      Toast.show({
        type: "error",
        text1: "Validation Error!",
        text2: "Please enter a name with at least 3 characters.",
      });
      return false;
    }
    setJournalNameError(null);
    return true;
  };

  const closeModal = () => {
    setIsVisible(false);
    setJournalName("");
    setJournalNameError(null);
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
          onPress={closeModal}
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
              onPress={closeModal}
              style={{ textAlign: "right" }}
            >
              Cancel
            </CustomText>

            <CustomIcon
              style={{ alignSelf: "center" }}
              Icon={ICONS.CreateJournalModalIllustration}
              height={verticalScale(100)}
              width={horizontalScale(100)}
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
                Name of the Journal
              </CustomText>
            </View>

            {/* Confirm Password Input */}
            <View>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: journalNameError
                      ? PALETTE.dangerRed
                      : PALETTE.inputBorder,
                    borderWidth: journalNameError ? 1 : 0.5,
                  },
                ]}
              >
                <TextInput
                  maxFontSizeMultiplier={1.3}
                  placeholder="Enter Name"
                  placeholderTextColor={PALETTE.PlaceHolderText}
                  style={styles.textInput}
                  value={journalName}
                  onChangeText={setJournalName}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onBlur={validateName} // Validate on blur
                />
              </View>

              <View style={styles.overlay} />
            </View>

            <PrimaryButton
              title="Create Journal"
              onPress={() => {
                if (validateName()) {
                  setJournalName("");
                  setJournalNameError(null);
                  onContinue(journalName);
                }
              }}
            />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Toast
        config={toastConfig}
        visibilityTime={4000}
        autoHide={true}
        topOffset={insets.top + 20}
      />
    </Modal>
  );
};

export default CreateJournalNameModal;

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
