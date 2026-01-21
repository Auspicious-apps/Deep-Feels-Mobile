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
      backgroundColor: PALETTE.mysticPurple,
    },
    safeArea: {
      flex: 1,
      padding: horizontalScale(15),
      gap: verticalScale(15),
    },
    logo: {
      width: horizontalScale(160),
      height: verticalScale(124),
      alignSelf: "center",
    },
    headerContainer: {
      marginVertical: verticalScale(10),
      gap: verticalScale(10),
    },
    formContainer: {
      gap: verticalScale(10),
      marginVertical: verticalScale(20),
    },
    inputFieldContainer: {
      gap: verticalScale(4),
    },
    inputWrapper: {
      backgroundColor: PALETTE.purple,
      width: "100%",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: horizontalScale(10),
      flexDirection: "row",
      minHeight: verticalScale(45),
      gap: horizontalScale(10),
      borderWidth: 0.5,
      borderColor: PALETTE.inputBorder,
    },
    textInput: {
      flex: 1,
      color: PALETTE.white,
    },
    passwordInput: {
      fontSize: responsiveFontSize(14),
    },
    optionsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rememberMeContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: horizontalScale(4),
    },
    checkboxChecked: {
      height: verticalScale(12),
      width: verticalScale(12),
      borderWidth: 1,
      borderColor: PALETTE.white,
      backgroundColor: PALETTE.midnightIndigo,
      borderRadius: 2,
    },
    checkboxUnchecked: {
      height: verticalScale(12),
      width: verticalScale(12),
      borderWidth: 1,
      borderColor: PALETTE.white,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 2,
    },
    orText: {
      textAlign: "center",
    },
    socialLoginContainer: {
      gap: verticalScale(10),
    },
  });
};
