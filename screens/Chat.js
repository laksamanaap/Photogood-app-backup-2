import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import SearchRoom from "../components/SearchRoom";
import AntDesign from "react-native-vector-icons/AntDesign";
import BottomSheetUI from "../components/BottomSheetChat";
import ChatList from "../components/ChatList";
import client from "../utils/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export default function Chat({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const sheetRef = useRef(null);

  const getTokenFromStorage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken !== null) {
        setToken(storedToken);
        console.log("token settings : ", storedToken);
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };

  const handleSearchRoom = (results) => {};

  const openBottomSheet = (cardID, cardName, cardImage) => {
    sheetRef.current?.open();
  };

  const fetchUserChat = async () => {
    try {
      const response = await client.get(`v1/show-all-room?token=${token}`);
      setChatData(response?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUserChat();
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchUserChat();
  }, []);

  console.log(chatData, "CHAT DATA ALL RESPONSEE");

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A9329D" />
      </View>
    );
  }

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
        <ScrollView
          contentContainerStyle={{
            marginTop: 32,
            marginBottom: 48,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ChatList
            chatData={chatData}
            navigation={navigation}
            onRefresh={onRefresh}
          />
        </ScrollView>
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
    marginBottom: 30,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  chatAvatarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  chatAvatarTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  chatAvatarSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  chatAvatarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
