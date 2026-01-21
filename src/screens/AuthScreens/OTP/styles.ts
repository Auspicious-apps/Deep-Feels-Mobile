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
      padding: horizontalScale(15),
      justifyContent: "flex-start",
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
      gap: verticalScale(10),
      marginTop: verticalScale(10),
    },
    inputFieldContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      gap: horizontalScale(15),
      marginBottom: verticalScale(10),
    },
    inputWrapper: {
      flex: 1,
      borderRadius: 40,
      paddingHorizontal: horizontalScale(15),
      backgroundColor: "#482E65",
      height: verticalScale(46),
      width: verticalScale(46),
      fontSize: responsiveFontSize(14),
      color: PALETTE.white,
      textAlign: "center",
    },

    loginPromptText: {
      textAlign: "center",
    },
  });
};
