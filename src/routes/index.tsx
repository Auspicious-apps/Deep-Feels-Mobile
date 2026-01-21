import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ImageBackground, Platform } from "react-native";
import "react-native-gesture-handler";
import IMAGES from "../assets/Images";
import BottomTabBar from "../components/BottomTabBar";
import SubscriptionExpiredModal from "../components/Modals/SubscriptionExpiredModal";
import ForgotPassword from "../screens/AuthScreens/ForgotPassword";
import Login from "../screens/AuthScreens/Login";
import NewPassword from "../screens/AuthScreens/NewPassword";
import OTP from "../screens/AuthScreens/OTP";
import Register from "../screens/AuthScreens/Register";
import AddPerson from "../screens/BottomTabs/BondTab/AddPerson";
import Bond from "../screens/BottomTabs/BondTab/Bond";
import CompatibilityDetails from "../screens/BottomTabs/BondTab/CompatibilityDetails";
import Home from "../screens/BottomTabs/Home";
import Journal from "../screens/BottomTabs/JournalTab/Journal";
import JournalDetails from "../screens/BottomTabs/JournalTab/JournalDetails";
import ChangePassword from "../screens/BottomTabs/ProfileTab/ChangePassword";
import InviteFriends from "../screens/BottomTabs/ProfileTab/InviteFriends";
import JournalEncryption from "../screens/BottomTabs/ProfileTab/JournalEncryption";
import MoodChart from "../screens/BottomTabs/ProfileTab/MoodChart";
import MyProfile from "../screens/BottomTabs/ProfileTab/MyProfile";
import OurMission from "../screens/BottomTabs/ProfileTab/OurMission";
import PrivacyPolicy from "../screens/BottomTabs/ProfileTab/PrivacyPolicy";
import Profile from "../screens/BottomTabs/ProfileTab/Profile";
import SubScription from "../screens/BottomTabs/ProfileTab/Subscription";
import SupportHelp from "../screens/BottomTabs/ProfileTab/SupportHelp";
import TermsOfService from "../screens/BottomTabs/ProfileTab/TermsOfService";
import Support from "../screens/BottomTabs/Support";
import OnBoarding from "../screens/Onboarding";
import SubscriptionOnboarding from "../screens/SetUpScreens/SubscriptionOnboarding";
import UserOnboardingDetails from "../screens/SetUpScreens/UserOnboardingDetails";
import Splash from "../screens/Splash";
import StarsAndSigns from "../screens/StarsAndSigns";
import {
  AuthStackParams,
  BondTabStackParams,
  BottomTabStackParams,
  JournalTabStackParams,
  ProfileTabStackParams,
  RootStackParams,
  SetUpStackParams,
} from "../typings/route";
import { navigationRef } from "../utils/Helpers";

const Stack = createNativeStackNavigator<RootStackParams>();
const Auth = createNativeStackNavigator<AuthStackParams>();
const Setup = createNativeStackNavigator<SetUpStackParams>();
const BottomTab = createBottomTabNavigator<BottomTabStackParams>();
const JournalScreens = createNativeStackNavigator<JournalTabStackParams>();
const BondScreens = createNativeStackNavigator<BondTabStackParams>();
const ProfileScreens = createNativeStackNavigator<ProfileTabStackParams>();

export default function Routes() {
  const navigatorScreenOptions = {
    headerShown: false,
    animation: Platform.select({
      android: "none" as const,
      ios: "default" as const,
    }),
    // gestureEnabled: false, // You can uncomment this if you're still seeing gestures
  };

  function AuthStack() {
    return (
      <Auth.Navigator screenOptions={navigatorScreenOptions}>
        <Auth.Screen
          name="LoginScreen"
          component={Login}
          options={{ headerShown: false }}
        />
        <Auth.Screen
          name="RegisterScreen"
          component={Register}
          options={{ headerShown: false }}
        />
        <Auth.Screen
          name="ForgotPassweordScreen"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Auth.Screen
          name="OtpVerificationScreen"
          component={OTP}
          options={{ headerShown: false }}
        />
        <Auth.Screen
          name="NewPasswordScreen"
          component={NewPassword}
          options={{ headerShown: false }}
        />
      </Auth.Navigator>
    );
  }

  function SetUpStack() {
    return (
      <Setup.Navigator screenOptions={navigatorScreenOptions}>
        <Setup.Screen
          name="userDetailsSetupScreen"
          component={UserOnboardingDetails}
          options={{ headerShown: false }}
        />
        <Setup.Screen
          name="subscriptionPlanScreen"
          component={SubscriptionOnboarding}
          options={{ headerShown: false }}
        />
      </Setup.Navigator>
    );
  }

  function JournalStack() {
    return (
      <JournalScreens.Navigator screenOptions={navigatorScreenOptions}>
        <JournalScreens.Screen
          name="journal"
          component={Journal}
          options={{ headerShown: false }}
        />
        <JournalScreens.Screen
          name="journalDetails"
          component={JournalDetails}
          options={{ headerShown: false }}
        />
      </JournalScreens.Navigator>
    );
  }

  function Bondtack() {
    return (
      <BondScreens.Navigator screenOptions={navigatorScreenOptions}>
        <BondScreens.Screen
          name="bond"
          component={Bond}
          options={{ headerShown: false }}
        />
        <BondScreens.Screen
          name="addPerson"
          component={AddPerson}
          options={{ headerShown: false }}
        />
        <BondScreens.Screen
          name="compatibilityDetails"
          component={CompatibilityDetails}
          options={{ headerShown: false }}
        />
      </BondScreens.Navigator>
    );
  }

  function ProfileStack() {
    return (
      <ProfileScreens.Navigator screenOptions={navigatorScreenOptions}>
        <ProfileScreens.Screen
          name="profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <ProfileScreens.Screen
          name="changePassword"
          component={ChangePassword}
          options={{ headerShown: false }}
        />
        <ProfileScreens.Screen
          name="myProfile"
          component={MyProfile}
          options={{ headerShown: false }}
        />
        <ProfileScreens.Screen
          name="subscription"
          component={SubScription}
          options={{ headerShown: false }}
        />
        <ProfileScreens.Screen
          name="moodChart"
          component={MoodChart}
          options={{ headerShown: false }}
        />
        <ProfileScreens.Screen
          name="journalEncryption"
          component={JournalEncryption}
          options={{ headerShown: false }}
        />
        <ProfileScreens.Screen
          name="helpForm"
          component={SupportHelp}
          options={{ headerShown: false }}
        />
        <ProfileScreens.Screen
          name="privacyPolicy"
          component={PrivacyPolicy}
          options={{ headerShown: false }}
        />
        <ProfileScreens.Screen
          name="termsOfService"
          component={TermsOfService}
          options={{ headerShown: false }}
        />
        <ProfileScreens.Screen
          name="inviteFriend"
          component={InviteFriends}
          options={{ headerShown: false }}
        />
        <ProfileScreens.Screen
          name="ourMission"
          component={OurMission}
          options={{ headerShown: false }}
        />
      </ProfileScreens.Navigator>
    );
  }

  function TabStack() {
    return (
      <BottomTab.Navigator
        screenOptions={{
          animation: Platform.select({ android: "none", ios: "none" }),
          headerShown: false,
        }}
        safeAreaInsets={{ bottom: 0 }}
        tabBar={(props) => <BottomTabBar {...props} />}
        layout={(props) => {
          return (
            <ImageBackground
              source={IMAGES.mainBackground}
              style={{
                flex: 1,
              }}
            >
              {props.children}
            </ImageBackground>
          );
        }}
      >
        <BottomTab.Screen name="homeTab" component={Home} />
        <BottomTab.Screen name="journalTab" component={JournalStack} />
        <BottomTab.Screen name="bondTab" component={Bondtack} />
        <BottomTab.Screen name="supportTab" component={Support} />
        <BottomTab.Screen name="profileTab" component={ProfileStack} />
      </BottomTab.Navigator>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          animation: Platform.select({ android: "none", ios: "default" }),
          headerShown: false,
        }}
      >
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="onBoarding" component={OnBoarding} />
        <Stack.Screen name="starsAndSigns" component={StarsAndSigns} />
        <Stack.Screen name="authStack" component={AuthStack} />
        <Stack.Screen name="setupStack" component={SetUpStack} />
        <Stack.Screen name="bottomTabStack" component={TabStack} />
      </Stack.Navigator>
      <SubscriptionExpiredModal />
    </NavigationContainer>
  );
}
