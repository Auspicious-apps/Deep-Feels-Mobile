import { GOOGLE_API_KEY } from "@env";
import messaging, {
  getToken,
  onTokenRefresh,
  requestPermission,
} from "@react-native-firebase/messaging";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useEffect } from "react";
import { LogBox, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { endConnection, initConnection } from "react-native-iap";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import NetworkLogger from "./src/components/NetworkLogger";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { setFcmToken } from "./src/redux/slices/UserSlice";
import { useAppDispatch } from "./src/redux/store";
import Routes from "./src/routes";
import { PALETTE } from "./src/utils/Colors";
import toastConfig from "./src/utils/ToastConfigs";

LogBox.ignoreAllLogs();

// Ensure defaultProps exists and then set allowFontScaling
function App() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const GOOGLE_WEB_CLIENT_ID = GOOGLE_API_KEY;

  // // Configure Google Sign-In
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  // const getInitialDeepLink = async (): Promise<string | null> => {
  //   try {
  //     // 1. Check for the initial URL (if the app was launched from cold start via a link)
  //     let initialUrl = await Linking.getInitialURL();

  //     if (initialUrl) {
  //       // For iOS/Android: Linking.getInitialURL() returns the link that first launched the app.
  //       console.log("App launched with initial URL:", initialUrl);
  //       return initialUrl;
  //     }

  //     // 2. Fallback check (less common, but useful in complex setups or older Android)
  //     // On Android, sometimes the intent is handled differently.

  //     // Note: If you are using Expo or specialized deep link libraries (like react-native-branch
  //     // or firebase/dynamic-links), they often provide their own primary functions.

  //     return null;
  //   } catch (error) {
  //     console.error("Failed to get initial deep link:", error);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   async function checkLink() {
  //     const link = await getInitialDeepLink();
  //     if (link) {
  //       // Process the link here (e.g., navigate, handle payment status)
  //       console.log("Received deep link for processing:", link);
  //     }
  //   }
  //   checkLink();

  //   // Additionally, set up a listener for when the app is already open (warm start)
  //   const subscription = Linking.addEventListener("url", ({ url }) => {
  //     // Process the link when the app is already running and a new link opens it
  //     console.log("App received URL event while running:", url);
  //     // Process the link here
  //   });

  //   return () => {
  //     // Clean up the listener when the component unmounts
  //     subscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    // 1. Initialize the connection
    const initializeIAP = async () => {
      try {
        console.log("Attempting to initialize IAP connection...");
        const result = await initConnection();
        console.log("IAP Connection successful:", result);

        // 2. Set the state only upon success
      } catch (error) {
        console.error("[IAP Error] initConnection failed:", error);
      }
    };

    initializeIAP();
    // Cleanup: Disconnect when the component unmounts
    return () => {
      endConnection();
      console.log("IAP Connection ended.");
    };
  }, []);

  useEffect(() => {
    // Modular approach to request permission and get the token
    const setupNotifications = async () => {
      // Request permission
      await requestPermission(messaging());

      // Get the token
      const token = await getToken(messaging());
      if (token) {
        dispatch(setFcmToken(token));
      }
    };
    setupNotifications();

    // You can also listen for token refresh events here
    const unsubscribe = onTokenRefresh(messaging(), (newToken) => {
      console.log("FCM Token refreshed:", newToken);
      dispatch(setFcmToken(newToken));
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider>
            <StatusBar
              barStyle={"light-content"}
              backgroundColor={PALETTE.mysticPurple}
              translucent={true}
            />
            <Routes />
            {__DEV__ && <NetworkLogger />}
          </ThemeProvider>
        </KeyboardProvider>
        <Toast
          config={toastConfig}
          visibilityTime={4000}
          autoHide={true}
          topOffset={insets.top + 20}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
