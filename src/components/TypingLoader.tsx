import React, { useEffect } from "react";
import { View, Text, StyleSheet, TextStyle, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  interpolate,
} from "react-native-reanimated";
import { CustomText } from "./CustomText";
import { PALETTE } from "../utils/Colors";

interface DotProps {
  delay: number;
  size: number;
  color: string;
  speed: number;
}

const Dot: React.FC<DotProps> = ({ delay, size, color, speed }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: speed }), -1, true)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.2, 1]),
  }));

  return (
    <Animated.Text style={[{ fontSize: size, color }, animatedStyle]}>
      .
    </Animated.Text>
  );
};

interface TypingLoaderProps {
  text?: string;
  dotCount?: number;
  size?: number;
  color?: string;
  speed?: number;
  dotSpacing?: number;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

const TypingLoader: React.FC<TypingLoaderProps> = ({
  text = "Typing",
  dotCount = 3,
  size = 10,
  color = PALETTE.midnightIndigo,
  speed = 600,
  dotSpacing = 2,
  textStyle,
  containerStyle,
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <CustomText
        fontFamily="regular"
        style={[styles.text, { fontSize: size, color }, textStyle]}
      >
        {text}
      </CustomText>
      <View style={[styles.dotsContainer, { marginLeft: dotSpacing }]}>
        {Array.from({ length: dotCount }).map((_, i) => (
          <Dot
            key={i}
            delay={i * (speed / 2)}
            size={size}
            color={color}
            speed={speed}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "",
  },
  dotsContainer: {
    flexDirection: "row",
  },
});

export default TypingLoader;
