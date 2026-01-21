import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  AllCompatibilityUserList,
  Partner,
  Relation,
} from "../service/ApiResponses/AllCompatibilityUserList";
import { AdditionalInfo } from "../service/ApiResponses/BuyPlanApiResponse";
import { DailyPrediction } from "../service/ApiResponses/GetHomeApiResponse";

export type RootStackParams = {
  splash: undefined;
  authStack: NavigatorScreenParams<AuthStackParams>;
  setupStack: NavigatorScreenParams<SetUpStackParams>;
  bottomTabStack: NavigatorScreenParams<BottomTabStackParams>;
  onBoarding: { startAndSignsData: AdditionalInfo };
  starsAndSigns: {
    startAndSignsData: AdditionalInfo;
    isFrom: "onboarding" | "homeScreen";
    dailyPredictionData?: DailyPrediction;
  };
};

export type AuthStackParams = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPassweordScreen: undefined;
  OtpVerificationScreen: {
    isFrom: "register" | "forgotPassword";
    email: string;
  };
  NewPasswordScreen: { token: stirng };
};

export type SetUpStackParams = {
  userDetailsSetupScreen: undefined;
  subscriptionPlanScreen: { isBuyAgain: boolean };
};

export type JournalTabStackParams = {
  journal: { isFromWriteJournal?: boolean };
  journalDetails: {
    id?: string;
    isNew: boolean;
    type: "dailyRoutine" | "myJournal";
    title?: string;
  };
};

export type BondTabStackParams = {
  bond: undefined;
  addPerson: { relationshipType: string };
  compatibilityDetails: { data?: Relation; partner: Partner; id: string };
};

export type ProfileTabStackParams = {
  profile: undefined;
  myProfile: undefined;
  changePassword: undefined;
  subscription: undefined;
  journalEncryption: undefined;
  moodChart: undefined;
  helpForm: undefined;
  termsOfService: undefined;
  privacyPolicy: undefined;
  inviteFriend: undefined;
  ourMission: undefined;
  horoscope: undefined;
};

export type BottomTabStackParams = {
  homeTab: undefined;
  journalTab: NavigatorScreenParams<JournalTabStackParams>;
  bondTab: NavigatorScreenParams<BondTabStackParams>;
  supportTab: undefined;
  profileTab: NavigatorScreenParams<ProfileTabStackParams>;
};

// SPLASH SCREEN
export type SplashScreenProps = NativeStackScreenProps<
  RootStackParams & AuthStackParams & BottomTabStackParams,
  "splash"
>;

// ONBOARDING SCREEN
export type OnboardingScreenProps = NativeStackScreenProps<
  RootStackParams & AuthStackParams & BottomTabStackParams,
  "onBoarding"
>;

// SIGN AND STARS
export type StarsAndSignsScreenProps = NativeStackScreenProps<
  SetUpStackParams & RootStackParams,
  "starsAndSigns"
>;

// AUTH SCREENS
export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParams & RootStackParams,
  "LoginScreen"
>;
export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParams & RootStackParams,
  "RegisterScreen"
>;
export type OtpVerificationScreenProps = NativeStackScreenProps<
  AuthStackParams & RootStackParams,
  "OtpVerificationScreen"
>;
export type ForgotPassweordScreenProps = NativeStackScreenProps<
  AuthStackParams & RootStackParams,
  "ForgotPassweordScreen"
>;
export type NewPasswordScreenProps = NativeStackScreenProps<
  AuthStackParams & RootStackParams,
  "NewPasswordScreen"
>;

// SETUP SCREENS
export type UserDetailsSetupScreenProps = NativeStackScreenProps<
  SetUpStackParams & RootStackParams,
  "userDetailsSetupScreen"
>;
export type subscriptionPlanScreenProps = NativeStackScreenProps<
  SetUpStackParams & RootStackParams,
  "subscriptionPlanScreen"
>;

// BOTTOM TAB SCREENS
export type HomeScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams,
  "homeTab"
>;

// PROFILE TAB AND SCREENS
export type ProfileScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "profile"
>;

export type MyProfileScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "myProfile"
>;
export type SubscriptionScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "subscription"
>;
export type ChangePasswordScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "changePassword"
>;
export type HelpSupportScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "helpForm"
>;
export type TermsOfServiceScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "termsOfService"
>;
export type PrivacyPolicyScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "privacyPolicy"
>;
export type InviteFirendsScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "inviteFriend"
>;
export type JournalEncryptionScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "journalEncryption"
>;
export type MoodChartScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "moodChart"
>;
export type OurMissionScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "ourMission"
>;
export type HoroscopeScreenProps = NativeStackScreenProps<
  BottomTabStackParams & RootStackParams & ProfileTabStackParams,
  "horoscope"
>;

// JOURNAL TAB AND SCREEN
export type JournalScreenProps = NativeStackScreenProps<
  JournalTabStackParams,
  "journal"
>;
export type JournalDetailsScreenProps = NativeStackScreenProps<
  JournalTabStackParams,
  "journalDetails"
>;

// BOND TAB SCREEN
export type BondScreenProps = NativeStackScreenProps<
  BondTabStackParams,
  "bond"
>;
export type AddPersonScreenProps = NativeStackScreenProps<
  BondTabStackParams,
  "addPerson"
>;
export type CompatibilityScreenProps = NativeStackScreenProps<
  BondTabStackParams,
  "compatibilityDetails"
>;
