import { StyleSheet } from "react-native";
import { PALETTE } from "../../../../utils/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../../../utils/Metrics";
import { useTheme } from "../../../../contexts/ThemeContext";

export const useThemedStyles = () => {
  const { colors, isDarkMode } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: PALETTE.mysticPurple,
      paddingVertical: verticalScale(10),
    },
    animatedBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      width: wp(100),
      height: hp(100),
    },
    safeArea: {
      flex: 1,
      paddingHorizontal: horizontalScale(15),
    },
    scrollViewContent: {
      gap: verticalScale(30),
    },
    profileImage: {
      height: hp(15),
      width: hp(15),
      borderRadius: 100,
      resizeMode: "contain",
      alignSelf: "center",
      borderWidth: 1,
      borderColor: PALETTE.white,
    },
    profileName: {
      textAlign: "center",
    },
    profileDescription: {
      textAlign: "center",
      width: wp(80),
      alignSelf: "center",
    },
    zodiacSignsContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    zodiacSignContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(5),
      borderWidth: 1,
      borderColor: "#9486B1",
      borderRadius: 20,
      paddingVertical: verticalScale(6),
      paddingHorizontal: horizontalScale(12),
      position: "relative",
    },
    overlay: {
      width: "100%",
      height: "100%",
      position: "absolute",
      backgroundColor: "white",
      borderRadius: 20,
    },

    listContainer: {
      gap: verticalScale(3),
      width: wp(90),
      alignSelf: "center",
    },
    profileCardContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(14),
      borderRadius: 5,
      paddingVertical: verticalScale(14),
      paddingHorizontal: horizontalScale(10),
      position: "relative",
    },
    prfileCardOverlay: {
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      position: "absolute",
      borderRadius: 5,
      opacity: 0.1,
    },
  });
};
