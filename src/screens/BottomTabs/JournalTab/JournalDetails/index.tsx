import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  NativeModules,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import LinearGradient from "react-native-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import FONTS from "../../../../assets/Fonts";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import PrimaryButton from "../../../../components/PrimaryButton";
import {
  refreshDailyReflection,
  refreshMyJournals,
} from "../../../../redux/slices/journalSlice";
import { useAppDispatch } from "../../../../redux/store";
import ENDPOINTS from "../../../../service/ApiEndpoints";
import { Reflection } from "../../../../service/ApiResponses/GetDailyRoutiineListApiResponse";
import { Journal } from "../../../../service/ApiResponses/GetMyJournalsApiResponse";
import {
  deleteData,
  fetchData,
  postData,
  putData,
} from "../../../../service/ApiService";
import { JournalDetailsScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import {
  horizontalScale,
  hp,
  responsiveFontSize,
  verticalScale,
} from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const { JournalCrypto } = NativeModules;

const JournalDetails: FC<JournalDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { isNew, type, id, title } = route.params;
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();
  const dispatch = useAppDispatch();

  const [journalMessage, setJournalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [dailyReflectionData, setDailyReflectionData] =
    useState<Reflection | null>(null);

  const [dailyReflectionmessage, setDailyReflectionmessage] = useState("");

  const [isDeletingJournal, setIsDeletingJournal] = useState(false);

  const handleSaveJournal = async () => {
    if (type === "myJournal") {
      if (id) {
        if (!journalMessage.trim()) {
          Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: "Please enter some description for your journal.",
          });
          return;
        }

        setIsLoading(true);

        const { encryptedContent, iv } = await JournalCrypto.encryptJournal(
          journalMessage
        );

        try {
          const response = await putData(`${ENDPOINTS.createJournal}/${id}`, {
            title,
            content: encryptedContent,
            iv,
          });

          if (response.data.success) {
            dispatch(refreshMyJournals());
            Toast.show({
              type: "success",
              text1: "Success!",
              text2: "Journal updated successfully",
            });
            navigation.goBack();
          }
        } catch (error: any) {
          console.error("Error Saving Journal", error);
          Toast.show({
            type: "error",
            text1: "Oops",
            text2: error.message || "Something went wrong. Please try again",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        const { encryptedContent, iv } = await JournalCrypto.encryptJournal(
          journalMessage
        );

        if (!journalMessage.trim()) {
          Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: "Please enter some description for your journal.",
          });
          return;
        }

        setIsLoading(true);
        try {
          const response = await postData(ENDPOINTS.createJournal, {
            title,
            content: encryptedContent,
            iv,
          });

          if (response.data.success) {
            dispatch(refreshMyJournals());
            Toast.show({
              type: "success",
              text1: "Success!",
              text2: "New Journal created successfully",
            });
            navigation.goBack();
          }
        } catch (error: any) {
          console.error("Error Saving Journal", error);
          Toast.show({
            type: "error",
            text1: "Oops",
            text2: error.message || "Something went wrong. Please try again",
          });
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      setIsLoading(true);
      try {
        const response = await putData(`${ENDPOINTS.updateReflection}/${id}`, {
          userDescription: dailyReflectionmessage,
        });

        if (response.data.success) {
          dispatch(refreshDailyReflection());
          navigation.goBack();
        }
      } catch (error: any) {
        console.error("Error Saving Journal", error);
        Toast.show({
          type: "error",
          text1: "Oops",
          text2: error.message || "Something went wrong. Please try again",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteJournal = async () => {
    setIsDeletingJournal(true);
    try {
      const response = await deleteData(`${ENDPOINTS.createJournal}/${id}`);

      if (response.data.success) {
        dispatch(refreshMyJournals());
        navigation.goBack();
      }
    } catch (error: any) {
      console.error("Error Deleting Journal", error);
      Toast.show({
        type: "error",
        text1: "Oops",
        text2: error.message || "Something went wrong. Please try again",
      });
    } finally {
      setIsDeletingJournal(false);
    }
  };

  const getDailyReflectionData = async () => {
    setIsFetchLoading(true);
    try {
      const response = await fetchData<Reflection>(
        `${ENDPOINTS.getReflectionbyId}/${id}`
      );

      if (response.data.success) {
        setDailyReflectionData(response.data.data);
        if (response.data.data.userDescription) {
          setDailyReflectionmessage(response.data.data.userDescription);
        }
      }
    } catch (error: any) {
      console.error("Get Daily Reflection By ID error:", error);
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      setIsFetchLoading(false);
    }
  };

  const getJournalData = async () => {
    setIsFetchLoading(true);
    try {
      const response = await fetchData<Journal>(
        `${ENDPOINTS.getJournalbyId}/${id}`
      );

      const decryptedContent = await JournalCrypto.decryptJournal(
        response.data.data.content, // Encrypted content from backend
        response.data.data.iv // IV from backend
      );

      if (response.data.success) {
        setJournalMessage(decryptedContent);
      }
    } catch (error: any) {
      console.error("Get Daily Reflection By ID error:", error);
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      setIsFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id && type === "dailyRoutine") {
      getDailyReflectionData();
    }
    if (id && type === "myJournal") {
      getJournalData();
    }
  }, [id, type]);

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
      imageStyle={{
        backgroundColor: PALETTE.midnightIndigo,
      }}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            position: "relative",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            nestedScrollEnabled
            contentContainerStyle={[
              styles.scrollViewContent,
              {
                flex: 1,
                paddingBottom: Platform.select({
                  android: verticalScale(100),
                  ios: insets.bottom + verticalScale(100),
                }),
                paddingTop: Platform.select({
                  ios: verticalScale(30),
                }),
              },
            ]}
          >
            {/* Header */}
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
                color={PALETTE.lightSkin}
                style={{ flex: 1 }}
              >
                {title}
              </CustomText>

              {!isNew && type === "myJournal" && (
                <PrimaryButton
                  title="Delete"
                  onPress={handleDeleteJournal}
                  isArrowIcon={false}
                  style={{
                    alignSelf: "flex-end",
                    paddingVertical: verticalScale(5),
                    paddingHorizontal: horizontalScale(10),
                  }}
                  textSize={12}
                  bgColor={["#FF0000", "#FF0000"]}
                  isFullWidth={false}
                  isLoading={isDeletingJournal}
                />
              )}
            </View>

            {isFetchLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator />
              </View>
            ) : (
              <>
                {type === "myJournal" && (
                  <TextInput
                    maxFontSizeMultiplier={1.3}
                    placeholder="Enter Your Journal Description"
                    placeholderTextColor={PALETTE.PlaceHolderText}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      paddingVertical: verticalScale(12),
                      paddingHorizontal: horizontalScale(12),
                      borderRadius: 10,
                      flex: 1,
                      color: PALETTE.white,
                      fontSize: responsiveFontSize(14),
                      fontFamily: FONTS.medium,
                    }}
                    textAlignVertical="top"
                    value={journalMessage}
                    onChangeText={setJournalMessage}
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline
                    scrollEnabled={true}
                  />
                )}

                {type === "dailyRoutine" && (
                  <View
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      paddingVertical: verticalScale(12),
                      paddingHorizontal: horizontalScale(12),
                      borderRadius: 10,
                      flex: 1,
                      alignItems: "flex-start",
                      gap: verticalScale(20),
                    }}
                  >
                    <LinearGradient
                      colors={[
                        PALETTE.waterGradient.start,
                        PALETTE.waterGradient.end,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        borderRadius: verticalScale(20),
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: verticalScale(8),
                          paddingHorizontal: horizontalScale(12),
                        }}
                      >
                        <CustomText
                          fontSize={12}
                          fontFamily="semiBold"
                          color={PALETTE.white}
                        >
                          Your Daily Reflection
                        </CustomText>
                      </View>
                    </LinearGradient>
                    <CustomText fontFamily="medium" fontSize={14}>
                      {dailyReflectionData?.reflection}
                    </CustomText>

                    <LinearGradient
                      colors={[
                        PALETTE.waterGradient.start,
                        PALETTE.waterGradient.end,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        borderRadius: verticalScale(20),
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: verticalScale(8),
                          paddingHorizontal: horizontalScale(12),
                        }}
                      >
                        <CustomText
                          fontSize={12}
                          fontFamily="semiBold"
                          color={PALETTE.white}
                        >
                          Grounding Tip
                        </CustomText>
                      </View>
                    </LinearGradient>
                    <CustomText fontFamily="medium" fontSize={14}>
                      {dailyReflectionData?.groundingTip}
                    </CustomText>

                    <LinearGradient
                      colors={[
                        PALETTE.waterGradient.start,
                        PALETTE.waterGradient.end,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        borderRadius: verticalScale(20),
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: verticalScale(8),
                          paddingHorizontal: horizontalScale(12),
                        }}
                      >
                        <CustomText
                          fontSize={12}
                          fontFamily="semiBold"
                          color={PALETTE.white}
                        >
                          Mantra
                        </CustomText>
                      </View>
                    </LinearGradient>
                    <CustomText fontFamily="medium" fontSize={14}>
                      {dailyReflectionData?.mantra}
                    </CustomText>

                    <TextInput
                      maxFontSizeMultiplier={1.3}
                      placeholder="Enter Your Notes"
                      placeholderTextColor={PALETTE.PlaceHolderText}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        paddingVertical: verticalScale(12),
                        paddingHorizontal: horizontalScale(12),
                        borderRadius: 10,
                        width: "100%",
                        color: PALETTE.white,
                        fontSize: responsiveFontSize(14),
                        fontFamily: FONTS.medium,
                        minHeight: hp(30),
                      }}
                      numberOfLines={5}
                      textAlignVertical="top"
                      value={dailyReflectionmessage}
                      onChangeText={setDailyReflectionmessage}
                      autoCapitalize="none"
                      autoCorrect={false}
                      multiline
                      scrollEnabled={true}
                    />
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </KeyboardAwareScrollView>
        <TouchableOpacity
          onPress={handleSaveJournal}
          style={{
            position: "absolute",
            bottom: Platform.select({
              android: verticalScale(120),
              ios: insets.top + verticalScale(90),
            }),
            right: verticalScale(15),
            zIndex: 100,
            justifyContent: "center",
            alignItems: "center",
            display:
              type === "dailyRoutine" && dailyReflectionmessage.length === 0
                ? "none"
                : "flex",
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} />
          ) : (
            <CustomIcon
              Icon={ICONS.GradientSaveButton}
              width={verticalScale(50)}
              height={verticalScale(50)}
            />
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default JournalDetails;

const styles = StyleSheet.create({});
