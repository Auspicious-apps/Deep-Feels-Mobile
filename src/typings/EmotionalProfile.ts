export interface EmotionalProfile {
  nervousSystemProfile: NervousSystemProfile;
  emotionalAndSomaticPatterns: EmotionalAndSomaticPatterns;
  relationshipPatterns: RelationshipPatterns;
  growthAreas: GrowthAreas;
  timestamp?: number; // When this profile was generated
}

export interface NervousSystemProfile {
  regulationStyle: string;
  triggerAwareness: string[];
  soothingPractices: string[];
  windowOfTolerance: string;
}

export interface EmotionalAndSomaticPatterns {
  emotionalProcessingStyle: string;
  stressResponsePattern: string;
  somaticPatterns: string;
  bodySignals: string[];
  groundingAnchors: string[];
}

export interface RelationshipPatterns {
  attachmentStyleIndicators: string;
  emotionalCommunicationStyle: string;
  boundaryTendencies: string;
  coRegulationNeeds: string;
}

export interface GrowthAreas {
  growingEdges: string[];
  selfCompassionReminders: string[];
  integrationPractices: string[];
}
