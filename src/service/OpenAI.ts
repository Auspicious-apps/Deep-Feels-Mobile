import { EmotionalProfile } from "../typings/EmotionalProfile";
import { postData } from "./ApiService";

export const generateDailyGuidance = async (
  personAName: string,
  personBName: string,
  relationType: string
) => {
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });

  const prompt = `Generate 3-4 fresh daily relationship tips for ${dayOfWeek} for ${personAName} and ${personBName} in a ${relationType} relationship.

RULES:
- NO astrology/zodiac/planetary references
- Focus ONLY on: emotional wellness, communication, nervous system support, boundaries, co-regulation
- Generate COMPLETELY FRESH content each time - vary topics, wording, examples
- Make tips relevant to ${dayOfWeek} naturally
- Tips must be practical, actionable, rooted in emotional wellness psychology
‚
Topics to vary: emotional check-ins, active listening, boundaries, conflict resolution, quality time, gratitude, stress management, self-care, playfulness, vulnerability, support.

Return ONLY a JSON array of 3-4 tip strings, no markdown.`;

  try {
    const response = await postData<string>("/paid-user/openai/chat", {
      prompt: [
        {
          role: "system",
          content: `Relationship wellness coach. Generate varied daily tips focused on emotional health. Return valid JSON array only.`,
        },
        { role: "user", content: prompt },
      ],
    });

    const result = response.data.data;

    if (!response.data.success)
      throw new Error(response.data.message || "OpenAI API error");

    // const raw = result.choices?.[0]?.message?.content?.trim() || "{}";

    // Clean up surrounding markdown (e.g., ```json\n[\n...)
    // const cleaned = raw
    //   .replace(/```json\n?|```/g, "")
    //   .replace(/^```|```$/g, "");

    const parsed = JSON.parse(result);

    if (Array.isArray(parsed)) {
      // Return the array in the desired structure
      return { daily_guidance: parsed };
    } else {
      throw new Error("Invalid format: OpenAI did not return a JSON array.");
    }
  } catch (err) {
    console.error("Error in generateDailyGuidance:", err);
    return { daily_guidance: [] };
  }
};

export const generateEmotionalProfile = async (
  userData: any
): Promise<EmotionalProfile | null> => {
  const {
    zodiacSign,
    sunSign,
    moonSign,
    risingStar,
    planetsData,
    housesData,
    aspectsData,
    personalityKeywords,
    gender,
  } = userData;

  const prompt = `Generate an emotional wellness profile based on astrological data. Translate to psychology/neuroscience language (nervous system, attachment, somatic patterns).

Profile:
Gender: ${gender}, Zodiac: ${zodiacSign}, Sun: ${sunSign}, Moon: ${moonSign}, Rising: ${risingStar}
Keywords: ${personalityKeywords.join(", ")}
Planets: ${JSON.stringify(planetsData.slice(0, 3))}
Houses: ${JSON.stringify(housesData.slice(0, 3))}

INSTRUCTIONS:
- Translate astrology into EMOTIONAL WELLNESS language (nervous system, somatic, attachment, regulation)
- Be personal, compassionate, actionable
- Avoid astrological jargon - use psychology/neuroscience terms
- Focus on self-regulation, grounding, emotional growth
- Generate FRESH, VARIED content - even for same data, vary wording, examples, perspectives
- Return ONLY valid JSON, no markdown

Return valid JSON only:
{
  "nervousSystemProfile": {
    "regulationStyle": "2-3 sentences",
    "triggerAwareness": ["3 triggers"],
    "soothingPractices": ["4 practices"],
    "windowOfTolerance": "2-3 sentences"
  },
  "emotionalAndSomaticPatterns": {
    "emotionalProcessingStyle": "2-3 sentences",
    "stressResponsePattern": "2-3 sentences",
    "somaticPatterns": "2-3 sentences",
    "bodySignals": ["3 signals"],
    "groundingAnchors": ["4 anchors"]
  },
  "relationshipPatterns": {
    "attachmentStyleIndicators": "2-3 sentences",
    "emotionalCommunicationStyle": "2-3 sentences",
    "boundaryTendencies": "2-3 sentences",
    "coRegulationNeeds": "2-3 sentences"
  },
  "growthAreas": {
    "growingEdges": ["3 edges"],
    "selfCompassionReminders": ["3 reminders"],
    "integrationPractices": ["3 practices"]
  }
}`;

  try {
    const response = await postData<string>("/paid-user/openai/chat", {
      prompt: [
        {
          role: "system",
          content: `Emotional wellness coach. Generate personalized profiles from astrological data. Return valid JSON only, no markdown.`,
        },
        { role: "user", content: prompt },
      ],
    });

    const result = response.data.data;

    if (!response.data.success)
      throw new Error(response.data.message || "OpenAI API error");

    // const raw = result.choices?.[0]?.message?.content?.trim() || "{}";

    // // Clean up surrounding markdown
    // const cleaned = raw
    //   .replace(/```json\n?|```/g, "")
    //   .replace(/^```|```$/g, "");

    const parsed: EmotionalProfile = JSON.parse(result);

    // // Add timestamp to the profile
    parsed.timestamp = Date.now();

    return parsed;
  } catch (err) {
    console.error("Error in generateEmotionalProfile:", err);
    return null;
  }
};
