import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import RenderMasonryBookmark from "../components/RenderMasonryBookmark";
import RenderMasonryBookmarkSaved from "../components/RenderMasonryBookmarkSaved";
import BottomSheetUI from "../components/BottomSheetUI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

export default function Bookmark({ navigation }) {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userStatus, setUserStatus] = useState("1");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const sheetRef = useRef(null);
  const [selectedCardID, setSelectedCardID] = useState(null);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [selectedCardImage, setSelectedCardImage] = useState(null);
  const [profileImage, setProfileImage] = useState(
    require("../assets/images/placeholder-image-3.png")
  );
  const [activeTab, setActiveTab] = useState("posts");

  const [post, setPost] = useState([]);
  const [saved, setSaved] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const openBottomSheet = (cardID, cardName, cardImage) => {
    setSelectedCardID(cardID);
    setSelectedCardName(cardName);
    setSelectedCardImage(cardImage);
    sheetRef.current?.open();
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
      console.log("bookmark user detail : ", response?.data);
      setUserData(response?.data);
      setUserStatus(response?.data.status);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPost = async () => {
    try {
      const response = await client.get(`v1/show-user-post?token=${token}`);
      console.log("upload user post  : ", response?.data);
      setPost(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookmark = async () => {
    try {
      const response = await client.get(`v2/show-all-bookmark?token=${token}`);
      console.log("upload user bookmark  : ", response?.data);
      setSaved(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchUserDetail();
    fetchUserPost();
    fetchUserBookmark();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUserDetail();
      await fetchUserPost();
      await fetchUserBookmark();
    } catch (error) {
      console.error("Error refreshing user detail:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A9329D" />
      </View>
    );
  }

  // console.log(saved, "BOOKMARK SAVEDD");

  return (
    <>
      <View style={styles.container}>
        {userData?.foto_profil ? (
          <Image
            source={{ uri: userData?.foto_profil }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 100,
              marginBottom: 15,
            }}
          />
        ) : (
          <Image
            source={profileImage}
            style={{
              width: 120,
              height: 120,
              borderRadius: 100,
              marginBottom: 15,
            }}
          />
        )}
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            style={[styles.tabButton]}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.tabButtonText}>Edit Profil</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "posts" && styles.activeTabButton,
            ]}
            onPress={() => handleTabChange("posts")}
          >
            <Text
              style={
                activeTab === "posts"
                  ? styles.tabButtonTextBold
                  : styles.tabButtonText
              }
            >
              Postingan Anda
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "saved" && styles.activeTabButton,
            ]}
            onPress={() => handleTabChange("saved")}
          >
            <Text
              style={
                activeTab === "saved"
                  ? styles.tabButtonTextBold
                  : styles.tabButtonText
              }
            >
              Disimpan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === "posts" ? (
          post.length > 0 ? (
            <RenderMasonryBookmark
              gif={post}
              openBottomSheet={openBottomSheet}
            />
          ) : (
            <View style={styles.textWrapper}>
              <Text style={styles.textBookmark}>
                User belum memosting apapun!
              </Text>
            </View>
          )
        ) : saved.length > 0 ? (
          <RenderMasonryBookmarkSaved
            gif={saved}
            openBottomSheet={openBottomSheet}
          />
        ) : (
          <View style={styles.textWrapper}>
            <Text style={styles.textBookmark}>
              User belum menyimpan apapun!
            </Text>
          </View>
        )}
      </ScrollView>
      <BottomSheetUI
        ref={sheetRef}
        height={685}
        id={selectedCardID}
        name={selectedCardName}
        image={selectedCardImage}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    padding: 35,
    alignItems: "center",
  },
  profileImage: {
    borderRadius: 50,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tabButton: {
    minWidth: 150,
    alignItems: "center",
    backgroundColor: "#ECECEC",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: "rgba(169, 50, 157, 0.20)",
  },
  tabButtonText: {
    color: "#000000",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  tabButtonTextBold: {
    color: "#000000",
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },
  itemImage: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textBookmark: {
    fontFamily: "Poppins-Bold",
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 30,
  },
});
