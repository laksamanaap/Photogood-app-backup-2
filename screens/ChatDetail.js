import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import ChatBubbleList from "../components/ChatBubbleList";
import { useRoute } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

export default function ChatDetail({ navigation }) {
  const route = useRoute();
  const { ruang_id } = route?.params;
  const [messageText, setMessageText] = useState("");
  const [token, setToken] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  console.log(ruang_id, "ID RUANGAAN COK SUMPEK AKU");

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

  const handleMessageText = (text) => {
    setMessageText(text);
  };

  const fetchUserDetail = async () => {
    try {
      const response = await client.get(`v1/show-user-detail?token=${token}`);
      console.log("bookmark user detail : ", response?.data);
      setUserData(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoomDetail = async () => {
    try {
      const response = await client.get(
        `v1/show-room-messages?token=${token}&ruang_id=${ruang_id}`
      );
      console.log(response?.data, "RUANGAN DETAILLLLLLLLLLLLL");
      setRoomData(response?.data);
    } catch (error) {
      console.error("Error fethcing room detail : ", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRoomDetail();
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const storeUserChat = async () => {
    try {
      const payload = {
        isi_pesan: messageText,
        ruang_id: ruang_id,
        user_id: String(userData?.user_id),
      };
      const response = await client.post(
        `v1/store-message?token=${token}`,
        payload
      );
      console.log(
        response?.data,
        `STORE USER CHAT IN ROOM ${roomData?.nama_ruang}`
      );
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchUserDetail();
    fetchRoomDetail();
  }, []);

  console.log(messageText, "MESSAGE TEXTTTTTTTTTTTTTTT");

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowRadius: 4,
          elevation: 5,
          backgroundColor: "#fff",
        }}
      >
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                marginTop: 16,
                marginLeft: 16,
                backgroundColor: "#A9329D",
                borderRadius: 50,
                padding: 4,
              }}
            >
              <Entypo name="chevron-left" size={20} color="white" />
            </View>
          </TouchableOpacity>
          <View style={styles.imageWrapper}>
            {roomData?.profil_ruang ? (
              <Image
                source={{ uri: roomData?.profil_ruang }}
                style={styles.chatAvatar}
              />
            ) : (
              <Image
                source={require("../assets/images/placeholder-image-3.png")}
                style={styles.chatAvatar}
              />
            )}
            <View style={styles.marginContainer}>
              <Text style={styles.AlbumTitle}>{roomData?.nama_ruang}</Text>
              <Text style={styles.AlbumSubtitle}>
                {roomData?.member?.length} Anggota
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={{ marginTop: 52, marginRight: 16 }}>
          <Feather
            name={"more-horizontal"}
            style={{ color: "#A9329D", fontSize: 24 }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {roomData?.messages.length > 0 ? (
          <ChatBubbleList chatData={roomData?.messages} onRefresh={onRefresh} />
        ) : (
          <Text>gaenek</Text>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan Anda di sini..."
          value={messageText}
          onChangeText={handleMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={storeUserChat}>
          <Text style={styles.sendButtonText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 12,
    gap: 16,
  },
  chatAvatar: {
    marginTop: 16,
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  AlbumTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  AlbumSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  marginContainer: {
    marginTop: 18,
  },
  imageWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#A9329D",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: "white",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
});
