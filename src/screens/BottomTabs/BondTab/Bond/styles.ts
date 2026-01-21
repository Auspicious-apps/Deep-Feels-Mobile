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

    circleWrapper: {
      position: "absolute",
      top: "40%",
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 2,
      borderColor: "white",
    },
    addCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 2,
      borderColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    addText: {
      fontSize: 30,
      color: "white",
    },
    label: {
      marginTop: 6,
      textAlign: "center",
      color: "white",
    },
    dropdownWrapper: {
      position: "absolute",
      top: "48%",
    },
    dropdownButton: {
      backgroundColor: "white",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    dropdownText: {
      color: "#3b0066",
      fontWeight: "600",
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
    inputWrapper: {
      width: "100%",
      position: "relative",
    },
    inputContainer: {
      paddingHorizontal: horizontalScale(15),
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 20,
      minHeight: verticalScale(45),
      gap: horizontalScale(5),
      zIndex: 1,
      borderWidth: 0.5,
      borderColor: PALETTE.inputBorder,
    },
    overlay: {
      opacity: 0.1,
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      position: "absolute",
      borderRadius: 20,
    },
    divider: {
      height: 1,
      width: "100%",
      opacity: 0.5,
    },
    optionText: {
      color: PALETTE.white,
    },
    selectedOption: {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      borderRadius: 6,
    },
    option: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: verticalScale(12),
      paddingHorizontal: horizontalScale(16),
      width:'100%'
    },
  });
};
