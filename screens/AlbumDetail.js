import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import RenderMasonryAlbumDetail from "../components/RenderMasonryAlbumDetail";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import { useRoute } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

export default function AlbumDetail({ navigation }) {
  const route = useRoute();
  const { id_album } = route?.params;
  const [token, setToken] = useState(null);
  const [albumData, setAlbumData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  console.log(id_album, "ID ALBUM RAWRRRRRRRRRR");

  const [gif, setGif] = useState([
    {
      name: "Album kenangan",
      index: 1,
      image: require("../assets/images/bunga.png"),
      totalData: 14,
    },
    {
      name: "Album kenangan",
      index: 2,
      image: require("../assets/images/kucing.png"),
      totalData: 12,
    },
    {
      name: "Album kenangan",
      index: 3,
      image: require("../assets/images/gigi.png"),
      totalData: 24,
    },
    {
      name: "Album kenangan",
      index: 4,
      image: require("../assets/images/gigi.png"),
      totalData: 24,
    },
    {
      name: "Album kenangan",
      index: 5,
      image: require("../assets/images/gigi.png"),
      totalData: 24,
    },
    {
      name: "Album kenangan",
      index: 5,
      image: require("../assets/images/gigi.png"),
      totalData: 24,
    },

    {
      name: "Album kenangan",
      index: 5,
      image: require("../assets/images/gigi.png"),
      totalData: 24,
    },
    {
      name: "Album kenangan",
      index: 5,
      image: require("../assets/images/gigi.png"),
      totalData: 24,
    },
    {
      name: "Album kenangan",
      index: 5,
      image: require("../assets/images/gigi.png"),
      totalData: 24,
    },
    {
      name: "Album kenangan",
      index: 5,
      image: require("../assets/images/gigi.png"),
      totalData: 24,
    },
  ]);

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

  const fetchAlbumDetail = async () => {
    try {
      const response = await client.get(
        `v2/show-detail-album/${id_album}?token=${token}`
      );
      // console.log(response?.data, "Response Album Detail RAWRRRRRR");
      setAlbumData(response?.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAlbumDetail();
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const deleteAlbumBoomarks = async () => {
    console.log(selectedPhotos, "BOOKMARK SELECTED!");
    try {
      const payload = {
        bookmark_ids: selectedPhotos,
      };
      const response = await client.post(
        `v2/delete-bookmark?token=${token}`,
        payload
      );
      console.log(response?.data);
      Alert.alert("Success", "Berhasil menghapus bookmark!");
      setTimeout(() => {
        onRefresh();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchAlbumDetail();
  }, []);

  console.log(albumData, "ALBUM DATA RAWWWWWWR");

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A9329D" />
      </View>
    );
  }

  console.log(selectedPhotos, "SELECTED PHOTOS TO DELETED");

  return (
    <>
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
            <Entypo name="chevron-left" size={26} color="white" />
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <View style={styles.marginContainer}>
              <Text style={styles.AlbumTitle}>{albumData?.nama_album}</Text>
              <Text style={styles.AlbumSubtitle}>
                {albumData?.total_bookmark_data} Foto
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.buttonIcon,
                { opacity: selectedPhotos.length === 0 ? 0.4 : 1 },
              ]}
              disabled={selectedPhotos.length === 0}
              onPress={deleteAlbumBoomarks}
            >
              <Feather
                name={"trash-2"}
                style={{ color: "#FFF", fontSize: 14 }}
              />
            </TouchableOpacity>
          </View>
          <Text>Edit</Text>
        </View>
      </View>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {albumData?.bookmark_fotos.length > 0 ? (
          <RenderMasonryAlbumDetail
            gif={albumData}
            selectedPhotos={selectedPhotos}
            setSelectedPhotos={setSelectedPhotos}
          />
        ) : (
          <View style={styles.textWrapper}>
            <Text style={styles.textBookmark}>
              Album kosong! Tambahkan foto untuk memulai.
            </Text>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Home")}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Cari Foto
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    gap: 16,
  },
  marginContainer: {
    marginTop: 18,
  },
  container: {
    paddingHorizontal: 30,
    marginTop: 24,
  },
  AlbumTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  AlbumSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
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
  buttonIcon: {
    width: 23,
    backgroundColor: "#A9329D",
    padding: 4,
    borderRadius: 50,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
