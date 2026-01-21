import { StyleSheet } from "react-native";
import { PALETTE } from "../../../../utils/Colors";
import { horizontalScale, verticalScale, wp } from "../../../../utils/Metrics";
import { useTheme } from "../../../../contexts/ThemeContext";

export const useThemedStyles = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      backgroundColor: PALETTE.mysticPurple,
    },
    safeAreaContainer: {
      flex: 1,
    },
    flexContainer: {
      flex: 1,
    },
    keyboardAwareContent: {
      flexGrow: 1,
      position: "relative",
    },
    scrollViewContent: {
      gap: verticalScale(30),
    },
    headerContainer: {
      paddingHorizontal: horizontalScale(15),
      paddingVertical: verticalScale(20),
      flexDirection: "row",
      gap: horizontalScale(10),
      alignItems: "center",
    },

    tabSelectorContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: wp(90),
      alignSelf: "center",
      borderRadius: verticalScale(10),
      padding: verticalScale(5),
      gap: horizontalScale(5),
    },
    tabButton: {
      flex: 1,
      alignItems: "center",
      paddingVertical: verticalScale(10),
      borderRadius: verticalScale(6),
      borderBottomColor: PALETTE.LightGrey,
      borderBottomWidth: 1,
      opacity: 0.7,
    },
    activeTabButton: {
      opacity: 1,
    },

    // Avatars row
    avatarsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    avatarWrapper: {
      alignItems: "center",
      width: wp(30),
      justifyContent: "center",
      gap: verticalScale(5),
    },
    avatarBorder: {
      borderWidth: 1,
      borderColor: PALETTE.white,
      borderRadius: 100,
    },

    // Button style
    compatibilityLabelButton: {
      width: wp(85),
      alignSelf: "center",
    },

    // Carousel styles
    carouselContainer: {
      paddingHorizontal: horizontalScale(12),
      gap: horizontalScale(12),
    },
    carouselCard: {
      overflow: "hidden",
      backgroundColor: "#ffffff1f",
      padding: horizontalScale(12),
      gap: verticalScale(5),
      borderRadius: 10,
    },

    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: verticalScale(10),
      gap: horizontalScale(6),
    },
    dot: {
      width: horizontalScale(8),
      height: horizontalScale(8),
      borderRadius: 4,
    },
    activeDot: {
      backgroundColor: PALETTE.mysticPurple,
      opacity: 1,
      width: horizontalScale(10),
      height: horizontalScale(10),
    },

    container: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: horizontalScale(10),
    },
    modalContent: {
      width: "100%",
      backgroundColor: PALETTE.mysticPurple,
      gap: verticalScale(15),
      borderRadius: 28,
      overflow: "hidden",
      padding: verticalScale(25),
    },
    logo: {
      width: horizontalScale(160),
      height: verticalScale(100),
      alignSelf: "center",
    },

    dailyGuidanceContainer: {
      width: wp(90),
      alignSelf: "center",
      gap: verticalScale(15),
      paddingBottom: verticalScale(20),
    },
    reportTitle: {
      color: PALETTE.gold, // Or another accent color
      textAlign: "center",
      marginBottom: verticalScale(10),
      paddingVertical: verticalScale(10),
      backgroundColor: "#ffffff0f",
      borderRadius: 8,
    },
    reportListContent: {
      // Add padding if needed for the list itself
    },
    reportItemContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: verticalScale(12),
      backgroundColor: "#ffffff1a", // Slightly opaque background for each item
      borderRadius: verticalScale(10),
      padding: verticalScale(12),
      borderLeftWidth: 3, // Accent border for style
      borderLeftColor: PALETTE.softLavender,
    },
    bulletPoint: {
      width: verticalScale(20),
      height: verticalScale(20),
      borderRadius: verticalScale(10),
      backgroundColor: PALETTE.celestialBlue, // Unique color for bullet
      alignItems: "center",
      justifyContent: "center",
      marginRight: horizontalScale(10),
      flexShrink: 0,
      marginTop: verticalScale(2), // Align number visually
    },
    reportText: {
      flex: 1,
      lineHeight: 18,
      color: PALETTE.white,
      // Note: fontSize is 13 now for a slightly richer look
    },
    emptyTabContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: verticalScale(40),
      paddingHorizontal: horizontalScale(20),
      minHeight: verticalScale(200),
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: verticalScale(60),
      minHeight: verticalScale(150),
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
