import React, { FC } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import ICONS from "../../assets/Icons";
import { PALETTE } from "../../utils/Colors";
import { horizontalScale, verticalScale } from "../../utils/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";

type FeatureLockedModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onNavigateToProfile: () => void;
  featureName: string;
};

const FeatureLockedModal: FC<FeatureLockedModalProps> = ({
  isVisible,
  onClose,
  onNavigateToProfile,
  featureName,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={1}
        style={styles.container}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(e) => e.stopPropagation()}
        >
          <View style={styles.lockIconContainer}>
            <CustomIcon
              Icon={ICONS.GirlWithBowIcon}
              height={verticalScale(100)}
              width={verticalScale(90)}
            />
          </View>

          <CustomText
            color={PALETTE.lightSkin}
            fontFamily="belganAesthetic"
            fontSize={24}
            style={{
              textAlign: "center",
            }}
          >
            Enhance Your {featureName}
          </CustomText>

          <View
            style={{
              gap: verticalScale(12),
              marginVertical: verticalScale(15),
            }}
          >
            <CustomText
              style={{
                textAlign: "center",
              }}
              fontSize={13}
              fontFamily="medium"
            >
              To personalize your{" "}
              <CustomText fontFamily="bold" color={PALETTE.sacredGold}>
                {featureName}
              </CustomText>{" "}
              experience and get deeper insights, we need a few more details.
            </CustomText>

            <View style={styles.requirementContainer}>
              <CustomText
                fontSize={12}
                fontFamily="bold"
                color={PALETTE.sacredGold}
              >
                Complete Your Profile
              </CustomText>
              <View style={{ gap: verticalScale(10) }}>
                <CustomText style={{}} fontSize={13}>
                  •{" "}
                  <CustomText fontSize={13} fontFamily="bold">
                    Date of Birth
                  </CustomText>{" "}
                  - Maps your emotional patterns and nervous system responses
                </CustomText>
                <CustomText fontSize={13}>
                  •{" "}
                  <CustomText fontFamily="bold" fontSize={13}>
                    Location of Birth
                  </CustomText>{" "}
                  - Provides personalized wellness insights and support
                </CustomText>
              </View>
            </View>

            <CustomText
              style={{
                textAlign: "center",
                marginTop: verticalScale(5),
              }}
              fontSize={12}
              fontFamily="medium"
              color={PALETTE.white}
            >
              Complete your wellness profile to get the most personalized
              emotional support.
            </CustomText>
          </View>

          <View style={{ gap: verticalScale(10) }}>
            <PrimaryButton
              title="Complete My Profile"
              onPress={onNavigateToProfile}
              isArrowIcon={true}
            />
            <PrimaryButton
              title="Maybe Later"
              onPress={onClose}
              isArrowIcon={false}
              bgColor={["transparent", "transparent"]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FeatureLockedModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(10),
  },
  modalContent: {
    width: "100%",
    backgroundColor: PALETTE.mysticPurple,
    gap: verticalScale(8),
    borderRadius: 28,
    overflow: "hidden",
    padding: verticalScale(24),
  },
  lockIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  requirementContainer: {
    backgroundColor: "rgba(168, 131, 222, 0.15)",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: PALETTE.sacredGold,
  },
});
