import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { horizontalScale, verticalScale, wp } from "../utils/Metrics";
import { CustomText } from "./CustomText";
import PrimaryButton from "./PrimaryButton";
import { PALETTE } from "../utils/Colors";

export type PlanCardProps = {
  id: string;
  title: string;
  price: number;
  buttonTitle: string;
  features: string[];
  selected?: boolean;
  onSelect: (id: string, title: string) => void;
  handleCheckout: (id: string) => void;
  isDisabled?: boolean;
  activeOpacity?: number
};

const PlanCard: FC<PlanCardProps> = ({
  id,
  title,
  price,
  buttonTitle,
  features,
  onSelect,
  handleCheckout,
  selected,
  isDisabled = false,
  activeOpacity = 0.6
}) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(title, id)}
      style={[
        selected && {
          borderWidth: 1,
          borderColor: PALETTE.waterGradient.start,
        },
        styles.container,
      ]}
      activeOpacity={activeOpacity}
      disabled={isDisabled}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <CustomText>{title}</CustomText>
          <PrimaryButton
            title={buttonTitle}
            isFullWidth={false}
            isArrowIcon={false}
            style={styles.button}
            onPress={() => {
              handleCheckout(id);
            }}
            textSize={12}
          />
        </View>
        <View style={styles.features}>
          {features.map((feat) => (
            <CustomText
              key={feat}
              fontSize={14}
              fontFamily="medium"
              style={{ lineHeight: 22 }}
            >
              {feat}
            </CustomText>
          ))}
        </View>
      </View>
      <View
        style={[
          styles.overlay,
          {
            opacity: selected ? 0.15 : 0.05,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

export default PlanCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
  },
  content: {
    padding: verticalScale(12),
    gap: verticalScale(10),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(16),
  },
  features: {
    gap: verticalScale(4),
  },
  overlay: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 10,
  },
});
