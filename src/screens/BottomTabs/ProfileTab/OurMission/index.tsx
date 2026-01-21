import React, { FC, useEffect } from "react";
import {
  ImageBackground,
  Platform,
  ScrollView,
  View
} from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import { OurMissionScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { verticalScale, wp } from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const OurMission: FC<OurMissionScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();

  // Animation for galaxy pulse
  const galaxyPulse = useSharedValue(1);
  const headerShimmer = useSharedValue(0);

  useEffect(() => {
    galaxyPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3000 }),
        withTiming(1, { duration: 3000 })
      ),
      -1,
      false
    );

    headerShimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500 }),
        withTiming(0, { duration: 2500 })
      ),
      -1,
      false
    );
  }, []);

  const galaxyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: galaxyPulse.value }],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + headerShimmer.value * 0.3,
  }));

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Galaxy animation behind content */}
        {/* <Animated.Image
          source={IMAGES.GalaxyIcon}
          style={[
            {
              height: hp(100),
              width: wp(180),
              top: "30%",
              resizeMode: "contain",
              position: "absolute",
              opacity: 0.5,
              alignSelf: "center",
            },
            galaxyAnimatedStyle,
          ]}
        /> */}

        {/* Main Content */}
        <Animated.View entering={FadeIn.duration(800)} style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: verticalScale(30),
              paddingHorizontal: wp(6),
              paddingBottom:
                Platform.OS === "ios"
                  ? insets.bottom + verticalScale(60)
                  : verticalScale(80),
            }}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <CustomIcon
                Icon={ICONS.GradientBackButtonIcon}
                height={verticalScale(34)}
                width={verticalScale(34)}
                onPress={() => navigation.goBack()}
              />
              <Animated.View style={headerAnimatedStyle}>
                <CustomText
                  fontFamily="belganAesthetic"
                  fontSize={30}
                  color={PALETTE.heading}
                >
                  Our Mission
                </CustomText>
              </Animated.View>
            </View>

            {/* Subheading */}
            <CustomText
              fontSize={20}
              color={PALETTE.lightSkin}
              fontFamily="belganAesthetic"
              style={{
                marginVertical: verticalScale(15),
                lineHeight: 28,
                textAlign: "left",
              }}
            >
              Nurture your spirit, calm your system.
            </CustomText>

            {/* Paragraph */}
            <CustomText
              fontSize={14}
              color={"#E1E6F2"}
              style={{
                textAlign: "left",
                lineHeight: 25,
                marginTop: verticalScale(10),
                zIndex: 11,
              }}
              fontFamily="medium"
            >
              At DeepFeels, we believe emotional wellness should be
              approachable, supportive, and deeply human. Too many carry heavy
              feelings without the tools to process them, and our mission is to
              change that. By combining psychology-based insights with AI's
              gentle guidance, we offer daily reflections, prompts, and insights
              that help you slow down, tune in, and connect with your inner
              world.
              {"\n\n"}
              We strive to make self-understanding accessible, so everyone can
              feel seen, supported, and inspired to grow—with compassion,
              clarity and calm.
            </CustomText>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default OurMission;
