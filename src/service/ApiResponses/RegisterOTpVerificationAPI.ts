export interface RegisterOTPVerificationAPI {
  _id: string;
  fullName: string;
  email: string;
  image: any;
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
  createdForVerificationAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  token: string;
}
