import React, { FC, useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useChangingText } from "../hooks/useChanginTextHook";
import { PALETTE } from "../utils/Colors";
import { verticalScale, wp } from "../utils/Metrics";
import { CustomText } from "./CustomText";

const loadingMessages = [
  // Calming + Grounding (replaces cosmic/stars)
  "Attuning to your emotional rhythm...",
  "Breathing into the present moment...",
  "Synchronizing your nervous system...",
  "Your body is finding calm...",

  // Grounding + Healing
  "Regulating your inner state...",
  "Gathering calm from within...",
  "Your energy is finding balance...",
  "Harmonizing body, mind, and breath...",

  // Wellness + Personal Growth
  "Centering your awareness...",
  "Preparing your personalized insights...",
  "Listening to your inner voice...",
  "Building your emotional profile...",
  "Processing your wellness data...",
  "Generating your reflection prompts...",
];

const CustomLoadingView: FC<{ insets: any }> = ({ insets }) => {
  const CYCLE_DURATION = 4000;

  const changingLoadingText = useChangingText(loadingMessages, CYCLE_DURATION);

  // Animated values for the central element
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  // Animated value for text opacity
  const textOpacity = useRef(new Animated.Value(1)).current;

  // 1000ms (1s) for fade in/out
  const FADE_DURATION = 1000;

  useEffect(() => {
    // Continuous rotation and pulsing effects (NO CHANGE)
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [spinValue, pulseValue]);

  // ⭐️ FADE TRANSITION LOGIC (SYNCHRONIZED) ⭐️
  useEffect(() => {
    let animationTimeout: NodeJS.Timeout;

    const startFadeCycle = () => {
      // 1. Fade OUT (1s) to 0.0
      Animated.timing(textOpacity, {
        toValue: 0.0,
        duration: FADE_DURATION, // 1000ms fade-out
        useNativeDriver: true,
      }).start(() => {
        // 2. Fade IN (1s) back to 1.0
        Animated.timing(textOpacity, {
          toValue: 1.0,
          duration: FADE_DURATION, // 1000ms fade-in
          useNativeDriver: true,
        }).start();
      });

      // 3. Schedule the next fade cycle
      // The fade cycle (2000ms total) should happen immediately before the text changes (4000ms).
      // We start the fade-out at CYCLE_DURATION - FADE_DURATION = 4000ms - 1000ms = 3000ms
      // We trigger the entire 2-second fade cycle every 4 seconds.
      animationTimeout = setTimeout(startFadeCycle, CYCLE_DURATION);
    };

    // The text changes AT the 4000ms mark, so we must start the fade-out at 3000ms.
    // We initiate the first fade cycle after 3000ms.
    const initialDelay = CYCLE_DURATION - FADE_DURATION;
    animationTimeout = setTimeout(startFadeCycle, initialDelay);

    // Cleanup function to stop the timeout when the component unmounts
    return () => clearTimeout(animationTimeout);
  }, []); // Run only once on mount

  // Interpolate for the central breathing circle's rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Interpolate for the orbiting dot's faster, opposite rotation
  const orbitSpin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-1080deg"],
  });

  const iconSize = verticalScale(60);
  const orbitingDotSize = verticalScale(10);
  const orbitRadius = verticalScale(45);

  // Inner breathing circle sizes for wellness animation
  const innerCircleSize = verticalScale(30);
  const middleCircleSize = verticalScale(20);

  // Combine the fixed base opacity (0.7) with the animated opacity (0.0 to 1.0)
  const combinedOpacity = textOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.7],
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Platform.select({
            android: verticalScale(100),
            ios: (insets?.bottom || 0) + verticalScale(80),
          }),
        },
      ]}
    >
      <Animated.View
        style={{
          transform: [{ rotate: spin }, { scale: pulseValue }],
          width: iconSize + 20,
          height: iconSize + 20,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: verticalScale(20),
        }}
      >
        {/* Wellness breathing circle animation */}
        <LinearGradient
          colors={["#4400ff97", "#4400ff57"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.wellnessIconContainer,
            {
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize / 2,
              shadowColor: PALETTE.sacredGold,
            },
          ]}
        >
          {/* Outer breathing ring */}
          <Animated.View
            style={{
              position: "absolute",
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: innerCircleSize / 2,
              borderWidth: 2,
              borderColor: PALETTE.lightSkin + "60",
              opacity: pulseValue.interpolate({
                inputRange: [1, 1.15],
                outputRange: [0.6, 0.3],
              }),
            }}
          />

          {/* Middle breathing ring */}
          <Animated.View
            style={{
              position: "absolute",
              width: middleCircleSize,
              height: middleCircleSize,
              borderRadius: middleCircleSize / 2,
              borderWidth: 2,
              borderColor: PALETTE.lightSkin + "80",
              opacity: pulseValue.interpolate({
                inputRange: [1, 1.15],
                outputRange: [0.8, 0.5],
              }),
            }}
          />

          {/* Central glowing orb */}
          <View
            style={{
              width: verticalScale(12),
              height: verticalScale(12),
              borderRadius: verticalScale(6),
              backgroundColor: PALETTE.sacredGold,
              shadowColor: PALETTE.sacredGold,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 8,
              elevation: 10,
            }}
          />
        </LinearGradient>

        {/* Orbiting wellness dot */}
        <Animated.View
          style={{
            position: "absolute",
            width: orbitingDotSize,
            height: orbitingDotSize,
            borderRadius: orbitingDotSize / 2,
            backgroundColor: PALETTE.lightTextColor,
            top: -orbitingDotSize / 2,
            left: "50%",
            marginLeft: -orbitingDotSize / 2,
            transform: [
              { translateY: orbitRadius },
              { translateX: -orbitingDotSize / 2 },
              { rotate: orbitSpin },
              { translateX: orbitRadius },
            ],
          }}
        />
      </Animated.View>

      <Animated.View style={{ opacity: combinedOpacity }}>
        <CustomText
          fontSize={14}
          fontFamily="semiBold"
          color={PALETTE.lightSkin}
          style={styles.loadingTextBase}
        >
          {changingLoadingText}
        </CustomText>
      </Animated.View>
    </View>
  );
};

// ... (styles remain the same) ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wellnessIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  loadingTextBase: {
    textAlign: "center",
    width: wp(80),
    lineHeight: verticalScale(25),
  },
  loadingText: {
    textAlign: "center",
    width: wp(80),
    lineHeight: verticalScale(25),
    opacity: 0.7,
  },
});

export default CustomLoadingView;
