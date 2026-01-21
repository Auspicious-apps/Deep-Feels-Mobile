export interface BuyPlanApiResponse  {
  _id: string
  user: User
  subscriptionId: string
  subscription: Subscription
  additionalInfo: AdditionalInfo
  journalEncryption: any
  trialEndsAt: string
  hasPaymentMethod: boolean
}

export interface User {
  _id: string
  fullName: string
  email: string
  password: string
  image: string
  fcmToken: string
  authType: string
  countryCode: string
  phone: string
  isVerifiedEmail: boolean
  isVerifiedPhone: boolean
  isUserInfoComplete: boolean
  isDeleted: boolean
  stripeCustomerId: any
  isCardSetupComplete: boolean
  hasUsedTrial: boolean
  role: string
  createdForVerificationAt: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Subscription {
  _id: string
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  planId: string
  paymentMethodId: any
  status: string
  trialStart: string
  trialEnd: string
  startDate: string
  currentPeriodStart: any
  currentPeriodEnd: any
  nextBillingDate: any
  amount: number
  currency: string
  nextPlanId: any
  cancellationReason: any
  createdAt: string
  updatedAt: string
  __v: number
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
  risingStar: string;
  timeZone: string;
  birthTimezoneOffset: number;
  dobUTC: string;
  birthTimezoneOffsetName: string;
  ascendantDegree: number;
  planetsData: PlanetsDaum[];
  lilith: Lilith;
  housesData: HousesDaum[];
  aspectsData: AspectsDaum[];
  timezoneOffset: number;
  midheaven: number;
  vertex: number;
  dataToSave: DataToSave;
  personalityKeywords: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PlanetsDaum {
  name: string;
  full_degree: number;
  norm_degree: number;
  speed: number;
  is_retro: string;
  sign_id: number;
  sign: string;
  house: number;
}

export interface Lilith {
  name: string;
  full_degree: number;
  norm_degree: number;
  speed: number;
  is_retro: string;
  sign_id: number;
  sign: string;
  house: number;
}

export interface HousesDaum {
  house: number;
  sign: string;
  sign_id: number;
  degree: number;
}

export interface AspectsDaum {
  aspecting_planet: string;
  aspected_planet: string;
  aspecting_planet_id: number;
  aspected_planet_id: number;
  aspect_type: number;
  type: string;
  orb: number;
  diff: number;
}

export interface DataToSave {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  timezone: number;
}
