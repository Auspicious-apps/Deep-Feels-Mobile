import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity } from "react-native";
import NL from "react-native-network-logger";
import { SafeAreaView } from "react-native-safe-area-context";
import { PALETTE } from "../utils/Colors";

const NetworkLogger = () => {
  const [isNetworkModalVisible, setIsNetworkVIsible] = useState(false);
  return (
    <>
      <Modal style={styles.modal} visible={isNetworkModalVisible}>
        <SafeAreaView style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsNetworkVIsible(false)}
          >
            <Text maxFontSizeMultiplier={1.3} style={styles.closeButtonTitle}>
              {"CLOSE"}
            </Text>
          </TouchableOpacity>
          <NL />
        </SafeAreaView>
      </Modal>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setIsNetworkVIsible(true);
        }}
      >
        <Text maxFontSizeMultiplier={1.3} style={styles.content}>
          {"Network Logs"}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    backgroundColor: PALETTE.white,
  },
  container: {
    width: 45,
    height: 45,
    position: "absolute",
    left: 24,
    bottom: 80,
    borderRadius: 45,
    backgroundColor: PALETTE.dangerRed,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    fontSize: 9,
    textAlign: "center",
    color: "white",
  },
  contentContainer: {
    flex: 1,
  },
  closeButton: {
    marginTop: 40,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButtonTitle: {
    textAlign: "center",
  },
});

export default React.memo(NetworkLogger);
