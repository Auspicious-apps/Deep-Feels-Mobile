import React from "react";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import IMAGES from "../../assets/Images";
import { setHomeData } from "../../redux/slices/homeSlice";
import { resetJournalData } from "../../redux/slices/journalSlice";
import { setShowSubscriptionExpireModal } from "../../redux/slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { PALETTE } from "../../utils/Colors";
import { replace } from "../../utils/Helpers";
import { horizontalScale, verticalScale } from "../../utils/Metrics";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";

const SubscriptionExpiredModal = () => {
  const { showSubscriptionExpireModal } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(setShowSubscriptionExpireModal(false));
  };

  return (
    <Modal
      visible={showSubscriptionExpireModal}
      transparent
      onRequestClose={closeModal}
      animationType="fade"
    >
      <TouchableOpacity activeOpacity={1} style={styles.container}>
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
              No Active Subscriptions
            </CustomText>
            <CustomText
              fontFamily="medium"
              fontSize={13}
              style={{
                textAlign: "center",
              }}
            >
              Please purchase a subscription to continue access all features in
              the Deep Feels.
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PrimaryButton
              title="Continue to Subscribe"
              onPress={() => {
                closeModal();
                replace("setupStack", {
                  screen: "subscriptionPlanScreen",
                  params: {
                    isBuyAgain: true,
                  },
                });

                dispatch(setHomeData(null));
                dispatch(resetJournalData());
              }}
              style={{
                paddingVertical: verticalScale(12),
                paddingHorizontal: horizontalScale(20),
                alignSelf: "center",
              }}
              isFullWidth={false}
              isArrowIcon={false}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SubscriptionExpiredModal;

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
