import { StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { PALETTE } from "../../../utils/Colors";
import { horizontalScale, verticalScale, wp } from "../../../utils/Metrics";

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
      gap: verticalScale(20),
    },
    headerContainer: {
      paddingHorizontal: horizontalScale(15),
      paddingVertical: verticalScale(20),
    },
    prfileCardOverlay: {
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      position: "absolute",
      opacity: 0.1,
    },

    tabContainer: {
      flexDirection: "row",
      borderRadius: verticalScale(20),
      overflow: "hidden",
      justifyContent: "center",
      backgroundColor: "#ffffff33",
      alignItems: "center",
      alignSelf: "center",
    },
    tab: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: verticalScale(8),
      paddingHorizontal: horizontalScale(12),
      borderRadius: verticalScale(20),
    },

    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
    },

    section: {
      width: wp(100) - verticalScale(30),
      gap: verticalScale(10),
      alignSelf: "center",
    },
    enhancedCard: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 12,
      padding: horizontalScale(15),
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      gap: verticalScale(15),
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: verticalScale(10),
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    signGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    signItem: {
      alignItems: "center",
      gap: verticalScale(5),
    },
  });
};
