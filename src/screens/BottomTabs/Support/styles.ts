import { Dimensions, Platform, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { PALETTE } from "../../../utils/Colors";
import { horizontalScale, hp, verticalScale } from "../../../utils/Metrics";

export const useThemedStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: PALETTE.mysticPurple,
    },
    backgroundImage: {
      backgroundColor: PALETTE.mysticPurple,
      height: Dimensions.get("screen").height,
      paddingBottom: verticalScale(10),
    },
    safeAreaContainer: {},
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: horizontalScale(15),
      paddingVertical: verticalScale(20),
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: "flex-end",
      paddingVertical: verticalScale(15),
      gap: verticalScale(10),
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: PALETTE.MediumGrey,
      borderWidth: 1,
      borderRadius: 50,
      paddingHorizontal: horizontalScale(18),
      paddingVertical: verticalScale(6),
    },
    textInput: {
      flex: 1,
      color: PALETTE.white,
      paddingVertical: verticalScale(10),
    },
    sendButton: {
      marginLeft: horizontalScale(10),
      backgroundColor: PALETTE.blue,
      borderRadius: 20,
      paddingVertical: verticalScale(10),
      paddingHorizontal: horizontalScale(15),
      justifyContent: "center",
      alignItems: "center",
    },
    messageBubble: {
      borderRadius: 8,
      maxWidth: "80%",
      marginVertical: verticalScale(2), // Add some vertical margin for better spacing
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: PALETTE.midnightIndigo,
      borderRadius: 8,
    },
    supportMessageContainer: {
      alignSelf: "flex-start",
    },
    supportMessage: {
      borderRadius: 6,
    },
  });
};
