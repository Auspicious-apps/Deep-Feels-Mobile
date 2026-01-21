export interface GetPlansApiResponse {
  _id: string;
  key: string;
  name: string;
  description: string;
  features: string[];
  trialDays: number;
  stripeProductId: string;
  stripePrices: string;
  amounts: number;
  fullAccess: FullAccess;
  trialAccess: TrialAccess;
  isActive: boolean;
  __v: number;
}

export interface FullAccess {
  unlimitedJournalEntries: boolean;
  dailyGuidance: boolean;
  compatibilityInsightUnlimited: boolean;
  personalizedPushNotification: boolean;
  weeklyEmotionalReport: boolean;
}

export interface TrialAccess {
  unlimitedJournalEntries: boolean;
  dailyGuidance: boolean;
  compatibilityInsightUnlimited: boolean;
  personalizedPushNotification: boolean;
  weeklyEmotionalReport: boolean;
}
