export interface GetSubscriptionDataAPiResponse {
  subscription: Subscription;
}

export interface Subscription {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
  __v: number;
  cancelledAt: string;
  gracePeriodEndDate?: string;
}

export interface AndroidDetails {
  packageName: string;
  acknowledged: boolean;
  obfuscatedAccountId: string;
  obfuscatedProfileId: string;
  developerPayload: string;
  paymentState: number;
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
