import dayjs from "dayjs";
import React, { FC, useState } from "react";
import {
  FlatList,
  FlexStyle,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { TextInput } from "react-native-gesture-handler";
import ICONS from "../Assets/Icons";
import CustomIcon from "./CustomIcon";
import { CustomText } from "./CustomText";
import { horizontalScale, verticalScale } from "../utils/Metrics";
import { PALETTE } from "../utils/Colors";

type CustomInputProps = TextInputProps & {
  placeholder?: string;
  type?:
    | "text"
    | "password"
    | "number"
    | "dropdown"
    | "textArea"
    | "date"
    | "time";
  isBackArrow?: boolean;
  onChangeText: (text: string) => void;
  value: string;
  style?: object;
  isFilterIcon?: boolean;
  onFilterPress?: () => void;
  onBackPress?: () => void;
  label?: string;
  height?: FlexStyle["height"];
  backgroundColor?: string;
  inputStyle?: StyleProp<TextStyle>;
  baseStyle?: StyleProp<ViewStyle>;
  options?: Array<{ label: string; value: string }>;
  width?: FlexStyle["width"];
  disabled?: boolean;
  maxDate?: Date;
  leftIcon?: any;
};

const CustomInput: FC<CustomInputProps> = (props) => {
  const {
    value,
    label,
    placeholder,
    type,
    onChangeText,
    options = [],
    baseStyle,
    inputStyle,
    disabled = false,
    maxDate,
    leftIcon,
  } = props;

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const changeValueInNumber = (dir: "up" | "down") => {
    const currentValue = Number(value) || 0;
    let newValue = dir === "up" ? currentValue + 1 : currentValue - 1;
    // Prevent negative values
    newValue = Math.max(0, newValue);
    onChangeText(newValue.toString());
  };

  const handleConfirm = (date: Date) => {
    setPickerVisible(false);
    setSelectedDate(date);
    if (type === "date") {
      const formattedDate = dayjs(date).format("D[th] MMM YYYY");
      onChangeText(formattedDate);

      // Calculate age based on date of birth
      const today = dayjs();
      const birthDate = dayjs(date);
      const age = today.diff(birthDate, "year");
      onChangeText(formattedDate); // Update with age
    } else if (type === "time") {
      const formattedTime = dayjs(date).format("hh:mm A");
      onChangeText(formattedTime);
    }
  };

  const handleCancel = () => {
    setPickerVisible(false);
  };

  const handleDropdownSelect = (selectedValue: string) => {
    onChangeText(selectedValue);
    setShowDropdown(false);
  };

  return (
    <View
      style={[
        baseStyle,
        {
          gap: verticalScale(6),
        },
      ]}
    >
      {label && (
        <CustomText fontFamily="regular" color={COLORS.oldGrey} fontSize={14}>
          {label}
        </CustomText>
      )}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => {
          if (type === "dropdown") {
            setShowDropdown(true);
          } else if (type === "time" || type === "date") {
            setPickerVisible(true);
          }
        }}
        style={[
          styles.inputContainer,
          {
            backgroundColor: disabled ? COLORS.greyishWhite : COLORS.white,
          },
        ]}
      >
        {leftIcon && <CustomIcon Icon={leftIcon} height={16} width={16} />}
        <TextInput
          maxFontSizeMultiplier={1.3}
          style={[
            {
              height: "auto",
              paddingVertical: verticalScale(14),
              flex: 1,
              color: PALETTE.white,
            },
            inputStyle,
          ]}
          keyboardType={type === "number" ? "numeric" : "default"}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#C5C9D0"
          secureTextEntry={type === "password" && !isPasswordVisible}
          onChangeText={onChangeText}
          editable={
            type !== "date" &&
            type !== "time" &&
            type !== "dropdown" &&
            !disabled
          }
        />

        {/* {type === "dropdown" && (
          <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
            <CustomIcon Icon={ICONS.DropdownIcon} height={12} width={12} />
          </TouchableOpacity>
        )} */}

        {type === "password" && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <CustomIcon
              Icon={isPasswordVisible ? ICONS.EyeOnIcon : ICONS.EyeOffIcon}
              height={20}
              width={20}
            />
          </TouchableOpacity>
        )}

        {type === "number" && (
          <View>
            <TouchableOpacity
              style={[
                styles.numberButton,
                {
                  paddingTop: verticalScale(5),
                },
              ]}
              onPress={() => changeValueInNumber("up")}
            >
              <CustomIcon Icon={ICONS.ArrowUpIcon} height={10} width={10} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.numberButton,
                {
                  paddingBottom: verticalScale(5),
                },
              ]}
              onPress={() => changeValueInNumber("down")}
            >
              <CustomIcon Icon={ICONS.ArrowDownIcon} height={10} width={10} />
            </TouchableOpacity>
          </View>
        )}

        {(type === "date" || type === "time") && (
          <>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setPickerVisible(true)}
            >
              <CustomIcon
                Icon={type === "date" ? ICONS.CalendarIcon : ICONS.ClockIcon}
                height={20}
                width={20}
              />
            </TouchableOpacity>
            <DatePicker
              modal
              open={isPickerVisible}
              mode={type}
              date={selectedDate || new Date()}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              maximumDate={maxDate}
            />
          </>
        )}

        <Modal
          visible={showDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowDropdown(false)}
          >
            <View style={styles.dropdownContainer}>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleDropdownSelect(item.value)}
                  >
                    <CustomText fontFamily="regular" fontSize={14}>
                      {item.label}
                    </CustomText>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Pressable>
        </Modal>
      </TouchableOpacity>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.greyishWhite,
    paddingHorizontal: horizontalScale(14),
    borderRadius: verticalScale(12),
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  numberButton: {
    paddingHorizontal: horizontalScale(5),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: verticalScale(10),
    width: "80%",
    maxHeight: "50%",
  },
  dropdownItem: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.oldGrey + "20",
  },
});
