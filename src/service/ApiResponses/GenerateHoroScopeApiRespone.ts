export interface GenerateHoroScopeApiResponse {
  userId: string;
  zodiacSign: string;
  sunSign: string;
  moonSign: string;
  risingStar: string;
  ascendantDegree: number;
  midheavenDegree: number;
  vertex: number;
  planetsData: PlanetsDaum[];
  housesData: HousesDaum[];
  aspectsData: AspectsDaum[];
  lilith: Lilith;
  personalityKeywords: string[];
  name: string;
  dob: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: string;
  _id: string;
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
