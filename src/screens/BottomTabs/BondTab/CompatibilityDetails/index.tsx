import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import PrimaryButton from "../../../../components/PrimaryButton";
import { setRefreshSavedProfiles } from "../../../../redux/slices/homeSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import ENDPOINTS from "../../../../service/ApiEndpoints";
import { deleteData } from "../../../../service/ApiService";
import { generateDailyGuidance } from "../../../../service/OpenAI";
import { CompatibilityScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import {
  capitalizeFirstLetter,
  getCachedDailyGuidance,
  getInitials,
  setCachedDailyGuidance,
} from "../../../../utils/Helpers";
import { horizontalScale, verticalScale, wp } from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

const TABS = {
  COMPATIBILITY: "Emotional Match",
  DAILY_GUIDANCE: "Connection Tips",
};

// Helper function to map compatibility labels to wellness terms
const mapCompatibilityLabel = (label: string): string => {
  const labelMap: { [key: string]: string } = {
    Lovers: "High Emotional Harmony",
    "Soul Mates": "Strong Relationship Flow",
    Extraordinary: "Exceptional Connection",
    "Very Auspicious": "Highly Compatible",
    Good: "Positive Dynamics",
    Moderate: "Balanced Compatibility",
    Challenging: "Growth Opportunity",
  };
  return labelMap[label] || label;
};

const CompatibilityDetails: FC<CompatibilityScreenProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();
  const dispatch = useAppDispatch();

  const { data, partner, id } = route.params;

  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { userData } = useAppSelector((state) => state.user);

  const [isDeleteProfileModal, setIsDeleteProfileModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeTab, setActiveTab] = useState(TABS.COMPATIBILITY);

  const [report, setReport] = useState<any>(null);
  const [currentCachedRelationType, setCurrentCachedRelationType] = useState<string>("");
  const [isReportLoading, setIsReportLoading] = useState(false);

  const carouselData = [
    data?.result.emotionalAndMentalCompatibility,
    data?.result.bondAndConnection,
    data?.result.spiritualCompatibility,
    data?.result.communicationAndUnderstanding,
    data?.result.lifestyleAndValuesCompatibility,
  ];

  const closeModal = () => {
    setIsDeleteProfileModal(false);
  };

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteData(
        `${ENDPOINTS.deleteCompatibilityProfile}/${id}`
      );
      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.data.message,
        });
        dispatch(setRefreshSavedProfiles());
        navigation.goBack();
      }
    } catch (error: any) {
      console.error("Delete Compatibility Profile error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const CompatibilityContent = () => (
    <>
      {/* Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          {
            paddingLeft: horizontalScale(15),
            paddingRight: horizontalScale(15),
          },
        ]}
        decelerationRate="fast"
        snapToInterval={wp(85) + horizontalScale(15)}
        snapToAlignment="start"
      >
        {carouselData?.map((item, index) => (
          <View
            style={[
              {
                width: wp(85),
                marginRight: verticalScale(15),
              },
              styles.carouselCard,
            ]}
          >
            <CustomText
              fontSize={14}
              fontFamily="belganAesthetic"
              color={PALETTE.lightSkin}
              style={{ marginBottom: verticalScale(5) }}
            >
              {item?.title}
            </CustomText>
            <CustomText fontSize={12} color={PALETTE.white}>
              {item?.text}
            </CustomText>
          </View>
        ))}
      </ScrollView>

      {/* Emotional Dynamics & Support */}
      <View
        style={{
          width: wp(90),
          alignSelf: "center",
          gap: verticalScale(15),
        }}
      >
        <CustomText fontSize={14} fontFamily="semiBold">
          Emotional Dynamics & Support
        </CustomText>

        <View
          style={{
            width: "100%",
            padding: verticalScale(12),
            backgroundColor: "#ffffff1f",
            borderRadius: verticalScale(12),
            gap: verticalScale(10),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: verticalScale(10),
              borderBottomWidth: 1,
              borderBottomColor: "#ffffff1f",
              gap: "5%",
            }}
          >
            <View
              style={{
                width: "44.5%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: horizontalScale(5),
              }}
            >
              <View
                style={[
                  styles.avatarBorder,
                  {
                    width: verticalScale(20),
                    height: verticalScale(20),
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffffff1f",
                  },
                ]}
              >
                <CustomText fontFamily="semiBold" fontSize={8}>
                  {getInitials(userData?.user.fullName!)}
                </CustomText>
              </View>
              <CustomText fontFamily="semiBold" fontSize={12}>
                You
              </CustomText>
            </View>

            <View
              style={{
                height: "100%",
                width: "1%",
                backgroundColor: "#ffffff1f",
              }}
            />
            <View
              style={{
                width: "44.5%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: horizontalScale(5),
                flexWrap: "wrap",
              }}
            >
              <View
                style={[
                  styles.avatarBorder,
                  {
                    width: verticalScale(20),
                    height: verticalScale(20),
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffffff1f",
                  },
                ]}
              >
                <CustomText fontFamily="semiBold" fontSize={8}>
                  {partner?.firstName.charAt(0) +
                    " " +
                    partner?.lastName.charAt(0)}
                </CustomText>
              </View>
              <CustomText fontFamily="semiBold" fontSize={12}>
                {partner?.firstName + " " + partner?.lastName}
              </CustomText>
            </View>
          </View>

          {/* Inner World & Emotional Needs (Moon Sign Traits) */}
          <View
            style={{
              width: "100%",
              backgroundColor: PALETTE.softLavender,
              paddingVertical: verticalScale(8),
              borderRadius: 4,
              paddingHorizontal: horizontalScale(12),
            }}
          >
            <CustomText
              fontSize={12}
              fontFamily="semiBold"
              style={{ textAlign: "center" }}
            >
              Inner World & Emotional Needs
            </CustomText>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: verticalScale(10),
              gap: "5%",
            }}
          >
            <View
              style={{
                width: "44.5%",
                alignItems: "center",
                justifyContent: "center",
                gap: horizontalScale(5),
              }}
            >
              <CustomText
                fontFamily="semiBold"
                fontSize={11}
                style={{ textAlign: "center" }}
              >
                {"Primary Trait"}
              </CustomText>
            </View>

            <View
              style={{
                height: "100%",
                width: "1%",
                backgroundColor: "#ffffff1f",
              }}
            />
            <View
              style={{
                width: "44.5%",
                alignItems: "center",
                justifyContent: "center",
                gap: horizontalScale(5),
              }}
            >
              <CustomText
                fontFamily="semiBold"
                fontSize={11}
                style={{ textAlign: "center" }}
              >
                {"Primary Trait"}
              </CustomText>
            </View>
          </View>

          {/* Emotional Style */}
          <View
            style={{
              width: "100%",
              backgroundColor: PALETTE.duskRose,
              paddingVertical: verticalScale(8),
              borderRadius: 4,
              paddingHorizontal: horizontalScale(12),
            }}
          >
            <CustomText
              fontSize={12}
              fontFamily="semiBold"
              style={{ textAlign: "center" }}
            >
              Emotional Style
            </CustomText>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: verticalScale(10),
              gap: "5%",
            }}
          >
            <View
              style={{
                width: "44.5%",
                alignItems: "center",
                justifyContent: "center",
                gap: horizontalScale(5),
              }}
            >
              <CustomText
                fontFamily="semiBold"
                fontSize={11}
                style={{ textAlign: "center" }}
              >
                {`${data?.result.astrologicalSupport.you.personalityKeywords[0]}, ${data?.result.astrologicalSupport.you.personalityKeywords[1]}, ${data?.result.astrologicalSupport.you.personalityKeywords[2]}`}
              </CustomText>
            </View>

            <View
              style={{
                height: verticalScale(30),
                width: "1%",
                backgroundColor: "#ffffff1f",
              }}
            />

            <View
              style={{
                width: "44.5%",
                alignItems: "center",
                justifyContent: "center",
                gap: horizontalScale(5),
              }}
            >
              <CustomText
                fontFamily="semiBold"
                fontSize={11}
                style={{ textAlign: "center" }}
              >
                {`${data?.result.astrologicalSupport.partner.personalityKeywords[0]}, ${data?.result.astrologicalSupport.partner.personalityKeywords[1]}, ${data?.result.astrologicalSupport.partner.personalityKeywords[2]}`}
              </CustomText>
            </View>
          </View>

          {/* How You Show Up in the World (Rising Star Traits) */}
          <View
            style={{
              width: "100%",
              backgroundColor: PALETTE.gold,
              paddingVertical: verticalScale(8),
              borderRadius: 4,
              paddingHorizontal: horizontalScale(12),
            }}
          >
            <CustomText
              fontSize={12}
              fontFamily="semiBold"
              style={{ textAlign: "center" }}
            >
              How You Show Up in the World
            </CustomText>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: verticalScale(10),
              gap: "5%",
            }}
          >
            <View
              style={{
                width: "44.5%",
                alignItems: "center",
                justifyContent: "center",
                gap: horizontalScale(5),
              }}
            >
              <CustomText
                fontFamily="semiBold"
                fontSize={11}
                style={{ textAlign: "center" }}
              >
                {data?.result.astrologicalSupport.you.risingTrait}
              </CustomText>
            </View>

            <View
              style={{
                height: verticalScale(30),
                width: "1%",
                backgroundColor: "#ffffff1f",
              }}
            />
            <View
              style={{
                width: "44.5%",
                alignItems: "center",
                justifyContent: "center",
                gap: horizontalScale(5),
              }}
            >
              <CustomText
                fontFamily="semiBold"
                fontSize={11}
                style={{ textAlign: "center" }}
              >
                {data?.result.astrologicalSupport.partner.risingTrait ||
                  "Aries"}
              </CustomText>
            </View>
          </View>

          {/* Core Personality Drivers (Sun Sign Traits) */}
          <View
            style={{
              width: "100%",
              backgroundColor: PALETTE.celestialBlue,
              paddingVertical: verticalScale(8),
              borderRadius: 4,
              paddingHorizontal: horizontalScale(12),
            }}
          >
            <CustomText
              fontSize={12}
              fontFamily="semiBold"
              style={{ textAlign: "center" }}
            >
              Core Personality Drivers
            </CustomText>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: verticalScale(10),
              gap: "5%",
            }}
          >
            <View
              style={{
                width: "44.5%",
                alignItems: "center",
                justifyContent: "center",
                gap: horizontalScale(5),
              }}
            >
              <CustomText
                fontFamily="semiBold"
                fontSize={11}
                style={{ textAlign: "center" }}
              >
                {data?.result.astrologicalSupport.you.sunSignTrait || "Aries"}
              </CustomText>
            </View>

            <View
              style={{
                height: "100%",
                width: "1%",
                backgroundColor: "#ffffff1f",
              }}
            />
            <View
              style={{
                width: "44.5%",
                alignItems: "center",
                justifyContent: "center",
                gap: horizontalScale(5),
              }}
            >
              <CustomText
                fontFamily="semiBold"
                fontSize={11}
                style={{ textAlign: "center" }}
              >
                {data?.result.astrologicalSupport.partner.sunSignTrait ||
                  "Aries"}
              </CustomText>
            </View>
          </View>
        </View>
      </View>

      <PrimaryButton
        title="Delete this profile"
        onPress={() => {
          setIsDeleteProfileModal(true);
        }}
        isArrowIcon={false}
        gradientStyle={{ width: wp(70), alignSelf: "center" }}
        bgColor={[PALETTE.earthGradient.start, PALETTE.earthGradient.end]}
      />
    </>
  );

  useEffect(() => {
    if (activeTab === TABS.COMPATIBILITY && flatListRef.current) {
      // Small delay to ensure FlatList is rendered
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          animated: false,
          index: activeIndex,
          viewPosition: 0,
        });
      }, 100);
    }
  }, [activeTab]);

  const DailyGuidanceContent = () => {
    if (isReportLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={PALETTE.white} />

          <CustomText
            fontSize={18}
            fontFamily="belganAesthetic" // Use a standout font for the title
            color={PALETTE.lightSkin}
            style={{ marginTop: verticalScale(15) }}
          >
            Generating Guidance Report
          </CustomText>
        </View>
      );
    }

    if (report && report.daily_guidance && report.daily_guidance.length > 0) {
      return (
        <View style={styles.dailyGuidanceContainer}>
          <FlatList
            data={report.daily_guidance}
            keyExtractor={(_, index) => `report-item-${index}`}
            scrollEnabled={false}
            contentContainerStyle={styles.reportListContent}
            renderItem={({ item, index }) => (
              <View style={styles.reportItemContainer}>
                <View style={styles.bulletPoint}>
                  <CustomText
                    fontFamily="bold"
                    fontSize={10}
                    color={PALETTE.white}
                  >
                    {index + 1}
                  </CustomText>
                </View>
                <CustomText
                  fontSize={13}
                  fontFamily="medium"
                  style={styles.reportText}
                >
                  {item}
                </CustomText>
              </View>
            )}
          />
        </View>
      );
    }

    return (
      // Report is not yet available or is empty, show the "coming soon" message
      <View style={styles.emptyTabContainer}>
        <CustomText
          fontSize={16}
          fontFamily="semiBold"
          color={PALETTE.lightSkin}
        >
          Daily Guidance coming soon! ✨
        </CustomText>
        <CustomText fontSize={12} fontFamily="medium" color={PALETTE.white}>
          This section will provide personalized daily insights based on your
          saved profile.
        </CustomText>
      </View>
    );
  };

  const fetchDailyGuidance = async (personA_data: any, personB_data: any) => {
    setIsReportLoading(true);

    try {
      // const response = await getFriendshipReport(
      //   {
      //     day: personA_data.day,
      //     month: personA_data.month,
      //     year: personA_data.year,
      //     hour: personA_data.hour,
      //     min: personA_data.min,
      //     lat: personA_data.lat,
      //     lon: personA_data.lon,
      //     tzone: personA_data.timezone,
      //   },
      //   {
      //     day: personB_data.day,
      //     month: personB_data.month,
      //     year: personB_data.year,
      //     hour: personB_data.hour,
      //     min: personB_data.min,
      //     lat: personB_data.lat,
      //     lon: personB_data.lon,
      //     tzone: personB_data.timezone,
      //   }
      // );

      // if (response) {
      const rephrasedData = await generateDailyGuidance(
        personA_data,
        personB_data,
        data?.relationshipType || " friends"
      );

      if (
        rephrasedData &&
        rephrasedData.daily_guidance &&
        data?.relationshipType
      ) {
        // 2. Cache the newly generated data with the specific relation type
        await setCachedDailyGuidance(id, data?.relationshipType, rephrasedData);

        // 3. Update the state with the fresh data
        setReport(rephrasedData);
        setCurrentCachedRelationType(data?.relationshipType);
        
        console.log(`Connection tips generated and cached for relation type: ${data?.relationshipType}`);
      } else {
        throw new Error("API returned no guidance data.");
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load guidance report.",
      });
    } finally {
      setIsReportLoading(false);
    }
  };

  useEffect(() => {
    const loadGuidance = async () => {
      // Determine the relation type to use for caching
      const currentRelationType = data?.relationshipType || "friends";

      // Only load if we're on the Daily Guidance tab
      if (activeTab === TABS.DAILY_GUIDANCE) {
        // Check if relationship type has changed from what we have cached
        const relationTypeChanged = currentCachedRelationType && currentCachedRelationType !== currentRelationType;
        
        if (relationTypeChanged) {
          console.log(`Relationship type changed from ${currentCachedRelationType} to ${currentRelationType}`);
          // Reset report to trigger new fetch
          setReport(null);
          setCurrentCachedRelationType("");
        }

        // Only fetch if we don't have a report for the current relation type
        if (!report || relationTypeChanged) {
          setIsReportLoading(true);
          
          // 1. Check local cache using BOTH ID and relationType
          const cachedReport = await getCachedDailyGuidance(
            id,
            currentRelationType
          );

          if (cachedReport) {
            // Found valid cache for today and this specific relation type
            console.log(`Using cached connection tips for relation type: ${currentRelationType}`);
            setReport(cachedReport);
            setCurrentCachedRelationType(currentRelationType);
            setIsReportLoading(false);
          } else {
            // No valid cache, generate fresh tips
            console.log(`No cache found for relation type: ${currentRelationType}, generating fresh tips`);
            fetchDailyGuidance(
              userData?.user.fullName || "",
              partner?.firstName + " " + partner?.lastName || ""
            );
          }
        }
      }
    };

    loadGuidance();
  }, [activeTab, id, data?.relationshipType, currentCachedRelationType]);

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <KeyboardAwareScrollView
          style={styles.flexContainer}
          contentContainerStyle={styles.keyboardAwareContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
            >
              Compatibility Analysis
            </CustomText>
          </View>

          {/* Content Area */}
          <View
            style={[
              styles.scrollViewContent,
              {
                paddingBottom: Platform.select({
                  android: verticalScale(100),
                  ios: insets.bottom + verticalScale(100),
                }),
              },
            ]}
          >
            {/* Avatars Section */}
            <View style={styles.avatarsRow}>
              <View style={styles.avatarWrapper}>
                <View
                  style={[
                    styles.avatarBorder,
                    {
                      width: verticalScale(49),
                      height: verticalScale(49),
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#ffffff1f",
                    },
                  ]}
                >
                  <CustomText fontFamily="semiBold" fontSize={16}>
                    {getInitials(userData?.user.fullName!)}
                  </CustomText>
                </View>
                <CustomText fontFamily="semiBold" fontSize={12}>
                  You
                </CustomText>
              </View>

              <View>
                <CustomIcon
                  Icon={ICONS.PuzzleIcon}
                  width={horizontalScale(60)}
                  height={verticalScale(60)}
                />
                {data?.relationshipType && (
                  <CustomText
                    fontSize={10}
                    style={{ textAlign: "center" }}
                    fontFamily="bold"
                  >
                    {capitalizeFirstLetter(data?.relationshipType)}
                  </CustomText>
                )}
              </View>

              <View style={styles.avatarWrapper}>
                <View
                  style={[
                    styles.avatarBorder,
                    {
                      width: verticalScale(49),
                      height: verticalScale(49),
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#ffffff1f",
                    },
                  ]}
                >
                  <CustomText fontFamily="semiBold" fontSize={16}>
                    {partner?.firstName.charAt(0)! +
                      partner?.lastName.charAt(0)!}
                  </CustomText>
                </View>
                <CustomText
                  fontFamily="semiBold"
                  fontSize={12}
                  style={{ textAlign: "center" }}
                >
                  {partner?.firstName + " " + partner?.lastName}
                </CustomText>
              </View>
            </View>

            {/* Compatibility Label */}
            <PrimaryButton
              bgColor={[PALETTE.fireGradient.start, PALETTE.fireGradient.end]}
              title={data?.result.overallCompatibilityLabel!}
              onPress={() => {}}
              gradientStyle={styles.compatibilityLabelButton}
              isArrowIcon={false}
            />

            {/* --- NEW: Tabs Selector --- */}
            <View style={styles.tabSelectorContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === TABS.COMPATIBILITY && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab(TABS.COMPATIBILITY)}
              >
                <CustomText
                  fontSize={14}
                  fontFamily="semiBold"
                  color={PALETTE.white}
                >
                  {TABS.COMPATIBILITY}
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === TABS.DAILY_GUIDANCE && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab(TABS.DAILY_GUIDANCE)}
              >
                <CustomText
                  fontSize={14}
                  fontFamily="semiBold"
                  color={PALETTE.white}
                >
                  {TABS.DAILY_GUIDANCE}
                </CustomText>
              </TouchableOpacity>
            </View>

            {/* --- Render content based on activeTab --- */}
            {activeTab === TABS.COMPATIBILITY ? (
              <CompatibilityContent />
            ) : (
              <DailyGuidanceContent />
            )}
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

      {/* Delete Profile Modal (Unchanged) */}
      <Modal
        visible={isDeleteProfileModal}
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
                Are you sure you want to delete this profile?
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
                isArrowIcon={false}
                onPress={handleDeleteProfile}
                style={{ width: wp(40) }}
                isLoading={isDeleting}
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
    </ImageBackground>
  );
};

export default CompatibilityDetails;
