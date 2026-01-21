export interface AllCompatibilityUserList {
  partner: Partner;
  _id: string;
  userId: UserId;
  relations: Relation[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Partner {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  timeOfBirth: string;
  birthPlace: string;
}

export interface UserId {
  _id: string;
  fullName: string;
  image: string;
  authType: string;
  countryCode: string;
  phone: string;
  isVerifiedEmail: boolean;
  isVerifiedPhone: boolean;
  isUserInfoComplete: boolean;
  isDeleted: boolean;
  isCardSetupComplete: boolean;
  hasUsedTrial: boolean;
  role: string;
  createdForVerificationAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Relation {
  relationshipType: string;
  partnerAstroData: PartnerAstroData;
  result: Result;
  _id: string;
}

export interface PartnerAstroData {
  zodiacSign: string;
  personalityKeywords: string[];
  sunSign: string;
  moonSign: string;
  risingStar: string;
  ascendantDegree: number;
  lilith: Lilith;
  midheaven: number;
  vertex: number;
  planetsData: PlanetsDaum[];
  housesData: HousesDaum[];
  aspectsData: AspectsDaum[];
  timezoneOffset: number;
  dataToSave: DataToSave;
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

export interface Result {
  overallCompatibilityLabel: string;
  description: string;
  emotionalAndMentalCompatibility: EmotionalAndMentalCompatibility;
  bondAndConnection: BondAndConnection;
  spiritualCompatibility: SpiritualCompatibility;
  communicationAndUnderstanding: CommunicationAndUnderstanding;
  lifestyleAndValuesCompatibility: LifestyleAndValuesCompatibility;
  astrologicalSupport: AstrologicalSupport;
  compatibilityScore: number;
  summaryHighlights: SummaryHighlights;
  generatedText: string;
}

export interface EmotionalAndMentalCompatibility {
  title: string;
  text: string;
}

export interface BondAndConnection {
  title: string;
  text: string;
}

export interface SpiritualCompatibility {
  title: string;
  text: string;
}

export interface CommunicationAndUnderstanding {
  title: string;
  text: string;
}

export interface LifestyleAndValuesCompatibility {
  title: string;
  text: string;
}

export interface AstrologicalSupport {
  you: You;
  partner: Partner2;
}

export interface You {
  zodiacSign: string;
  zodiacTrait: string;
  personalityKeywords: string[];
  risingStar: string;
  risingTrait: string;
  sunSign: string;
  sunSignTrait: string;
}

export interface Partner2 {
  zodiacSign: string;
  zodiacTrait: string;
  personalityKeywords: string[];
  risingStar: string;
  risingTrait: string;
  sunSign: string;
  sunSignTrait: string;
}

export interface SummaryHighlights {
  strengths: string[];
  challenges: string[];
  advice: string[];
}
