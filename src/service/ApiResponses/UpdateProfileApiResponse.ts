export interface UpdateProfileApiResponse {
  _id: string;
  user: User;
  subscription: Subscription;
  additionalInfo: AdditionalInfo;
  journalEncryption: any;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  password: string;
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
  currentPeriodStart: any;
  currentPeriodEnd: any;
  nextBillingDate: any;
  amount: number;
  currency: string;
  nextPlanId: any;
  cancellationReason: any;
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
  journalEncryption: boolean;
  gender: string;
  zodiacSign: string;
  sunSign: string;
  moonSign: string;
  birthStar: string;
  risingStar: string;
  personalityKeywords: string[];
  createdAt: string;
  updatedAt: string;
  moonSignDescription?: string;
  __v: number;
}
