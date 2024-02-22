import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import Card from "../components/Card";
import { useRoute } from "@react-navigation/native";

import SearchGIF from "../components/SearchGIF";
import SearchPhotos from "../components/SearchPhotos";
import SearchVector from "../components/SearchVector";

import BottomSheetUI from "../components/BottomSheetUI";
import BottomSheetGIF from "../components/BottomSheetGIF";
import BottomSheetPhoto from "../components/BottomSheetPhoto";
import BottomSheetVector from "../components/BottomSheetVector";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import RenderMasonryPhoto from "../components/RenderMasonryPhoto";
import RenderMasonryGif from "../components/RenderMasonryGif";
import RenderMasonryVector from "../components/RenderMasonryVector";

import client from "../utils/client";

export default function Home({ navigation }) {
  const route = useRoute();
  const routes = route;
  const handleRefresh = routes?.params?.onRefreshHome;

  const [searchResults, setSearchResults] = useState([]);

  const [selectedCardID, setSelectedCardID] = useState(null);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [selectedCardImage, setSelectedCardImage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedGIFID, setSelectedGIFID] = useState(null);

  const [selectedPhotoID, setSelectedPhotoID] = useState(null);

  const [selectedVectorID, setSelectedVectorID] = useState(null);

  // State Fetch Temporary Data
  const [gifExample, setGif] = useState([
    {
      name: "Ini Gif Satu",
      index: 1,
      image: require("../assets/images/bunga.png"),
    },
    {
      name: "Ini Gif Dua",
      index: 2,
      image: require("../assets/images/kucing.png"),
    },
    {
      name: "Ini Gif Tiga",
      index: 3,
      image: require("../assets/images/gigi.png"),
    },
    {
      name: "Ini Gif Empat",
      index: 4,
      image: require("../assets/images/kucing.png"),
    },
    {
      name: "Ini Gif Lima",
      index: 5,
      image: require("../assets/images/gigi.png"),
    },
    {
      name: "Ini Gif Enam",
      index: 6,
      image: require("../assets/images/bunga.png"),
    },
    {
      name: "Ini Gif Satu",
      index: 7,
      image: require("../assets/images/placeholder-image-3.png"),
    },
    {
      name: "Ini Gif Satu",
      index: 8,
      image: require("../assets/images/placeholder-image-3.png"),
    },
    {
      name: "Ini Gif Satu",
      index: 9,
      image: require("../assets/images/placeholder-image-3.png"),
    },
    {
      name: "Ini Gif Satu",
      index: 10,
      image: require("../assets/images/placeholder-image-3.png"),
    },
  ]);

  // State Fetch Main Data
  const [gif, setGIF] = useState([]);
  const [vector, setVector] = useState([]);
  const [photo, setPhoto] = useState([]);

  const [activeCategory, setActiveCategory] = useState("gif");

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
  };

  const sheetRef = useRef(null);
  const sheetRefGIF = useRef(null);

  // Open Bottom Sheet
  const openBottomSheetPhoto = (cardID, cardName, cardImage) => {
    setSelectedCardID(cardID);
    setSelectedCardName(cardName);
    setSelectedCardImage(cardImage);
    sheetRef.current?.open();
  };

  const openBottomSheetGIF = (gifID) => {
    setSelectedGIFID(gifID);
    sheetRefGIF.current?.open();
  };

  const openBottomSheetVector = (cardID, cardName, cardImage) => {
    setSelectedCardID(cardID);
    setSelectedCardName(cardName);
    setSelectedCardImage(cardImage);
    sheetRef.current?.open();
  };

  const handleGIFSearchResults = (results) => {
    setGIF(results);
  };

  const handlePhotosSearchResults = (results) => {
    setPhoto(results);
  };

  const handleVectorSearchResults = (results) => {
    setVector(results);
  };

  // Fetch Data
  const fetchData = async () => {
    try {
      await fetchGIFData();
      await fetchPhotoData();
      await fetchVectorData();
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    if (handleRefresh) {
      handleRefresh();
    }
    fetchData();
  }, [handleRefresh]);

  console.log("gif data from home : ", gif);
  console.log(searchResults, "=============== Search Results ===============");

  const renderContent = () => {
    switch (activeCategory) {
      case "gif":
        return (
          <RenderMasonryGif
            gif={gif}
            openBottomSheetGIF={openBottomSheetGIF}
            fetchData={fetchData}
          />
        );
      case "foto":
        return (
          <>
            <RenderMasonryPhoto
              gif={gifExample}
              openBottomSheet={openBottomSheetPhoto}
              fetchData={fetchData}
            />
          </>
        );
      case "vector":
        return (
          <RenderMasonryVector
            gif={gifExample}
            openBottomSheet={openBottomSheetVector}
            fetchData={fetchData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <View style={styles.container}>
          {activeCategory === "gif" ? (
            <SearchGIF onSearchResults={handleGIFSearchResults} />
          ) : activeCategory === "foto" ? (
            <SearchPhotos onSearchResults={handlePhotosSearchResults} />
          ) : activeCategory === "vector" ? (
            <SearchVector onSearchResults={handleVectorSearchResults} />
          ) : null}
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[
                styles.category,
                activeCategory === "gif" && styles.activeCategory,
              ]}
              onPress={() => handleCategoryPress("gif")}
            >
              <MaterialCommunityIcon
                name="file-gif-box"
                size={20}
                color="#888"
                style={[activeCategory === "gif" && styles.activeGifIcon]}
              />
              <Text
                style={[activeCategory === "gif" && styles.activeGifCategory]}
              >
                GIF
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.category,
                activeCategory === "foto" && styles.activeCategory,
              ]}
              onPress={() => handleCategoryPress("foto")}
            >
              <MaterialIcon
                name="photo-camera"
                size={20}
                color="#888"
                style={[activeCategory === "foto" && styles.activeGifIcon]}
              />
              <Text
                style={[
                  activeCategory === "foto"
                    ? styles.activeGifCategory
                    : styles.text,
                ]}
              >
                Foto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.category,
                activeCategory === "vector" && styles.activeCategory,
              ]}
              onPress={() => handleCategoryPress("vector")}
            >
              <FontAwesome
                name="paint-brush"
                size={20}
                color="#888"
                style={[activeCategory === "vector" && styles.activeGifIcon]}
              />
              <Text
                style={[
                  activeCategory === "vector"
                    ? styles.activeGifCategory
                    : styles.text,
                ]}
              >
                Vector
              </Text>
            </TouchableOpacity>
          </View>
          {renderContent()}
        </View>
      </KeyboardAvoidingView>
      <BottomSheetUI
        ref={sheetRef}
        height={685}
        id={selectedCardID}
        name={selectedCardName}
        image={selectedCardImage}
      />
      <BottomSheetGIF
        ref={sheetRefGIF}
        height={685}
        id={selectedGIFID}
        navigation={navigation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheetContent: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "scroll",
  },
  item: {
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    backgroundColor: "rgba(169, 50, 157, 0.25)",
    fontSize: 24,
    height: 200,
    width: "50%",
  },
  container: {
    marginTop: 35,
    padding: 20,
    fontFamily: "Poppins-Regular",
  },

  category: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECECEC",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 16,
    fontFamily: "Poppins-Regular",
  },
  inputSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECECEC",
    height: 40,
    width: "100%",
    borderRadius: 50,
    paddingHorizontal: 15,
  },
  inputSearch: {
    flex: 1,
    marginLeft: 5,
    fontSize: 14,
  },
  icon: {
    marginRight: 10,
  },
  activeCategory: {
    backgroundColor: "rgba(169, 50, 157, 0.20)",
    borderColor: "rgba(169, 50, 157, 0.20)",
  },
  activeGifCategory: {
    fontFamily: "Poppins-Bold",
  },
  activeGifIcon: {
    color: "rgba(169, 50, 157, 0.60)",
  },
  card: {
    borderRadius: 24,
  },
  image: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
    borderRadius: 20,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontFamily: "Poppins-Regular",
  },
  textBold: {
    fontFamily: "Poppins-Bold",
  },
});
