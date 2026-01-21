import React, { FC, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  TextInput,
  ActivityIndicator, // <-- Import TextInput
} from "react-native";
import ICONS from "../assets/Icons";
import { PALETTE } from "../utils/Colors";
import { horizontalScale, hp, verticalScale, wp } from "../utils/Metrics";
import CustomIcon from "./CustomIcon";
import { CustomText } from "./CustomText";

interface CustomDropDownProps<T> {
  isVisible: boolean;
  onClose: () => void;
  items: T[];
  selectedItem: T;
  onSelectItem: (item: T) => void;
  position?: { x: number; y: number };
  width?: number;
  title?: string;
  allowCustomInput?: boolean; // <-- New Prop to control the feature
  customInputPlaceholder?: string; // <-- Optional prop for placeholder text
  isLoading?: boolean; // Boolean to show/hide loading
  loadingComponent?: React.ReactNode; // Optional custom loading component
  closeAuto?: boolean; // Optional custom loading component
}

const CustomDropDown: FC<CustomDropDownProps<string>> = ({
  isVisible,
  onClose,
  items,
  selectedItem,
  onSelectItem,
  position,
  width = wp(95),
  title = "Select an Option",
  allowCustomInput = false, // <-- Default to false
  customInputPlaceholder = "Enter custom value...",
  isLoading = false,
  loadingComponent,
  closeAuto = true,
}) => {
  const [customInputValue, setCustomInputValue] = useState("");

  const handleSelect = (item: string) => {
    onSelectItem(item);
    if (closeAuto) {
      onClose();
    }
  };

  const handleCustomSelect = () => {
    if (customInputValue.trim()) {
      onSelectItem(customInputValue.trim());
      setCustomInputValue(""); // Clear input after selection
      if (closeAuto) {
        onClose();
      }
    }
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.dropdown,
                {
                  backgroundColor: PALETTE.mysticPurple,
                  width,
                },
                position
                  ? { top: position.y, left: position.x }
                  : styles.centeredDropdown,
              ]}
            >
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  {/* Render custom component or default spinner */}
                  {loadingComponent ? (
                    loadingComponent
                  ) : (
                    <ActivityIndicator size="large" color={PALETTE.lightSkin} />
                  )}
                </View>
              )}

              {/* Header */}
              <View style={styles.header}>
                <CustomText
                  fontSize={16}
                  fontFamily="bold"
                  style={styles.headerText}
                >
                  {title}
                </CustomText>
              </View>

              {/* --- Custom Input Section --- */}
              {allowCustomInput && (
                <>
                  <View
                    style={[
                      styles.divider,
                      {
                        backgroundColor: PALETTE.white,
                        marginTop: verticalScale(5),
                      },
                    ]}
                  />
                  <View style={styles.customInputContainer}>
                    <TextInput
                      maxFontSizeMultiplier={1.3}
                      style={styles.customTextInput}
                      placeholder={customInputPlaceholder}
                      placeholderTextColor={PALETTE.lightTextColor}
                      onChangeText={setCustomInputValue}
                      value={customInputValue}
                    />
                    <TouchableOpacity
                      style={[
                        styles.customSaveButton,
                        {
                          backgroundColor: customInputValue.trim()
                            ? PALETTE.lightSkin
                            : PALETTE.lightTextColor, // Disable button appearance
                        },
                      ]}
                      activeOpacity={0.7}
                      onPress={handleCustomSelect}
                      disabled={!customInputValue.trim()} // Actual disabled state
                    >
                      <CustomText
                        fontSize={12}
                        fontFamily="bold"
                        color={PALETTE.mysticPurple}
                      >
                        Save
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Scrollable items if > 10 */}
              <ScrollView
                style={{ maxHeight: hp(50) }}
                showsVerticalScrollIndicator={false}
              >
                {items.map((item, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={[
                        styles.option,
                        selectedItem === item && styles.selectedOption,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => handleSelect(item)}
                    >
                      <CustomText
                        fontSize={14}
                        fontFamily={selectedItem === item ? "bold" : "regular"}
                        style={styles.optionText}
                      >
                        {item}
                      </CustomText>
                      {selectedItem === item && (
                        <CustomIcon
                          Icon={ICONS.TickIcon}
                          height={18}
                          width={18}
                        />
                      )}
                    </TouchableOpacity>
                    {index < items.length - 1 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: PALETTE.white },
                        ]}
                      />
                    )}
                  </React.Fragment>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// --- Styles Update ---

const styles = StyleSheet.create({
  // ... existing styles ...
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: PALETTE.white,
    padding: verticalScale(8),
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    maxHeight: hp(60),
  },
  centeredDropdown: {
    position: "relative",
  },
  header: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  headerText: {
    color: PALETTE.white,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
  },
  selectedOption: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 6,
  },
  optionText: {
    color: PALETTE.white,
  },
  divider: {
    height: 1,
    width: "100%",
    opacity: 0.5,
  },

  // --- New Styles for Custom Input ---
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(8),
    gap: horizontalScale(10),
  },
  customTextInput: {
    flex: 1,
    height: verticalScale(40),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingHorizontal: horizontalScale(12),
    color: PALETTE.white,
    fontSize: 14,
  },
  customSaveButton: {
    height: verticalScale(40),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire dropdown area
    backgroundColor: "rgba(50, 20, 80, 0.85)", // Dark translucent background
    zIndex: 10, // Ensure it sits on top of all other content
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12, // Match dropdown border radius
  },
});

export default CustomDropDown;
