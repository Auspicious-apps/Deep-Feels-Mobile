import { StyleSheet } from "react-native";
import {
  horizontalScale,
  responsiveFontSize,
  verticalScale,
} from "../../../utils/Metrics";
import { PALETTE } from "../../../utils/Colors";
import { useTheme } from "../../../contexts/ThemeContext";

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
      gap: verticalScale(15),
    },
    logo: {
      width: horizontalScale(160),
      height: verticalScale(100),
      alignSelf: "center",
    },
    headerContainer: {
      marginVertical: verticalScale(10),
      gap: verticalScale(10),
    },
    formContainer: {
      flex: 1,
      gap: verticalScale(10),
    },
    inputFieldContainer: {
      gap: verticalScale(8),
    },
    inputWrapper: {
      width: "100%",
      position: "relative",
    },
    inputContainer: {
      paddingHorizontal: horizontalScale(10),
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      borderRadius: 20,
      minHeight: verticalScale(45),
      gap: horizontalScale(5),
      zIndex: 1,
    },
    overlay: {
      opacity: 0.1,
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      position: "absolute",
      borderRadius: 20,
    },
    timeOfBirthHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(3),
    },

    textInput: {
      flex: 1,
      color: PALETTE.white,
    },
  });
};
