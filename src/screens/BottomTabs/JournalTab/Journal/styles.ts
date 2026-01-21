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
    },
    headerContainer: {
      paddingHorizontal: horizontalScale(15),
      paddingVertical: verticalScale(20),
      gap: verticalScale(10),
    },

    tabContainer: {
      flexDirection: "row",
      borderRadius: verticalScale(20),
      overflow: "hidden",
      justifyContent: "space-between",
      backgroundColor: "#ffffff33",
      alignSelf: "center",
    },
    tab: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: verticalScale(8),
      paddingHorizontal: horizontalScale(12),
    },

    row: {
      justifyContent: "space-between",
      gap: 10,
    },
    card: {
      width: wp(45),
      borderRadius: 10,
      paddingHorizontal: verticalScale(16),
      paddingVertical: verticalScale(12),
      backgroundColor: "rgba(255, 255, 255, 0.08)", // glass effect
      gap: verticalScale(5),
    },
    selectedCard: {
      borderWidth: 2,
      borderColor: "#9A5BFF",
    },
    date: {
      textAlign: "right",
    },
  });
};
