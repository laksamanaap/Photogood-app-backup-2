import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import RenderMasonryAlbum from "../components/RenderMasonryAlbum";
import AntDesign from "react-native-vector-icons/AntDesign";
import SearchAlbum from "../components/SearchAlbum";
import BottomSheetUI from "../components/BottomSheetAlbum";

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

export default function Album({ navigation }) {
  const [selectedCardID, setSelectedCardID] = useState(null);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [selectedCardImage, setSelectedCardImage] = useState(null);
  const [token, setToken] = useState(null);
  const [album, setAlbum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const openBottomSheet = (cardID, cardName, cardImage) => {
    sheetRef.current?.open();
  };

  const sheetRef = useRef(null);

  const handleNavigation = (albumID) => {
    navigation.navigate("AlbumDetail", { id_album: albumID });
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

  const fetchMemberAlbum = async () => {
    try {
      const response = await client.get(`v2/show-album?token=${token}`);
      // console.log("member album list", response?.data);
      setAlbum(response?.data);
      setLoading(false);
    } catch (error) {
      console.log(error, "Error Album");
      setLoading(false);
      if (error?.response.status === 401) {
        setLoading(true);
        Alert.alert(
          "An error occurred!",
          "Anda harus menjadi member terlebih dahulu untuk mengakses album!",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Home");
              },
            },
          ]
        );
      }
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchMemberAlbum();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchMemberAlbum();
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAlbumSearchResults = (results) => {
    console.log(results, "RESULT SEARCH ALBUM");
    setAlbum(results);
  };

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
        <View style={styles.albumTop}>
          <Text style={styles.albumTitle}>Jelajahi Album</Text>
          <TouchableOpacity
            style={styles.albumIcon}
            onPress={() => openBottomSheet()}
          >
            <AntDesign name="pluscircle" size={25} color="#A9329D" />
          </TouchableOpacity>
        </View>
        <SearchAlbum onSearchResults={handleAlbumSearchResults} />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {album.length > 0 ? (
          <RenderMasonryAlbum album={album} navigation={handleNavigation} />
        ) : (
          <View style={styles.textWrapper}>
            <Text style={styles.textBookmark}>
              Album anda kosong! Tambahkan album untuk memulai.
            </Text>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => openBottomSheet()}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Tambah Album
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      <BottomSheetUI ref={sheetRef} height={600} onRefresh={onRefresh} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 30 },
  albumTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  albumTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textBookmark: {
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  textWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 30,
    gap: 16,
  },
  button: {
    width: "50%",
    backgroundColor: "#A9329D",
    padding: 4,
    borderRadius: 50,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
