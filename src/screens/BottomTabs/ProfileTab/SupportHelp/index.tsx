import React, { FC, useState } from "react";
import {
  ImageBackground,
  Linking,
  Platform,
  TextInput,
  View,
} from "react-native";
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
import { useAppSelector } from "../../../../redux/store";
import ENDPOINTS from "../../../../service/ApiEndpoints";
import { postData } from "../../../../service/ApiService";
import { HelpSupportScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { horizontalScale, verticalScale } from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const SupportHelp: FC<HelpSupportScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();

  const { userData } = useAppSelector((state) => state.user);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(userData?.user.email); // Assuming email comes from profile
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    subject: false,
    message: false,
  });

  const validateForm = () => {
    const newErrors = {
      fullName: !fullName.trim(),
      email: !email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      subject: !subject.trim(),
      message: !message.trim(),
    };

    setErrors(newErrors);

    if (newErrors.fullName) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Full Name is required",
      });
      return false;
    }

    if (newErrors.email) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "A valid Email Address is required",
      });
      return false;
    }

    if (newErrors.subject) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Subject is required",
      });
      return false;
    }

    if (newErrors.message) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Message is required",
      });
      return false;
    }

    return true;
  };

  const handleSendMessage = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        fullName,
        email,
        subject,
        message,
      };

      const response = await postData(ENDPOINTS.suppotRequest, payload);
      if (response?.data?.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Message sent successfully!",
        });
        setFullName("");
        setSubject("");
        setMessage("");
        // if (navigation.canGoBack()) {
        navigation.goBack();
        // console.log(navigation.canGoBack(), "OOOo");
        // }
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSendMessage = async () => {
  //   if (!validateForm()) return;

  //   // 1. Construct the email body text
  //   const emailBody = `Full Name: ${fullName}\n\nMessage: ${message}`;

  //   // 2. Encode the subject and body for the URL
  //   // We use a predefined email address, the user's entered email is used as the 'From' address by their mail app.
  //   const urlSubject = encodeURIComponent(subject);
  //   const urlBody = encodeURIComponent(emailBody);

  //   // 3. Construct the mailto: URL
  //   // Use the user's entered email as a 'cc' or 'reply-to' field if necessary,
  //   // but the main URL structure is simple:
  //   const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${urlSubject}&body=${urlBody}`;

  //   try {
  //     const canOpen = await Linking.canOpenURL(mailtoUrl);

  //     if (canOpen) {
  //       await Linking.openURL(mailtoUrl);

  //       // Optional: Show success toast and clear fields after opening mail app
  //       Toast.show({
  //         type: "info",
  //         text1: "Opening Mail App",
  //         text2: "Please send your message from your email app.",
  //       });
  //       setFullName("");
  //       setSubject("");
  //       setMessage("");
  //       // Removed navigation.goBack() as the user is now in a different app
  //     } else {
  //       // Fallback for devices that cannot open the mailto URL
  //       Toast.show({
  //         type: "error",
  //         text1: "Error",
  //         text2: `Cannot open mail app. Please email your request manually to ${SUPPORT_EMAIL}`,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Linking error:", error);
  //     Toast.show({
  //       type: "error",
  //       text1: "Error",
  //       text2: "Failed to open mail application.",
  //     });
  //   }
  // };
  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
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
              We’re here to help
            </CustomText>
          </View>

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

                    errors.fullName
                      ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                      : {},
                  ]}
                >
                  <TextInput
                    allowFontScaling={false}
                    placeholder="Enter your Full Name"
                    placeholderTextColor={PALETTE.PlaceHolderText}
                    style={styles.textInput}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    importantForAutofill="no"
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
                <View
                  style={[
                    styles.inputContainer,
                    errors.email
                      ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                      : {},
                  ]}
                >
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
                    importantForAutofill="no"
                  />
                </View>
                <View style={styles.overlay} />
              </View>
            </View>

            {/* Subject */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Subject
              </CustomText>
              <View style={styles.inputWrapper}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.subject
                      ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                      : {},
                  ]}
                >
                  <TextInput
                    maxFontSizeMultiplier={1.3}
                    placeholder="Enter your Subject"
                    placeholderTextColor={PALETTE.PlaceHolderText}
                    style={styles.textInput}
                    value={subject}
                    onChangeText={setSubject}
                    autoCapitalize="words"
                    autoCorrect={false}
                    importantForAutofill="no"
                  />
                </View>
                <View style={styles.overlay} />
              </View>
            </View>
            {/* Message */}
            <View style={styles.inputFieldContainer}>
              <CustomText fontSize={12} fontFamily="medium">
                Message
              </CustomText>
              <View style={styles.inputWrapper}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.message
                      ? { borderColor: PALETTE.dangerRed, borderWidth: 1 }
                      : {},
                  ]}
                >
                  <TextInput
                    maxFontSizeMultiplier={1.3}
                    placeholder="Enter your Message"
                    placeholderTextColor={PALETTE.PlaceHolderText}
                    style={[
                      styles.textInput,
                      {
                        minHeight: verticalScale(200),
                        paddingTop: verticalScale(10),
                      },
                    ]}
                    textAlignVertical="top"
                    value={message}
                    onChangeText={setMessage}
                    autoCapitalize="words"
                    multiline
                    numberOfLines={10}
                    autoCorrect={false}
                    importantForAutofill="no"
                    submitBehavior="blurAndSubmit"
                  />
                </View>
                <View style={styles.overlay} />
              </View>
            </View>
          </View>

          <PrimaryButton
            title="Send Message"
            onPress={handleSendMessage}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SupportHelp;
