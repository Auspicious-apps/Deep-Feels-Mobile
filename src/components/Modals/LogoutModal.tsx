import React, { Dispatch, FC, SetStateAction } from "react";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import IMAGES from "../../assets/Images";
import { PALETTE } from "../../utils/Colors";
import { horizontalScale, verticalScale, wp } from "../../utils/Metrics";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";

type LogOutModalProps = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onContinue: () => void;
};
const LogoutModal: FC<LogOutModalProps> = ({
  isVisible,
  setIsVisible,
  onContinue,
}) => {
  const closeModal = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={closeModal}
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableOpacity
        onPress={closeModal}
        activeOpacity={1}
        style={styles.container}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true} // Capture touch events
          onResponderRelease={(e) => e.stopPropagation()} // Prevent propagation
        >
          <Image source={IMAGES.LogoWithTitle} style={styles.logo} />
          <View
            style={{
              alignItems: "center",
              gap: verticalScale(10),
              marginVertical: verticalScale(20),
            }}
          >
            <CustomText
              color={PALETTE.lightSkin}
              fontFamily="belganAesthetic"
              fontSize={26}
              style={{
                textAlign: "center",
              }}
            >
              Are you sure you want to logout?
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
              title="Logout"
              isArrowIcon={false}
              onPress={onContinue}
              style={{ width: wp(40) }}
            />
            <PrimaryButton
              title="Cancel"
              onPress={closeModal}
              style={{ width: wp(30) }}
              isArrowIcon={false}
              bgColor={["transparent", "transparent"]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default LogoutModal;

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
    gap: verticalScale(15),
    borderRadius: 28,
    overflow: "hidden",
    padding: verticalScale(25),
  },
  logo: {
    width: horizontalScale(160),
    height: verticalScale(100),
    alignSelf: "center",
  },
});
