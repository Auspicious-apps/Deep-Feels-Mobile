/**
 * @format
 */

import React from "react";
import { AppRegistry } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import App from "./App";
import { name as appName } from "./app.json";
import { store } from "./src/redux/store";
import { storeRef } from "./src/utils/Helpers";

const RootApp = () => {
  // Assign store to global ref once initialized
  storeRef.current = store;
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </SafeAreaProvider>
  );
};

AppRegistry.registerComponent(appName, () => RootApp);
