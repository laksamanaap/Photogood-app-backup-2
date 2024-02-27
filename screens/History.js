import { Text, StyleSheet, View, Image, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import SearchHistory from "../components/SearchHistory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

export default function History() {
  const [downdloadData, setDownloadData] = useState(null);
  const [likeData, setLikeData] = useState(null);

  const fetchLikeData = async () => {
    try {
      const response = await client.get("/v1/show-user-like");
      setLikeData(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDownloadData = async () => {
    try {
      const response = await client.get("/v1/show-user-download");
      setDownloadData(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDownloadData();
    fetchLikeData();
  }, []);

  console.log(likeData, "LIKE DATA IN HISTORY");
  console.log(downdloadData, "DOWNLOAD DATA IN HISTORY");

  return (
    <View style={styles.container}>
      <SearchHistory />
      <ScrollView>
        <View style={styles.historyWrapper}>
          <Image
            style={styles.historyImage}
            source={require("../assets/images/placeholder-image.png")}
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text style={styles.text}>Anda baru saja menjadi member</Text>
          </View>
        </View>
        <View style={styles.historyWrapper}>
          <Image
            style={styles.historyImage}
            source={require("../assets/images/placeholder-image.png")}
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              Anda baru saja mendownload gambar berjudul "laksa"
            </Text>
          </View>
        </View>
        <View style={styles.historyWrapper}>
          <Image
            style={styles.historyImage}
            source={require("../assets/images/placeholder-image.png")}
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              Anda baru saja mendownload gambar berjudul "laksa"
            </Text>
          </View>
        </View>
        <View style={styles.historyWrapper}>
          <Image
            style={styles.historyImage}
            source={require("../assets/images/placeholder-image.png")}
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              Anda baru saja mendownload gambar berjudul "laksa"
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 35,
  },
  historyWrapper: {
    marginTop: 20,
    gap: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  historyImage: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
  },
});
