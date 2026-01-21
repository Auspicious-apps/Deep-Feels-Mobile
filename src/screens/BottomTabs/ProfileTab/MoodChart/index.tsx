import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import Toast from "react-native-toast-message";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomDropDown from "../../../../components/CustomDropdown";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import ENDPOINTS from "../../../../service/ApiEndpoints";
import { GetMoodChartData } from "../../../../service/ApiResponses/GetMoodChartDataAPiResponse";
import { fetchData } from "../../../../service/ApiService";
import { MoodChartScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { horizontalScale, verticalScale, wp } from "../../../../utils/Metrics";
import { useThemedStyles } from "./styles";

dayjs.extend(customParseFormat);

const emojiImages = {
  Calm: IMAGES.Calm,
  Glowing: IMAGES.Glowing,
  Grateful: IMAGES.Grateful,
  Low: IMAGES.Low,
  Neutral: IMAGES.Neutral,
  Not_Recorded: IMAGES.Not_Recorded,
};

export const getEmoji = (mood: keyof typeof emojiImages) => {
  return emojiImages[mood] || null;
};

const MoodChart: FC<MoodChartScreenProps> = ({ navigation }) => {
  const styles = useThemedStyles();
  const insets = useSafeAreaInsets();

  const [isDateDropdown, setIsDateDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [moodData, setMoodData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /** Generate last 24 months (backwards) */
  const items = Array.from({ length: 24 }, (_, i) =>
    dayjs().subtract(i, "month").format("MMMM YYYY")
  );

  const daysInMonth = selectedDate.daysInMonth();

  /** Create empty month list */
  const daysList = Array.from({ length: daysInMonth }, (_, i) => {
    const dateObj = selectedDate.date(i + 1);
    return {
      date: dateObj.format("DD"),
      day: dateObj.format("ddd").toUpperCase(),
      mood: "Not_Recorded",
      description: `The mood was not recorded`,
    };
  });

  /** Helper for suffixes */
  function getDaySuffix(day: number) {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  /** Fetch API Data */
  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const response = await fetchData<GetMoodChartData[]>(
        ENDPOINTS.getMoodData,
        {
          month: selectedDate.month() + 1, // dayjs months are 0-indexed
          year: selectedDate.year(),
        }
      );
      if (response.data.success) {
        setMoodData(response.data.data);
      }
    } catch (error: any) {
      console.error("Get Moods Chart Data error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  /** Refetch when month/year changes */
  useEffect(() => {
    fetchMoodData();
  }, [selectedDate]);

  /** Merge API data into daysList */
  const mergedList = daysList.map((day) => {
    const match = moodData.find((m) =>
      dayjs(m.date).isSame(selectedDate.date(Number(day.date)), "day")
    );
    return match
      ? {
          date: day.date,
          day: day.day,
          mood: match.mood === "Not Recorded" ? "Not_Recorded" : match.mood,
          description: match.note,
        }
      : day;
  });

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollViewContent,
            {
              paddingBottom: Platform.select({
                android: verticalScale(100),
                ios: insets.top + verticalScale(70),
              }),
              paddingTop: verticalScale(30),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <CustomIcon
              Icon={ICONS.GradientBackButtonIcon}
              height={verticalScale(34)}
              width={verticalScale(34)}
              onPress={() => navigation.goBack()}
            />
            <CustomText
              fontFamily="belganAesthetic"
              fontSize={30}
              color={PALETTE.heading}
              style={{ flex: 1 }}
            >
              Mood Chart
            </CustomText>

            <TouchableOpacity
              onPress={() => setIsDateDropdown(true)}
              style={{
                padding: verticalScale(9),
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(3),
              }}
            >
              <CustomText fontSize={10}>
                {selectedDate.format("MMMM YYYY")}
              </CustomText>
              <CustomIcon Icon={ICONS.DownArrowIcon} height={16} width={16} />
            </TouchableOpacity>
            <CustomDropDown
              isVisible={isDateDropdown}
              onClose={() => setIsDateDropdown(false)}
              items={items}
              selectedItem={selectedDate.format("MMMM YYYY")}
              onSelectItem={(item) => {
                setSelectedDate(dayjs(item, "MMMM YYYY"));
              }}
              title="Select Month & Year"
              width={wp(80)}
            />
          </View>

          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator color={PALETTE.white} />
            </View>
          ) : (
            <FlatList
              data={mergedList}
              contentContainerStyle={{ gap: verticalScale(10) }}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* Left Date Column */}
                  <View
                    style={{
                      width: horizontalScale(40),
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <CustomText fontFamily="semiBold" fontSize={12}>
                      {item.date}
                    </CustomText>
                    <CustomText
                      fontFamily="medium"
                      color={PALETTE.lightTextColor}
                      fontSize={12}
                    >
                      {item.day}
                    </CustomText>

                    {/* Dots (except for last item) */}
                    {index !== mergedList.length - 1 && (
                      <View
                        style={{
                          alignItems: "center",
                          position: "absolute",
                          bottom: -35,
                        }}
                      >
                        {Array.from({ length: 4 }).map((_, dotIndex) => (
                          <View
                            key={dotIndex}
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: "#ffffff1b",
                              marginVertical: 2,
                            }}
                          />
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Right Mood Card */}
                  <View style={{ overflow: "hidden", flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: verticalScale(10),
                        gap: horizontalScale(10),
                      }}
                    >
                      <Image
                        source={getEmoji(item.mood as keyof typeof emojiImages)}
                        style={{
                          width: verticalScale(24),
                          height: verticalScale(24),
                        }}
                      />
                      <View style={{ gap: verticalScale(5), flex: 1 }}>
                        <CustomText fontFamily="semiBold" fontSize={14}>
                          {item.mood === "Not_Recorded"
                            ? "Not Recorded"
                            : item.mood}
                        </CustomText>
                        <CustomText
                          fontFamily="medium"
                          fontSize={10}
                          color={PALETTE.lightTextColor}
                          style={{ flexShrink: 1, flexWrap: "wrap" }}
                        >
                          {item.description}
                        </CustomText>
                      </View>
                    </View>
                    <View style={[styles.cardOverlay]} />
                  </View>
                </View>
              )}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default MoodChart;
