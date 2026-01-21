// toastConfig.jsx
import { JSX } from "react";
import { StyleSheet, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

import { CustomText } from "../components/CustomText";
import { PALETTE } from "./Colors";
import { horizontalScale, verticalScale, wp } from "./Metrics";

// Reusable component for both toast types
interface CustomToastComponentProps extends BaseToastProps {
  type: "success" | "error" | "info";
}

const CustomToastComponent = ({
  type,
  text1,
  text2,
}: CustomToastComponentProps) => {
  const borderColor =
    type === "success"
      ? PALETTE.softLavender
      : type === "info"
      ? PALETTE.celestialBlue
      : PALETTE.dangerRed;

  return (
    <View style={styles.container}>
      <View style={[styles.accentBar, { backgroundColor: borderColor }]} />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <CustomText color={PALETTE.black} fontSize={14} fontFamily="bold">
            {text1}
          </CustomText>
          <CustomText fontSize={13} fontFamily="light" color={PALETTE.black}>
            {text2}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

const toastConfig = {
  success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <CustomToastComponent
      type="success"
      text1={props.text1}
      text2={props.text2}
    />
  ),
  error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <CustomToastComponent
      type="error"
      text1={props.text1}
      text2={props.text2}
    />
  ),
  info: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <CustomToastComponent type="info" text1={props.text1} text2={props.text2} />
  ),
};

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    backgroundColor: PALETTE.white,
    flexDirection: "row",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  accentBar: {
    width: horizontalScale(6),
    height: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(15),
    gap: horizontalScale(10),
    flex: 1,
  },
  textContainer: {
    flexShrink: 1,
  },
});

export default toastConfig;
