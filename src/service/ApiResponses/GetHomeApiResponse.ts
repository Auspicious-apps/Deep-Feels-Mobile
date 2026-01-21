export interface HomeApiDataResponse {
  plan: Plan;
  dailyReflection: DailyReflection;
  mood: any;
  moodNotSet: boolean;
}

export interface Plan {
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

export interface DailyReflection {
  userId: string;
  title: string;
  date: string;
  groundingTip: string;
  mantra: string;
  todayEnergy: string;
  emotionalTheme: string;
  suggestedFocus: string;
  transitReflections: TransitReflection[];
  majorTransits: MajorTransit[];
  result: Result;
  dailyPrediction: DailyPrediction;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TransitReflection {
  transit: string;
  reflection: string;
  keyAction: string;
  intensity: string;
  score: number;
  transit_planet: string;
  natal_planet: string;
  aspect_type: string;
  start_time: string;
  exact_time: string;
  end_time: string;
}

export interface MajorTransit {
  transit_planet: string;
  natal_planet: string;
  aspect_type: string;
  start_time: string;
  exact_time: string;
  end_time: string;
  is_retrograde: boolean;
  transit_sign: string;
  natal_house: number;
  planet_in_signs?: string[];
  house_of_natal_planet: number;
  significanceScore: number;
  aspectWeight: number;
  planetCombinationWeight: number;
}

export interface Result {
  considered_date: string;
  moon_phase: string;
  significance: string;
  report: string;
}

export interface DailyPrediction {
  status: boolean;
  sun_sign: string;
  prediction_date: string;
  prediction: Prediction;
}

export interface Prediction {
  personal_life: string;
  profession: string;
  health: string;
  emotions: string;
  travel: string;
  luck: string;
}