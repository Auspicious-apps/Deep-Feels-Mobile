import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { FC, useRef, useState } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker, {
  CallingCode,
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import DatePicker from "react-native-date-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getTimeZone } from "react-native-localize";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AVATARS from "../../../../assets/avatars";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomDropDown from "../../../../components/CustomDropdown";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import SelectImageOptions from "../../../../components/Modals/SelectImageOptions";
import PrimaryButton from "../../../../components/PrimaryButton";
import { setHardRefreshHomeData } from "../../../../redux/slices/homeSlice";
import { setUser } from "../../../../redux/slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import ENDPOINTS from "../../../../service/ApiEndpoints";
import { UpdateProfileApiResponse } from "../../../../service/ApiResponses/UpdateProfileApiResponse";
import { patchData } from "../../../../service/ApiService";
import { MyProfileScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { getCountryByCallingCode } from "../../../../utils/CountryCallingCodes";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";
dayjs.extend(utc);

const MyProfile: FC<MyProfileScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { userData } = useAppSelector((state) => state.user);

  // State for input fields
  const [fullName, setFullName] = useState<string>(
    userData?.user.fullName ?? ""
  );
  const [email, setEmail] = useState<string>(userData?.user.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    userData?.user.phone ?? ""
  );

  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    userData?.additionalInfo.dobUTC
      ? new Date(userData?.additionalInfo?.dobUTC)
      : null
  );

  const [birthTime, setBirthTime] = useState<Date | null>(
    userData?.additionalInfo.timeOfBirth
      ? dayjs()
          .hour(Number(userData.additionalInfo.timeOfBirth.split(":")[0]))
          .minute(Number(userData.additionalInfo.timeOfBirth.split(":")[1]))
          .toDate()
      : null
  );
  const [birthLocation, setBirthLocation] = useState<string>(
    userData?.additionalInfo.birthPlace ?? ""
  );
  const [gender, setGender] = useState<"Male" | "Female" | string>(
    userData?.additionalInfo.gender
      ? userData.additionalInfo.gender.charAt(0).toUpperCase() +
          userData.additionalInfo.gender.slice(1)
      : ""
  );

  const [isLoading, setIsLoading] = useState(false);

  // State for DatePicker and dropdown visibility
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [genderModal, setGenderModal] = useState(false);

  const dropdownButtonRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  // --- Country Picker States ---
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>(
    (getCountryByCallingCode(userData?.user.countryCode!)
      ?.isoCode as CountryCode) ?? "US"
  );

  const [country, setCountry] = useState<Country | any>({
    cca2: getCountryByCallingCode(userData?.user.countryCode!)
      ?.isoCode as CountryCode,
    callingCode: [
      getCountryByCallingCode(userData?.user.countryCode!)
        ?.callingCode as CallingCode,
    ],
  });

  // --- Error States ---
  const [fullNameError, setFullNameError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [birthLocationError, setBirthLocationError] = useState<string>("");
  const [genderError, setGenderError] = useState<string>("");

  // --- TextInput Refs ---
  const phoneInputRef = useRef<TextInput>(null);

  // --- Country Picker Handler ---
  const onSelect = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry);
    setShowCountryPicker(false);
    phoneInputRef.current?.focus(); // Restore focus to phone input
  };

  const openDropdown = () => {
    dropdownButtonRef.current?.measure((fx, fy, width, height, px, py) => {
      setDropdownPosition({
        x: px,
        y: py + height + verticalScale(5),
      });
      setGenderModal(true);
    });
  };

  // Helper functions for formatting
  const formatDateForDisplay = (date: Date | null) =>
    date ? dayjs(date).format("MMM D, YYYY") : "";

  const formatTimeForDisplay = (time: Date | null) =>
    time ? dayjs(time).format("hh:mm A") : "";

  const [avatar, setAvatar] = useState<any>(userData?.user?.image);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const onClickCapture = () => {
    setIsImageModalVisible(true);
  };

  const onSelectImage = (avatarName: string) => {
    setAvatar(avatarName);
    setIsImageModalVisible(false);
  };

  const renderFormContainer = () => (
    <View style={styles.formContainer}>
      {/* Full Name */}
      <View style={styles.inputFieldContainer}>
        <CustomText fontSize={12} fontFamily="medium">
          Full Name
        </CustomText>
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputContainer,
              fullNameError
                ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                : {},
            ]}
          >
            <TextInput
              maxFontSizeMultiplier={1.3}
              placeholder="Enter your Full Name"
              placeholderTextColor={PALETTE.PlaceHolderText}
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          <View style={styles.overlay} />
        </View>
      </View>

      {/* Email Address */}
      <View style={styles.inputFieldContainer}>
        <CustomText fontSize={12} fontFamily="medium">
          Email Address
        </CustomText>
        <View style={styles.inputWrapper}>
          <View style={[styles.inputContainer]}>
            <TextInput
              maxFontSizeMultiplier={1.3}
              placeholder="Enter your Email Address"
              placeholderTextColor={PALETTE.PlaceHolderText}
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="words"
              autoCorrect={false}
              editable={false}
            />
          </View>
        </View>
      </View>

      {/* Phone Number */}
      {userData?.user.authType === "EMAIL" && (
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
            <View style={styles.phoneInputContainer}>
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
                <CustomIcon Icon={ICONS.DownArrowIcon} height={10} width={10} />
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
            <View style={styles.overlay} />
          </View>
        </View>
      )}

      {/* Date of birth Input Field */}
      <View style={styles.inputFieldContainer}>
        <CustomText fontSize={12} fontFamily="medium">
          Date of birth
        </CustomText>
        <View style={styles.inputWrapper}>
          <Pressable
            onPress={() => setIsDatePickerOpen(true)}
            style={styles.inputContainer}
          >
            <CustomIcon Icon={ICONS.CalendarICon} height={18} width={20} />
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
        <CustomText fontSize={12} fontFamily="medium">
          Location of birth
        </CustomText>
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputContainer,
              birthLocationError
                ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                : {},
            ]}
          >
            <CustomIcon Icon={ICONS.LocationIcon} height={18} width={20} />
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
          onPress={!userData?.additionalInfo.gender ? openDropdown : undefined}
          style={[
            styles.inputWrapper,
            {
              opacity: userData?.additionalInfo.gender ? 0.7 : 1,
              backgroundColor: "rhba(0,0,0,0.8)",
            },
          ]}
          ref={dropdownButtonRef}
          disabled={!!userData?.additionalInfo.gender}
        >
          <Pressable
            onPress={
              !userData?.additionalInfo.gender ? openDropdown : undefined
            }
            style={[
              styles.inputContainer,
              genderError
                ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                : {},
            ]}
          >
            <CustomIcon Icon={ICONS.UserIcon} height={18} width={20} />
            <TextInput
              maxFontSizeMultiplier={1.3}
              placeholder="Select your gender"
              placeholderTextColor={PALETTE.PlaceHolderText}
              style={styles.textInput}
              value={gender}
              editable={false}
              onPress={
                !userData?.additionalInfo.gender ? openDropdown : undefined
              }
            />
          </Pressable>
          <Pressable
            onPress={
              !userData?.additionalInfo.gender ? openDropdown : undefined
            }
            style={styles.overlay}
          />
        </Pressable>
        {userData?.additionalInfo.gender && (
          <CustomText fontSize={11}>
            Note: Gender helps personalize your profile. To keep your
            information current, this detail can only be updated by our Support
            Team.
          </CustomText>
        )}
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
  );

  const validateForm = () => {
    let isValid = true;

    // Reset all errors first
    setFullNameError("");
    setPhoneNumberError("");
    setBirthLocationError("");
    setGenderError("");

    // Full Name validation
    if (!fullName.trim()) {
      setFullNameError("Full Name is required.");
      isValid = false;
    }

    // Phone Number validation (only if authType is EMAIL)
    if (userData?.user.authType === "EMAIL") {
      if (!phoneNumber.trim()) {
        setPhoneNumberError("Phone Number is required.");
        isValid = false;
      } else if (phoneNumber.trim().length < 6) {
        setPhoneNumberError("Phone Number is too short.");
        isValid = false;
      }
    }

    // Birth Location validation
    if (!birthLocation.trim()) {
      setBirthLocationError("Birth Location is required.");
      isValid = false;
    }

    // Gender validation
    if (!gender) {
      setGenderError("Gender is required.");
      isValid = false;
    }

    // You can add more complex validations here (e.g., regex for phone number)

    return isValid;
  };

  // --- Save Changes Handler ---
  const handleSaveChanges = async () => {
    if (validateForm()) {
      try {
        // Form is valid, proceed with the update logic
        setIsLoading(true);

        const resposne = await patchData<UpdateProfileApiResponse>(
          ENDPOINTS.updateUser,
          {
            fullName,
            dob: dayjs(dateOfBirth).format("YYYY-MM-DD"),
            timeOfBirth: birthTime ? dayjs(birthTime).format("HH:mm") : "",
            birthPlace: birthLocation,
            image: avatar,
            gender: gender.toLowerCase(),
            ...(userData?.user.authType === "EMAIL" && {
              countryCode: country.callingCode[0],
              phone: phoneNumber,
            }),
            timeZone: getTimeZone(),
          }
        );

        if (resposne.data.success) {
          dispatch(setUser(resposne.data.data as any));
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Profile Updated Successfully!",
          });
          dispatch(setHardRefreshHomeData());
          navigation.goBack();
        }
      } catch (err: any) {
        console.log(err, "Error updating profile");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err.message || "Failed to update profile. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Form is not valid, display an error toast
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all the required fields.",
      });
    }
  };

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          extraScrollHeight={50}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollViewContent,
              {
                paddingBottom: Platform.select({
                  android: verticalScale(100),
                  ios: insets.top + verticalScale(70),
                }),
                paddingTop: verticalScale(30),
              },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <CustomIcon
                Icon={ICONS.GradientBackButtonIcon}
                height={verticalScale(34)}
                width={verticalScale(34)}
                onPress={() => navigation.goBack()}
              />
              <CustomText
                fontFamily="belganAesthetic"
                fontSize={30}
                color={PALETTE.heading}
              >
                My Profile
              </CustomText>
            </View>
            {/* {renderImageComp()} */}
            {renderFormContainer()}
            <PrimaryButton
              title="Save Changes"
              onPress={handleSaveChanges}
              isLoading={isLoading}
            />
          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <SelectImageOptions
        isModalVisible={isImageModalVisible}
        setIsModalVisible={setIsImageModalVisible}
        onSelectAvatar={onSelectImage}
        initialAvatar={userData?.user.image || "Avatar1"}
      />
    </ImageBackground>
  );
};

export default MyProfile;
