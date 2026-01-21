import { CommonActions } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import IMAGES from "../../../assets/Images";
import ZODIAC_SIGNS from "../../../assets/zodiacSigns";
import CustomLoadingView from "../../../components/CustomHomeLoading";
import { CustomText } from "../../../components/CustomText";
import FeatureLockedModal from "../../../components/Modals/FeatureLockedModal";
import LogMoodModal from "../../../components/Modals/LogMoodModal";
import {
  resetHardRefreshHomeData,
  resetRefreshHomeData,
  setHomeData,
  setRefreshHomeData,
  setSelectedMood,
} from "../../../redux/slices/homeSlice";
import { refreshMyJournals } from "../../../redux/slices/journalSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import ENDPOINTS from "../../../service/ApiEndpoints";
import { HomeApiDataResponse } from "../../../service/ApiResponses/GetHomeApiResponse";
import { fetchData, postData } from "../../../service/ApiService";
import { HomeScreenProps } from "../../../typings/route";
import { PALETTE } from "../../../utils/Colors";
import {
  getLocalStorageData,
  storeLocalStorageData,
} from "../../../utils/Helpers";
import { horizontalScale, verticalScale, wp } from "../../../utils/Metrics";
import STORAGE_KEYS from "../../../utils/Storage";
import { useThemedStyles } from "./styles";

export const moodData = [
  {
    name: "Low",
    value: "Low",
    image: IMAGES.Low,
  },
  {
    name: "Neutral",
    value: "Neutral",
    image: IMAGES.Neutral,
  },
  {
    name: "Calm",
    value: "Calm",
    image: IMAGES.Calm,
  },
  {
    name: "Grateful",
    value: "Grateful",
    image: IMAGES.Grateful,
  },
  {
    name: "Glowing",
    value: "Glowing",
    image: IMAGES.Glowing,
  },
];

const MAX_LINES_FOCUS_TEXT = 3; // Define the maximum number of lines for collapsed view

const Home: FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();
  const dispatch = useAppDispatch();

  const { userData } = useAppSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const { homeData, refreshHomeData, selectedMood, hardRefreshHOmeData } =
    useAppSelector((state) => state.home);

  const [isFocusTextExpanded, setIsFocusTextExpanded] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [selectedMoonTab, setSelectedMoonTab] = useState(0);

  const [moodModalTimer, setMoodModalTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const [isFeatureLockedModalVisible, setIsFeatureLockedModalVisible] =
    useState(false);

  const zodiacSignIcon =
    ZODIAC_SIGNS[
      userData?.additionalInfo?.zodiacSign as keyof typeof ZODIAC_SIGNS
    ];

  const [isLogMoodModalVisible, setIsLogMoodModalVisible] =
    useState<boolean>(false);

  const tabData = [{ title: "Grounding Tip" }, { title: "Mantra" }];

  const handleTabPress = (index: number) => {
    setSelectedIndex(index);
  };

  const handleMoodSelect = async (item: { value: string; name: string }) => {
    if (!userData?.user?.hasAllData) {
      setIsFeatureLockedModalVisible(true);
      return;
    }

    dispatch(setSelectedMood(item.value));
    try {
      const response = await postData(ENDPOINTS.mood, {
        mood: item.value,
        description: "Hello",
      });
      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Mood Updated",
          text2: `You selected ${item.name}`,
        });
        dispatch(setRefreshHomeData());
        // Trigger journal data refresh to update weeklyMoodReport
        dispatch(refreshMyJournals());
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to update mood.",
      });
    }
  };

  const getHomeData = async (showLoading: boolean) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const localDate = new Date();
      const localISOString = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, -1);
      const response = await fetchData<HomeApiDataResponse>(
        `${ENDPOINTS.getHomeData}?date=${encodeURIComponent(localISOString)}`
      );

      if (response.data.success) {
        dispatch(setHomeData(response.data.data));
        if (response.data.data.mood) {
          dispatch(setSelectedMood(response.data.data.mood.mood));
        }
        dispatch(resetRefreshHomeData());
        dispatch(resetHardRefreshHomeData());
      }
    } catch (error: any) {
      console.error("Get Home Data error:", error);
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
    if (!homeData) {
      getHomeData(true);
    }
  }, []);

  useEffect(() => {
    if (homeData && homeData.moodNotSet) {
      // Create an async function to handle the storage check
      const checkAndShowModal = async () => {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const lastShownDate = await getLocalStorageData(
          STORAGE_KEYS.MOOD_LOG_KEY
        );

        // 2. ONLY PROCEED if the modal hasn't been shown today
        if (lastShownDate !== today) {
          // Set a timer to show the modal after a 5-second delay
          const timer = setTimeout(async () => {
            setIsLogMoodModalVisible(true);
            const today = new Date().toISOString().split("T")[0];
            await storeLocalStorageData(STORAGE_KEYS.MOOD_LOG_KEY, today);
          }, 10000); // 5-second delay

          // Store the timer reference to clear it later
          setMoodModalTimer(timer);
        }
      };

      checkAndShowModal();
    }

    // Cleanup function to clear the timer when the component unmounts or dependencies change
    return () => {
      if (moodModalTimer) {
        clearTimeout(moodModalTimer);
        setMoodModalTimer(null);
      }
    };
  }, [homeData]);

  useEffect(() => {
    if (refreshHomeData && refreshHomeData > 0) {
      getHomeData(false);
    }
  }, [refreshHomeData]);

  useEffect(() => {
    if (hardRefreshHOmeData && hardRefreshHOmeData > 0) {
      getHomeData(true);
    }
  }, [hardRefreshHOmeData]);

  const reflectionText =
    homeData?.dailyReflection?.transitReflections[0]?.reflection;
  const showReadMore = reflectionText && reflectionText.length > 200;

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
      imageStyle={{
        backgroundColor: PALETTE.midnightIndigo,
      }}
    >
      <SafeAreaView style={[styles.safeAreaContainer]}>
        {isLoading ? (
          <CustomLoadingView insets={insets} />
        ) : (
          <Animated.View entering={FadeIn.duration(1500)} style={{ flex: 1 }}>
            <ScrollView
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
                  Hello {userData?.user?.fullName.split(" ")[0]},
                </CustomText>
                <CustomText
                  fontFamily="belganAesthetic"
                  fontSize={20}
                  color={PALETTE.lightSkin}
                >
                  How are you feeling today?
                </CustomText>
                <CustomText
                  fontSize={14}
                  color={PALETTE.white}
                  style={{ marginTop: verticalScale(10) }}
                >
                  Let’s begin with your emotional insight for the day.
                </CustomText>
              </View>

              {/* <View style={styles.section}> */}
              {/* <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    rowGap: verticalScale(10),
                  }}
                >
                  <CustomText
                    fontSize={18}
                    fontFamily="bold"
                    color={PALETTE.lightSkin}
                  >
                    Your Emotional Snapshot
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
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        if (userData?.additionalInfo) {
                          navigation.navigate("starsAndSigns", {
                            startAndSignsData: userData?.additionalInfo,
                            isFrom: "homeScreen",
                            dailyPredictionData:
                              homeData?.dailyReflection?.dailyPrediction,
                          });
                        }
                      }}
                      style={[styles.tab, { zIndex: 101 }]}
                    >
                      <CustomText
                        fontSize={12}
                        fontFamily="semiBold"
                        color={PALETTE.white}
                      >
                        View details
                      </CustomText>
                    </TouchableOpacity>
                  </LinearGradient>
                </View> */}
              {/* <View style={styles.enhancedCard}>
                  <View style={styles.cardHeader}>
                    <CustomText
                      fontSize={18}
                      fontFamily="belganAesthetic"
                      color={PALETTE.lightSkin}
                    >
                      {userData?.additionalInfo?.zodiacSign}
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
                        {userData?.additionalInfo?.sunSign}
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
                        {userData?.additionalInfo?.moonSign}
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
                        {userData?.additionalInfo?.risingStar}
                      </CustomText>
                    </View>
                  </View>
                </View> */}
              {/* </View> */}

              {/* Personal Focus Card */}
              {reflectionText && (
                <View
                  style={{
                    overflow: "hidden",
                    width: wp(100) - verticalScale(30),
                    alignSelf: "center",
                  }}
                >
                  <View
                    style={{
                      padding: verticalScale(12),
                      gap: verticalScale(10),
                    }}
                  >
                    <CustomText fontSize={12} color={PALETTE.lightTextColor}>
                      Daily Insights
                    </CustomText>
                    <CustomText fontSize={12} color={"#E1E6F2"}>
                      Use this reflection to help your nervous system settle and
                      stay present.
                    </CustomText>

                    <CustomText
                      fontSize={14}
                      fontFamily="medium"
                      // Conditionally set the number of lines
                      numberOfLines={
                        isFocusTextExpanded ? 0 : MAX_LINES_FOCUS_TEXT
                      }
                    >
                      {reflectionText}
                    </CustomText>

                    {showReadMore && (
                      <CustomText
                        onPress={() =>
                          setIsFocusTextExpanded(!isFocusTextExpanded)
                        }
                        fontSize={12}
                        fontFamily="semiBold"
                        color={PALETTE.sacredGold}
                        style={{
                          textDecorationLine: "underline",
                          alignSelf: "flex-end",
                          zIndex: 1000,
                        }}
                      >
                        {isFocusTextExpanded ? "Read Less" : "Read More"}
                      </CustomText>
                    )}

                    <CustomText fontSize={12} color={PALETTE.lightTextColor}>
                      Wellness Tip:{" "}
                      <CustomText fontSize={14} fontFamily="medium">
                        {
                          homeData?.dailyReflection?.transitReflections[0]
                            ?.keyAction
                        }
                      </CustomText>
                    </CustomText>
                  </View>
                  <View style={[styles.prfileCardOverlay]} />
                </View>
              )}

              {/* Moon Backdrop Card (Rest of the component remains the same) */}
              <View
                style={{
                  overflow: "hidden",
                  width: wp(100) - verticalScale(30),
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    padding: verticalScale(12),
                    gap: verticalScale(10),
                  }}
                >
                  {/* <CustomText fontSize={12} color={PALETTE.lightTextColor}>
                    Moon Backdrop:{" "}
                    <CustomText
                      fontSize={12}
                      fontFamily="bold"
                      color={PALETTE.white}
                    >
                      {homeData?.dailyReflection?.result?.moon_phase}
                    </CustomText>
                  </CustomText> */}

                  <View
                    style={{
                      gap: verticalScale(10),
                      zIndex: 100,
                      padding: verticalScale(12),
                    }}
                  >
                    <View style={styles.tabContainer}>
                      {["Energy", "Reflection"].map((tab, index) => (
                        <LinearGradient
                          key={tab}
                          colors={
                            selectedMoonTab === index
                              ? [
                                  PALETTE.waterGradient.start,
                                  PALETTE.waterGradient.end,
                                ]
                              : ["transparent", "transparent"]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            borderRadius: verticalScale(20),
                            overflow: "hidden",
                          }}
                        >
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setSelectedMoonTab(index)}
                            style={[styles.tab, { zIndex: 101 }]}
                          >
                            <CustomText
                              fontSize={12}
                              fontFamily="semiBold"
                              color={
                                selectedMoonTab === index
                                  ? PALETTE.white
                                  : PALETTE.lightTextColor
                              }
                            >
                              {tab}
                            </CustomText>
                          </TouchableOpacity>
                        </LinearGradient>
                      ))}
                    </View>

                    {selectedMoonTab === 0 && (
                      <CustomText fontSize={14} style={{ textAlign: "center" }}>
                        {homeData?.dailyReflection?.result?.significance}
                      </CustomText>
                    )}
                    {selectedMoonTab === 1 && (
                      <CustomText fontSize={14} style={{ textAlign: "center" }}>
                        {homeData?.dailyReflection?.result?.report}
                      </CustomText>
                    )}
                  </View>
                </View>
                <View style={[styles.prfileCardOverlay]} />
              </View>

              <View
                style={{
                  overflow: "hidden",
                  width: wp(100) - verticalScale(30),
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    gap: verticalScale(10),
                    zIndex: 100,
                    padding: verticalScale(12),
                  }}
                >
                  <View style={styles.tabContainer}>
                    {tabData.map((tab, index) => (
                      <LinearGradient
                        key={tab.title}
                        colors={
                          selectedIndex === index
                            ? [
                                PALETTE.waterGradient.start,
                                PALETTE.waterGradient.end,
                              ]
                            : ["transparent", "transparent"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          borderRadius: verticalScale(20),
                          overflow: "hidden",
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => handleTabPress(index)}
                          style={[styles.tab, { zIndex: 101 }]}
                        >
                          <CustomText
                            fontSize={12}
                            fontFamily="semiBold"
                            color={
                              selectedIndex === index
                                ? PALETTE.white
                                : PALETTE.lightTextColor
                            }
                          >
                            {tab.title}
                          </CustomText>
                        </TouchableOpacity>
                      </LinearGradient>
                    ))}
                  </View>

                  {selectedIndex === 0 && (
                    <CustomText fontSize={14} style={{ textAlign: "center" }}>
                      {homeData?.dailyReflection?.groundingTip}
                    </CustomText>
                  )}
                  {selectedIndex === 1 && (
                    <CustomText fontSize={14} style={{ textAlign: "center" }}>
                      {homeData?.dailyReflection?.mantra}
                    </CustomText>
                  )}

                  <CustomText
                    onPress={() => {
                      navigation.navigate("journalTab", {
                        screen: "journal",
                        params: {},
                      });
                    }}
                    fontSize={12}
                    color={PALETTE.sacredGold}
                    style={{
                      textDecorationLine: "underline",
                      textAlign: "center",
                    }}
                  >
                    Write In Your Journal
                  </CustomText>
                </View>
                <View style={[styles.prfileCardOverlay, { zIndex: 99 }]} />
              </View>

              {/* Selec Your Mood  */}
              <View
                style={{
                  overflow: "hidden",
                  width: wp(100) - verticalScale(30),
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    padding: verticalScale(12),
                    gap: verticalScale(10),
                    zIndex: 100,
                  }}
                >
                  <CustomText fontFamily="semiBold" fontSize={14}>
                    How are you feeling today?
                  </CustomText>
                  <CustomText fontSize={12} color={"#E1E6F2"}>
                    Take a mindful pause and notice your current state before
                    selecting.
                  </CustomText>

                  <FlatList
                    data={moodData}
                    horizontal
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => {
                      const isSelected = selectedMood === item.value;

                      return (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => handleMoodSelect(item)}
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            // width: (wp(100) - verticalScale(50)) / 5,
                          }}
                        >
                          <View
                            style={{
                              borderRadius: 100,
                              borderWidth: 1,
                              borderColor: isSelected
                                ? "#858FFF"
                                : "transparent",
                              padding: verticalScale(10),
                            }}
                          >
                            <Image
                              source={item.image}
                              style={{
                                width: verticalScale(24),
                                height: verticalScale(24),
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                          <CustomText
                            fontSize={14}
                            color={isSelected ? PALETTE.white : PALETTE.heading}
                            style={{ marginTop: verticalScale(5) }}
                          >
                            {item.name}
                          </CustomText>
                        </TouchableOpacity>
                      );
                    }}
                    contentContainerStyle={{
                      width: wp(100) - verticalScale(30),
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      paddingHorizontal: horizontalScale(10),
                    }}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={verticalScale(80)}
                    decelerationRate="fast"
                    initialNumToRender={5}
                    windowSize={5}
                  />
                </View>
                <View style={[styles.prfileCardOverlay]} />
              </View>
            </ScrollView>
          </Animated.View>
        )}
        {!isLoading && userData?.user.hasAllData && (
          <LogMoodModal
            isVisible={isLogMoodModalVisible}
            setIsVisible={setIsLogMoodModalVisible}
          />
        )}
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
          featureName="Daily Guidance"
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Home;
