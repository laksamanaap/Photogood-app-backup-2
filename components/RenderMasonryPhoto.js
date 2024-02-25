import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";

const RenderMasonryList = ({ gif, photo, openBottomSheetPhoto, fetchData }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getRandomHeight = () => {
    return Math.floor(Math.random() * 200) + 100;
  };

  const oddItems = gif.filter((_, index) => index % 2 !== 0);
  const evenItems = gif.filter((_, index) => index % 2 === 0);

  console.log(oddItems, "Photo section");
  console.log(evenItems, "Photo section");

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flexDirection: "row", paddingBottom: 100 }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          {oddItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                openBottomSheetPhoto(
                  item.foto_id,
                  item.judul_foto,
                  item.lokasi_file
                )
              }
            >
              <View style={[styles.card, { height: getRandomHeight() }]}>
                <Image
                  source={{ uri: item.lokasi_file }}
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flex: 1, flexDirection: "column" }}>
          {evenItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                openBottomSheetPhoto(
                  item.foto_id,
                  item.judul_foto,
                  item.lokasi_file
                )
              }
            >
              <View style={[styles.card, { height: getRandomHeight() }]}>
                <Image
                  source={{ uri: item.lokasi_file }}
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default RenderMasonryList;
