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
      gap: verticalScale(10),
    },

    inputFieldContainer: {
      gap: verticalScale(4),
      flex: 1,
    },
    textInputWrapper: {
      flex: 1,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: horizontalScale(10),
      flexDirection: "row",
      gap: horizontalScale(10),
      minHeight: verticalScale(45),
      borderWidth: 0.5,
      borderColor: PALETTE.inputBorder,
      backgroundColor: "#ffffff1f",
    },
    textInput: {
      flex: 1,
      color: PALETTE.white,
    },
  });
};
