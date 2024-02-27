import React, { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
} from "react-native";

const RenderMasonryList = ({
  gif,
  gifID,
  openBottomSheetGIF,
  fetchData,
  navigation,
}) => {
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

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flexDirection: "row", paddingBottom: 100 }}>
          {evenItems.length > 0 || oddItems.length > 0 ? (
            <>
              <View style={{ flex: 1, flexDirection: "column" }}>
                {evenItems.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        openBottomSheetGIF(
                          item.foto_id,
                          item.judul_foto,
                          item.lokasi_file
                        )
                      }
                    >
                      <View
                        style={[styles.card, { height: getRandomHeight() }]}
                      >
                        <Image
                          source={{ uri: item.lokasi_file }}
                          style={styles.image}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={{ flex: 1, flexDirection: "column" }}>
                {oddItems.map((item, index) => {
                  console.log("item from odditems : ", item);
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        openBottomSheetGIF(
                          item.foto_id,
                          item.judul_foto,
                          item.lokasi_file
                        )
                      }
                    >
                      <View
                        style={[styles.card, { height: getRandomHeight() }]}
                      >
                        <Image
                          source={{ uri: item.lokasi_file }}
                          style={styles.image}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : (
            <View style={styles.notFoundWrapper}>
              <Image
                style={styles.notFoundImage}
                source={require("../assets/images/404-not-found-unscreen.gif")}
                resizeMode="contain"
              />
              <View style={styles.notFoundTextWrapper}>
                <Text style={styles.notFoundTitle}>Gif tidak ditemukan</Text>
                <Text style={styles.notFoundSubtitle}>
                  Jadilah orang pertama yang mengupload gif!
                </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Upload")}
              >
                <Text style={styles.buttonText}>Unggah Foto</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </>
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
  notFoundWrapper: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundTextWrapper: {
    flexDirection: "column",
    alignItems: "center",
  },
  notFoundImage: {
    flexDirection: "row",
    justifyContent: "center",
    width: 250,
    height: 250,
  },
  notFoundTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
  },
  notFoundSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9548F7",
    fontFamily: "Poppins-Regular",
    marginTop: 16,
    minWidth: 100,
    padding: 8,
    borderRadius: 50,
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    color: "#fff",
    fontSize: 12,
  },
});

export default RenderMasonryList;
