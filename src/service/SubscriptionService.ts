import { Platform } from "react-native";
import {
  getAvailablePurchases,
  ReceiptValidationResultIOS,
  validateReceipt,
} from "react-native-iap";
import ENDPOINTS from "./ApiEndpoints";
import { GetUserDataApiResponse } from "./ApiResponses/GetUSerDataApiResponse";
import { postData } from "./ApiService";
import Toast from "react-native-toast-message";

/**
 * Validates iOS receipt with Apple and backend
 * @returns Validation response from backend
 */
export const validateIOSReceipt =
  async (): Promise<GetUserDataApiResponse | null> => {
    try {
      // Request fresh receipt from Apple
      const receipt = await validateReceipt({
        sku: "org.reactjs.native.deepfeels.membership",
      });

      const iosRecipt = receipt as ReceiptValidationResultIOS;

      if (!iosRecipt) {
        console.log("[SubscriptionService] No iOS receipt available");
        return null;
      }

      // Send JWS representation to backend for validation
      const response = await postData<GetUserDataApiResponse>(
        ENDPOINTS.validateIosReciept,
        {
          receiptData: iosRecipt.jwsRepresentation,
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error(
        "[SubscriptionService] iOS receipt validation error:",
        error.message
      );
      return null;
    }
  };

/**
 * Validates Android purchase token with backend
 * @returns Validation response from backend
 */
export const validateAndroidSubscription =
  async (): Promise<GetUserDataApiResponse | null> => {
    try {
      const purchases = await getAvailablePurchases();

      if (!purchases || purchases.length === 0) {
        console.log("[SubscriptionService] No Android purchases found");
        Toast.show({
          type: "info",
          text1: "No purchases found",
          text2: "Please buy a new subscription to access premium features.",
        });
        return null;
      }

      // Find the most recent subscription purchase
      const subscription = purchases.find((p) =>
        [
          "org.reactjs.native.deepfeels.membership",
          "com_deepfeels_monthly",
        ].includes(p.productId)
      );

      if (!subscription || !subscription.purchaseToken) {
        console.log("[SubscriptionService] No active subscription found");
        return null;
      }

      // Send purchase token to backend for validation
      const response = await postData<any>(ENDPOINTS.restorePurchase, {
        purchaseToken: subscription.purchaseToken,
        packageName: "com.deepfeels",
        productId: subscription.productId,
        data: {
          platform: "android",
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error(
        "[SubscriptionService] Android subscription validation error:",
        error.message
      );
      return null;
    }
  };

/**
 * Main subscription validation method
 * Validates subscription on both iOS and Android platforms
 * @returns Subscription validation response with user data
 */
export const validateSubscriptionOnAppLaunch =
  async (): Promise<GetUserDataApiResponse | null> => {
    try {
      console.log(
        "[SubscriptionService] Starting subscription validation on app launch"
      );

      if (Platform.OS === "ios") {
        const result = await validateIOSReceipt();

        return result;
      } else {
        const result = await validateAndroidSubscription();
        return result;
      }
    } catch (error: any) {
      console.error(
        "[SubscriptionService] App launch subscription validation error:",
        error.message
      );
      throw error;
      // Don't throw - allow app to continue even if validation fails
      // return null;
    }
  };

/**
 * Checks if a subscription is valid
 * @param subscriptionData The subscription data from validation response
 * @returns True if subscription is active and not expired
 */
export const isSubscriptionActive = (subscriptionData: any): boolean => {
  if (!subscriptionData || !subscriptionData.subscription) {
    return false;
  }

  const status = subscriptionData.subscription.status;
  if (status === "cancelled" || status === "expired") {
    return false;
  }

  const expirationDate = subscriptionData.subscription.expirationDate;
  if (expirationDate && new Date(expirationDate) < new Date()) {
    return false;
  }

  return true;
};

export default {
  validateSubscriptionOnAppLaunch,
  validateIOSReceipt,
  validateAndroidSubscription,
  isSubscriptionActive,
};
