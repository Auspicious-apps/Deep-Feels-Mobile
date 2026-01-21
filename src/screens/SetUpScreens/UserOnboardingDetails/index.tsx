import { GoogleSignin } from "@react-native-google-signin/google-signin";
import dayjs from "dayjs";
import React, { FC, useRef, useState } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../../assets/Icons";
import IMAGES from "../../../assets/Images";
import CustomDropDown from "../../../components/CustomDropdown";
import CustomIcon from "../../../components/CustomIcon";
import { CustomText } from "../../../components/CustomText";
import OptionalDetailsConfirmModal from "../../../components/Modals/OptionalDetailsConfirmModal";
import { KeyboardAvoidingContainer } from "../../../components/KeyboardScrollView";
import PrimaryButton from "../../../components/PrimaryButton";
import ENDPOINTS from "../../../service/ApiEndpoints";
import { UserInfoApiResponse } from "../../../service/ApiResponses/UserInfoAPIResponse";
import { postData } from "../../../service/ApiService";
import { UserDetailsSetupScreenProps } from "../../../typings/route";
import { PALETTE } from "../../../utils/Colors";
import { deleteLocalStorageData } from "../../../utils/Helpers";
import { horizontalScale, verticalScale, wp } from "../../../utils/Metrics";
import STORAGE_KEYS from "../../../utils/Storage";
import { useThemedStyles } from "./styles";
import { useChangingText } from "../../../hooks/useChanginTextHook";
import { getTimeZone } from "react-native-localize";

const messages = [
  "Building your personal profile...",
  "Mapping your emotional landscape...",
  "Understanding your unique traits...",
  "Processing your wellbeing data...",
  "Creating your wellness identity...",
  "Aligning your emotional patterns...",
  "Decoding your personality insights...",
  "Reading your emotional signature...",
  "Analyzing your wellbeing profile...",
  "Shaping your personal wellness path...",
  "Building your self-awareness journey...",
  "Exploring your emotional alignment...",
  "Weaving your personal story...",
  "Discovering your emotional strengths...",
  "Revealing your unique essence...",
  "Harmonizing your emotional patterns...",
  "Capturing your personality profile...",
  "Creating your wellness roadmap...",
];

const UserOnboardingDetails: FC<UserDetailsSetupScreenProps> = ({
  navigation,
}) => {
  const styles = useThemedStyles();
  const changingLoadingText = useChangingText(messages, 2000);

  // State for input fields, storing dates as Date objects
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [birthTime, setBirthTime] = useState<Date | null>(null);
  const [birthLocation, setBirthLocation] = useState<string>("");
  const [gender, setGender] = useState<"Male" | "Female" | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  // State for DatePicker modal visibility
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const [genderModal, setGenderModal] = useState(false);

  const dropdownButtonRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const openDropdown = () => {
    dropdownButtonRef.current?.measure((fx, fy, width, height, px, py) => {
      setDropdownPosition({
        x: px,
        y: py + height + verticalScale(5),
      });
      setGenderModal(true);
    });
  };

  // Helper function to format date for display in the TextInput
  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return "";
    // Use dayjs to format the date
    return dayjs(date).format("MMM D, YYYY"); // e.g., "Jan 1, 2000"
  };

  // Helper function to format time for display in the TextInput
  const formatTimeForDisplay = (time: Date | null) => {
    if (!time) return "";
    // Use dayjs to format the time
    return dayjs(time).format("hh:mm A"); // e.g., "10:30 AM"
  };

  const handleCreateProfile = async () => {
    //  Everything is optional

    // Check if DOB or location are missing
    if (!dateOfBirth || !birthLocation || !gender) {
      setIsConfirmModalVisible(true);
      return;
    }

    // If all fields are filled, proceed directly
    await proceedWithProfileCreation();
  };

  const proceedWithProfileCreation = async () => {
    setIsLoading(true);
    try {
      const response = await postData<UserInfoApiResponse>(ENDPOINTS.userInfo, {
        birthPlace: birthLocation || "",
        dob: dateOfBirth ? dayjs(dateOfBirth).format("YYYY-MM-DD") : "",
        gender: gender.toLowerCase() || "",
        ...(birthTime && {
          timeOfBirth: dayjs(birthTime).format("HH:mm"),
        }),
        timeZone: getTimeZone(),
      });

      if (response.data.success) {
        navigation.navigate("subscriptionPlanScreen", {
          isBuyAgain: false,
        });
      }
    } catch (error: any) {
      console.error("Add User Info error:", error);
      Toast.show({
        type: "error",
        text1: "Add User Info Failed!",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
      imageStyle={{
        backgroundColor: PALETTE.midnightIndigo,
      }}
    >
      <KeyboardAvoidingContainer>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <CustomText
              color={PALETTE.lightSkin}
              fontFamily="belganAesthetic"
              fontSize={26}
            >
              Let’s understand your inner blueprint
            </CustomText>
            <CustomText fontSize={14} fontFamily="medium">
              Your details help us tailor emotional insights and daily support
              that feel aligned with you.
            </CustomText>
          </View>

          <View style={styles.formContainer}>
            {/* Date of birth Input Field */}
            <View style={styles.inputFieldContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <CustomText fontSize={12} fontFamily="medium">
                  Date of birth
                </CustomText>
              </View>
              <CustomText
                fontSize={11}
                fontFamily="medium"
                color={PALETTE.sacredGold}
              >
                Understanding your birth timing helps us map your nervous system
                patterns and provide deeply personalized emotional wellness
                support.
              </CustomText>
              <View style={styles.inputWrapper}>
                <Pressable
                  onPress={() => setIsDatePickerOpen(true)}
                  style={styles.inputContainer}
                >
                  <CustomIcon
                    Icon={ICONS.CalendarICon}
                    height={18}
                    width={20}
                  />
                  <TextInput
                    maxFontSizeMultiplier={1.3}
                    placeholder="Select your date of birth"
                    placeholderTextColor={PALETTE.PlaceHolderText}
                    style={styles.textInput}
                    value={formatDateForDisplay(dateOfBirth)}
                    editable={false}
                    onPress={() => setIsDatePickerOpen(true)}
                  />
                </Pressable>
                <View style={styles.overlay} />
              </View>
              <DatePicker
                modal
                open={isDatePickerOpen}
                date={dateOfBirth || new Date()}
                mode="date"
                onConfirm={(selectedDate) => {
                  setIsDatePickerOpen(false);
                  setDateOfBirth(selectedDate);
                }}
                onCancel={() => setIsDatePickerOpen(false)}
                maximumDate={new Date()}
              />
            </View>

            {/* Time of birth Input Field */}
            <View style={styles.inputFieldContainer}>
              <View style={styles.timeOfBirthHeader}>
                <CustomText fontSize={12} fontFamily="medium">
                  Time of birth
                </CustomText>
                <CustomText fontSize={10} fontFamily="italic">
                  ( Optional )
                </CustomText>
              </View>
              <View style={styles.inputWrapper}>
                <Pressable
                  onPress={() => setIsTimePickerOpen(true)}
                  style={styles.inputContainer}
                >
                  <CustomIcon Icon={ICONS.ClockIcon} height={18} width={20} />
                  <TextInput
                    maxFontSizeMultiplier={1.3}
                    placeholder="Select your time of birth"
                    placeholderTextColor={PALETTE.PlaceHolderText}
                    style={styles.textInput}
                    value={formatTimeForDisplay(birthTime)}
                    editable={false}
                    onPress={() => setIsTimePickerOpen(true)}
                  />
                </Pressable>
                <View style={styles.overlay} />
              </View>
              <DatePicker
                modal
                open={isTimePickerOpen}
                date={birthTime || new Date()}
                mode="time"
                onConfirm={(selectedTime) => {
                  setIsTimePickerOpen(false);
                  setBirthTime(selectedTime);
                }}
                onCancel={() => setIsTimePickerOpen(false)}
              />
            </View>

            {/* Location of birth Input Field */}
            <View style={styles.inputFieldContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <CustomText fontSize={12} fontFamily="medium">
                  Location of birth
                </CustomText>
              </View>
              <CustomText
                fontSize={11}
                fontFamily="medium"
                color={PALETTE.sacredGold}
              >
                Your birth location helps us understand your emotional patterns
                and tailor nervous system support to your unique wellbeing
                needs.
              </CustomText>
              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <CustomIcon
                    Icon={ICONS.LocationIcon}
                    height={18}
                    width={20}
                  />
                  <TextInput
                    maxFontSizeMultiplier={1.3}
                    placeholder="Enter your birth location"
                    placeholderTextColor={PALETTE.PlaceHolderText}
                    style={styles.textInput}
                    value={birthLocation}
                    onChangeText={setBirthLocation}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                <View style={styles.overlay} />
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Gender
              </CustomText>
              <Pressable
                onPress={openDropdown}
                style={styles.inputWrapper}
                ref={dropdownButtonRef}
              >
                <View style={styles.inputContainer}>
                  <CustomIcon Icon={ICONS.GenderIcon} height={18} width={20} />
                  <TextInput
                    maxFontSizeMultiplier={1.3}
                    placeholder="Select your gender"
                    placeholderTextColor={PALETTE.PlaceHolderText}
                    style={styles.textInput}
                    value={gender}
                    editable={false}
                    onPress={openDropdown}
                  />
                </View>
                <View style={styles.overlay} />
              </Pressable>
              <CustomDropDown
                isVisible={genderModal}
                onClose={() => setGenderModal(false)}
                items={["Male", "Female", "Other"]}
                selectedItem={gender}
                onSelectItem={(gender: string) => {
                  setGender(gender);
                  setGenderModal(false);
                }}
                // position={dropdownPosition}
                width={wp(95) - horizontalScale(20)}
              />
            </View>
          </View>

          <PrimaryButton
            title={
              isLoading ? changingLoadingText : "Create My Wellness Profile"
            }
            onPress={handleCreateProfile}
            disabled={isLoading}
          />
          <CustomText style={{ textAlign: "center" }} fontSize={12}>
            Not your account?{" "}
            <CustomText
              fontSize={12}
              fontFamily="bold"
              color={PALETTE.sacredGold}
              onPress={async () => {
                await deleteLocalStorageData(STORAGE_KEYS.TOKEN);
                if (Platform.OS === "ios") {
                } else {
                  await GoogleSignin.signOut();
                }
                navigation.replace("authStack", {
                  screen: "LoginScreen",
                });
              }}
            >
              Login.
            </CustomText>
          </CustomText>
        </SafeAreaView>
      </KeyboardAvoidingContainer>

      <OptionalDetailsConfirmModal
        isVisible={isConfirmModalVisible}
        setIsVisible={setIsConfirmModalVisible}
        onConfirm={proceedWithProfileCreation}
        onEdit={() => setIsConfirmModalVisible(false)}
      />
    </ImageBackground>
  );
};

export default UserOnboardingDetails;
