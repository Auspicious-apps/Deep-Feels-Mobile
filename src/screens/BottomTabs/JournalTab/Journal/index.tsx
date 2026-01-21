import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
  RefreshControl,
  Animated as RNAnimated,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import CreateJournalNameModal from "../../../../components/Modals/CreateJournalNameModal";
import UnlockJournalWithPasswordModal from "../../../../components/Modals/UnlockJournalWithPasswordModal";
import {
  appendDailyReflectionData,
  appendMyJournalsData,
  markInitialLoadingForMyJournal,
  setDailyReflectionData,
  setIsLoading,
  setLoadingMoreDailyReflections,
  setLoadingMoreMyJournals,
  setMyJournalsData,
  setWeeklyMoodReport,
} from "../../../../redux/slices/journalSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import ENDPOINTS from "../../../../service/ApiEndpoints";
import { GetDailyRoutineApiResponse } from "../../../../service/ApiResponses/GetDailyRoutiineListApiResponse";
import { MyJournalsApiResponse } from "../../../../service/ApiResponses/GetMyJournalsApiResponse";
import { fetchData } from "../../../../service/ApiService";
import { JournalScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { getLocalStorageData } from "../../../../utils/Helpers";
import { verticalScale } from "../../../../utils/Metrics";
import STORAGE_KEYS from "../../../../utils/Storage";
import { useThemedStyles } from "./styles";

// Extend dayjs with dayOfYear plugin
dayjs.extend(dayOfYear);

const Journal: FC<JournalScreenProps> = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();
  const dispatch = useAppDispatch();

  // Access all state from Redux store
  const {
    isLoading,
    myJournalsList,
    myJournalsPage,
    myJournalsLimit,
    myJournalsTotalPages,
    loadingMoreMyJournals,
    dailyReflectionList,
    dailyReflectionPage,
    dailyReflectionLimit,
    dailyReflectionTotalPages,
    loadingMoreDailyReflections,
    refreshMyjournal,
    initialMyJournalLoading,
    weeklyMoodReport,
  } = useAppSelector((state) => state.journal);

  const { userData } = useAppSelector((state) => state.user);

  const [showJournalLock, setShowJournalLock] = useState(false);

  const [isCreateJournalModal, setIsCreateJournalModal] = useState(false);

  const [refreshingMyJournals, setRefreshingMyJournals] = useState(false);
  const [refreshingDailReflections, setRefreshingDailReflections] =
    useState(false);

  const tabData = [
    // { title: "Daily Reflection" },
    { title: "My Journals" },
  ];

  const fadeAnim = useRef(tabData.map(() => new RNAnimated.Value(0))).current;

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Daily prompts rotation
  const dailyPrompts = [
    "Where in your body do you feel today's emotions the most?",
    "What does calm feel like for you right now?",
    "If your heart could speak, what would it say?",
    "How are your emotions guiding you toward growth?",
    "What feeling is asking for your attention today?",
    "Where do you notice tension in your body right now?",
    "What would it feel like to let go of what's weighing on you?",
  ];

  // Get daily prompt based on day of year
  const getDailyPrompt = () => {
    const dayOfYear = dayjs().dayOfYear();
    return dailyPrompts[dayOfYear % dailyPrompts.length];
  };

  // Breathing animation
  const breathingScale = useSharedValue(1);

  useEffect(() => {
    // Gentle breathing animation
    breathingScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 3000 }), // Inhale 3 seconds
        withTiming(1, { duration: 4000 }) // Exhale 4 seconds
      ),
      -1,
      false
    );
  }, []);

  const breathingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingScale.value }],
  }));

  const onContinueCreateJournal = (title: string) => {
    navigation.navigate("journalDetails", {
      isNew: true,
      type: "myJournal",
      title,
    });
    setIsCreateJournalModal(false);
  };

  const handleTabPress = (index: number) => {
    setSelectedIndex(index);
  };

  const renderDailyReflection = () => {
    return (
      <View style={{ alignSelf: "center" }}>
        <FlatList
          data={dailyReflectionList}
          refreshControl={
            <RefreshControl
              refreshing={refreshingDailReflections}
              onRefresh={() => getDailyReflectionData(false)}
            />
          }
          numColumns={2}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={[styles.card]}
                onPress={() => {
                  navigation.navigate("journalDetails", {
                    type: "dailyRoutine",
                    isNew: false,
                    title: item.title,
                    id: item._id,
                  });
                }}
              >
                <CustomText fontSize={10} style={styles.date}>
                  {dayjs(item.date).format("DD MMM")}
                </CustomText>
                <CustomText fontSize={14} fontFamily="semiBold">
                  {item.title}
                </CustomText>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item._id}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ gap: verticalScale(10) }}
          ListFooterComponent={() => {
            if (
              dailyReflectionPage === dailyReflectionTotalPages ||
              dailyReflectionTotalPages === 0
            ) {
              return null;
            }

            return (
              <View
                style={{ padding: verticalScale(15), alignItems: "center" }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: loadingMoreDailyReflections
                      ? "transparent"
                      : PALETTE.mysticPurple,
                    paddingVertical: verticalScale(8),
                    paddingHorizontal: verticalScale(20),
                    borderRadius: verticalScale(10),
                  }}
                  onPress={fetchMoreDailyreflections}
                  disabled={loadingMoreDailyReflections}
                >
                  {loadingMoreDailyReflections ? (
                    <ActivityIndicator size={"small"} />
                  ) : (
                    <CustomText fontSize={12} color={PALETTE.white}>
                      Load More
                    </CustomText>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  };

  const fetchMoreDailyreflections = async () => {
    if (loadingMoreDailyReflections) return;
    dispatch(setLoadingMoreDailyReflections(true));

    try {
      const response = await fetchData<GetDailyRoutineApiResponse>(
        ENDPOINTS.getDailyReflection,
        {
          page: dailyReflectionPage + 1,
          limit: dailyReflectionLimit,
        }
      );

      if (response.data.success) {
        dispatch(
          appendDailyReflectionData({
            reflections: response.data.data.reflections,
            page: response.data.data.pagination.page,
          })
        );
      }
    } catch (error: any) {
      console.error("Fetch more daily reflections error:", error);
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2: error.message || "Failed to load more reflections.",
      });
    } finally {
      dispatch(setLoadingMoreDailyReflections(false));
    }
  };

  const renderMyJournals = () => {
    return (
      <View style={{ alignSelf: "center", marginTop: verticalScale(10) }}>
        <FlatList
          data={[
            {
              _id: "placeholder",
              userId: "placeholder",
              date: "2025-08-26T06:59:22.283Z",
              title: "My First Journal",
              content: "",
              createdAt: "2025-08-26T06:59:22.288Z",
              updatedAt: "2025-08-26T06:59:22.288Z",
              __v: 0,
            },
            ...myJournalsList,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshingMyJournals}
              onRefresh={() => getMyJournalData(false)}
            />
          }
          numColumns={2}
          renderItem={({ item }) => {
            if (item._id === "placeholder") {
              return (
                <TouchableOpacity
                  style={[
                    styles.card,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: PALETTE.celestialBlue,
                    },
                  ]}
                  onPress={() => setIsCreateJournalModal(true)}
                >
                  <CustomIcon
                    Icon={ICONS.CelestialBluePlusICon}
                    height={16}
                    width={16}
                  />
                  <CustomText
                    fontSize={14}
                    fontFamily="semiBold"
                    style={{ textAlign: "center" }}
                    color={PALETTE.celestialBlue}
                  >
                    Create New Journal
                  </CustomText>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                style={[styles.card]}
                onPress={() => {
                  navigation.navigate("journalDetails", {
                    isNew: false,
                    type: "myJournal",
                    id: item._id,
                    title: item.title,
                  });
                }}
              >
                <CustomText fontSize={10} style={styles.date}>
                  {dayjs(item.date).format("DD MMM")}
                </CustomText>
                <CustomText fontSize={14} fontFamily="semiBold">
                  {item.title}
                </CustomText>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item._id}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ gap: verticalScale(10) }}
          ListFooterComponent={() => {
            if (
              myJournalsPage === myJournalsTotalPages ||
              myJournalsTotalPages === 0
            ) {
              return null;
            }
            return (
              <View
                style={{ padding: verticalScale(15), alignItems: "center" }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: loadingMoreMyJournals
                      ? "transparent"
                      : PALETTE.mysticPurple,
                    paddingVertical: verticalScale(8),
                    paddingHorizontal: verticalScale(20),
                    borderRadius: verticalScale(10),
                  }}
                  onPress={fetchMoreMyJournals}
                  disabled={loadingMoreMyJournals}
                >
                  {loadingMoreMyJournals ? (
                    <ActivityIndicator size={"small"} />
                  ) : (
                    <CustomText fontSize={12} color={PALETTE.white}>
                      Load More
                    </CustomText>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  };

  const fetchMoreMyJournals = async () => {
    if (loadingMoreMyJournals) return;
    dispatch(setLoadingMoreMyJournals(true));

    try {
      const response = await fetchData<MyJournalsApiResponse>(
        ENDPOINTS.getMyJournalList,
        {
          page: myJournalsPage + 1,
          limit: myJournalsLimit,
        }
      );

      if (response.data.success) {
        dispatch(
          appendMyJournalsData({
            journals: response.data.data.journals.journals,
            page: response.data.data.journals.pagination.page,
          })
        );
      }
    } catch (error: any) {
      console.error("Fetch more journals error:", error);
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2: error.message || "Failed to load more journals.",
      });
    } finally {
      dispatch(setLoadingMoreMyJournals(false));
    }
  };

  const getMyJournalData = async (showLoading: boolean) => {
    if (showLoading) {
      dispatch(setIsLoading(true));
    }
    try {
      const response = await fetchData<MyJournalsApiResponse>(
        ENDPOINTS.getMyJournalList,
        {
          page: 1, // Always fetch the first page on initial load
          limit: myJournalsLimit,
        }
      );

      if (response.data.success) {
        dispatch(
          setMyJournalsData({
            journals: response.data.data.journals.journals,
            page: response.data.data.journals.pagination.page,
            limit: response.data.data.journals.pagination.limit,
            totalPages: response.data.data.journals.pagination.totalPages,
          })
        );
        if (response.data.data.dailyMoodSummary) {
          dispatch(
            setWeeklyMoodReport(response.data.data.dailyMoodSummary.summary)
          );
        }
        dispatch(markInitialLoadingForMyJournal());
      }
    } catch (error: any) {
      console.error("Get My Journal Data error:", error);
      if (error.message.includes("No matching document found for id")) {
      } else {
        Toast.show({
          type: "error",
          text1: "Oops!",
          text2: error.message || "Something went wrong.",
        });
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const getDailyReflectionData = async (showLoading: boolean) => {
    if (showLoading) {
      dispatch(setIsLoading(true));
    }
    try {
      const response = await fetchData<GetDailyRoutineApiResponse>(
        ENDPOINTS.getDailyReflection,
        {
          page: 1, // Always fetch the first page on initial load
          limit: dailyReflectionLimit,
        }
      );

      if (response.data.success) {
        dispatch(
          setDailyReflectionData({
            reflections: response.data.data.reflections,
            page: response.data.data.pagination.page,
            limit: response.data.data.pagination.limit,
            totalPages: response.data.data.pagination.totalPages,
          })
        );
      }
    } catch (error: any) {
      console.error("Get Daily Routine Data error:", error);
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleMainRefresh = () => {
    if (selectedIndex === 0) {
      // Assuming 'My Journals' is the only current tab (index 0)
      getMyJournalData(false);
    }
    // If the Daily Reflection tab was active, you would call:
    // else if (selectedIndex === 0) {
    //   getDailyReflectionData(false);
    // }
  };

  useEffect(() => {
    if (refreshMyjournal === 0 && !initialMyJournalLoading) {
      getMyJournalData(true);
    } else {
      getMyJournalData(false);
    }
    // if (refreshDailyReflection === 0 && dailyReflectionList.length === 0) {
    //   getDailyReflectionData(true);
    // } else {
    //   getDailyReflectionData(false);
    // }
  }, [refreshMyjournal]);

  useEffect(() => {
    fadeAnim.forEach((anim, i) => {
      RNAnimated.timing(anim, {
        toValue: selectedIndex === i ? 1 : 0.4,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [selectedIndex, fadeAnim]);

  useEffect(() => {
    const checkUnlockStatus = async () => {
      if (userData?.journalEncryption && selectedIndex === 0) {
        const storedTimestamp = await getLocalStorageData(
          STORAGE_KEYS.JOURNAL_UNLOCK_TIMESTAMP_KEY
        );
        // const fiveHoursInMilliseconds = 60 * 1000;
        const fiveHoursInMilliseconds = 5 * 60 * 60 * 1000;
        const now = Date.now();

        if (storedTimestamp) {
          const lastUnlockTime = parseInt(storedTimestamp, 10);

          if (now - lastUnlockTime < fiveHoursInMilliseconds) {
            // Journal is already unlocked within the 5-hour window
            setShowJournalLock(false);
            return;
          }
        }

        // If no timestamp or the 5-hour window has passed, show the lock modal
        setShowJournalLock(true);
      }
    };

    if (isFocused && selectedIndex === 0 && userData) {
      checkUnlockStatus();
    }
  }, [isFocused, selectedIndex, userData]);

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
      imageStyle={{
        backgroundColor: PALETTE.midnightIndigo,
      }}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
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
          refreshControl={
            <RefreshControl
              refreshing={
                selectedIndex === 0
                  ? refreshingMyJournals
                  : refreshingDailReflections
              }
              onRefresh={handleMainRefresh}
            />
          }
        >
          {/* Header with fade-in animation */}
          <Animated.View
            entering={FadeIn.duration(1500)}
            style={styles.headerContainer}
          >
            <View style={{ position: "relative" }}>
              <CustomText
                fontFamily="belganAesthetic"
                fontSize={30}
                color={PALETTE.lightSkin}
              >
                Your Space to Feel
              </CustomText>

              {/* Breathing icon in corner */}
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: -10,
                    right: 0,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: PALETTE.sacredGold,
                    opacity: 0.3,
                  },
                  breathingAnimatedStyle,
                ]}
              />
            </View>
            <View>
              <CustomText
                fontSize={15}
                color={PALETTE.lightSkin}
                fontFamily="belganAesthetic"
                style={{ lineHeight: 22 }}
              >
                {getDailyPrompt()}
              </CustomText>
              <CustomText
                fontSize={14}
                color={PALETTE.white}
                style={{ opacity: 0.9, marginTop: 5 }}
              >
                Write what moves through you today.
              </CustomText>

              {weeklyMoodReport ? (
                <Animated.View
                  key={weeklyMoodReport} // re-triggers animation when text changes
                  entering={FadeIn.duration(600)}
                  exiting={FadeOut.duration(300)}
                  layout={Layout.springify()} // smooth layout transitions
                >
                  <CustomText
                    fontSize={12}
                    color={PALETTE.white}
                    style={{
                      opacity: 1,
                      marginTop: 5,
                      letterSpacing: 0.3,
                      textAlign: "left",
                    }}
                  >
                    {weeklyMoodReport}
                  </CustomText>
                </Animated.View>
              ) : null}
            </View>

            {/* Top Tabs */}
            {/* <View style={styles.tabContainer}>
            {tabData.map((tab, index) => (
              <Animated.View
                key={tab.title}
                style={{ opacity: fadeAnim[index] }}
              >
                <LinearGradient
                  colors={
                    selectedIndex === index
                      ? [PALETTE.waterGradient.start, PALETTE.waterGradient.end]
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
              </Animated.View>
            ))}
          </View> */}

            {/* Selected Tab UI */}
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              selectedIndex === 0 && renderMyJournals()
            )}
            {/* {isLoading ? (
            <ActivityIndicator />
          ) : selectedIndex === 0 ? (
            renderDailyReflection()
          ) : (
            renderMyJournals()
          )} */}
          </Animated.View>
        </ScrollView>

        <CreateJournalNameModal
          isVisible={isCreateJournalModal}
          setIsVisible={setIsCreateJournalModal}
          onContinue={(title) => onContinueCreateJournal(title)}
        />

        {showJournalLock && (
          <UnlockJournalWithPasswordModal
            isVisible={showJournalLock}
            setIsVisible={setShowJournalLock}
            setSelectedIndex={setSelectedIndex}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Journal;
