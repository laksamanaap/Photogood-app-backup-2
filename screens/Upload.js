import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

export default function Upload() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([
    { label: "Hewan", value: "Hewan" },
    { label: "Tumbuhan", value: "Banana" },
  ]);

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userStatus, setUserStatus] = useState("1");
  const [memberId, setMemberId] = useState(null);

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
      console.log("upload user detail : ", response?.data);
      setUserData(response?.data);
      setUserStatus(response?.data.status);
      setMemberId(response?.data?.member?.member_id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchUserDetail();
  }, []);

  const pickImage = async (sourceType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
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
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  // Guest
  const handleUpload = async () => {
    console.log(
      "==================== guest upload ============================"
    );
    if (!image) {
      Alert.alert("An error occured!", "Pilih foto terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      const imageUriParts = image.split(".");
      const imageExtension = imageUriParts[imageUriParts.length - 1];
      const imageType = `image/${imageExtension}`;

      if (
        imageType === "image/jpeg" ||
        imageType === "image/png" ||
        imageType === "image/jpg" ||
        imageType === "image/gif" ||
        imageType === "image/svg"
      ) {
        formData.append("images", {
          uri: image,
          name: "photo.jpg",
          type: imageType,
        });
      } else {
        Alert.alert("Error", "Only image files are allowed.");
        setIsLoading(false);
        return;
      }

      // Temporary
      formData.append("judul_foto", "laksa");
      formData.append("deskripsi_foto", "melody");
      formData.append("user_id", userData?.user_id);
      formData.append("kategori_id", "1");
      formData.append("type_foto", "GIF");
      formData.append("status", "1");

      const responseMember = await client.post(
        "/v1/store-guest-photo",
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("responseMember Upload Photo:", responseMember.data);
      Alert.alert(
        "Success",
        "Foto berhasil diunggah",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Home", { onRefreshHome: onRefreshHome });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("An error occured", error?.response.data.message);
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  // Member
  const handleMemberUpload = async () => {
    console.log(
      "==================== member upload ============================"
    );

    if (!image) {
      Alert.alert("An error occured!", "Pilih foto terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      const imageUriParts = image.split(".");
      const imageExtension = imageUriParts[imageUriParts.length - 1];
      const imageType = `image/${imageExtension}`;

      if (
        imageType === "image/jpeg" ||
        imageType === "image/png" ||
        imageType === "image/jpg" ||
        imageType === "image/gif" ||
        imageType === "image/svg"
      ) {
        formData.append("images", {
          uri: image,
          name: "photo.jpg",
          type: imageType,
        });
      } else {
        Alert.alert("Error", "Only image files are allowed.");
        setIsLoading(false);
        return;
      }

      // Temporary
      formData.append("judul_foto", "laksa");
      formData.append("deskripsi_foto", "melody");
      formData.append("user_id", userData?.user_id);
      formData.append("member_id", memberId);
      formData.append("kategori_id", "1");
      formData.append("type_foto", "GIF");
      formData.append("status", "1");

      const responseMember = await client.post(
        "/v2/store-member-photo",
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("responseMember Upload Photo:", responseMember.data);
      Alert.alert(
        "Success",
        "Foto berhasil diunggah",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Home", { onRefreshHome: onRefreshHome });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("An error occured", error?.response.data.message);
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const onRefresh = async () => {
    console.log("============= REFRESHING UPLOAD ===============");
    setRefreshing(true);
    try {
      await fetchUserDetail();
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  // Fetch Data
  const fetchGIFData = async () => {
    try {
      const response = await client.get("/get-all-gif");
      setGIF(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPhotoData = async () => {
    try {
      const response = await client.get("/get-all-photo");
      setPhoto(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVectorData = async () => {
    try {
      const response = await client.get("/get-all-vector");
      setVector(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      await fetchGIFData();
      await fetchPhotoData();
      await fetchVectorData();
    } catch (error) {
      console.log(error);
    }
  };

  const onRefreshHome = async () => {
    console.log("============= REFRESHING HOME ===============");
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
    }
  };

  console.log("Image Value : ", image);
  console.log("userData upload : ", userData);
  console.log("member id upload : ", memberId);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A9329D" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.imagePreview}>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
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
        <Text>Atau</Text>
        <TouchableOpacity style={styles.button} onPress={pickFromCamera}>
          <Text style={styles.buttonText}>Kamera</Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: "100%", marginTop: 30 }}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Judul Foto</Text>
          <TextInput style={styles.input} placeholder="Judul Foto" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Deskripsi Foto</Text>
          <TextInput style={styles.input} placeholder="Deskripsi Foto" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kategori Foto</Text>
          {/* <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={{
              borderWidth: 0,
              backgroundColor: "#ECECEC",
            }}
            dropDownContainerStyle={{
              borderWidth: 0,
              backgroundColor: "white",
            }}
            textStyle={{
              color: "#888",
              fontFamily: "Poppins-Regular",
            }}
            arrowStyle={{
              color: "#888",
            }}
          /> */}
        </View>
        <View style={{ marginTop: 25 }}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isLoading ? "#ccc" : "#A9329D" },
            ]}
            onPress={userStatus === "2" ? handleMemberUpload : handleUpload}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Mengunggah..." : "Unggah Foto"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  imagePreview: {
    width: 300,
    height: 200,
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
  button: {
    display: "flex",
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
    fontSize: 14,
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
    backgroundColor: "#ECECEC",
    height: 40,
    width: "100%",
    borderColor: "#ECECEC",
    borderWidth: 1,
    marginBottom: 25,
    padding: 10,
    borderRadius: 50,
  },
});
