import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { PALETTE } from "../../utils/Colors";
import { verticalScale, wp } from "../../utils/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import PrimaryButton from "../PrimaryButton";
import AVATARS from "../../assets/avatars";

type SelectImageOptionsProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  onSelectAvatar: (imageUrl: string) => void;
  initialAvatar: string | null;
};

export const AVATARDATA = [
  {
    name: "Avatar1",
    icon: AVATARS.Avatar1,
  },
  {
    name: "Avatar2",
    icon: AVATARS.Avatar2,
  },
  {
    name: "Avatar3",
    icon: AVATARS.Avatar3,
  },
  {
    name: "Avatar4",
    icon: AVATARS.Avatar4,
  },
  {
    name: "Avatar5",
    icon: AVATARS.Avatar5,
  },
  {
    name: "Avatar6",
    icon: AVATARS.Avatar6,
  },
  {
    name: "Avatar7",
    icon: AVATARS.Avatar7,
  },
  {
    name: "Avatar8",
    icon: AVATARS.Avatar8,
  },
  {
    name: "Avatar9",
    icon: AVATARS.Avatar9,
  },
  {
    name: "Avatar10",
    icon: AVATARS.Avatar10,
  },
  {
    name: "Avatar11",
    icon: AVATARS.Avatar11,
  },
  {
    name: "Avatar12",
    icon: AVATARS.Avatar12,
  },
  {
    name: "Avatar13",
    icon: AVATARS.Avatar13,
  },
  {
    name: "Avatar14",
    icon: AVATARS.Avatar14,
  },
  {
    name: "Avatar15",
    icon: AVATARS.Avatar15,
  },
];

const SelectImageOptions: FC<SelectImageOptionsProps> = ({
  isModalVisible,
  setIsModalVisible,
  onSelectAvatar,
  initialAvatar,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    initialAvatar
  );

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSelectPress = () => {
    if (selectedAvatar) {
      onSelectAvatar(selectedAvatar);
      closeModal();
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent
      onRequestClose={closeModal}
      animationType="fade"
    >
      <TouchableOpacity
        onPress={closeModal}
        activeOpacity={1}
        style={styles.container}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(e) => e.stopPropagation()}
        >
          <View style={styles.titleContainer}>
            <CustomText
              fontSize={18}
              fontFamily="medium"
              style={{ textAlign: "center", color: PALETTE.white }}
            >
              Select Your Avatar
            </CustomText>
          </View>
          <FlatList
            data={AVATARDATA}
            numColumns={5}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => {
              const isSelected = item.name === selectedAvatar;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedAvatar(item.name)}
                  style={[
                    styles.avatarContainer,
                    isSelected && styles.selectedAvatarBorder,
                  ]}
                >
                  <CustomIcon
                    Icon={item.icon}
                    height={wp(10)} // Use a slightly smaller size to make the border visible
                    width={wp(10)}
                  />
                </TouchableOpacity>
              );
            }}
            // Use columnWrapperStyle for even spacing and a clean grid
            columnWrapperStyle={styles.avatarList}
          />
          <PrimaryButton
            title="Select"
            onPress={handleSelectPress}
            disabled={!selectedAvatar}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SelectImageOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: wp(90),
    backgroundColor: PALETTE.mysticPurple,
    gap: verticalScale(15),
    borderRadius: 28,
    padding: verticalScale(25),
  },
  titleContainer: {
    marginBottom: verticalScale(10),
  },
  // This style will be applied to each row of avatars
  avatarList: {
    justifyContent: "space-between",
    marginVertical: verticalScale(5),
  },
  avatarContainer: {
    flex: 1,
    aspectRatio: 1, // Ensures the container is a square
    justifyContent: "center", // Center icon horizontally
    alignItems: "center", // Center icon vertically
    borderRadius: wp(6),
    marginHorizontal: wp(1), // Add horizontal margin for spacing
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatarBorder: {
    borderColor: PALETTE.white, // Using a different color for better contrast
  },
});
