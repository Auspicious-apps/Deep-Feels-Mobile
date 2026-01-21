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
import { TermsOfServiceScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { verticalScale } from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const TermsOfService: FC<TermsOfServiceScreenProps> = ({ navigation }) => {
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
              Terms of Service
            </CustomText>
          </View>

          <View>
            <CustomText
              fontFamily="semiBold"
              fontSize={18}
              style={{ marginVertical: verticalScale(10) }}
            >
              Legal Disclaimer
            </CustomText>
            <CustomText
              fontSize={14}
              color={PALETTE.lightTextColor}
              style={{ textAlign: "left" }}
            >
              DeepFeels takes your emotional wellness and privacy seriously. The
              information and guidance provided on this platform are intended
              for general emotional support and personal development. It is not
              a substitute for professional therapy or medical advice. We
              recommend seeking the support of a qualified mental health
              professional for personalized care.
            </CustomText>
          </View>
          <View>
            <CustomText
              fontFamily="semiBold"
              fontSize={18}
              style={{ marginVertical: verticalScale(10) }}
            >
              Emotional Wellness Terms & Conditions
            </CustomText>
            <CustomText
              fontSize={14}
              color={PALETTE.lightTextColor}
              style={{ textAlign: "left" }}
            >
              Our Emotional Wellness Terms & Conditions are designed to
              establish the guidelines for using DeepFeels to enhance your
              emotional well-being. By accessing and using our app, you agree to
              abide by these terms which outline the relationship between you as
              a user and DeepFeels as the provider of emotional support and
              guidance.
            </CustomText>
          </View>
          <View>
            <CustomText
              fontFamily="semiBold"
              fontSize={18}
              style={{ marginVertical: verticalScale(10) }}
            >
              Guidelines for Emotional Wellness
            </CustomText>
            <CustomText
              fontSize={14}
              color={PALETTE.lightTextColor}
              style={{ textAlign: "left" }}
            >
              Our Emotional Wellness Terms & Conditions cover important aspects
              such as user eligibility, privacy protection, intellectual
              property rights, account suspension, and more. To gain a deeper
              understanding of these guidelines, explore our comprehensive guide
              on 'Navigating Emotional Wellness Terms & Conditions'.
            </CustomText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default TermsOfService;
