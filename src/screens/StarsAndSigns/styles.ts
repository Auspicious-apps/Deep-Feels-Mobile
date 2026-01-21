import { StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { horizontalScale, verticalScale, wp } from "../../utils/Metrics";
import { PALETTE } from "../../utils/Colors";

export const useThemedStyles = () => {
  const { colors, isDarkMode } = useTheme();
  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
      paddingHorizontal: horizontalScale(15),
      paddingTop: verticalScale(15),
      justifyContent: "space-between",
      gap: verticalScale(15),
    },
    scrollViewContent: {
      gap: verticalScale(20),
      paddingBottom: verticalScale(10),
    },
    headerContainer: {},
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(10),
    },
    section: {
      gap: verticalScale(10),
    },
    keywordContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: horizontalScale(10),
    },
    keyword: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 15,
      paddingHorizontal: horizontalScale(10),
      paddingVertical: verticalScale(5),
      fontSize: 12,
    },
    expandableHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: verticalScale(10),
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.2)",
    },
    expandableContent: {
      marginTop: verticalScale(10),
      gap: verticalScale(10),
    },
    advancedToggleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginVertical: verticalScale(10),
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

    // New styles for the expandable card items
    expandedCard: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: 10,
      padding: horizontalScale(15),
      gap: verticalScale(8),
      borderLeftWidth: 3,
      borderLeftColor: PALETTE.lightSkin,
    },
    expandedCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    separator: {
      height: 1,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      marginVertical: verticalScale(5),
    },
    // New style for the reflection card
    reflectionCard: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 12,
      padding: horizontalScale(15),
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      gap: verticalScale(10),
    },
    reflectionCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    predictionCarouselContainer: {},
    predictionCard: {
      width: wp(85),
      marginRight: verticalScale(15),
      padding: verticalScale(15),
      borderRadius: 10,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    predictionCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: verticalScale(10),
    },

    predictionDotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    predictionDot: {
      height: 8,
      width: 8,
      borderRadius: 4,
      marginHorizontal: horizontalScale(4),
      backgroundColor: PALETTE.white + "80",
    },
    activePredictionDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: PALETTE.lightSkin,
    },
  });
};
