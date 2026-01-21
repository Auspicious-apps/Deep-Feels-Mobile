import React, { FC } from "react";
import { Image, ImageBackground, Platform, Share, View } from "react-native";
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
import { PALETTE } from "../../../../utils/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";
import { InviteFirendsScreenProps } from "../../../../typings/route";
import PrimaryButton from "../../../../components/PrimaryButton";

const InviteFriends: FC<InviteFirendsScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();

  const url = Platform.select({
    ios: "",
    android:
      "https://play.google.com/store/apps/details?id=com.deepfeels&hl=en_IN",
  });

  const handleShareLink = async () => {
    try {
      const shareMessage = `Join me on Deep Feels! 🌙✨\n\nDiscover emotional insights, share compatibility with your loved ones, and embark on a journey of self-reflection and healing.\n${url}`;

      const result = await Share.share({
        message: shareMessage,
        title: "Join DeepFeels",
        ...(Platform.OS === "ios" && {
          url,
        }),
      });

      if (result.action === Share.dismissedAction) {
        // User dismissed the share dialog
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Share Failed",
        text2: error.message || "Unable to share. Please try again.",
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
          contentContainerStyle={{
            flex: 1,
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
              Invite Friends
            </CustomText>
          </View>

          <View style={{ flex: 1 }}>
            <Image
              source={IMAGES.LogoWithTitle}
              style={{
                height: hp(30),
                width: wp(70),
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
            <View style={{ gap: verticalScale(10) }}>
              <CustomText
                fontSize={14}
                fontFamily="semiBold"
                style={{ textAlign: "center" }}
              >
                Invite a Friend to Reflect with You
              </CustomText>
              <CustomText
                fontSize={14}
                color={PALETTE.lightTextColor}
                style={{ textAlign: "center" }}
              >
                Invite a friend to join DeepFeels and share the journey of
                emotional healing. Emotional growth is better when it's done
                together.
              </CustomText>
            </View>
          </View>

          <PrimaryButton title="Share Link" onPress={handleShareLink} />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default InviteFriends;
