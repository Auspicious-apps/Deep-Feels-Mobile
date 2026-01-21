import React, { Dispatch, FC, SetStateAction, useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../assets/Icons";
import { setRefreshHomeData } from "../../redux/slices/homeSlice";
import { refreshMyJournals } from "../../redux/slices/journalSlice";
import { useAppDispatch } from "../../redux/store";
import { moodData } from "../../screens/BottomTabs/Home";
import ENDPOINTS from "../../service/ApiEndpoints";
import { postData } from "../../service/ApiService";
import { PALETTE } from "../../utils/Colors";
import { horizontalScale, verticalScale, wp } from "../../utils/Metrics";
import toastConfig from "../../utils/ToastConfigs";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";

type LodMoodModalProps = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
};

const LogMoodModal: FC<LodMoodModalProps> = ({ isVisible, setIsVisible }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = async (item: { value: string; name: string }) => {
    setSelectedMood(item.value);
  };

  // Reset state when modal becomes hidden
  useEffect(() => {
    if (!isVisible) {
      setDescription("");
      setSelectedMood(null);
    }
  }, [isVisible]);

  const closeModal = () => {
    setIsVisible(false);
    setDescription("");
    setSelectedMood(null);
  };

  const logMoodWithDescription = async () => {
    setIsLoading(true);
    try {
      const resposne = await postData(ENDPOINTS.mood, {
        mood: selectedMood,
        description: description,
      });

      if (resposne.data.success) {
        dispatch(setRefreshHomeData());
        // Trigger journal data refresh to update weeklyMoodReport
        dispatch(refreshMyJournals());
        closeModal();
      }
    } catch (error: any) {
      console.error("Log Mood Error error:", error);
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
              style={{
                textAlign: "right",
                position: "absolute",
                top: verticalScale(20),
                right: horizontalScale(30),
              }}
            >
              Skip
            </CustomText>

            <CustomIcon
              style={{ alignSelf: "center" }}
              Icon={ICONS.LogmModIllustrationIcon}
              height={verticalScale(70)}
              width={horizontalScale(120)}
            />
            <View
              style={{
                alignItems: "center",
                marginVertical: verticalScale(20),
              }}
            >
              <CustomText
                color={PALETTE.lightSkin}
                fontFamily="belganAesthetic"
                fontSize={20}
                style={{
                  textAlign: "center",
                }}
              >
                How are you feeling today?
              </CustomText>
              <CustomText
                fontSize={12}
                color={"#E1E6F2"}
                style={{ textAlign: "center" }}
              >
                Take a mindful pause and notice your current state before
                selecting.
              </CustomText>

              <FlatList
                data={moodData}
                horizontal
                keyExtractor={(item, index) => item.value} // Use unique value instead of index
                renderItem={({ item }) => {
                  const isSelected = selectedMood === item.value;

                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleMoodSelect(item)}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 100,
                          borderWidth: 1,
                          borderColor: isSelected ? "#858FFF" : "transparent",
                          padding: verticalScale(10),
                        }}
                      >
                        <Image
                          source={item.image}
                          style={{
                            width: verticalScale(20),
                            height: verticalScale(20),
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                      <CustomText
                        fontSize={12}
                        color={isSelected ? PALETTE.white : PALETTE.heading}
                        style={{ marginTop: verticalScale(5) }}
                      >
                        {item.name}
                      </CustomText>
                    </TouchableOpacity>
                  );
                }}
                contentContainerStyle={{
                  width: wp(90) - verticalScale(20),
                  justifyContent: "space-evenly",
                }}
                showsHorizontalScrollIndicator={false}
                snapToInterval={verticalScale(80)}
                decelerationRate="fast"
                initialNumToRender={5}
                windowSize={5}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CustomText fontSize={12}>Notes</CustomText>
              <CustomText fontSize={12}>
                {description.length}/30 words
              </CustomText>
            </View>

            <View>
              <View style={[styles.inputContainer]}>
                <TextInput
                  maxFontSizeMultiplier={1.3}
                  placeholder="Enter a note"
                  placeholderTextColor={PALETTE.PlaceHolderText}
                  style={styles.textInput}
                  value={description}
                  onChangeText={setDescription}
                  autoCapitalize="none"
                  maxLength={30}
                  autoCorrect={false}
                />
              </View>

              <View style={styles.overlay} />
            </View>

            <PrimaryButton
              title="Log Mood"
              isArrowIcon={false}
              onPress={logMoodWithDescription}
              disabled={isLoading}
              isLoading={isLoading}
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

export default LogMoodModal;

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
    gap: verticalScale(10),
    borderRadius: 28,
    overflow: "hidden",
    paddingHorizontal: verticalScale(25),
    paddingVertical: verticalScale(20),
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
