import React, { FC, useState } from "react";
import { ImageBackground, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../assets/Icons";
import IMAGES from "../../assets/Images";
import CustomIcon from "../../components/CustomIcon";
import { CustomText } from "../../components/CustomText";
import SubscriptionSuccessModal from "../../components/Modals/SubscriptionSuccessModal";
import PrimaryButton from "../../components/PrimaryButton";
import { OnboardingScreenProps } from "../../typings/route";
import { PALETTE } from "../../utils/Colors";
import { storeLocalStorageData } from "../../utils/Helpers";
import { horizontalScale, verticalScale } from "../../utils/Metrics";
import STORAGE_KEYS from "../../utils/Storage";
import { useThemedStyles } from "./styles";

const IconRow = ({ icon, text }: { icon: any; text: string }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(10),
    }}
  >
    <LinearGradient
      colors={[PALETTE.waterGradient.start, PALETTE.waterGradient.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          borderRadius: 100,
          alignItems: "center",
          paddingHorizontal: horizontalScale(10),
          paddingVertical: verticalScale(10),
        }}
      >
        <CustomIcon Icon={icon} height={20} width={20} />
      </View>
    </LinearGradient>

    <CustomText
      fontFamily="semiBold"
      fontSize={13}
      style={{
        flexShrink: 1,
      }}
    >
      {text}
    </CustomText>
  </View>
);

const slides = [
  {
    title: "Our Mission",
    content: (
      <CustomText
        fontFamily="medium"
        fontSize={14}
        style={{ textAlign: "center" }}
      >
        Too many carry heavy feelings without support. Our mission is to change
        that—offering daily reflections and guidance to help you feel seen and
        understood.
      </CustomText>
    ),
  },
  {
    title: "How It Works",
    content: (
      <View style={{ gap: verticalScale(20) }}>
        <IconRow
          icon={ICONS.HomeIcon}
          text="Your daily guidance, reflections, and emotional check-ins — all in one gentle space."
        />
        <IconRow
          icon={ICONS.JournalIcon}
          text="A private space to write freely, respond to prompts, and keep your reflections safe."
        />
      </View>
    ),
  },
  {
    title: "How It Works",
    content: (
      <View style={{ gap: verticalScale(20) }}>
        <IconRow
          icon={ICONS.BondIcon}
          text="Understand how your energy flows with people & receive tips to nurture relationships."
        />
        <IconRow
          icon={ICONS.SupportIcon}
          text="Tell how you’re feeling and receive gentle guidance to help you process emotions."
        />
      </View>
    ),
  },
];

const OnBoarding: FC<OnboardingScreenProps> = ({ navigation, route }) => {
  const styles = useThemedStyles();
  const startAndSignsData = route.params.startAndSignsData;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModal, setIsModal] = useState(true);

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await storeLocalStorageData(STORAGE_KEYS.ONBOARDING_COMPLETED, true);

      navigation.replace("bottomTabStack", {
        screen: "homeTab",
      });
      // navigation.replace("starsAndSigns", {
      //   startAndSignsData,
      //   isFrom: "onboarding",
      // });
    }
  };

  const handleSkip = async () => {
    await storeLocalStorageData(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
    // navigation.replace("starsAndSigns", {
    //   startAndSignsData,
    //   isFrom: "onboarding",
    // });
    navigation.replace("bottomTabStack", {
      screen: "homeTab",
    });
  };

  return (
    <ImageBackground
      source={IMAGES.OnboardingBg}
      style={styles.backgroundImage}
      imageStyle={{
        backgroundColor: PALETTE.midnightIndigo,
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <CustomText
          onPress={handleSkip}
          style={{ textAlign: "right", alignSelf: "flex-end" }}
        >
          {currentSlide < 2 ? "Skip" : ""}
        </CustomText>

        <View
          style={{
            borderWidth: 0.5,
            borderColor: PALETTE.waterGradient.start,
            borderRadius: 10,
            position: "relative",
          }}
        >
          <View
            style={{
              padding: verticalScale(16),
              gap: verticalScale(20),
              zIndex: 100,
            }}
          >
            <CustomText
              color={PALETTE.lightSkin}
              fontFamily="belganAesthetic"
              fontSize={26}
              style={{ textAlign: "center" }}
            >
              {slides[currentSlide].title}
            </CustomText>

            {slides[currentSlide].content}

            <PrimaryButton
              title={
                currentSlide === slides.length - 1 ? "Get Started" : "Next"
              }
              onPress={handleNext}
              isArrowIcon={currentSlide === slides.length - 1}
            />
          </View>

          <View style={styles.overlay} />
        </View>
      </SafeAreaView>
      <SubscriptionSuccessModal
        isVisible={isModal}
        setIsVisible={setIsModal}
        onContinue={() => {}}
      />
    </ImageBackground>
  );
};

export default OnBoarding;
