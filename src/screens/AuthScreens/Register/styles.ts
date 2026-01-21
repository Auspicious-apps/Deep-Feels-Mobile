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
    },
    logo: {
      width: horizontalScale(160),
      height: verticalScale(100),
      alignSelf: "center",
    },
    headerContainer: {
      gap: verticalScale(5),
    },
    formContainer: {
      gap: verticalScale(10),
      marginVertical: verticalScale(10),
    },
    inputFieldContainer: {
      gap: verticalScale(4),
    },
    textInputWrapper: {
      width: "100%",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: horizontalScale(10),
      flexDirection: "row",
      gap: horizontalScale(10),
      minHeight: verticalScale(45),
      borderWidth: 0.5,
      borderColor: PALETTE.inputBorder,
      backgroundColor: PALETTE.purple,
    },
    textInput: {
      flex: 1,
      color: PALETTE.white,
    },
    passwordTextInput: {
      fontSize: responsiveFontSize(14),
    },
    phoneInputWrapper: {
      width: "100%",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: horizontalScale(10),
      paddingRight: horizontalScale(10),
      minHeight: verticalScale(45),
      backgroundColor: PALETTE.purple,
    },
    countryPickerButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#594274",
      paddingHorizontal: horizontalScale(10),
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      height: "100%",
    },
    loginPromptText: {
      textAlign: "center",
    },
  });
};
