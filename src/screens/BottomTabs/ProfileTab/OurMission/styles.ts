import { StyleSheet } from "react-native";
import { PALETTE } from "../../../../utils/Colors";
import { horizontalScale, verticalScale } from "../../../../utils/Metrics";

export const useThemedStyles = () => {
  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      backgroundColor: PALETTE.mysticPurple,
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingHorizontal: horizontalScale(15),
      paddingVertical: verticalScale(15),
      gap: verticalScale(20),
    },
    headerContainer: {
      flexDirection: "row",
      gap: horizontalScale(15),
      alignItems: "center",
    },
  });
};
