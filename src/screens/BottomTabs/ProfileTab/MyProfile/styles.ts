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
      flexGrow: 1,
      paddingHorizontal: horizontalScale(15),
      paddingVertical: verticalScale(15),
      gap: verticalScale(20),
    },
    profileImage: {
      height: hp(16),
      width: hp(16),
      borderRadius: 100,
      resizeMode: "contain",
      borderWidth: 1,
      borderColor: PALETTE.white,
    },
    profileImageContainer: {
      position: "relative",
      alignSelf: "flex-start",
    },
    pencilIconContainer: {
      position: "absolute",
      right: 0,
      bottom: 10,
    },
    headerContainer: {
      flexDirection: "row",
      gap: horizontalScale(15),
      alignItems: "center",
    },
    inputFieldContainer: {
      gap: verticalScale(4),
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
    phoneInputContainer: {
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
    formContainer: {
      gap: verticalScale(10),
    },
    textInput: {
      flex: 1,
      color: PALETTE.white,
    },
    phoneInputWrapper: {
      width: "100%",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: horizontalScale(10),
      minHeight: verticalScale(45),
      zIndex: 1,
    },
    countryPickerButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffffff23",
      paddingHorizontal: horizontalScale(10),
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      height: verticalScale(45),
    },
  });
};
