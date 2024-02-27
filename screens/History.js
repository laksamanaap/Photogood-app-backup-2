import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  RefreshControl,
  Animated,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import SearchHistory from "../components/SearchHistory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";
import Foundation from "react-native-vector-icons/Foundation";

export default function History() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downdloadData, setDownloadData] = useState(null);
  const [likeData, setLikeData] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userStatus, setUserStatus] = useState("1");
  const [memberId, setMemberId] = useState(null);

  const [isShining, setIsShining] = useState(false);
  const shiningAnimation = useRef(new Animated.Value(0)).current;

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
      console.log("upload user detail : ", response?.data);
      setUserData(response?.data);
      setUserStatus(response?.data.status);
      setMemberId(response?.data?.member?.member_id);
      setLoading(false);
    } catch (error) {
      console.error(error);
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

  const fetchDownloadData = async () => {
    try {
      const response = await client.get(
        `/v1/show-user-download?token=${token}`
      );
      setDownloadData(response?.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    await fetchUserDetail();
    await fetchDownloadData();
    await fetchLikeData();
  };

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

  useEffect(() => {
    getTokenFromStorage();
    fetchUserDetail();
    fetchDownloadData();
    fetchLikeData();
  }, []);

  useEffect(() => {
    const shiningInterval = setInterval(() => {
      setIsShining((prevIsShining) => !prevIsShining);
    }, 800);

    return () => clearInterval(shiningInterval);
  }, []);

  useEffect(() => {
    if (isShining) {
      Animated.timing(shiningAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(shiningAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isShining]);

  console.log(likeData, "LIKE DATA IN HISTORY");
  console.log(downdloadData, "DOWNLOAD DATA IN HISTORY");

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A9329D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchHistory />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userStatus === "2" && (
          <View style={styles.historyWrapper}>
            <View style={{ position: "relative" }}>
              {userData?.foto_profil ? (
                <Image
                  source={{ uri: userData?.foto_profil }}
                  style={styles.historyImage}
                />
              ) : (
                <Image
                  source={require("../assets/images/placeholder-image-3.png")}
                  style={styles.historyImage}
                />
              )}
              {userStatus === "2" && (
                <Animated.View
                  style={[
                    styles.crownWrapper,
                    {
                      opacity: shiningAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 1],
                      }),
                    },
                  ]}
                >
                  <Foundation
                    name="crown"
                    size={16}
                    color={"#FFBB48"}
                    style={styles.crownIcon}
                  />
                </Animated.View>
              )}
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.text}>Anda baru saja menjadi member</Text>
            </View>
          </View>
        )}
        {likeData?.length > 0 &&
          likeData?.map((like, index) => {
            return (
              <View style={styles.historyWrapper} key={index}>
                {like?.foto?.lokasi_file ? (
                  <Image
                    style={styles.historyImage}
                    source={{ uri: like?.foto?.lokasi_file }}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    style={styles.historyImage}
                    source={require("../assets/images/placeholder-image.png")}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.textWrapper}>
                  <Text style={styles.text}>
                    Anda baru saja menyukai gambar berjudul "
                    <Text style={styles.textBold}>
                      {like?.foto?.judul_foto}"
                    </Text>
                  </Text>
                </View>
              </View>
            );
          })}
        {downdloadData?.length > 0 &&
          downdloadData?.map((download, index) => (
            <View style={styles.historyWrapper} key={index}>
              {download?.foto?.lokasi_file ? (
                <Image
                  style={styles.historyImage}
                  source={{ uri: download?.foto?.lokasi_file }}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  style={styles.historyImage}
                  source={require("../assets/images/placeholder-image.png")}
                  resizeMode="cover"
                />
              )}
              <View style={styles.textWrapper}>
                <Text style={styles.text}>
                  Anda baru saja mendownload gambar berjudul "
                  <Text style={styles.textBold}>
                    {download?.foto?.judul_foto}"
                  </Text>
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 35,
    marginBottom: 32,
  },
  historyWrapper: {
    marginTop: 20,
    gap: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  historyImage: {
    borderRadius: 12,
    width: 50,
    height: 50,
    overlayColor: "#f2f2f2",
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
  },
  textBold: {
    marginLeft: 10,
    fontFamily: "Poppins-Bold",
  },
  crownWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    transform: [{ translateX: 4 }, { translateY: -30 }],
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 4,
    minWidth: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 10,
  },
  crownIcon: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
