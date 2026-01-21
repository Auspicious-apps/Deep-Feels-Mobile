import React, { Dispatch, FC, SetStateAction } from "react";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import IMAGES from "../../assets/Images";
import { useAppSelector } from "../../redux/store";
import { GetSubscriptionDataAPiResponse } from "../../service/ApiResponses/GetUserSubscriptionData";
import { PALETTE } from "../../utils/Colors";
import { horizontalScale, verticalScale, wp } from "../../utils/Metrics";
import toastConfig from "../../utils/ToastConfigs";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";

type ConfirmCancelSubcriptionModalProps = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  isCancelling: boolean;
  setIsCancelling: Dispatch<SetStateAction<boolean>>;
  onContinue: () => void;
  subscriptionDetails: GetSubscriptionDataAPiResponse;
};

const CancelSubscriptionConfirmModal: FC<
  ConfirmCancelSubcriptionModalProps
> = ({
  isVisible,
  setIsVisible,
  onContinue,
  isCancelling,
}) => {
  const insets = useSafeAreaInsets();

  const { userData } = useAppSelector((state) => state.user);

  const closeModal = () => {
    setIsVisible(false);
  };

  const cancelSubscription = async () => {
    onContinue();
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
              Are you sure you want to cancel your{" "}
              {userData?.subscription?.status === "trialing"
                ? "free trial"
                : "membership"}
              ?
            </CustomText>
            <CustomText
              style={{
                textAlign: "center",
              }}
              fontSize={12}
            >
              <CustomText fontSize={12} fontFamily="bold">
                Note:
              </CustomText>{" "}
              You will not be able to access the app as you need an active
              subscription to access all the features of app.
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
              title="Confirm"
              onPress={cancelSubscription}
              style={{ width: wp(40) }}
              isLoading={isCancelling}
              disabled={isCancelling}
              isArrowIcon={false}
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
      <Toast
        config={toastConfig}
        visibilityTime={4000}
        autoHide={true}
        topOffset={insets.top + 20}
      />
    </Modal>
  );
};

export default CancelSubscriptionConfirmModal;

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
