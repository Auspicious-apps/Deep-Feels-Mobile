import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../assets/Icons";
import IMAGES from "../../assets/Images";
import ZODIAC_SIGNS from "../../assets/zodiacSigns";
import CustomIcon from "../../components/CustomIcon";
import { CustomText } from "../../components/CustomText";
import PrimaryButton from "../../components/PrimaryButton";
import TypingLoader from "../../components/TypingLoader";
import { useAppSelector } from "../../redux/store";
import { generateEmotionalProfile } from "../../service/OpenAI";
import { EmotionalProfile } from "../../typings/EmotionalProfile";
import { StarsAndSignsScreenProps } from "../../typings/route";
import { PALETTE } from "../../utils/Colors";
import {
  getLocalStorageData,
  storeLocalStorageData,
} from "../../utils/Helpers";
import { horizontalScale, verticalScale, wp } from "../../utils/Metrics";
import STORAGE_KEYS from "../../utils/Storage";
import { useThemedStyles } from "./styles";

const PredictionCard: FC<{ data: { title: string; content: string } }> = ({
  data,
}) => {
  const styles = useThemedStyles();
  return (
    <View style={styles.predictionCard}>
      <CustomText
        fontSize={14}
        fontFamily="belganAesthetic"
        color={PALETTE.lightSkin}
        style={{ marginBottom: verticalScale(5) }}
      >
        {data.title}
      </CustomText>
      <CustomText fontSize={12} color={PALETTE.white}>
        {data.content}
      </CustomText>
    </View>
  );
};

const dailyGuidanceLabels = [
  "Emotional Connection",
  "Purpose & Flow",
  "Body & Energy",
  "Inner Climate",
  "Environment & Movement",
  "Flow & Timing”",
];

const StarsAndSigns: FC<StarsAndSignsScreenProps> = ({ navigation, route }) => {
  const styles = useThemedStyles();
  const data = route.params.startAndSignsData;
  const predictionData = route.params.dailyPredictionData;
  const isFrom = route.params.isFrom;

  const [expandedSections, setExpandedSections] = useState({
    nervousSystem: false,
    emotional: false,
    relationship: false,
    growth: false,
  });

  const { userData } = useAppSelector((state) => state.user);

  console.log(userData, "USER DATA");

  const [activePredictionIndex, setActivePredictionIndex] = useState(0);
  const [emotionalProfile, setEmotionalProfile] =
    useState<EmotionalProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileAge, setProfileAge] = useState<string>("");

  const cardWidth = wp(85);
  const cardMargin = horizontalScale(15);
  const snapInterval = cardWidth + cardMargin;

  // Check if cached profile is expired (12 hours = 43200000 milliseconds)
  const isProfileExpired = (timestamp: number): boolean => {
    const TWELVE_HOURS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    const now = Date.now();
    return now - timestamp > TWELVE_HOURS;
  };

  // Calculate how old the profile is
  const getProfileAge = (timestamp: number): string => {
    const now = Date.now();
    const diffMs = now - timestamp;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diffMs / (1000 * 60));
      return `Updated ${minutes} min ago`;
    } else if (hours < 12) {
      return `Updated ${hours}h ago`;
    } else {
      return "Refreshing insights...";
    }
  };

  // Manual refresh function
  const handleRefreshProfile = async () => {
    if (!userData?.additionalInfo || isLoadingProfile) return;

    setIsLoadingProfile(true);
    try {
      console.log("Manual refresh: Generating fresh emotional profile");
      const profile = await generateEmotionalProfile(userData.additionalInfo);

      if (profile) {
        setEmotionalProfile(profile);
        await storeLocalStorageData(
          STORAGE_KEYS.EMOTIONAL_PROFILE_CACHE,
          JSON.stringify(profile)
        );

        if (profile.timestamp) {
          setProfileAge(getProfileAge(profile.timestamp));
        }

        Toast.show({
          type: "success",
          text1: "Profile Refreshed",
          text2: "New insights generated successfully",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Unable to Refresh",
          text2: "Please try again later",
        });
      }
    } catch (error) {
      console.error("Error refreshing emotional profile:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to refresh your profile",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Generate emotional profile on mount or when expired
  useEffect(() => {
    const loadEmotionalProfile = async () => {
      if (!userData?.additionalInfo) return;

      setIsLoadingProfile(true);
      try {
        // Check if we have a cached profile first
        const cachedProfileData = await getLocalStorageData(
          STORAGE_KEYS.EMOTIONAL_PROFILE_CACHE
        );

        if (cachedProfileData) {
          const cachedProfile: EmotionalProfile = JSON.parse(cachedProfileData);

          // Check if profile is expired
          if (
            cachedProfile.timestamp &&
            !isProfileExpired(cachedProfile.timestamp)
          ) {
            console.log("Using cached emotional profile");
            setEmotionalProfile(cachedProfile);
            setIsLoadingProfile(false);
            return;
          } else {
            console.log("Cached profile expired, regenerating...");
          }
        }

        // Generate new profile if no cache exists or cache is expired
        console.log("Generating fresh emotional profile");
        const profile = await generateEmotionalProfile(userData.additionalInfo);

        if (profile) {
          setEmotionalProfile(profile);
          // Cache the new profile with timestamp
          await storeLocalStorageData(
            STORAGE_KEYS.EMOTIONAL_PROFILE_CACHE,
            JSON.stringify(profile)
          );
          console.log("New profile generated and cached");

          // Update profile age display
          if (profile.timestamp) {
            setProfileAge(getProfileAge(profile.timestamp));
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Unable to Generate Profile",
            text2: "Please try again later",
          });
        }
      } catch (error) {
        console.error("Error generating emotional profile:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to generate your emotional profile",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadEmotionalProfile();
  }, [userData?.additionalInfo]);

  // Update profile age every minute
  useEffect(() => {
    if (emotionalProfile?.timestamp) {
      setProfileAge(getProfileAge(emotionalProfile.timestamp));

      const interval = setInterval(() => {
        if (emotionalProfile.timestamp) {
          setProfileAge(getProfileAge(emotionalProfile.timestamp));
        }
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [emotionalProfile]);

  const handlePredictionScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    // Calculate the index based on the content offset and the snap interval
    const index = Math.round(offsetX / snapInterval);
    setActivePredictionIndex(index);
  };

  const toggleSection = (sectionName: keyof typeof expandedSections) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [sectionName]: !prevState[sectionName],
    }));
  };

  const zodiacSignIcon =
    ZODIAC_SIGNS[data?.zodiacSign as keyof typeof ZODIAC_SIGNS];

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
      imageStyle={{
        backgroundColor: PALETTE.midnightIndigo,
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={[styles.scrollViewContent]}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Header --- */}
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              {isFrom === "homeScreen" && (
                <CustomIcon
                  Icon={ICONS.GradientBackButtonIcon}
                  height={verticalScale(36)}
                  width={verticalScale(36)}
                  onPress={() => navigation.goBack()}
                />
              )}
              <CustomText
                fontFamily="belganAesthetic"
                fontSize={30}
                color={PALETTE.lightSkin}
                style={{ flexShrink: 1 }}
              >
                Your Unique Profile
              </CustomText>
            </View>
            <View style={{ marginVertical: verticalScale(30) }}>
              <CustomText color={PALETTE.white}>
                Here's a snapshot of your unique emotional blueprint,{" "}
                <CustomText
                  fontSize={16}
                  fontFamily="bold"
                  color={PALETTE.white}
                >
                  {userData?.user?.fullName}!
                </CustomText>
              </CustomText>
            </View>
          </View>

          {isFrom === "homeScreen" && predictionData && (
            <View style={styles.section}>
              <CustomText
                fontSize={18}
                fontFamily="bold"
                color={PALETTE.lightSkin}
              >
                Daily Guidance
              </CustomText>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.predictionCarouselContainer,
                  {
                    paddingLeft: horizontalScale(15),
                    paddingRight: horizontalScale(15),
                  },
                ]}
                decelerationRate="fast"
                snapToInterval={wp(85) + horizontalScale(15)}
                onScroll={handlePredictionScroll}
                snapToAlignment="start"
              >
                {Object.entries(predictionData?.prediction)?.map(
                  ([key, value], index) => (
                    <PredictionCard
                      key={index}
                      data={{
                        title: dailyGuidanceLabels[index],
                        content: value as string,
                      }}
                    />
                  )
                )}
              </ScrollView>
              <View style={styles.predictionDotsContainer}>
                {Object.entries(predictionData?.prediction)?.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.predictionDot,
                      // Style the active dot differently
                      activePredictionIndex === index &&
                        styles.activePredictionDot,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          {/* --- Enhanced Cosmic Snapshot View --- */}
          <View style={styles.section}>
            {/* <CustomText
              fontSize={18}
              fontFamily="bold"
              color={PALETTE.lightSkin}
            >
              Your Cosmic Snapshot
            </CustomText> */}
            {/* <View style={styles.enhancedCard}>
              <View style={styles.cardHeader}>
                <CustomText
                  fontSize={18}
                  fontFamily="belganAesthetic"
                  color={PALETTE.lightSkin}
                >
                  {data?.zodiacSign}
                </CustomText>
                {zodiacSignIcon && (
                  <CustomIcon
                    Icon={zodiacSignIcon}
                    height={verticalScale(40)}
                    width={verticalScale(40)}
                  />
                )}
              </View>
              <View style={styles.signGrid}>
                <View style={styles.signItem}>
                  <CustomText fontSize={12} color={PALETTE.white}>
                    Sun Sign
                  </CustomText>
                  <CustomText
                    fontSize={14}
                    fontFamily="bold"
                    color={PALETTE.lightSkin}
                  >
                    {data?.sunSign}
                  </CustomText>
                </View>
                <View style={styles.signItem}>
                  <CustomText fontSize={12} color={PALETTE.white}>
                    Moon Sign
                  </CustomText>
                  <CustomText
                    fontSize={14}
                    fontFamily="bold"
                    color={PALETTE.lightSkin}
                  >
                    {data?.moonSign}
                  </CustomText>
                </View>
                <View style={styles.signItem}>
                  <CustomText fontSize={12} color={PALETTE.white}>
                    Rising Sign
                  </CustomText>
                  <CustomText
                    fontSize={14}
                    fontFamily="bold"
                    color={PALETTE.lightSkin}
                  >
                    {data?.risingStar}
                  </CustomText>
                </View>
              </View>
            </View> */}
            <View style={styles.keywordContainer}>
              {data?.personalityKeywords?.map(
                (keyword: string, index: number) => (
                  <CustomText
                    key={index}
                    style={styles.keyword}
                    color={PALETTE.white}
                  >
                    {keyword}
                  </CustomText>
                )
              )}
            </View>
          </View>

          {/* --- Enhanced Reflection Prompt Section --- */}

          {/* --- Loading State --- */}
          {isLoadingProfile && (
            <View
              style={[
                styles.section,
                {
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: verticalScale(40),
                },
              ]}
            >
              <CustomText
                fontSize={14}
                color={PALETTE.lightSkin}
                style={{ marginTop: verticalScale(15), textAlign: "center" }}
              >
                Generating your personalized{"\n"}emotional wellness profile...
              </CustomText>
            </View>
          )}

          {/* --- Nervous System Profile Section --- */}
          {!isLoadingProfile && emotionalProfile && (
            <View style={styles.section}>
              <Pressable
                onPress={() => toggleSection("nervousSystem")}
                style={styles.expandableHeader}
              >
                <CustomText
                  fontSize={18}
                  fontFamily="bold"
                  color={PALETTE.lightSkin}
                >
                  Your Nervous System Profile
                </CustomText>
                <CustomIcon
                  Icon={
                    expandedSections.nervousSystem
                      ? ICONS.ChevronUp
                      : ICONS.ChevronDown
                  }
                  height={24}
                  width={24}
                />
              </Pressable>
              {expandedSections.nervousSystem && (
                <View style={styles.expandableContent}>
                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      How You Self-Regulate
                    </CustomText>
                    <View style={styles.separator} />
                    <CustomText fontSize={13} color={PALETTE.white}>
                      {emotionalProfile.nervousSystemProfile.regulationStyle}
                    </CustomText>
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Common Emotional Triggers
                    </CustomText>
                    <View style={styles.separator} />
                    {emotionalProfile.nervousSystemProfile.triggerAwareness.map(
                      (trigger, index) => (
                        <CustomText
                          key={index}
                          fontSize={13}
                          color={PALETTE.white}
                        >
                          • {trigger}
                        </CustomText>
                      )
                    )}
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Soothing Practices for You
                    </CustomText>
                    <View style={styles.separator} />
                    {emotionalProfile.nervousSystemProfile.soothingPractices.map(
                      (practice, index) => (
                        <CustomText
                          key={index}
                          fontSize={13}
                          color={PALETTE.white}
                        >
                          • {practice}
                        </CustomText>
                      )
                    )}
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Your Window of Tolerance
                    </CustomText>
                    <View style={styles.separator} />
                    <CustomText fontSize={13} color={PALETTE.white}>
                      {emotionalProfile.nervousSystemProfile.windowOfTolerance}
                    </CustomText>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* --- Emotional & Somatic Patterns Section --- */}
          {!isLoadingProfile && emotionalProfile && (
            <View style={styles.section}>
              <Pressable
                onPress={() => toggleSection("emotional")}
                style={styles.expandableHeader}
              >
                <CustomText
                  fontSize={18}
                  fontFamily="bold"
                  color={PALETTE.lightSkin}
                >
                  Emotional & Body Patterns
                </CustomText>
                <CustomIcon
                  Icon={
                    expandedSections.emotional
                      ? ICONS.ChevronUp
                      : ICONS.ChevronDown
                  }
                  height={24}
                  width={24}
                />
              </Pressable>
              {expandedSections.emotional && (
                <View style={styles.expandableContent}>
                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      How You Process Emotions
                    </CustomText>
                    <View style={styles.separator} />
                    <CustomText fontSize={13} color={PALETTE.white}>
                      {
                        emotionalProfile.emotionalAndSomaticPatterns
                          .emotionalProcessingStyle
                      }
                    </CustomText>
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Your Stress Response
                    </CustomText>
                    <View style={styles.separator} />
                    <CustomText fontSize={13} color={PALETTE.white}>
                      {
                        emotionalProfile.emotionalAndSomaticPatterns
                          .stressResponsePattern
                      }
                    </CustomText>
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Where You Hold Emotions
                    </CustomText>
                    <View style={styles.separator} />
                    <CustomText fontSize={13} color={PALETTE.white}>
                      {
                        emotionalProfile.emotionalAndSomaticPatterns
                          .somaticPatterns
                      }
                    </CustomText>
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Body Signals to Notice
                    </CustomText>
                    <View style={styles.separator} />
                    {emotionalProfile.emotionalAndSomaticPatterns.bodySignals.map(
                      (signal, index) => (
                        <CustomText
                          key={index}
                          fontSize={13}
                          color={PALETTE.white}
                        >
                          • {signal}
                        </CustomText>
                      )
                    )}
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Grounding Anchors
                    </CustomText>
                    <View style={styles.separator} />
                    {emotionalProfile.emotionalAndSomaticPatterns.groundingAnchors.map(
                      (anchor, index) => (
                        <CustomText
                          key={index}
                          fontSize={13}
                          color={PALETTE.white}
                        >
                          • {anchor}
                        </CustomText>
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* --- Relationship Patterns Section --- */}
          {!isLoadingProfile && emotionalProfile && (
            <View style={styles.section}>
              <Pressable
                onPress={() => toggleSection("relationship")}
                style={styles.expandableHeader}
              >
                <CustomText
                  fontSize={18}
                  fontFamily="bold"
                  color={PALETTE.lightSkin}
                >
                  Relationship Patterns
                </CustomText>
                <CustomIcon
                  Icon={
                    expandedSections.relationship
                      ? ICONS.ChevronUp
                      : ICONS.ChevronDown
                  }
                  height={24}
                  width={24}
                />
              </Pressable>
              {expandedSections.relationship && (
                <View style={styles.expandableContent}>
                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Attachment Style
                    </CustomText>
                    <View style={styles.separator} />
                    <CustomText fontSize={13} color={PALETTE.white}>
                      {
                        emotionalProfile.relationshipPatterns
                          .attachmentStyleIndicators
                      }
                    </CustomText>
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      How You Communicate Feelings
                    </CustomText>
                    <View style={styles.separator} />
                    <CustomText fontSize={13} color={PALETTE.white}>
                      {
                        emotionalProfile.relationshipPatterns
                          .emotionalCommunicationStyle
                      }
                    </CustomText>
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Boundary Tendencies
                    </CustomText>
                    <View style={styles.separator} />
                    <CustomText fontSize={13} color={PALETTE.white}>
                      {emotionalProfile.relationshipPatterns.boundaryTendencies}
                    </CustomText>
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Finding Safety with Others
                    </CustomText>
                    <View style={styles.separator} />
                    <CustomText fontSize={13} color={PALETTE.white}>
                      {emotionalProfile.relationshipPatterns.coRegulationNeeds}
                    </CustomText>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* --- Growth Areas Section --- */}
          {!isLoadingProfile && emotionalProfile && (
            <View style={styles.section}>
              <Pressable
                onPress={() => toggleSection("growth")}
                style={styles.expandableHeader}
              >
                <CustomText
                  fontSize={18}
                  fontFamily="bold"
                  color={PALETTE.lightSkin}
                >
                  Your Growth Journey
                </CustomText>
                <CustomIcon
                  Icon={
                    expandedSections.growth
                      ? ICONS.ChevronUp
                      : ICONS.ChevronDown
                  }
                  height={24}
                  width={24}
                />
              </Pressable>
              {expandedSections.growth && (
                <View style={styles.expandableContent}>
                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Growing Edges
                    </CustomText>
                    <View style={styles.separator} />
                    {emotionalProfile.growthAreas.growingEdges.map(
                      (edge, index) => (
                        <CustomText
                          key={index}
                          fontSize={13}
                          color={PALETTE.white}
                        >
                          • {edge}
                        </CustomText>
                      )
                    )}
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Self-Compassion Reminders
                    </CustomText>
                    <View style={styles.separator} />
                    {emotionalProfile.growthAreas.selfCompassionReminders.map(
                      (reminder, index) => (
                        <CustomText
                          key={index}
                          fontSize={13}
                          color={PALETTE.white}
                        >
                          • {reminder}
                        </CustomText>
                      )
                    )}
                  </View>

                  <View style={styles.expandedCard}>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={PALETTE.lightSkin}
                    >
                      Integration Practices
                    </CustomText>
                    <View style={styles.separator} />
                    {emotionalProfile.growthAreas.integrationPractices.map(
                      (practice, index) => (
                        <CustomText
                          key={index}
                          fontSize={13}
                          color={PALETTE.white}
                        >
                          • {practice}
                        </CustomText>
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {isFrom === "onboarding" && (
          <PrimaryButton
            title={"Continue"}
            onPress={() => {
              navigation.replace("bottomTabStack", { screen: "homeTab" });
            }}
            gradientStyle={{
              width: wp(90),
              alignSelf: "center",
            }}
            isArrowIcon={false}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default StarsAndSigns;
