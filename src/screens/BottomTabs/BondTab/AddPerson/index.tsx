import dayjs from "dayjs";
import React, { FC, useState } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeIn } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomDropDown from "../../../../components/CustomDropdown";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import PrimaryButton from "../../../../components/PrimaryButton";
import { useChangingText } from "../../../../hooks/useChanginTextHook";
import { setRefreshSavedProfiles } from "../../../../redux/slices/homeSlice";
import { useAppDispatch } from "../../../../redux/store";
import ENDPOINTS from "../../../../service/ApiEndpoints";
import { CheckCompatibilityApiResponse } from "../../../../service/ApiResponses/CheckCompatibilityApiResponse";
import { postData } from "../../../../service/ApiService";
import { AddPersonScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { horizontalScale, verticalScale, wp } from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

export const messages = [
  "Calculating your compatibility...",
  "Analyzing communication patterns...",
  "Finding your connection profile...",
  "Assessing your relationship dynamics...",
  "Analyzing compatibility factors...",
  "Balancing relationship strengths...",
  "Reading personality patterns...",
  "Consulting your profiles...",
  "Mapping your relationship pathways...",
  "Decoding interaction styles...",
  "Tracing your emotional connection...",
  "Exploring your relationship alignment...",
  "Comparing personality frequencies...",
  "Discovering shared values...",
  "Unveiling your relational bond...",
  "Synchronizing communication rhythms...",
  "Measuring emotional compatibility...",
  "Calculating relational resonance...",
];

const AddPerson: FC<AddPersonScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();
  const dispatch = useAppDispatch();

  const { relationshipType } = route.params;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const changingText = useChangingText(messages, 2000);

  // --- Input States ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [birthLocation, setBirthLocation] = useState("");

  // --- Error States ---
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [sexError, setSexError] = useState("");
  const [dobError, setDobError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [locationError, setLocationError] = useState("");

  // Dropdown/Picker States
  const [genderModal, setGenderModal] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // --- Formatters ---
  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return "";
    return dayjs(date).format("MMM D, YYYY");
  };

  const formatTimeForDisplay = (time: Date | null) => {
    if (!time) return "";
    return dayjs(time).format("hh:mm A");
  };

  // --- Validation Function ---
  const validateInputs = (): boolean => {
    let valid = true;

    setFirstNameError("");
    setLastNameError("");
    setSexError("");
    setDobError("");
    // setTimeError("");
    setLocationError("");

    if (!firstName.trim()) {
      valid = false;
      setFirstNameError("First name is required.");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "First name is required.",
      });
      return valid;
    }

    if (!lastName.trim()) {
      valid = false;
      setLastNameError("Last name is required.");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Last name is required.",
      });
      return valid;
    }

    if (!sex) {
      setSexError("Please select gender.");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please select gender.",
      });
      valid = false;
      return valid;
    }

    if (!dob) {
      setDobError("Date of birth is required.");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Date of birth is required.",
      });
      valid = false;
      return valid;
    }

    // if (!time) {
    //   setTimeError("Time of birth is required.");
    //   Toast.show({
    //     type: "error",
    //     text1: "Validation Error",
    //     text2: "Time of birth is required.",
    //   });
    //   valid = false;
    //   return valid;
    // }

    if (!birthLocation.trim()) {
      setLocationError("Location is required.");
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Location of birth is required.",
      });
      valid = false;
      return valid;
    }

    return valid;
  };

  const handleCheckCompatibility = async () => {
    if (!validateInputs()) return;
    setIsLoading(true);

    try {
      const response = await postData<CheckCompatibilityApiResponse>(
        ENDPOINTS.checkCompatibility,
        {
          relationshipType: relationshipType.toLowerCase(),
          firstName: firstName,
          lastName: lastName,
          gender: sex,
          dob: dayjs(dob).format("YYYY-MM-DD"),
          birthPlace: birthLocation,
          ...(time && { timeOfBirth: dayjs(time).format("HH:mm") }),
        }
      );

      if (response.data.success) {
        dispatch(setRefreshSavedProfiles());

        navigation.replace("compatibilityDetails", {
          data: response.data.data.relations[0] as any,
          partner: response.data.data.partner as any,
          id: response.data.data._id,
        });
      }
    } catch (error: any) {
      console.error("Check Compatibility error:", error);
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <Animated.View entering={FadeIn.duration(1500)} style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              position: "relative",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ScrollView
              nestedScrollEnabled
              contentContainerStyle={[
                styles.scrollViewContent,
                {
                  paddingBottom: Platform.select({
                    android: verticalScale(100),
                    ios: insets.bottom + verticalScale(100),
                  }),
                },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.headerContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: horizontalScale(10),
                  }}
                >
                  <CustomIcon
                    Icon={ICONS.GradientBackButtonIcon}
                    height={verticalScale(36)}
                    width={verticalScale(36)}
                    onPress={() => navigation.goBack()}
                  />
                  <CustomText
                    fontFamily="belganAesthetic"
                    fontSize={30}
                    color={PALETTE.lightSkin}
                  >
                    Add Person
                  </CustomText>
                </View>
                <CustomText fontSize={14} color={PALETTE.white}>
                  Let’s get to know them better. These next steps will help us
                  explore your relationship more deeply
                </CustomText>
              </View>

              <View
                style={{
                  paddingHorizontal: horizontalScale(15),
                  gap: verticalScale(20),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: horizontalScale(10),
                  }}
                >
                  <View style={styles.inputFieldContainer}>
                    <CustomText fontSize={12} fontFamily="medium">
                      First Name
                    </CustomText>
                    <View
                      style={[
                        styles.textInputWrapper,
                        firstNameError
                          ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                          : {},
                      ]}
                    >
                      <CustomIcon
                        Icon={ICONS.UserIcon}
                        height={18}
                        width={20}
                      />
                      <TextInput
                        maxFontSizeMultiplier={1.3}
                        placeholder="First name"
                        placeholderTextColor={PALETTE.PlaceHolderText}
                        style={styles.textInput}
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="words"
                        autoCorrect={false}
                      />
                    </View>
                  </View>
                  <View style={styles.inputFieldContainer}>
                    <CustomText fontSize={12} fontFamily="medium">
                      Last Name
                    </CustomText>
                    <View
                      style={[
                        styles.textInputWrapper,
                        lastNameError
                          ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                          : {},
                      ]}
                    >
                      <CustomIcon
                        Icon={ICONS.UserIcon}
                        height={18}
                        width={20}
                      />
                      <TextInput
                        maxFontSizeMultiplier={1.3}
                        placeholder="Last name"
                        placeholderTextColor={PALETTE.PlaceHolderText}
                        style={styles.textInput}
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                        autoCorrect={false}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputFieldContainer}>
                  <CustomText fontSize={12} fontFamily="medium">
                    Sex
                  </CustomText>
                  <Pressable
                    onPress={() => {
                      setGenderModal(true);
                    }}
                    style={[
                      styles.textInputWrapper,
                      sexError
                        ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                        : {},
                    ]}
                  >
                    <CustomIcon
                      Icon={ICONS.GenderIcon}
                      height={18}
                      width={20}
                    />
                    <TextInput
                      maxFontSizeMultiplier={1.3}
                      placeholder="Select your gender"
                      placeholderTextColor={PALETTE.PlaceHolderText}
                      style={styles.textInput}
                      value={sex}
                      onPress={() => {
                        setGenderModal(true);
                      }}
                      editable={false}
                    />
                    <CustomDropDown
                      isVisible={genderModal}
                      onClose={() => setGenderModal(false)}
                      items={["Male", "Female", "Other"]}
                      selectedItem={sex}
                      onSelectItem={(gender: string) => {
                        setSex(gender);
                        setGenderModal(false);
                      }}
                      width={wp(95) - horizontalScale(20)}
                    />
                  </Pressable>
                </View>

                <View style={styles.inputFieldContainer}>
                  <CustomText fontSize={12} fontFamily="medium">
                    Date of birth
                  </CustomText>
                  <Pressable
                    onPress={() => setIsDatePickerOpen(true)}
                    style={[
                      styles.textInputWrapper,
                      dobError
                        ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                        : {},
                    ]}
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
                      value={formatDateForDisplay(dob)}
                      editable={false}
                      onPress={() => setIsDatePickerOpen(true)}
                    />
                  </Pressable>
                  <DatePicker
                    modal
                    open={isDatePickerOpen}
                    date={dob || new Date()}
                    mode="date"
                    onConfirm={(selectedDate) => {
                      setIsDatePickerOpen(false);
                      setDob(selectedDate);
                    }}
                    onCancel={() => setIsDatePickerOpen(false)}
                    maximumDate={new Date()}
                  />
                </View>

                <View style={styles.inputFieldContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: horizontalScale(5),
                    }}
                  >
                    <CustomText fontSize={12} fontFamily="medium">
                      Time of birth
                    </CustomText>
                    <CustomText fontSize={12} fontFamily="medium">
                      ( Optional )
                    </CustomText>
                  </View>
                  <Pressable
                    onPress={() => setIsTimePickerOpen(true)}
                    style={[
                      styles.textInputWrapper,
                      timeError
                        ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                        : {},
                    ]}
                  >
                    <CustomIcon
                      Icon={ICONS.CalendarICon}
                      height={18}
                      width={20}
                    />
                    <TextInput
                      maxFontSizeMultiplier={1.3}
                      placeholder="Select your time of birth"
                      placeholderTextColor={PALETTE.PlaceHolderText}
                      style={styles.textInput}
                      value={formatTimeForDisplay(time)}
                      editable={false}
                      onPress={() => setIsTimePickerOpen(true)}
                    />
                  </Pressable>
                  <DatePicker
                    modal
                    open={isTimePickerOpen}
                    date={time || new Date()}
                    mode="time"
                    onConfirm={(selectedTime) => {
                      setIsTimePickerOpen(false);
                      setTime(selectedTime);
                    }}
                    onCancel={() => setIsTimePickerOpen(false)}
                  />
                </View>

                <View style={styles.inputFieldContainer}>
                  <CustomText fontSize={12} fontFamily="medium">
                    Location of birth
                  </CustomText>
                  <View
                    style={[
                      styles.textInputWrapper,
                      locationError
                        ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                        : {},
                    ]}
                  >
                    <CustomIcon Icon={ICONS.UserIcon} height={18} width={20} />
                    <TextInput
                      maxFontSizeMultiplier={1.3}
                      placeholder="Location"
                      placeholderTextColor={PALETTE.PlaceHolderText}
                      style={styles.textInput}
                      value={birthLocation}
                      onChangeText={setBirthLocation}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              </View>

              <PrimaryButton
                title={isLoading ? changingText : "Check Compatibility"}
                onPress={handleCheckCompatibility}
                gradientStyle={{
                  width: wp(90),
                  alignSelf: "center",
                  opacity: isLoading ? 0.8 : 1,
                }}
                disabled={isLoading}
                isArrowIcon={!isLoading}
              />
            </ScrollView>
          </KeyboardAwareScrollView>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AddPerson;
