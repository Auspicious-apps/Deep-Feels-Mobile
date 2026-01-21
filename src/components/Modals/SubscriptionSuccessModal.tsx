import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ImageBackground, Modal, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import IMAGES from "../../assets/Images";
import { PALETTE } from "../../utils/Colors";
import { horizontalScale, hp, verticalScale, wp } from "../../utils/Metrics";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";

type AuthSuccessModalProps = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onContinue: () => void;
};

const SubscriptionSuccessModal: FC<AuthSuccessModalProps> = ({
  isVisible,
  setIsVisible,
  onContinue,
}) => {
  const [showReflection, setShowReflection] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Animated values for mission statement image
  const missionOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      // Reset states when modal opens
      setShowReflection(false);
      setShowButton(false);

      // Step 1: Fade in mission statement image
      missionOpacity.value = withTiming(1, { duration: 1000 });

      // Step 2: After 2 seconds, show reflection text
      const reflectionTimer = setTimeout(() => {
        setShowReflection(true);
      }, 2500);

      // Step 3: After reflection fades in (2s + 1s fade), show button
      const buttonTimer = setTimeout(() => {
        setShowButton(true);
      }, 4500);

      return () => {
        clearTimeout(reflectionTimer);
        clearTimeout(buttonTimer);
      };
    } else {
      // Reset opacity when modal closes
      missionOpacity.value = 0;
    }
  }, [isVisible]);

  const missionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: missionOpacity.value,
  }));

  const handleBegin = () => {
    setIsVisible(false);
    onContinue();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={handleBegin}
      animationType="fade"
    >
      <View style={styles.container}>
        <ImageBackground
          style={styles.imageStyle}
          imageStyle={{
            borderRadius: 10,
          }}
          source={IMAGES.MissionStatement}
          resizeMode="cover"
        >
          <View style={styles.contentContainer}>
            {/* Mission Statement Text - Fades in first */}
            <Animated.View
              style={[styles.missionTextContainer, missionAnimatedStyle]}
            >
              <CustomText
                fontFamily="belganAesthetic"
                fontSize={18}
                color={PALETTE.lightSkin}
                style={styles.missionText}
              >
                DeepFeels was born from loss, love, and a longing to heal. A
                legacy of emotional renewal-where inner wisdom meets the art of
                balance, built with heart, and guided by Spirit.
              </CustomText>
              {/* <CustomText
                fontSize={16}
                color={PALETTE.white}
                style={styles.missionSubtext}
              >
                A legacy of emotional renewal and nervous system harmony, where
                cosmic design meets the science of calm — built with heart, and
                guided by Spirit.
              </CustomText> */}
            </Animated.View>

            {/* Reflection Message - Fades in after 2 seconds */}
            {showReflection && (
              <Animated.View
                entering={FadeIn.duration(1500)}
                style={styles.reflectionContainer}
              >
                <CustomText
                  fontFamily="belganAesthetic"
                  fontSize={30}
                  color={PALETTE.sacredGold}
                  style={styles.reflectionTitle}
                >
                  DeepFeels
                </CustomText>
                <CustomText
                  fontSize={16}
                  color={PALETTE.white}
                  style={styles.reflectionSubtext}
                >
                  Daily guidance for your emotional wellness.
                </CustomText>
              </Animated.View>
            )}

            {/* Begin Button - Appears after reflection */}
            {showButton && (
              <Animated.View
                entering={FadeInDown.duration(800)}
                style={styles.buttonContainer}
              >
                <PrimaryButton
                  title="Begin"
                  onPress={handleBegin}
                  style={styles.beginButton}
                  textColor={PALETTE.white}
                  isArrowIcon={false}
                  textSize={14}
                  isFullWidth={false}
                />
              </Animated.View>
            )}
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
};

export default SubscriptionSuccessModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    height: hp(70),
    width: wp(90),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(30),
    gap: verticalScale(40),
  },
  missionTextContainer: {
    gap: verticalScale(20),
    alignItems: "center",
    paddingHorizontal: horizontalScale(10),
  },
  missionText: {
    textAlign: "center",
  },
  missionSubtext: {
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.9,
  },
  reflectionContainer: {
    alignItems: "center",
    paddingHorizontal: horizontalScale(10),
  },
  reflectionTitle: {
    textAlign: "center",
  },
  reflectionSubtext: {
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    width: "60%",
    alignSelf: "center",
  },
  beginButton: {
    backgroundColor: "transparent",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(30),
  },
});
