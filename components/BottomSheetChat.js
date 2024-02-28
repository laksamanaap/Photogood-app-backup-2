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
  const pickImage = async (sourceType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      sourceType: sourceType,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    namaAlbum: "",
    deskripsiAlbum: "",
  });

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
      height={height}
      containerHeight={Dimensions.get("window").height + 75}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.imagePreview}>
          {image && (
            <Image source={{ uri: image }} style={styles.previewImage} />
          )}
          {!image && (
            <Text style={{ fontFamily: "Poppins-Regular" }}>
              No image selected
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => pickImage(ImagePicker.MediaTypeOptions.Images)}
          >
            <Text style={styles.buttonText}>Unggah Gambar</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: "Poppins-Regular", marginBottom: 12 }}>
            Atau
          </Text>
          <TouchableOpacity style={styles.button} onPress={pickFromCamera}>
            <Text style={styles.buttonText}>Kamera</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 12 }}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nama Ruang</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Ruang"
              value={formData.namaAlbum}
              onChangeText={(text) =>
                setFormData({ ...formData, namaAlbum: text })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Deskripsi Ruang</Text>
            <TextInput
              style={styles.input}
              placeholder="Deskripsi Ruang"
              value={formData.deskripsiAlbum}
              onChangeText={(text) =>
                setFormData({ ...formData, deskripsiAlbum: text })
              }
            />
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isLoading ? "#ccc" : "#A9329D" },
            ]}
          >
            <Text style={styles.buttonText}>Buat Ruang</Text>
          </TouchableOpacity>
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
    marginBottom: 30,
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
    padding: 6,
    borderRadius: 50,
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: "Poppins-Regular",
    color: "#fff",
    fontSize: 12,
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
  imagePreview: {
    maxWidth: 320,
    height: 200,
    marginBottom: 30,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    width: "100%",
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
});
