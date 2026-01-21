import React, { FC } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  Vibration,
  View,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PALETTE } from "../utils/Colors";
import { horizontalScale, verticalScale, wp } from "../utils/Metrics";
import { CustomText } from "./CustomText";
import CustomIcon from "./CustomIcon";
import ICONS from "../assets/Icons";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  textColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
  textSize?: number;
  isFullWidth?: boolean;
  bgColor?: string[];
  gradientStyle?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
  isArrowIcon?: boolean;
  leftIcon?: any;
};

const PrimaryButton: FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  textColor = PALETTE.white,
  style,
  textSize = 14,
  isFullWidth = true,
  bgColor = [PALETTE.waterGradient.start, PALETTE.waterGradient.end],
  gradientStyle,
  textStyle,
  isLoading = false,
  isArrowIcon = true,
  leftIcon,
}) => {
  return (
    <LinearGradient
      colors={bgColor}
      style={[
        {
          borderRadius: verticalScale(20),
          opacity: disabled ? 0.5 : 1,
          alignItems: "center",
        },
        gradientStyle,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.7}
        style={[isFullWidth && styles.button, style]}
        onPress={() => {
          if (Platform.OS === "android") {
            Vibration.vibrate(2);
          }
          onPress();
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={PALETTE.white} />
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            {leftIcon && <CustomIcon Icon={leftIcon} height={16} width={16} />}
            <CustomText
              fontFamily="semiBold"
              fontSize={textSize}
              color={textColor}
              style={textStyle}
            >
              {title}
            </CustomText>
            {isArrowIcon && (
              <CustomIcon
                Icon={ICONS.ButtonArrowRightIcon}
                height={18}
                width={18}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(20),
    alignItems: "center",
    justifyContent: "center",
    width: wp(90),
    alignSelf: "center",
  },
});

export default PrimaryButton;
