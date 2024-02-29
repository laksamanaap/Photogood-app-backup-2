import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

export default function ChatBubble({ message }) {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

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

  const fetchUserDetail = async () => {
    try {
      const response = await client.get(`v1/show-user-detail?token=${token}`);
      console.log("bookmark user detail : ", response?.data);
      setUserData(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const isCurrentUser = message?.user_id === userData?.user_id;
  console.log(isCurrentUser, "CURRENT USER GA???");

  const flexDirection = isCurrentUser ? "row-reverse" : "row";
  const userImageAlignment = isCurrentUser
    ? styles.userImageRight
    : styles.userImageLeft;
  const imageSource = message?.user?.foto_profil
    ? { uri: message?.user?.foto_profil }
    : require("../assets/images/profile-image.png");

  const formatDate = (createdAt) => {
    const today = moment().startOf("day");
    const messageDate = moment(createdAt);
    const diffDays = today.diff(messageDate, "days");

    if (diffDays === 0) {
      return messageDate.format("HH:mm");
    } else if (diffDays === 1) {
      return "Kemarin";
    } else if (diffDays < 7) {
      return `${diffDays} hari yang lalu`;
    } else {
      return messageDate.format("D MMM YYYY");
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchUserDetail();
  }, []);

  return (
    <>
      <View style={[styles.container, { flexDirection }]}>
        <Image
          source={imageSource}
          style={[
            styles.userAvatar,
            userImageAlignment,
            {
              marginLeft: isCurrentUser ? 0 : 16,
              marginRight: isCurrentUser ? 16 : 0,
            },
          ]}
        />
        <View
          style={[
            styles.messageContainer,
            {
              backgroundColor: isCurrentUser ? "#A9329D" : "#FFFFFF",
              borderRadius: 16,
              marginRight: isCurrentUser ? 8 : 0,
              marginLeft: isCurrentUser ? 0 : 8,
              marginTop: 8,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {!isCurrentUser ? (
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  color: isCurrentUser ? "white" : "black",
                  fontSize: 13,
                }}
              >
                {message?.user?.username}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  color: isCurrentUser ? "white" : "black",
                  fontSize: 13,
                }}
              >
                Anda
              </Text>
            )}
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                color: isCurrentUser ? "white" : "black",
                fontSize: 10,
              }}
            >
              {formatDate(message?.created_at)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: isCurrentUser ? "white" : "black",
                fontFamily: "Poppins-Regular",
                fontSize: 11,
                textAlign: "left",
              }}
            >
              {message.isi_pesan}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  messageContainer: {
    minWidth: "35%",
    maxWidth: "70%",
    padding: 8,
  },

  userAvatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    resizeMode: "cover",
    objectFit: "cover",
  },
});
