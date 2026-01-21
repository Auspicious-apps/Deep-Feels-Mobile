export interface LoginApiResponse {
  _id: string;
  reactivated: boolean;
  user: User;
  token: string;
  subscription: Subscription | null;
  additionalInfo: AdditionalInfo;
  journalEncryption: any;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  image: string;
  fcmToken: string;
  authType: string;
  countryCode: string;
  phone: string;
  isVerifiedEmail: boolean;
  isVerifiedPhone: boolean;
  isUserInfoComplete: boolean;
  isDeleted: boolean;
  stripeCustomerId: string;
  isCardSetupComplete: boolean;
  hasUsedTrial: boolean;
  role: string;
  createdForVerificationAt: string;
  createdAt: string;
  updatedAt: string;
  hasAllData: boolean;
  __v: number;
}

export interface Subscription {
  _id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  planId: string;
  paymentMethodId: any;
  status: string;
  trialStart: string;
  trialEnd: string;
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  amount: number;
  currency: string;
  nextPlanId: any;
  cancellationReason: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GoogleLoginApiResponse {
  _id: string;
  user: User;
  token: string;
  subscription: Subscription | null;
  additionalInfo: AdditionalInfo;
  journalEncryption: any;
  reactivated: boolean
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  image: string;
  fcmToken: string;
  authType: string;
  countryCode: string;
  phone: string;
  isVerifiedEmail: boolean;
  isVerifiedPhone: boolean;
  isUserInfoComplete: boolean;
  isDeleted: boolean;
  stripeCustomerId: string;
  isCardSetupComplete: boolean;
  hasUsedTrial: boolean;
  createdForVerificationAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdditionalInfo {
  _id: string;
  userId: string;
  dob: string;
  timeOfBirth: string;
  birthPlace: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  journalEncryption: boolean;
  gender: string;
  birthStar: string;
  moonSign: string;
  personalityKeywords: string[];
  sunSign: string;
  zodiacSign: string;
  risingStar: string;
  dobUTC: string;
}
