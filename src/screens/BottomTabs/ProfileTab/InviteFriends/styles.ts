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
  });
};
