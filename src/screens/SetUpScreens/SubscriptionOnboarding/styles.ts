import { StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { horizontalScale, verticalScale } from "../../../utils/Metrics";

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
      gap: verticalScale(10),
    },
    plansContainer: {
      flex: 1,
      gap: verticalScale(20),
      paddingHorizontal: verticalScale(10),
    },
    detailCard: {
      gap: horizontalScale(5),
      width: "100%",
      paddingVertical: verticalScale(8),
    },
    policyLinksContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: horizontalScale(10),
    },
    policyLink: {
      textDecorationLine: "underline",
      color: colors.bgsoft,
    },
    policySeparator: {
      fontSize: 12,
      color: colors.backgroundPrimary,
    },
  });
};
