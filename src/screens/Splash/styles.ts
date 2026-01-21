import { Dimensions, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { hp, wp } from "../../utils/Metrics";

export const useThemedStyles = () => {
  const { colors, isDarkMode } = useTheme();

  return StyleSheet.create({
    background: {
      height: Dimensions.get("screen").height,
      width: wp(100),
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      height: hp(33),
      width: hp(33),
      resizeMode: "contain",
    },
  });
};
