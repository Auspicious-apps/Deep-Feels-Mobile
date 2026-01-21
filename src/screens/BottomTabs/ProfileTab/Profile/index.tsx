import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import {
  Animated as DefaultAnimated,
  FlatList,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";
import ICONS from "../../../../assets/Icons";
import IMAGES from "../../../../assets/Images";
import CustomIcon from "../../../../components/CustomIcon";
import { CustomText } from "../../../../components/CustomText";
import DeleteAccountModal from "../../../../components/Modals/DeleteAccountModal";
import LogoutModal from "../../../../components/Modals/LogoutModal";
import { clearMessages } from "../../../../redux/slices/guideSlice";
import { setHomeData } from "../../../../redux/slices/homeSlice";
import { resetJournalData } from "../../../../redux/slices/journalSlice";
import { resetUser } from "../../../../redux/slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import { ProfileScreenProps } from "../../../../typings/route";
import { PALETTE } from "../../../../utils/Colors";
import { deleteLocalStorageData, getInitials } from "../../../../utils/Helpers";
import { hp, verticalScale } from "../../../../utils/Metrics";
import STORAGE_KEYS from "../../../../utils/Storage";
import { useThemedStyles } from "./styles";

interface ProfileOption {
  id: string;
  title: string;
  icon: React.FC<SvgProps>;
  routeName: string;
}

const ALL_PROFILE_OPTIONS: ProfileOption[] = [
  {
    id: "1",
    title: "Your Blueprint",
    icon: ICONS.PlanetIconWithBg,
    routeName: "starsAndSigns",
  },
  {
    id: "2",
    title: "My Profile",
    icon: ICONS.MyProfileIcon,
    routeName: "myProfile",
  },
  {
    id: "3",
    title: "Change Password",
    icon: ICONS.ChangePasswordIcon,
    routeName: "changePassword",
  },
  {
    id: "4",
    title: "Subscription",
    icon: ICONS.SubscriptionIcon,
    routeName: "subscription",
  },

  {
    id: "5",
    title: "Mood Chart",
    icon: ICONS.MoodChartIcon,
    routeName: "moodChart",
  },
  {
    id: "6",
    title: "Journal Encryption",
    icon: ICONS.JournlEncruptionIcon,
    routeName: "journalEncryption",
  },
  {
    id: "7",
    title: "Invite Friends",
    icon: ICONS.InviteFriendsIcon,
    routeName: "inviteFriend",
  },
  {
    id: "8",
    title: "Our Mission",
    icon: ICONS.OurmissionIcon,
    routeName: "ourMission",
  },
  {
    id: "9",
    title: "Support",
    icon: ICONS.ProfileSupportIcon,
    routeName: "helpForm",
  },
  {
    id: "10",
    title: "Privacy Policy",
    icon: ICONS.PrivacyPolicyIcon,
    routeName: "privacyPolicy",
  },
  {
    id: "11",
    title: "Terms of Service",
    icon: ICONS.TermsOfServiceIcon,
    routeName: "termsOfService",
  },
  {
    id: "12",
    title: "Delete Account and Data",
    icon: ICONS.DeleteIcon,
    routeName: "deleteAccount",
  },
  { id: "13", title: "Logout", icon: ICONS.LogoutIcon, routeName: "logout" },
];

const Profile: FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles();

  const animationValue = useRef(new DefaultAnimated.Value(0)).current;

  const { userData } = useAppSelector((state) => state.user);
  const { homeData } = useAppSelector((state) => state.home);

  const authType = userData?.user.authType;
  const isEmailAuth = authType === "EMAIL";

  const profileOptions: ProfileOption[] = React.useMemo(() => {
    if (isEmailAuth) {
      if (!userData?.user?.hasAllData) {
        return ALL_PROFILE_OPTIONS.filter(
          (option) =>
            option.id !== "2" &&
            option.id !== "4" &&
            option.id !== "5" &&
            option.id !== "6"
        );
      }
      // Return the full list if authenticated by email
      return ALL_PROFILE_OPTIONS;
    } else {
      if (!userData?.user?.hasAllData) {
        return ALL_PROFILE_OPTIONS.filter(
          (option) =>
            option.id !== "2" &&
            option.id !== "4" &&
            option.id !== "5" &&
            option.id !== "6"
        );
      }
      // Filter out 'Change Password' (id: '2') for social sign-in users
      return ALL_PROFILE_OPTIONS.filter((option) => option.id !== "3");
    }
  }, [isEmailAuth, userData]);

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteAcocuntModalVisible, setDeleteAcocuntModalVisible] =
    useState(false);

  const getSectionTitle = (option: ProfileOption) => {
    // "Application" always comes before the first option (My Profile, ID 1)
    if (option.id === "1") {
      return "Application";
    }
    // "Legal & Support" always comes before the "Support" option (ID 9)
    // which is the item immediately following "Our Mission" (ID 8)

    if (isEmailAuth) {
      if (option.id === "8") {
        return "Legal & Support";
      }
    } else {
      if (option.id === "9") {
        return "Legal & Support";
      }
    }

    return null;
  };

  // Memoize the icon component to prevent unnecessary re-renders
  const ZodiacSign = memo(
    ({ signName, index }: { signName: string; index: number }) => (
      <View style={{ overflow: "hidden" }}>
        <View style={styles.zodiacSignContainer}>
          <CustomIcon
            Icon={
              index === 0
                ? ICONS.sunSignIcon
                : index === 1
                ? ICONS.moonSignIcon
                : ICONS.resingSignIcon
            }
            height={verticalScale(12)}
            width={verticalScale(12)}
          />
          <CustomText fontSize={12}>{signName}</CustomText>
        </View>
        <View
          style={[
            styles.overlay,
            {
              opacity: 0.1,
            },
          ]}
        />
      </View>
    )
  );

  const renderProfileCards = ({
    item,
    index,
  }: {
    item: ProfileOption;
    index: number;
  }) => {
    const sectionTitle = getSectionTitle(item);

    return (
      <>
        {sectionTitle && (
          <CustomText
            fontSize={12}
            fontFamily="medium"
            style={{
              // Adjust top margin based on the header type
              marginTop:
                sectionTitle === "Legal & Support"
                  ? verticalScale(20)
                  : verticalScale(10),
              marginBottom: verticalScale(10),
            }}
          >
            {sectionTitle}
          </CustomText>
        )}
        <TouchableOpacity
          onPress={() => {
            if (item.routeName === "logout") {
              setLogoutModalVisible(true);
            } else if (item.routeName === "deleteAccount") {
              setDeleteAcocuntModalVisible(true);
            } else if (item.routeName === "starsAndSigns") {
              navigation.navigate(item.routeName as any, {
                startAndSignsData: userData?.additionalInfo,
                isFrom: "homeScreen",
                dailyPredictionData: homeData?.dailyReflection?.dailyPrediction,
              });
            } else {
              navigation.navigate(item.routeName as any);
            }
          }}
          style={{ overflow: "hidden" }}
        >
          <View style={styles.profileCardContainer}>
            <CustomIcon
              Icon={item.icon}
              height={verticalScale(25)}
              width={verticalScale(25)}
            />
            <CustomText fontFamily="medium" fontSize={13}>
              {item.title}
            </CustomText>
          </View>
          <View style={[styles.prfileCardOverlay]} />
        </TouchableOpacity>
      </>
    );
  };

  const hadnlelogout = async () => {
    if (Platform.OS === "ios") {
      // const auth = getAuth();
      // await signOut(auth);
    } else {
      await GoogleSignin.signOut();
      navigation.replace("authStack", {
        screen: "LoginScreen",
      });
    }
    await deleteLocalStorageData(STORAGE_KEYS.TOKEN);
    await deleteLocalStorageData(STORAGE_KEYS.MOOD_LOG_KEY);

    dispatch(resetUser());
    dispatch(setHomeData(null));
    dispatch(resetJournalData());
    dispatch(clearMessages());
    navigation.replace("authStack", {
      screen: "LoginScreen",
    });
  };

  const hadnleDeleteAccount = async () => {
    if (Platform.OS === "ios") {
      // const auth = getAuth();
      // await signOut(auth);
      setDeleteAcocuntModalVisible(false);
      navigation.replace("authStack", {
        screen: "LoginScreen",
      });
    } else {
      await GoogleSignin.signOut();
      setDeleteAcocuntModalVisible(false);
      navigation.replace("authStack", {
        screen: "LoginScreen",
      });
    }
  };

  useEffect(() => {
    const animation = DefaultAnimated.timing(animationValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    animation.start();

    return () => animation.stop();
  }, [animationValue]);

  const animatedImageStyle = React.useMemo(
    () => ({
      transform: [
        {
          scale: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1.5, 1],
          }),
        },
      ],
    }),
    [animationValue]
  );

  return (
    <View style={styles.container}>
      <DefaultAnimated.Image
        source={IMAGES.ProfileBackground}
        style={[styles.animatedBackground, animatedImageStyle]}
        resizeMode="cover"
      />
      <SafeAreaView>
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
          <LinearGradient
            colors={["#657de95b", "#764ca550"]}
            style={{
              height: hp(12),
              width: hp(12),
              borderRadius: 100,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <CustomText
              fontSize={30}
              color={PALETTE.white}
              fontFamily="boldItalic"
            >
              {getInitials(userData?.user.fullName!)}
            </CustomText>
            <View style={[styles.prfileCardOverlay]} />
          </LinearGradient>

          {/* Profile Info */}
          <View>
            <CustomText
              fontFamily="belganAesthetic"
              fontSize={28}
              color={PALETTE.lightSkin}
              style={styles.profileName}
            >
              {userData?.user.fullName}
            </CustomText>
            {userData?.user.hasAllData && (
              <CustomText
                fontFamily="medium"
                fontSize={12}
                style={styles.profileDescription}
              >
                {userData?.additionalInfo.moonSignDescription}
              </CustomText>
            )}
          </View>

          {/* Zodiac Signs */}
          {userData?.user.hasAllData && (
            <View style={styles.zodiacSignsContainer}>
              <ZodiacSign
                signName={userData?.additionalInfo.sunSign!}
                index={0}
              />
              <ZodiacSign
                signName={userData?.additionalInfo?.moonSign!}
                index={1}
              />
              {userData?.additionalInfo.risingStar && (
                <ZodiacSign
                  signName={userData?.additionalInfo.risingStar}
                  index={2}
                />
              )}
            </View>
          )}

          <FlatList
            data={profileOptions}
            renderItem={renderProfileCards}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </ScrollView>

        <DeleteAccountModal
          isVisible={deleteAcocuntModalVisible}
          setIsVisible={setDeleteAcocuntModalVisible}
          onContinue={hadnleDeleteAccount}
        />
      </SafeAreaView>
      <LogoutModal
        isVisible={logoutModalVisible}
        setIsVisible={setLogoutModalVisible}
        onContinue={hadnlelogout}
      />
    </View>
  );
};

export default Profile;
