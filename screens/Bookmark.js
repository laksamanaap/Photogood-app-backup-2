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
import RenderMasonryBookmarkLiked from "../components/RenderMasonryBookmarkLiked";
import BottomSheetUI from "../components/BottomSheetUI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";

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
  const [likeData, setLikeData] = useState(null);

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

  const fetchLikeData = async () => {
    try {
      const response = await client.get(`/v1/show-user-like?token=${token}`);
      setLikeData(response?.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchUserDetail();
    fetchUserPost();
    fetchUserBookmark();
    fetchLikeData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUserDetail();
      await fetchUserPost();
      await fetchUserBookmark();
      await fetchLikeData();
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

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate("Settings")}
        >
          <AntDesign name="setting" size={24} color={"white"} />
        </TouchableOpacity>
        <View style={styles.profileTopWrapper}>
          <View style={styles.profileTopAvatar}>
            {userData?.foto_profil ? (
              <Image
                source={{ uri: userData?.foto_profil }}
                style={{
                  width: 100,
                  height: 100,
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
            <TouchableOpacity
              style={styles.profileTopIconWhite}
              onPress={() => navigation.navigate("Profile")}
            >
              <View style={styles.profileTopIcon}>
                <Feather name={"edit"} size={16} color={"white"} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.textProfileTitle}>@{userData?.username}</Text>
          <View style={styles.profileDetailWrapper}>
            <View style={styles.profileDetail}>
              <Text style={styles.profileDetailTitle}>{post?.length}</Text>
              <Text style={styles.profileDetailSubtitle}>Postingan</Text>
            </View>
            <View style={styles.profileDetail}>
              <Text style={styles.profileDetailTitle}>{saved?.length}</Text>
              <Text style={styles.profileDetailSubtitle}>Disimpan</Text>
            </View>
            <View style={styles.profileDetail}>
              <Text style={styles.profileDetailTitle}>{likeData?.length}</Text>
              <Text style={styles.profileDetailSubtitle}>Disukai</Text>
            </View>
          </View>
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
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "liked" && styles.activeTabButton,
            ]}
            onPress={() => handleTabChange("liked")}
          >
            <Text
              style={
                activeTab === "liked"
                  ? styles.tabButtonTextBold
                  : styles.tabButtonText
              }
            >
              Disukai
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
        ) : activeTab === "saved" ? (
          saved.length > 0 ? (
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
          )
        ) : likeData.length > 0 ? (
          <RenderMasonryBookmarkLiked
            gif={likeData}
            openBottomSheet={openBottomSheet}
          />
        ) : (
          <View style={styles.textWrapper}>
            <Text style={styles.textBookmark}>
              User belum menyukai siapapun! (mati rasa)
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
    position: "relative",
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
    // minWidth: 150,
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
  textProfileTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  profileTopWrapper: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 24,
  },
  profileDetailWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 16,
  },
  profileDetail: {
    flexDirection: "column",
    alignItems: "center",
  },
  profileDetailTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  profileDetailSubtitle: {
    fontFamily: "Poppins-Regular",
    color: "#949494",
  },
  profileTopAvatar: {
    position: "relative",
  },
  profileTopIconWhite: {
    backgroundColor: "#F2F2F2",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 45,
    position: "absolute",
    bottom: 10,
    right: 0,
  },
  profileTopIcon: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#A9329D",
    padding: 6,
    borderRadius: 50,
  },
  settingsIcon: {
    backgroundColor: "#A9329D",
    borderRadius: 50,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 45,
    position: "absolute",
    right: 25,
    top: 15,
  },
});
