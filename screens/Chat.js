import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import SearchRoom from "../components/SearchRoom";
import AntDesign from "react-native-vector-icons/AntDesign";
import BottomSheetUI from "../components/BottomSheetChat";
import * as ImagePicker from "expo-image-picker";

export default function Chat() {
  const [refreshing, setRefreshing] = useState(false);
  const sheetRef = useRef(null);

  const handleSearchRoom = (results) => {};

  const openBottomSheet = (cardID, cardName, cardImage) => {
    sheetRef.current?.open();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerTitle}>Forum Diskusi</Text>
          <TouchableOpacity
            style={styles.albumIcon}
            onPress={() => openBottomSheet()}
          >
            <AntDesign name="pluscircle" size={25} color="#A9329D" />
          </TouchableOpacity>
        </View>
        <SearchRoom onSearchResults={handleSearchRoom} />
        {/* For Room Discuss List */}
        <ScrollView></ScrollView>
      </View>
      <BottomSheetUI ref={sheetRef} height={625} onRefresh={onRefresh} />
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  topContainerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  container: {
    padding: 30,
  },
});
