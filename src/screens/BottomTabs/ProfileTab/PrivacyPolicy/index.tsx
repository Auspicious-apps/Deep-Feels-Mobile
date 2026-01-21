import React, { FC } from "react";
import { ImageBackground, Platform, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import { PrivacyPolicyScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { verticalScale } from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const PrivacyPolicy: FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
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
              Privacy Policy
            </CustomText>
          </View>

          <View>
            <CustomText
              fontFamily="semiBold"
              fontSize={18}
              style={{ marginVertical: verticalScale(10) }}
            >
              Welcome to DeepFeels
            </CustomText>
            <CustomText
              fontSize={14}
              color={PALETTE.lightTextColor}
              style={{ textAlign: "left" }}
            >
              Thank you for being part of the DeepFeels community — a space
              designed to support your emotional journey with care, privacy, and
              intention. We are deeply committed to protecting your personal
              information and respecting your right to emotional safety. If you
              ever have questions or concerns about how your data is handled,
              please feel free to reach out to us at hello@deepfeels.net. By
              using the DeepFeels mobile app and its related services, you are
              placing your trust in us to hold your information securely and
              respectfully. We honor that trust and take your privacy seriously.
              This privacy notice explains what information we collect, how we
              use it, and the rights you have in relation to your data. If you
              do not agree with our privacy practices, we kindly ask that you
              discontinue use of the DeepFeels app and services. This policy
              applies to all information collected through the DeepFeels mobile
              app, our website (if applicable), and any associated services,
              offerings, or events (collectively referred to as the “Services”).
              We encourage you to read this privacy policy carefully so that you
              feel confident and informed about how your information is cared
              for.
            </CustomText>
          </View>
          <View>
            <CustomText
              fontFamily="semiBold"
              fontSize={18}
              style={{ marginVertical: verticalScale(10) }}
            >
              Information We Collect:
            </CustomText>
            <CustomText
              fontSize={14}
              color={PALETTE.lightTextColor}
              style={{ textAlign: "left" }}
            >
              We collect personal information that you choose to share with us.
              This includes your name, contact details, account credentials, and
              — if applicable — payment or social login information. Whether
              you’re creating a journal entry, checking in with your emotions,
              subscribing to a plan, or reaching out to us, we only collect
              what’s necessary to support your experience within DeepFeels.
            </CustomText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default PrivacyPolicy;
