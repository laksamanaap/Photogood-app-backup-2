import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Button,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import React, { Component, useState, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

const SearchHistory = ({ onSearchResults }) => {
  const [searchLikeQuery, setSearchLikeQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

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

  const handleSearch = async () => {
    if (!searchLikeQuery) {
      Alert.alert("An error occured!", "Text input tidak boleh kosong");
      return;
    }
    try {
      setLoading(true);
      const response = await client.get(
        `/search-history?like_foto=${searchLikeQuery}&download_foto=${searchLikeQuery}&token=${token}`
      );
      console.log("Response in searching history : ", response.data);
      onSearchResults(response?.data);
    } catch (error) {
      console.log("Error searching photos:", error);
      Alert.alert("An error occured!", error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.inputSearchContainer}>
      <AntDesign name="search1" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.inputSearch}
        placeholder="Temukan riwayat anda"
        onChangeText={(text) => setSearchLikeQuery(text)}
        onSubmitEditing={handleSearch}
      />
    </View>
  );
};

export default SearchHistory;

const styles = StyleSheet.create({
  inputSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECECEC",
    height: 40,
    width: "100%",
    borderRadius: 50,
    paddingHorizontal: 15,
  },
  inputSearch: {
    flex: 1,
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  icon: {
    marginRight: 10,
  },
});
