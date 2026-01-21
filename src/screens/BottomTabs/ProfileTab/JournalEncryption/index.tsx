import React, { FC, useState } from "react";
import { ImageBackground, Platform, Switch, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import JournalPasswordModal from "../../../../components/Modals/JournalPasswordModal";
import VerifJournalPassworModal from "../../../../components/Modals/VerifyJournalPassword";
import { useAppSelector } from "../../../../redux/store";
import { JournalEncryptionScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { horizontalScale, verticalScale } from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const JournalEncryption: FC<JournalEncryptionScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();

  const { userData } = useAppSelector((state) => state.user);

  const [isJournalLockEnabled, setIsJournalLockEnabled] = useState(
    userData?.journalEncryption || false
  );

  const [passwordModal, setPasswordModal] = useState(false);
  const [isCreatePasswordModal, setIsCreatePasswordModal] = useState(false);

  const toggleJournalEncryption = async () => {
    if (userData?.journalEncryption === null) {
      setIsCreatePasswordModal(true);
      return;
    } else {
      setPasswordModal(true);
    }
  };

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flex: 1,
            paddingBottom: Platform.select({
              android: verticalScale(100),
              ios: insets.top + verticalScale(70),
            }),
            paddingTop: verticalScale(30),
            paddingHorizontal: horizontalScale(15),
            gap: verticalScale(20),
          }}
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <CustomIcon
              Icon={ICONS.GradientBackButtonIcon}
              height={verticalScale(36)}
              width={verticalScale(36)}
              onPress={() => navigation.goBack()}
            />
            <CustomText
              fontFamily="belganAesthetic"
              fontSize={30}
              color={PALETTE.heading}
            >
              Journal Encryption
            </CustomText>
          </View>

          <View style={{ flex: 1, gap: verticalScale(10) }}>
            <View
              style={{
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: horizontalScale(14),
                  borderRadius: 5,
                  paddingVertical: verticalScale(14),
                  paddingHorizontal: horizontalScale(10),
                  position: "relative",
                  justifyContent: "space-between",
                  zIndex: 1,
                }}
              >
                <CustomText fontSize={14}>Enable Journal Lock</CustomText>
                <Switch
                  value={isJournalLockEnabled}
                  onValueChange={toggleJournalEncryption}
                  trackColor={{
                    false: PALETTE.PlaceHolderText,
                    true: Platform.select({
                      android: "#ffffff47",
                      ios: "transparent",
                    }),
                  }}
                  thumbColor={
                    isJournalLockEnabled ? PALETTE.sacredGold : "#B9B9B9"
                  }
                  ios_backgroundColor={PALETTE.PlaceHolderText}
                  style={{
                    transform: [
                      {
                        scaleX: Platform.select({
                          android: 0.8,
                          ios: 0.6,
                          default: 1,
                        })!,
                      },
                      {
                        scaleY: Platform.select({
                          android: 0.8,
                          ios: 0.6,
                          default: 1,
                        })!,
                      },
                    ],
                  }}
                  
                />
              </View>
              <View style={styles.cardOverlay} />
            </View>
            <CustomText fontSize={12} color={PALETTE.lightTextColor}>
              For your privacy, we don’t store your passcode anywhere. If you
              forget it, your journal entries will be permanently deleted.
            </CustomText>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <JournalPasswordModal
        isVisible={isCreatePasswordModal}
        setIsVisible={setIsCreatePasswordModal}
        isJournalLockEnabled={isJournalLockEnabled}
        setIsJournalLockEnabled={setIsJournalLockEnabled}
      />
      <VerifJournalPassworModal
        isVisible={passwordModal}
        setIsVisible={setPasswordModal}
        isJournalLockEnabled={isJournalLockEnabled}
        setIsJournalLockEnabled={setIsJournalLockEnabled}
      />
    </ImageBackground>
  );
};

export default JournalEncryption;
