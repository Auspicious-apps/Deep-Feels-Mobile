import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomDropDown from "../../../../components/CustomDropdown";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import FeatureLockedModal from "../../../../components/Modals/FeatureLockedModal";
import { useChangingText } from "../../../../hooks/useChanginTextHook";
import {
  markInitialLoadDone,
  setSavedProfiles,
} from "../../../../redux/slices/bondSlice";
import { setRefreshSavedProfiles } from "../../../../redux/slices/homeSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import ENDPOINTS from "../../../../service/ApiEndpoints";
import { AllCompatibilityUserList } from "../../../../service/ApiResponses/AllCompatibilityUserList";
import { CheckCompatibilityApiResponse } from "../../../../service/ApiResponses/CheckCompatibilityApiResponse";
import { fetchData, postData } from "../../../../service/ApiService";
import { BondScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { capitalizeFirstLetter, getInitials } from "../../../../utils/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../../../utils/Metrics";
import { messages } from "../AddPerson";
import { useThemedStyles } from "./styles";
import Animated, { FadeIn } from "react-native-reanimated";

const Bond: FC<BondScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();
  const dispatch = useAppDispatch();

  const { userData } = useAppSelector((state) => state.user);
  const { refreshSavedProfiles } = useAppSelector((state) => state.home);

  const relationTypes = [
    "Friends",
    "Lovers",
    "Sibling",
    "Parent",
    "Colleagues",
    "Mentors",
    "Relatives",
    "Roommates",
  ];

  const [matchTypeVisisble, setMatchTypeVisisble] = useState(false);
  const [selectedType, setSelectedType] = useState<
    | "Friends"
    | "Lovers"
    | "Sibling"
    | "Parent"
    | "Colleagues"
    | "Mentors"
    | "Relatives"
    | "Roommates"
    | any
  >("Friends");

  const [isLoading, setIsLoading] = useState(false);
  const changingLoadingText = useChangingText(messages, 2000);

  const [isDropdownLoading, setIsDropdownLoading] = useState(false);

  const [showSelectRelationType, setShowSelectRelationType] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<AllCompatibilityUserList | null>(null);

  const [isFeatureLockedModalVisible, setIsFeatureLockedModalVisible] =
    useState(false);

  const { savedProfiles, initialLoadDone } = useAppSelector(
    (state) => state.bond
  );

  const getAllSavedProfiles = async (showLoading: boolean) => {
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const response = await fetchData<AllCompatibilityUserList[]>(
        ENDPOINTS.getAllCompatibleUsers
      );

      if (response.data.success) {
        dispatch(setSavedProfiles(response.data.data));
        dispatch(markInitialLoadDone());
      }
    } catch (error: any) {
      console.error("Get Saved Home Data error:", error);
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (refreshSavedProfiles && refreshSavedProfiles > 0) {
      getAllSavedProfiles(true);
    }
  }, [refreshSavedProfiles]);

  useEffect(() => {
    if (!initialLoadDone) {
      getAllSavedProfiles(true);
    }
  }, []);

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
      imageStyle={{ backgroundColor: PALETTE.mysticPurple }}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <Animated.View entering={FadeIn.duration(1500)} style={{ flex: 1 }}>
          <ScrollView
            nestedScrollEnabled
            contentContainerStyle={[
              styles.scrollViewContent,
              {
                paddingBottom: Platform.select({
                  android: verticalScale(100),
                  ios: insets.bottom + verticalScale(100),
                }),
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <CustomText
                fontFamily="belganAesthetic"
                fontSize={30}
                color={PALETTE.lightSkin}
              >
                Emotional Match
              </CustomText>
              <CustomText fontSize={14} color={PALETTE.white}>
                Understand the emotions between you and someone you care about.
              </CustomText>
            </View>

            {/* Match UI */}
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                minHeight: hp(40),
                width: wp(90),
                position: "relative",
                alignSelf: "center",
                padding: verticalScale(40),
              }}
            >
              {/* Left Circle */}
              <View
                style={{
                  height: verticalScale(125),
                  width: verticalScale(125),
                  borderRadius: 100,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: PALETTE.waterGradient.start,
                  zIndex: 100,
                }}
              >
                <CustomText fontSize={20} color={PALETTE.white}>
                  {getInitials(userData?.user.fullName!)}
                </CustomText>
                <CustomText fontFamily="semiBold" fontSize={12}>
                  You
                </CustomText>
              </View>

              <CustomIcon
                Icon={ICONS.ArcLines}
                height={wp(60)}
                width={wp(65)}
              />

              <TouchableOpacity
                onPress={() => {
                  setMatchTypeVisisble(true);
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateY: 20 }],
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: horizontalScale(3),
                  borderWidth: 1,
                  borderColor: PALETTE.white,
                  paddingHorizontal: horizontalScale(10),
                  paddingVertical: verticalScale(4),
                }}
              >
                <CustomText fontSize={12} fontFamily="semiBold">
                  {selectedType}
                </CustomText>
                <CustomIcon Icon={ICONS.DownArrowIcon} height={16} width={16} />

                <CustomDropDown
                  allowCustomInput
                  isVisible={matchTypeVisisble}
                  onClose={() => setMatchTypeVisisble(false)}
                  items={[
                    "Friends",
                    "Lovers",
                    "Sibling",
                    "Parent",
                    "Colleagues",
                    "Mentors",
                    "Relatives",
                    "Roommates",
                  ]}
                  selectedItem={selectedType}
                  onSelectItem={(type: any) => {
                    setSelectedType(type);
                    setMatchTypeVisisble(false);
                  }}
                  width={wp(95) - horizontalScale(20)}
                  title="Select Relation Type"
                />
              </TouchableOpacity>

              {/* Right Circle */}
              <TouchableOpacity
                onPress={() => {
                  if (!userData?.user?.hasAllData) {
                    setIsFeatureLockedModalVisible(true);
                    return;
                  }
                  navigation.navigate("addPerson", {
                    relationshipType: selectedType.toLowerCase(),
                  });
                }}
                style={{
                  height: verticalScale(125),
                  width: verticalScale(125),
                  borderRadius: 100,
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: PALETTE.waterGradient.start,
                  zIndex: 100,
                }}
              >
                <CustomText fontSize={30}>+</CustomText>
                <CustomText fontFamily="semiBold" fontSize={12}>
                  Add Person
                </CustomText>
              </TouchableOpacity>
            </View>

            {/* Saved Profile */}
            {savedProfiles.length > 0 ? (
              <View
                style={{
                  gap: verticalScale(15),
                }}
              >
                <CustomText
                  fontSize={14}
                  fontFamily="semiBold"
                  style={{
                    paddingHorizontal: horizontalScale(15),
                  }}
                >
                  Saved Profile
                </CustomText>

                {isLoading ? (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: verticalScale(50),
                    }}
                  >
                    <ActivityIndicator />
                  </View>
                ) : (
                  <>
                    <FlatList
                      data={savedProfiles}
                      horizontal
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedProfile(item);
                              setShowSelectRelationType(true);
                            }}
                            style={{
                              alignItems: "center",
                              gap: verticalScale(5),
                            }}
                          >
                            <View
                              style={{
                                borderRadius: 100,
                                borderWidth: 1,
                                borderColor: PALETTE.white,
                                justifyContent: "center",
                                alignItems: "center",
                                width: verticalScale(48),
                                height: verticalScale(48),
                                backgroundColor: "#dcecf920",
                              }}
                            >
                              <CustomText
                                fontSize={14}
                              >{`${item.partner.firstName.charAt(
                                0
                              )}${item.partner.lastName.charAt(
                                0
                              )}`}</CustomText>
                            </View>
                            <CustomText fontSize={10} fontFamily="semiBold">
                              {`${item.partner.firstName} ${item.partner.lastName}`}
                            </CustomText>
                          </TouchableOpacity>
                        );
                      }}
                      contentContainerStyle={{
                        gap: horizontalScale(30),
                        paddingHorizontal: horizontalScale(15),
                      }}
                    />
                    <CustomDropDown
                      allowCustomInput
                      isLoading={isDropdownLoading}
                      loadingComponent={
                        <View style={{ gap: verticalScale(10) }}>
                          <CustomText
                            fontSize={18}
                            fontFamily="semiBold"
                            color={PALETTE.lightTextColor}
                            style={{ textAlign: "center" }}
                          >
                            {changingLoadingText}
                          </CustomText>
                          <ActivityIndicator color={PALETTE.lightSkin} />
                        </View>
                      }
                      isVisible={showSelectRelationType}
                      onClose={() => setShowSelectRelationType(false)}
                      items={[
                        ...new Set([
                          // 1. Start with all predefined relationship types (strings)
                          ...relationTypes,
                          // 2. Map the selected profile's relations (objects) to a list of strings
                          //    We use (|| []) to safely handle a null/undefined selectedProfile
                          ...(selectedProfile?.relations || []).map((item) =>
                            capitalizeFirstLetter(item.relationshipType)
                          ),
                        ]),
                      ]}
                      closeAuto={false}
                      selectedItem={""}
                      onSelectItem={async (type: any) => {
                        const selectedRelationTypeData =
                          selectedProfile &&
                          selectedProfile.relations.find((item) =>
                            type.toLowerCase().includes(item.relationshipType)
                          );

                        if (selectedProfile && selectedRelationTypeData) {
                          setShowSelectRelationType(false);
                          navigation.navigate("compatibilityDetails", {
                            data: selectedRelationTypeData,
                            partner: selectedProfile.partner,
                            id: selectedProfile._id,
                          });
                        } else {
                          setIsDropdownLoading(true);
                          try {
                            const response =
                              await postData<CheckCompatibilityApiResponse>(
                                `${ENDPOINTS.checkCompatibility}?_id=${selectedProfile?._id}`,
                                {
                                  relationshipType: type.toLowerCase(),
                                  firstName: selectedProfile?.partner.firstName,
                                  lastName: selectedProfile?.partner.lastName,
                                  gender: selectedProfile?.partner.gender,
                                  dob: dayjs(
                                    selectedProfile?.partner.dob
                                  ).format("YYYY-MM-DD"),
                                  birthPlace:
                                    selectedProfile?.partner.birthPlace,
                                  ...(selectedProfile?.partner.timeOfBirth && {
                                    timeOfBirth:
                                      selectedProfile?.partner.timeOfBirth,
                                  }),
                                }
                              );

                            if (response.data.success) {
                              const selectedRelationTypeData =
                                response.data.data.relations &&
                                response.data.data.relations.find((item) =>
                                  type
                                    .toLowerCase()
                                    .includes(item.relationshipType)
                                );

                              dispatch(setRefreshSavedProfiles());
                              navigation.navigate("compatibilityDetails", {
                                data: selectedRelationTypeData,
                                partner: response.data.data.partner,
                                id: selectedProfile?._id!,
                              });
                            }
                          } catch (error: any) {
                            console.error("Check Compatibility error:", error);
                            Toast.show({
                              type: "error",
                              text1: "Oops!",
                              text2:
                                error.message ||
                                "Something went wrong. Please try again.",
                            });
                          } finally {
                            setIsLoading(false);
                            setIsDropdownLoading(false);
                            setShowSelectRelationType(false);
                          }
                        }
                      }}
                      width={wp(95) - horizontalScale(20)}
                      title="Select Relation Type"
                    />
                  </>
                )}
              </View>
            ) : (
              <CustomText style={{ textAlign: "center" }}>
                No Saved Profiles
              </CustomText>
            )}
          </ScrollView>
        </Animated.View>
      </SafeAreaView>

      <FeatureLockedModal
        isVisible={isFeatureLockedModalVisible}
        onClose={() => setIsFeatureLockedModalVisible(false)}
        onNavigateToProfile={() => {
          setIsFeatureLockedModalVisible(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "profileTab",
                  state: { routes: [{ name: "profile" }] },
                },
              ],
            })
          );
        }}
        featureName="Emotional Match"
      />
    </ImageBackground>
  );
};

export default Bond;
