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
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

const BottomSheetUI = forwardRef(
  ({ height, onRefresh, roomData, userData }, ref) => {
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

    const [image, setImage] = useState(null);

    return (
      <>
        <BottomSheet
          ref={ref}
          style={styles.container}
          animationType="slide"
          height={height}
          containerHeight={Dimensions.get("window").height + 75}
        >
          <View style={styles.contentContainer}>
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    position: "relative",
                  }}
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: 135,
                        height: 135,
                        borderRadius: 100,
                        marginBottom: 15,
                      }}
                    />
                  ) : userData?.foto_profil ? (
                    <Image
                      source={{ uri: userData.foto_profil }}
                      style={{
                        width: 135,
                        height: 135,
                        borderRadius: 100,
                        marginBottom: 15,
                      }}
                    />
                  ) : (
                    <View style={styles.imagePreview}>
                      <Text style={{ fontFamily: "Poppins-Regular" }}>
                        No image
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

                <View
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Bold",
                      fontSize: 16,
                    }}
                  >
                    Tobrut (tobat brutal)
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 13,
                    }}
                  >
                    Ruang Diskusi - 1 Member
                  </Text>
                  <TouchableOpacity style={{ marginBottom: 4 }}>
                    <MaterialIcon
                      name="info-outline"
                      size={20}
                      color="#A9329D"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 13,
                      color: "#7C7C7C",
                    }}
                  >
                    Dibuat oleh laksa, 14/12/05, 20.08
                  </Text>
                </View>
                <View style={{ width: "100%", marginTop: 30 }}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nama Album</Text>
                    <TextInput style={styles.input} placeholder="Nama Album" />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Deskripsi Album</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Deskripsi Album"
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#A9329D" }]}
                    >
                      <Text style={styles.buttonText}>Update Album</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </BottomSheet>
      </>
    );
  }
);

export default BottomSheetUI;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 30,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
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
    width: 135,
    height: 135,
    borderWidth: 2,
    borderRadius: 100,
    padding: 10,
    borderStyle: "dashed",
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  profileIconContainer: {
    position: "absolute",
    backgroundColor: "rgba(169, 50, 157, 0.60)",
    top: 10,
    right: 5,
    padding: 8,
    borderRadius: 24,
  },
});
