import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AVATARS from "../assets/avatars";
import ICONS from "../assets/Icons";
import { useAppSelector } from "../redux/store";
import { PALETTE } from "../utils/Colors";
import { getInitials } from "../utils/Helpers";
import {
  horizontalScale,
  isAndroid,
  verticalScale,
  wp,
} from "../utils/Metrics";
import CustomIcon from "./CustomIcon";
import { CustomText } from "./CustomText";

type Tab = {
  name: string;
  icon: any;
  activIcon?: any;
  route: string;
};

const BottomTabBar: FC<BottomTabBarProps> = ({ state, navigation }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index].name;

  const { userData } = useAppSelector((state) => state.user);

  const tabs: Tab[] = [
    {
      name: "Home",
      icon: ICONS.HomeIcon,
      route: "homeTab",
    },
    {
      name: "Journal",
      icon: ICONS.JournalIcon,
      route: "journalTab",
    },
    {
      name: "Bond",
      icon: ICONS.BondIcon,
      route: "bondTab",
    },
    {
      name: "Guide",
      icon: ICONS.SupportIcon,
      route: "supportTab",
    },
    {
      name: "Profile",
      icon: AVATARS[
        (userData?.user?.image as keyof typeof AVATARS) || "Avatar1"
      ],
      route: "profileTab",
    },
  ];

  const handleTabPress = useCallback(
    (tab: Tab) => {
      if (currentRoute !== tab.route) {
        if (["journalTab", "bondTab", "profileTab"].includes(tab.route)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: tab.route,
                  state: { routes: [{ name: tab.route.replace("Tab", "") }] },
                },
              ],
            })
          );
        } else {
          navigation.navigate(tab.route as never);
        }
      }
    },
    [navigation, currentRoute]
  );

  const renderTab = useCallback(
    ({ item }: { item: Tab }) => {
      const isActive = currentRoute === item.route;
      const IconComponent =
        isActive && item.activIcon ? item.activIcon : item.icon;

      return (
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabPress(item)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={
              isActive
                ? [PALETTE.waterGradient.start, PALETTE.waterGradient.end]
                : ["transparent", "transparent"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              {
                borderRadius: verticalScale(40),
                alignItems: "center",
              },
            ]}
          >
            {item.name === "Profile" ? (
              <View
                style={{
                  borderRadius: verticalScale(40),
                  alignItems: "center",
                  paddingHorizontal: horizontalScale(10),
                  paddingVertical: verticalScale(5),
                }}
              >
                <CustomText color={PALETTE.white}>
                  {getInitials(userData?.user?.fullName!)}
                </CustomText>
              </View>
            ) : (
              <View
                style={{
                  borderRadius: verticalScale(40),
                  alignItems: "center",
                  paddingHorizontal: horizontalScale(10),
                  paddingVertical: verticalScale(5),
                }}
              >
                <CustomIcon Icon={IconComponent} height={20} width={20} />
              </View>
            )}
          </LinearGradient>
          <CustomText
            fontSize={10}
            fontWeight={isActive ? "500" : "400"}
            color={PALETTE.white}
            style={{ opacity: isActive ? 1 : 0.6 }}
          >
            {item.name}
          </CustomText>
        </TouchableOpacity>
      );
    },
    [handleTabPress, currentRoute]
  );

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Hide tab bar only on specific screens like chat
  if (isKeyboardVisible && currentRoute === "chats") {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: verticalScale(isAndroid ? 20 : 10) + insets.bottom },
      ]}
    >
      <FlatList
        data={tabs}
        renderItem={renderTab}
        keyExtractor={(item) => item.route}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabContent}
      />
    </View>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: PALETTE.midnightIndigo,
    paddingTop: verticalScale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: verticalScale(15),
    borderTopRightRadius: verticalScale(15),
    position: "absolute",
    bottom: 0,
    minHeight: verticalScale(70),
  },
  tabWrapper: {
    flex: 1,
  },
  tabBar: {},
  tabContent: {
    flexGrow: 1,
    justifyContent: "space-around",
  },
  tab: {
    alignItems: "center",
    justifyContent: "flex-end",
    alignSelf: "center",
    zIndex: 99,
    gap: verticalScale(5),
    width: wp(100) / 7,
  },
});
