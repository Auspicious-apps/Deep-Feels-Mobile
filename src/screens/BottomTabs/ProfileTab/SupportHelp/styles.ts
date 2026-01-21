import { StyleSheet } from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { horizontalScale, hp, verticalScale } from "../../../../utils/Metrics";
import { PALETTE } from "../../../../utils/Colors";

export const useThemedStyles = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      backgroundColor: PALETTE.mysticPurple,
    },
    scrollViewContent: {
      flex: 1,
      paddingHorizontal: horizontalScale(15),
      gap: verticalScale(20),
    },
    headerContainer: {
      flexDirection: "row",
      gap: horizontalScale(15),
      alignItems: "center",
    },
    plansContainer: {
      flex: 1,
      gap: verticalScale(20),
    },
    inputFieldContainer: {
      gap: verticalScale(10),
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
    formContainer: {
      flex: 1,
      gap: verticalScale(10),
    },
    textInput: {
      flex: 1,
      color: PALETTE.white,
    },
  });
};
