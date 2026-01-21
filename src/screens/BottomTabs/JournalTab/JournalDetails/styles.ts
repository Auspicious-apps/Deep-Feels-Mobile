import { StyleSheet } from "react-native";
import { PALETTE } from "../../../../utils/Colors";
import { horizontalScale, verticalScale, wp } from "../../../../utils/Metrics";
import { useTheme } from "../../../../contexts/ThemeContext";

export const useThemedStyles = () => {
  const { colors, isDarkMode } = useTheme();
  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      backgroundColor: PALETTE.mysticPurple,
    },
    safeAreaContainer: {
      flex: 1,
    },
    scrollViewContent: {
      gap: verticalScale(30),
      paddingHorizontal: horizontalScale(15),
      paddingVertical: verticalScale(15),
    },
    headerContainer: {
      flexDirection: "row",
      gap: horizontalScale(15),
      alignItems: "flex-start",
    },
  });
};
