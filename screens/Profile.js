import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  AppState,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

export default function Profile() {
  const [image, setImage] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    nama_lengkap: "",
    email: "",
    alamat: "",
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

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
      console.log("settings user detail : ", response?.data);
      setUserData(response?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUserDetail();
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const updateUserDetail = async () => {
    if (!formData.alamat && userData?.alamat) {
      formData.alamat = userData.alamat;
    }

    if (!formData.nama_lengkap && userData?.nama_lengkap) {
      formData.nama_lengkap = userData.nama_lengkap;
    }

    if (!formData.nama_lengkap && !formData.alamat) {
      Alert.alert("An error occurred!", "Nama lengkap dan alamat harus diisi!");
      return;
    } else if (!formData.alamat) {
      Alert.alert("An error occurred!", "Alamat harus diisi!");
      return;
    } else if (!formData.nama_lengkap) {
      Alert.alert("An error occurred!", "Nama lengkap harus diisi!");
      return;
    }

    try {
      const payload = {
        alamat: formData.alamat || userData?.alamat,
        email: formData.email || userData?.email,
        username: formData.username || userData?.username,
        nama_lengkap: formData.nama_lengkap || userData?.nama_lengkap,
      };

      const response = await client.post(
        `v1/update-user-detail?token=${token}`,
        payload
      );

      // Store foto_profil (if there is an image)
      if (image) {
        const imageData = new FormData();
        imageData.append("images", {
          uri: image,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        const responsePhoto = await client.post(
          `/v1/store-user-photo?token=${token}`,
          imageData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(responsePhoto, "responsePhoto fetch in profile : ");
        onRefresh();
      }

      Alert.alert("Success", "Berhasil update user data!");
      onRefresh();
      console.log(response, "response fetch in profile : ");
    } catch (error) {
      Alert.alert("An Error Occured!", error);
      console.error(error, "error in profile : ");
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchUserDetail();
    // updateUserDetail();
  }, []);

  // console.log(formData);
  console.log(image, "IMAGE PROFILE ");
  console.log(userData, "PROFILE USER DATA : ");
  console.log(formData, "PROFILE FORM DATA : ");

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A9329D" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, alignItems: "center" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              marginBottom: 15,
            }}
          />
        ) : userData?.foto_profil ? (
          <Image
            source={{ uri: userData.foto_profil }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              marginBottom: 15,
            }}
          />
        ) : (
          <View style={styles.imagePreview}>
            <Text style={{ fontFamily: "Poppins-Regular" }}>
              No image selected
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => pickImage()}
          style={styles.profileIconContainer}
        >
          <MaterialIcon name="photo-camera" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: "100%", padding: 40 }}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, !isEditable && styles.disabledInput]}
            placeholder="Username"
            defaultValue={userData?.username}
            onChangeText={(value) =>
              setFormData({ ...formData, username: value })
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={[styles.input, !isEditable && styles.disabledInput]}
            placeholder="Nama Lengkap"
            defaultValue={userData?.nama_lengkap}
            onChangeText={(value) =>
              setFormData({ ...formData, nama_lengkap: value })
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !isEditable && styles.disabledInput]}
            placeholder="Email"
            defaultValue={userData?.email}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={[styles.input, !isEditable && styles.disabledInput]}
            placeholder="Alamat"
            defaultValue={userData?.alamat}
            onChangeText={(value) =>
              setFormData({ ...formData, alamat: value })
            }
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => updateUserDetail()}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 16,
              fontFamily: "Poppins-Regular",
            }}
          >
            Edit Profile
          </Text>
          {isSaving && <ActivityIndicator size="small" color="#ffffff" />}
        </TouchableOpacity>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileIconContainer: {
    position: "absolute",
    backgroundColor: "rgba(169, 50, 157, 0.60)",
    top: 10,
    right: 0,
    padding: 8,
    borderRadius: 24,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderRadius: 100,
    padding: 10,
    borderStyle: "dashed",
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    resizeMode: "cover",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    marginBottom: 10,
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  input: {
    backgroundColor: "#ECECEC",
    height: 40,
    width: "100%",
    borderColor: "#ECECEC",
    borderWidth: 1,
    marginBottom: 25,
    padding: 10,
    borderRadius: 50,
    fontFamily: "Poppins-Regular",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#A9329D",
    gap: 16,
    padding: 10,
    borderRadius: 50,
  },
  disabledInput: {
    backgroundColor: "#dedede",
  },
});
