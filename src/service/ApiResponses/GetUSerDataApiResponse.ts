export interface GetUserDataApiResponse {
  _id: string;
  user: User;
  subscription: Subscription;
  additionalInfo: AdditionalInfo;
  journalEncryption: any;
}

export interface Subscription {
  userId: string;
  subscriptionId: string;
  productId: string;
  platform: string;
  status: string;
  purchaseToken: string;
  orderId: string;
  transactionId: string;
  startDate: string;
  expiryDate: string;
  autoRenewing: boolean;
  billingPeriod: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  priceAmount: number;
  androidDetails: AndroidDetails;
  renewalHistory: RenewalHistory[];
  metadata: Metadata;
  lastVerifiedAt: string;
  lastSyncedAt: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AndroidDetails {
  packageName: string;
  acknowledged: boolean;
  obfuscatedAccountId: string;
  obfuscatedProfileId: string;
  developerPayload: string;
  paymentState: number;
  linkedPurchaseToken: string;
}

export interface RenewalHistory {
  date: string;
  orderId: string;
  status: string;
  priceAmount: number;
  _id: string;
}

export interface Metadata {
  countryCode: string;
  acknowledgementState: number;
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
  stripeCustomerId: any;
  isCardSetupComplete: boolean;
  hasUsedTrial: boolean;
  role: string;
  createdForVerificationAt: string;
  createdAt: string;
  updatedAt: string;
  uuid: string;
  hasAllData: boolean;
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
  moonSignDescription?: string;
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
