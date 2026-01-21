import { StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { horizontalScale, verticalScale } from "../../utils/Metrics";

export const useThemedStyles = () => {
  const { colors, isDarkMode } = useTheme();
  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
      paddingHorizontal: horizontalScale(15),
      paddingTop: verticalScale(25),
      paddingBottom: verticalScale(15),
      justifyContent: "space-between",
    },

    overlay: {
      opacity: 0.8,
      width: "100%",
      height: "100%",
      backgroundColor: "#2C115C",
      position: "absolute",
      borderRadius: 10,
    },
  });
};
