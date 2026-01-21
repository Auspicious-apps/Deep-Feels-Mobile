import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Animated as RNAnimated,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigationMode } from "react-native-navigation-mode";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import ICONS from "../../../assets/Icons";
import IMAGES from "../../../assets/Images";
import CustomIcon from "../../../components/CustomIcon";
import { CustomText } from "../../../components/CustomText";
import FeatureLockedModal from "../../../components/Modals/FeatureLockedModal";
import { KeyboardAvoidingContainer } from "../../../components/KeyboardScrollView";
import {
  setTilesData,
  streamAndSaveMessage,
} from "../../../redux/slices/guideSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import ENDPOINTS from "../../../service/ApiEndpoints";
import { GetTileApiResponse } from "../../../service/ApiResponses/GetTileDataApiResponse";
import { fetchData } from "../../../service/ApiService";
import { PALETTE } from "../../../utils/Colors";
import { horizontalScale, verticalScale } from "../../../utils/Metrics";
import { useThemedStyles } from "./styles";

// Category data for the Guide screen
interface CategoryTile {
  id: string;
  title: string;
  description: string;
}

const categories: CategoryTile[] = [
  {
    id: "ask",
    title: "Ask",
    description: "Start a conversation",
  },
  {
    id: "breathe",
    title: "Breathe",
    description: "Vagus nerve & grounding",
  },
  {
    id: "reflect",
    title: "Reflect",
    description: "Emotional awareness",
  },
  {
    id: "align",
    title: "Align",
    description: "Wellness guidance",
  },
  {
    id: "regulate",
    title: "Regulate",
    description: "Body-based techniques",
  },
];

const CategoryContent = ({
  category,
  tileData,
  isLoadingData,
}: {
  category: CategoryTile;
  tileData: GetTileApiResponse | null;
  isLoadingData: boolean;
}) => {
  if (isLoadingData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color={PALETTE.sacredGold} />
      </View>
    );
  }

  // Error/No Data State
  if (!tileData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: horizontalScale(30),
        }}
      >
        <CustomText
          fontFamily="belganAesthetic"
          fontSize={28}
          color={PALETTE.sacredGold}
          style={{ textAlign: "center", marginBottom: verticalScale(10) }}
        >
          {category.title}
        </CustomText>
        <CustomText
          fontSize={16}
          color={PALETTE.dangerRed}
          style={{ textAlign: "center", lineHeight: 24 }}
        >
          We're having trouble connecting. Failed to retrieve guidance for{" "}
          {category.title}. Please try again later.
        </CustomText>
      </View>
    );
  }

  // Dynamic Content Display (API Response UI)
  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(600)}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: horizontalScale(20),
          paddingVertical: verticalScale(40),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Title with Icon */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: verticalScale(20),
          }}
        >
          <CustomText
            fontFamily="belganAesthetic"
            fontSize={26}
            color={PALETTE.sacredGold}
          >
            {category.title}
          </CustomText>
        </View>

        {/* Main Message/Introduction */}
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: 15,
            padding: horizontalScale(18),
            marginBottom: verticalScale(15),
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.15)",
            gap: verticalScale(10),
          }}
        >
          <CustomText
            fontSize={14}
            fontFamily="regular"
            color={PALETTE.lightSkin}
            style={{ lineHeight: 20, textAlign: "center" }}
          >
            {tileData.message}
          </CustomText>

          <CustomText fontSize={14} color={PALETTE.lightTextColor}>
            Action Step:{" "}
            <CustomText fontSize={14} fontFamily="medium">
              {tileData.actionStep}
            </CustomText>
          </CustomText>
        </View>

        {/* Footer */}
        <CustomText
          fontSize={13}
          fontFamily="regular"
          color={PALETTE.lightTextColor}
          style={{
            textAlign: "center",
          }}
        >
          {tileData.footer}
        </CustomText>
      </ScrollView>
    </Animated.View>
  );
};

const Support = ({ navigation }: any) => {
  const styles = useThemedStyles();
  const dispatch = useAppDispatch();
  const { navigationMode } = useNavigationMode();

  const { userData } = useAppSelector((state) => state.user);
  const [isFeatureLockedModalVisible, setIsFeatureLockedModalVisible] =
    useState(false);

  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryTile | null>(
    categories[0]
  );
  const [isFetchingTileData, setIsFetchingTileData] = useState(false);

  const { messages, isLoading, isSendingMessage, isStreaming, tilesData } =
    useAppSelector((state) => state.guide);

  const currentTileData =
    selectedCategory?.id !== "ask"
      ? tilesData[selectedCategory?.id as keyof typeof tilesData]
      : null;

  const scrollRef = useRef<any>(null);
  const fadeAnims = useRef<{ [key: string]: RNAnimated.Value }>({}).current;

  const handleSendMessage = async (text: string = message) => {
    if (!userData?.user?.hasAllData) {
      setIsFeatureLockedModalVisible(true);
      return;
    }

    if (text.trim() === "" || isSendingMessage) return;

    const userMessage = text.trim();
    setMessage(""); // Clear input field immediately

    // Send message with selected category to backend
    const resultAction = await dispatch(
      streamAndSaveMessage({
        userMessage,
        category: selectedCategory?.id,
      })
    );

    if (streamAndSaveMessage.rejected.match(resultAction)) {
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2:
          (resultAction.payload as string) ||
          "Failed to send message. Please try again.",
      });
    }
  };

  const handleRetry = (failedMessage: string) => {
    handleSendMessage(failedMessage);
  };

  const formatTimestamp = (createdAt: string) => {
    const date = new Date(createdAt);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    return isToday
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const renderCategoryTile = (category: CategoryTile) => {
    const isSelected = selectedCategory?.id === category.id;

    return (
      <TouchableOpacity
        key={category.id}
        activeOpacity={0.8}
        onPress={() => {
          if (!userData?.user?.hasAllData) {
            setIsFeatureLockedModalVisible(true);
            return;
          }
          setSelectedCategory(category);
        }}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 10,
          paddingHorizontal: horizontalScale(15),
          paddingVertical: verticalScale(8),
          borderWidth: 1,
          borderColor: isSelected
            ? PALETTE.sacredGold
            : "rgba(255, 255, 255, 0.2)",
          alignItems: "center",
        }}
      >
        <CustomText
          fontSize={11}
          fontFamily="semiBold"
          color={PALETTE.lightSkin}
        >
          {category.title}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const fetchCategoryTileData = async () => {
    if (!selectedCategory || selectedCategory.id === "ask") return;

    setIsFetchingTileData(true);
    try {
      const response = await fetchData<GetTileApiResponse>(
        `${ENDPOINTS.getTileData}${selectedCategory?.id}`
      );

      if (response.data.data) {
        dispatch(
          setTilesData({
            type: response.data.data.type,
            data: response.data.data,
          })
        );
      }
    } catch (error) {
      console.log(error, "Error gettting tile data");
    } finally {
      setIsFetchingTileData(false);
    }
  };

  useEffect(() => {
    // Only fetch if a non-ask category is selected AND the data is not already in Redux state
    if (
      selectedCategory &&
      selectedCategory.id !== "ask" &&
      !tilesData[selectedCategory.id as keyof typeof tilesData]
    ) {
      fetchCategoryTileData();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    const latestMessageId = latestMessage.id;

    if (!fadeAnims[latestMessageId]) {
      fadeAnims[latestMessageId] = new RNAnimated.Value(0);

      RNAnimated.timing(fadeAnims[latestMessageId], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isStreaming]);

  return (
    <ImageBackground
      source={IMAGES.mainBackground}
      style={styles.backgroundImage}
    >
      <Animated.View entering={FadeIn.duration(1000)} style={{ flex: 1 }}>
        <SafeAreaView
          edges={Platform.select({
            ios: ["top", "bottom", "left", "right"],
          })}
          style={{
            flex: Platform.select({
              android: navigationMode?.isGestureNavigation ? 0.9 : 0.85,
              ios: 0.92,
            }),
          }}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <CustomText
              fontFamily="belganAesthetic"
              fontSize={30}
              color={PALETTE.lightSkin}
            >
              Your Journey Within
            </CustomText>
          </View>

          {/* Category Selection Tiles */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: horizontalScale(10),
              rowGap: verticalScale(10),
              columnGap: horizontalScale(5),
            }}
          >
            {categories.map((category) => renderCategoryTile(category))}
          </View>

          {selectedCategory?.id === "ask" ? (
            Platform.OS === "android" ? (
              <KeyboardAvoidingContainer
                style={{
                  flex: 1,
                  gap: verticalScale(10),
                  paddingHorizontal: horizontalScale(15),
                  paddingBottom: verticalScale(15),
                }}
              >
                <FlatList
                  ref={scrollRef}
                  data={messages || []}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    if (!fadeAnims[item.id]) {
                      fadeAnims[item.id] = new RNAnimated.Value(1);
                    }

                    return (
                      <RNAnimated.View
                        key={item.id}
                        style={[
                          styles.messageBubble,
                          item.isUser
                            ? {
                                ...styles.userMessage,
                                alignSelf: "flex-end",
                                maxWidth: "80%",
                              }
                            : {
                                ...styles.supportMessageContainer,
                                alignSelf: "flex-start",
                                maxWidth: "80%",
                              },
                          {
                            marginBottom: verticalScale(10),
                            opacity: fadeAnims[item.id],
                          },
                        ]}
                      >
                        {!item.isUser && (
                          <LinearGradient
                            colors={[
                              PALETTE.waterGradient.start,
                              PALETTE.waterGradient.end,
                            ]}
                            style={styles.supportMessage}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <CustomText
                              style={{
                                paddingHorizontal: horizontalScale(12),
                                paddingVertical: verticalScale(8),
                              }}
                              fontSize={14}
                              fontFamily="medium"
                              color={PALETTE.white}
                            >
                              {item.text ||
                                (isStreaming && item.text === ""
                                  ? "Typing..."
                                  : "")}
                            </CustomText>
                            <CustomText
                              style={{
                                paddingHorizontal: horizontalScale(12),
                                paddingBottom: verticalScale(4),
                                fontSize: 10,
                                color: PALETTE.midnightIndigo,
                              }}
                              fontFamily="regular"
                            >
                              {formatTimestamp(item.createdAt)}
                            </CustomText>
                          </LinearGradient>
                        )}
                        {item.isUser && (
                          <View style={[styles.userMessage]}>
                            <CustomText
                              fontSize={14}
                              fontFamily="medium"
                              style={{
                                paddingHorizontal: horizontalScale(12),
                                paddingVertical: verticalScale(8),
                              }}
                              color={PALETTE.white}
                            >
                              {item.text}
                            </CustomText>
                            <CustomText
                              style={{
                                paddingHorizontal: horizontalScale(12),
                                paddingBottom: verticalScale(4),
                                fontSize: 10,
                              }}
                              fontFamily="regular"
                            >
                              {formatTimestamp(item.createdAt)}
                            </CustomText>
                            {item.isFailed && (
                              <Pressable
                                onPress={() => handleRetry(item.text)}
                                style={{
                                  paddingHorizontal: horizontalScale(12),
                                  paddingBottom: verticalScale(4),
                                }}
                              >
                                <CustomText
                                  style={{
                                    fontSize: 10,
                                    color: PALETTE.dangerRed,
                                  }}
                                >
                                  Retry
                                </CustomText>
                              </Pressable>
                            )}
                          </View>
                        )}
                      </RNAnimated.View>
                    );
                  }}
                  onContentSizeChange={() => {
                    if (scrollRef.current && isStreaming) {
                      scrollRef.current?.scrollToEnd({ animated: true });
                    }
                  }}
                  ListEmptyComponent={() =>
                    !isLoading && (
                      <CustomText
                        style={{
                          textAlign: "center",
                          marginVertical: verticalScale(20),
                        }}
                        fontSize={16}
                        color={PALETTE.lightTextColor}
                      >
                        Start your journey with{" "}
                        {selectedCategory?.title || "guidance"}
                      </CustomText>
                    )
                  }
                  contentContainerStyle={{}}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                />

                <View style={[styles.inputContainer]}>
                  <TextInput
                    maxFontSizeMultiplier={1.3}
                    placeholder="What insight could bring you closer to balance?"
                    placeholderTextColor={PALETTE.PlaceHolderText}
                    style={[
                      styles.textInput,
                      { flex: 1, marginRight: horizontalScale(10) },
                    ]}
                    value={message}
                    multiline
                    numberOfLines={3}
                    onChangeText={setMessage}
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    editable={!isSendingMessage}
                  />
                  <Pressable
                    onPress={() => handleSendMessage()}
                    disabled={isSendingMessage}
                  >
                    {isSendingMessage ? (
                      <ActivityIndicator
                        size="small"
                        color={PALETTE.earthGradient.start}
                      />
                    ) : (
                      <CustomIcon Icon={ICONS.SendIcon} />
                    )}
                  </Pressable>
                </View>
              </KeyboardAvoidingContainer>
            ) : (
              <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: horizontalScale(10),
                    paddingBottom: verticalScale(20),
                    gap: verticalScale(10),
                  }}
                >
                  <FlatList
                    ref={scrollRef}
                    data={messages || []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                      if (!fadeAnims[item.id]) {
                        fadeAnims[item.id] = new RNAnimated.Value(1);
                      }

                      return (
                        <RNAnimated.View
                          key={item.id}
                          style={[
                            styles.messageBubble,
                            item.isUser
                              ? {
                                  ...styles.userMessage,
                                  alignSelf: "flex-end",
                                  maxWidth: "80%",
                                }
                              : {
                                  ...styles.supportMessageContainer,
                                  alignSelf: "flex-start",
                                  maxWidth: "80%",
                                },
                            {
                              marginBottom: verticalScale(10),
                              opacity: fadeAnims[item.id],
                            },
                          ]}
                        >
                          {!item.isUser ? (
                            <LinearGradient
                              colors={[
                                PALETTE.waterGradient.start,
                                PALETTE.waterGradient.end,
                              ]}
                              style={styles.supportMessage}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              <CustomText
                                style={{
                                  paddingHorizontal: horizontalScale(12),
                                  paddingVertical: verticalScale(8),
                                }}
                                fontSize={14}
                                fontFamily="medium"
                                color={PALETTE.white}
                              >
                                {item.text ||
                                  (isStreaming && item.text === ""
                                    ? "Typing..."
                                    : "")}
                              </CustomText>
                              <CustomText
                                style={{
                                  paddingHorizontal: horizontalScale(12),
                                  paddingBottom: verticalScale(4),
                                  fontSize: 10,
                                  color: PALETTE.midnightIndigo,
                                }}
                                fontFamily="regular"
                              >
                                {formatTimestamp(item.createdAt)}
                              </CustomText>
                            </LinearGradient>
                          ) : (
                            <View style={[styles.userMessage]}>
                              <CustomText
                                fontSize={14}
                                fontFamily="medium"
                                style={{
                                  paddingHorizontal: horizontalScale(12),
                                  paddingVertical: verticalScale(8),
                                }}
                                color={PALETTE.white}
                              >
                                {item.text}
                              </CustomText>
                              <CustomText
                                style={{
                                  paddingHorizontal: horizontalScale(12),
                                  paddingBottom: verticalScale(4),
                                }}
                                fontSize={10}
                                fontFamily="regular"
                              >
                                {formatTimestamp(item.createdAt)}
                              </CustomText>
                              {item.isFailed && (
                                <Pressable
                                  onPress={() => handleRetry(item.text)}
                                >
                                  <CustomText
                                    style={{
                                      fontSize: 10,
                                      color: PALETTE.dangerRed,
                                      marginLeft: horizontalScale(10),
                                    }}
                                  >
                                    Retry
                                  </CustomText>
                                </Pressable>
                              )}
                            </View>
                          )}
                        </RNAnimated.View>
                      );
                    }}
                    ListEmptyComponent={() =>
                      !isLoading && (
                        <CustomText
                          style={{
                            textAlign: "center",
                            marginVertical: verticalScale(20),
                          }}
                          fontSize={16}
                          color={PALETTE.lightTextColor}
                        >
                          Start your journey with{" "}
                          {selectedCategory?.title || "guidance"}
                        </CustomText>
                      )
                    }
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingTop: verticalScale(10),
                      paddingBottom: verticalScale(10),
                      paddingHorizontal: horizontalScale(5),
                    }}
                    onContentSizeChange={() => {
                      if (scrollRef.current && isStreaming) {
                        scrollRef.current?.scrollToEnd({ animated: true });
                      }
                    }}
                  />
                  <View style={[styles.inputContainer]}>
                    <TextInput
                      maxFontSizeMultiplier={1.3}
                      placeholder="What insight could bring you closer to balance?"
                      placeholderTextColor={PALETTE.PlaceHolderText}
                      style={[
                        styles.textInput,
                        { flex: 1, marginRight: horizontalScale(10) },
                      ]}
                      value={message}
                      multiline
                      numberOfLines={3}
                      onChangeText={setMessage}
                      autoCapitalize="sentences"
                      autoCorrect={true}
                      editable={!isSendingMessage}
                    />
                    <Pressable
                      onPress={() => handleSendMessage()}
                      disabled={isSendingMessage}
                    >
                      {isSendingMessage ? (
                        <ActivityIndicator
                          size="small"
                          color={PALETTE.earthGradient.start}
                        />
                      ) : (
                        <CustomIcon Icon={ICONS.SendIcon} />
                      )}
                    </Pressable>
                  </View>
                </View>
              </KeyboardAvoidingView>
            )
          ) : (
            <Animated.View
              key={selectedCategory?.id}
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(200)}
              style={{ flex: 1 }}
            >
              <CategoryContent
                category={selectedCategory!}
                tileData={currentTileData}
                isLoadingData={isFetchingTileData}
              />
            </Animated.View>
          )}
        </SafeAreaView>

        <FeatureLockedModal
          isVisible={isFeatureLockedModalVisible}
          onClose={() => setIsFeatureLockedModalVisible(false)}
          onNavigateToProfile={() => {
            setIsFeatureLockedModalVisible(false);
            navigation?.dispatch(
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
          featureName="Wellness Guide"
        />
      </Animated.View>
    </ImageBackground>
  );
};

export default Support;
