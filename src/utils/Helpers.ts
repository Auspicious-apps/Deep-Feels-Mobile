import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging, {
  AuthorizationStatus,
  getToken,
  registerDeviceForRemoteMessages,
  requestPermission,
} from "@react-native-firebase/messaging";
import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from "@react-navigation/native";
import { Store } from "@reduxjs/toolkit";
import axios from "axios";
import React from "react";
import { Platform } from "react-native";

export const getLocalStorageData = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  if (!value) return null; // Return null if no value exists
  try {
    return JSON.parse(value); // Try to parse as JSON
  } catch (error) {
    console.warn(
      `Could not parse "${key}" as JSON, returning raw value:`,
      value
    );
    return value; // Return the raw string if parsing fails
  }
};

export const storeLocalStorageData = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value)); // Always store as JSON string
};

export const deleteLocalStorageData = async (key: string) => {
  await AsyncStorage.removeItem(key); // Always store as JSON string
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const requestUserPermissionAndGetToken = async () => {
  try {
    // 1. Register device for remote messages on iOS
    // Use the modular function
    if (Platform.OS === "ios") {
      await registerDeviceForRemoteMessages(messaging());
    }

    // 2. Request permission from the user
    // Use the modular function and constant
    const authStatus = await requestPermission(messaging());
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);

      // 3. Get the FCM token
      // Use the modular function
      const token = await getToken(messaging());

      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.log("FCM Token not found.");
        return null;
      }
    } else {
      console.log("User has not granted notification permissions.");
      return null;
    }
  } catch (error: any) {
    console.error("Failed to get FCM token:", error);
    if (Platform.OS === "ios" && error.code === "messaging/permission-denied") {
      console.log("User denied notification permissions on iOS.");
    }
    return null;
  }
};

export const createRandomAvatarName = () => {
  const randomNumber = Math.floor(Math.random() * 15) + 1;
  return `Avatar${randomNumber}`;
};

// This ref will be initialized with the main navigation container
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export const navigate = (name: string, params?: object) => {
  if (navigationRef.current?.isReady()) {
    if (params) {
      navigationRef.current.navigate(name, params);
    } else {
      navigationRef.current.navigate(name);
    }
  }
};

export const replace = (name: string, params?: object) => {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.dispatch(StackActions.replace(name, params));
  }
};

export const resetAndNavigate = (name: string) => {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name }],
      })
    );
  }
};

// storeRef is a React ref that will hold the Redux store instance
export const storeRef = React.createRef<Store>();

export const dispatchAction = (action: any) => {
  if (storeRef.current) {
    storeRef.current.dispatch(action);
  } else {
    console.warn("⚠️ Store is not ready yet, cannot dispatch:", action);
  }
};

export function getInitials(fullName: string) {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    // If only one word, return first two letters
    return parts[0].substring(0, 2).toUpperCase();
  }

  // If multiple words, take the first letter of first & last word
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface PersonData {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
}

interface FriendshipReportPayload {
  p_day: number;
  p_month: number;
  p_year: number;
  p_hour: number;
  p_min: number;
  p_lat: number;
  p_lon: number;
  p_tzone: number;
  s_day: number;
  s_month: number;
  s_year: number;
  s_hour: number;
  s_min: number;
  s_lat: number;
  s_lon: number;
  s_tzone: number;
}

interface FriendshipReportResponse {
  // Define properties based on the expected API response structure
  // For now, use 'any' if the structure is unknown
  [key: string]: any;
}

export async function getFriendshipReport(
  primaryData: PersonData,
  secondaryData: PersonData
) {
  // --- API Configuration ---
  const url = "https://json.astrologyapi.com/v1/friendship_report/tropical";

  // *** WARNING: REPLACE with your actual User ID and API Key. ***
  // This example uses the hardcoded auth header from your cURL command.
  // Storing this in frontend code is generally INSECURE for production.
  const authHeader =
    "Basic NjQ1MTg5OjE3OTI0ZjAxM2FlY2ZkMzNhOWU5ZTk1YWI0OGIwMWIwMTUzZjk3MjU=";

  // --- Combine data into the required API payload structure ---
  const payload = {
    // Map primary data keys to p_keys
    p_day: primaryData.day,
    p_month: primaryData.month,
    p_year: primaryData.year,
    p_hour: primaryData.hour,
    p_min: primaryData.min,
    p_lat: primaryData.lat,
    p_lon: primaryData.lon,
    p_tzone: primaryData.tzone,

    // Map secondary data keys to s_keys
    s_day: secondaryData.day,
    s_month: secondaryData.month,
    s_year: secondaryData.year,
    s_hour: secondaryData.hour,
    s_min: secondaryData.min,
    s_lat: secondaryData.lat,
    s_lon: secondaryData.lon,
    s_tzone: secondaryData.tzone,
  };

  // --- Axios Request (Requires the Axios library) ---
  try {
    const response = await axios.post<FriendshipReportResponse>(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    console.error(
      "Error fetching friendship report:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

interface GuidanceCache {
  date: string; // YYYY-MM-DD
  report: { daily_guidance: string[] };
}

// Function to get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split("T")[0];

/**
 * Creates a unique key combining the profile ID and relation type.
 */
const createGuidanceKey = (
  profileId: string | number,
  relationType: string
) => {
  // Normalize the relation type (e.g., lower case, remove spaces)
  const normalizedType = relationType.toLowerCase().replace(/\s/g, "_");
  return `@DailyGuidance_${profileId}_${normalizedType}`;
};

/**
 * Retrieves cached daily guidance for a specific profile ID and relation type.
 * Checks if the cached data is from today.
 * @param profileId The unique ID of the compatibility profile.
 * @param relationType The type of relationship (e.g., "friends", "couple").
 * @returns Cached report if valid for today, otherwise null.
 */
export const getCachedDailyGuidance = async (
  profileId: string | number,
  relationType: string
): Promise<{ daily_guidance: string[] } | null> => {
  const KEY = createGuidanceKey(profileId, relationType);
  try {
    const cachedItem = await AsyncStorage.getItem(KEY);
    if (cachedItem) {
      const cache: GuidanceCache = JSON.parse(cachedItem);
      // Check if the cached date matches today's date
      if (cache.date === getTodayDate()) {
        console.log("Using cached daily guidance for:", relationType);
        return cache.report;
      } else {
        console.log("Cached data is outdated for:", relationType);
        await AsyncStorage.removeItem(KEY);
      }
    }
    return null;
  } catch (e) {
    console.error("Failed to retrieve or parse guidance cache:", e);
    return null;
  }
};

/**
 * Stores the generated daily guidance report with today's date.
 */
export const setCachedDailyGuidance = async (
  profileId: string | number,
  relationType: string,
  report: { daily_guidance: string[] }
): Promise<void> => {
  const KEY = createGuidanceKey(profileId, relationType);
  const cache: GuidanceCache = {
    date: getTodayDate(),
    report: report,
  };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(cache));
    console.log("Guidance cached successfully for:", relationType);
  } catch (e) {
    console.error("Failed to save guidance cache:", e);
  }
};

export const formatDate = (
  dateString: string | number | Date,
  addThirtyDays: boolean = false // Add a new optional boolean parameter
): string => {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Check if the flag is true to calculate the new date
  if (addThirtyDays) {
    date.setDate(date.getDate() + 31);
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export const isDatePassed = (dateString: string | number | Date) => {
  const now = new Date();
  const targetDate = new Date(dateString);
  return targetDate.getTime() < now.getTime();
};
