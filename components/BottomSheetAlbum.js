import React, { forwardRef, useState, useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import BottomSheet from "@devvie/bottom-sheet";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Foundation from "react-native-vector-icons/Foundation";
import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

const BottomSheetUI = forwardRef(({ height, onRefresh }, ref) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    namaAlbum: "",
    deskripsiAlbum: "",
  });
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

  const fetchUserDetail = async () => {
    try {
      const response = await client.get(`v1/show-user-detail?token=${token}`);
      console.log("album list user detail : ", response?.data);
      setUserData(response?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeMemberAlbum = async () => {
    try {
      const payload = {
        user_id: String(userData?.user_id),
        nama_album: formData?.namaAlbum,
        deskripsi_album: formData?.deskripsiAlbum,
      };
      const response = await client.post(
        `v2/store-album?token=${token}`,
        payload
      );
      console.log(response?.data, "RESPONSE IN BOTTOM SHEET ALBUM");
      if (response?.status === 200) {
        onRefresh();
        Alert.alert("Success", "Album berhasil ditambahkan!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("An error occured!", error?.response?.data.message);
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchUserDetail();
  }, []);

  console.log(formData, "BOTTOM SHEET ALBUM DATA FORM VALUE : ");

  return (
    <BottomSheet
      ref={ref}
      style={styles.container}
      animationType="slide"
      containerHeight={Dimensions.get("window").height + 75}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ width: "100%", marginTop: 30 }}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nama Album</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Album"
              value={formData.namaAlbum}
              onChangeText={(text) =>
                setFormData({ ...formData, namaAlbum: text })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Deskripsi Album</Text>
            <TextInput
              style={styles.input}
              placeholder="Deskripsi Album"
              value={formData.deskripsiAlbum}
              onChangeText={(text) =>
                setFormData({ ...formData, deskripsiAlbum: text })
              }
            />
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isLoading ? "#ccc" : "#A9329D" },
              ]}
              onPress={storeMemberAlbum}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Menambahkan Album..." : "Buat Album"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
});

export default BottomSheetUI;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 30,
    justifyContent: "center",
  },

  imagePreview: {
    height: 150,
    marginBottom: 30,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    borderStyle: "dashed",
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A9329D",
    minWidth: 100,
    padding: 8,
    borderRadius: 50,
    fontFamily: "Poppins-Regular",
  },
  buttonText: {
    fontFamily: "Poppins-Regular",
    color: "#fff",
    fontSize: 13,
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    fontFamily: "Poppins-Regular",
    backgroundColor: "#FFFFFF",
    height: 40,
    width: "100%",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    marginBottom: 25,
    padding: 10,
    borderRadius: 50,
  },
});
