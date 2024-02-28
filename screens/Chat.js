import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import SearchRoom from "../components/SearchRoom";
import AntDesign from "react-native-vector-icons/AntDesign";
import BottomSheetUI from "../components/BottomSheetChat";
import client from "../utils/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Chat() {
  const [refreshing, setRefreshing] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [token, setToken] = useState(null);
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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchUserChat = async () => {
    try {
      const response = await client.get(`v1/show-all-room?token=${token}`);
      setChatData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserChat();
  }, []);

  console.log(chatData, "CHAT DATA ALL RESPONSEE");

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
        <ScrollView contentContainerStyle={{ marginTop: 32 }}>
          {chatData?.length > 0 ? (
            chatData?.map((chat, index) => (
              <TouchableOpacity style={styles.chatAvatarContainer} key={index}>
                <View style={styles.chatAvatarWrapper}>
                  {chat?.profil_ruang ? (
                    <Image
                      source={{ uri: chat?.profil_ruang }}
                      style={styles.chatAvatar}
                    />
                  ) : (
                    <Image
                      source={require("../assets/images/placeholder-image-3.png")}
                      style={styles.chatAvatar}
                    />
                  )}
                  <View>
                    <Text style={styles.chatAvatarTitle}>
                      {chat?.nama_ruang}
                    </Text>
                    <Text style={styles.chatAvatarSubtitle}>
                      {chat?.lastMessage ? (
                        <Text>al</Text>
                      ) : (
                        <Text>
                          {chat?.owner?.username} Baru saja membuat grup ini
                        </Text>
                      )}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chatAvatarSubtitle, { marginTop: 4 }]}>
                  {chat?.lastMessage ? (
                    <Text>Last Message</Text>
                  ) : (
                    <Text>{chat?.created_at}</Text>
                  )}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Takde chat</Text>
          )}
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
    marginBottom: 20,
  },
});
