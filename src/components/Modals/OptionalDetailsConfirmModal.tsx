import React, { Dispatch, FC, SetStateAction } from "react";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import IMAGES from "../../assets/Images";
import { PALETTE } from "../../utils/Colors";
import { horizontalScale, verticalScale, wp } from "../../utils/Metrics";
import toastConfig from "../../utils/ToastConfigs";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";

type OptionalDetailsConfirmModalProps = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  onEdit: () => void;
};

const OptionalDetailsConfirmModal: FC<OptionalDetailsConfirmModalProps> = ({
  isVisible,
  setIsVisible,
  onConfirm,
  onEdit,
}) => {
  const insets = useSafeAreaInsets();

  const closeModal = () => {
    setIsVisible(false);
  };

  const handleEdit = () => {
    onEdit();
    closeModal();
  };

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={closeModal}
      animationType="fade"
    >
      <TouchableOpacity
        onPress={closeModal}
        activeOpacity={1}
        style={styles.container}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(e) => e.stopPropagation()}
        >
          <Image source={IMAGES.LogoWithTitle} style={styles.logo} />
          <View
            style={{
              alignItems: "center",
              gap: verticalScale(15),
              marginVertical: verticalScale(10),
            }}
          >
            <CustomText
              color={PALETTE.lightSkin}
              fontFamily="belganAesthetic"
              fontSize={24}
              style={{
                textAlign: "center",
              }}
            >
              Complete Your Wellness Profile
            </CustomText>
            <CustomText
              style={{
                textAlign: "center",
              }}
              fontSize={13}
              fontFamily="medium"
            >
              <CustomText
                fontSize={13}
                fontFamily="bold"
                color={PALETTE.sacredGold}
              >
                Your birth date, location of birth and gender
              </CustomText>{" "}
              are important for unlocking the full potential of Deep Feels.
            </CustomText>

            {/* Emotional Wellness Benefit */}
            <View style={styles.benefitContainer}>
              <CustomText
                fontSize={12}
                fontFamily="bold"
                color={PALETTE.sacredGold}
              >
                Emotional Wellness
              </CustomText>
              <CustomText fontSize={11} style={{ marginTop: verticalScale(5) }}>
                Understanding your birth timing helps us deliver emotional
                insights and reflections that resonate deeply with your unique
                emotional patterns.
              </CustomText>
            </View>

            {/* Nervous System Support Benefit */}
            <View style={styles.benefitContainer}>
              <CustomText
                fontSize={12}
                fontFamily="bold"
                color={PALETTE.sacredGold}
              >
                Nervous System Support
              </CustomText>
              <CustomText fontSize={11} style={{ marginTop: verticalScale(5) }}>
                Your location and timing data enable personalized nervous system
                guidance tailored to your environmental and astrological
                influences.
              </CustomText>
            </View>

            {/* Holistic Wellness Benefit */}
            <View style={styles.benefitContainer}>
              <CustomText
                fontSize={12}
                fontFamily="bold"
                color={PALETTE.sacredGold}
              >
                Complete Wellness Picture
              </CustomText>
              <CustomText fontSize={11} style={{ marginTop: verticalScale(5) }}>
                Together, these details create a comprehensive wellness profile
                for advanced features like compatibility insights and
                personalized healing paths.
              </CustomText>
            </View>

            <CustomText
              style={{
                textAlign: "center",
                marginTop: verticalScale(8),
              }}
              fontSize={12}
              fontFamily="medium"
              color={PALETTE.white}
            >
              You can always update this information in your profile later.
            </CustomText>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <PrimaryButton
              title="Add Details Now"
              onPress={handleEdit}
              style={{ width: wp(45) }}
              isArrowIcon={false}
            />
            <PrimaryButton
              title="Skip for Now"
              onPress={handleConfirm}
              style={{ width: wp(35) }}
              isArrowIcon={false}
              bgColor={["transparent", "transparent"]}
            />
          </View>
        </View>
      </TouchableOpacity>
      <Toast
        config={toastConfig}
        visibilityTime={4000}
        autoHide={true}
        topOffset={insets.top + 20}
      />
    </Modal>
  );
};

export default OptionalDetailsConfirmModal;

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
    gap: verticalScale(12),
    borderRadius: 28,
    overflow: "hidden",
    padding: verticalScale(22),
  },
  logo: {
    width: horizontalScale(140),
    height: verticalScale(80),
    alignSelf: "center",
  },
  benefitContainer: {
    backgroundColor: "rgba(168, 131, 222, 0.15)",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: PALETTE.sacredGold,
  },
});
