import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";
import { useNavigation } from "@react-navigation/native";

const Settings = (props) => {
  console.log(props, "settings props : ");
  const navigation = props.navigation;
  const { handleLogout } = props.route.params;

  console.log(handleLogout, "Props handle logout");
  console.log(navigation, "Props handle navigation");

  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userStatus, setUserStatus] = useState("1");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      console.log("settings user detail : ", response?.data);
      setUserData(response?.data);
      setUserStatus(response?.data.status);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTokenFromStorage();
    fetchUserDetail();
  }, []);

  useEffect(() => {
    const shiningInterval = setInterval(() => {
      setIsShining((prevIsShining) => !prevIsShining);
    }, 1000);

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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUserDetail();
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

  console.log(userData, "USER DATA : ");
  console.log(userStatus, "USER STATUS : ");

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.settingsCardMain}>
        <View>
          <Text style={styles.settingsTextBold}>
            {userData?.nama_lengkap} ({userData?.username})
          </Text>
          <Text style={styles.settingsTextSmall}>{userData?.email}</Text>
        </View>
        <View style={styles.userAvatarContainer}>
          {userData?.foto_profil ? (
            <Image
              source={{ uri: userData?.foto_profil }}
              style={styles.userAvatar}
            />
          ) : (
            <Image
              source={require("../assets/images/placeholder-image-3.png")}
              style={styles.userAvatar}
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
      </View>
      <View>
        <TouchableOpacity
          style={styles.settingsCardSecondary}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.settinggsCardSecondaryContainer}>
            <View style={styles.settingsCardSecondaryIcon}>
              <Octicons name="person" size={18} color={"#A9329D"} />
            </View>
            <Text style={styles.settingsTextBold}>Edit Profile</Text>
          </View>
          <View style={styles.settingsCardSecondaryWrapper}>
            <Entypo name="chevron-right" size={18} color={"#000000"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsCardSecondary}>
          <View style={styles.settinggsCardSecondaryContainer}>
            <View style={styles.settingsCardSecondaryIcon}>
              <AntDesign name="profile" size={18} color={"#A9329D"} />
            </View>
            <Text style={styles.settingsTextBold}>History</Text>
          </View>
          <View style={styles.settingsCardSecondaryWrapper}>
            <Entypo name="chevron-right" size={18} color={"#000000"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsCardSecondary}
          onPress={() => navigation.navigate("Album")}
        >
          <View style={styles.settinggsCardSecondaryContainer}>
            <View style={styles.settingsCardSecondaryIcon}>
              <Feather name="image" size={18} color={"#A9329D"} />
            </View>
            <Text style={styles.settingsTextBold}>Album</Text>
          </View>
          <View style={styles.settingsCardSecondaryWrapper}>
            <Entypo name="chevron-right" size={18} color={"#000000"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsCardSecondary}
          onPress={() => navigation.navigate("Membership")}
        >
          <View style={styles.settinggsCardSecondaryContainer}>
            <View style={styles.settingsCardSecondaryIcon}>
              <MaterialCommunityIcons
                name="crown-outline"
                size={20}
                color={"#A9329D"}
              />
            </View>
            <Text style={styles.settingsTextBold}>Membership</Text>
          </View>
          <View style={styles.settingsCardSecondaryWrapper}>
            <Entypo name="chevron-right" size={18} color={"#000000"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsCardSecondary}
          onPress={() => {
            handleLogout();
          }}
        >
          <View style={styles.settinggsCardSecondaryContainer}>
            <View style={styles.settingsCardSecondaryIcon}>
              <MaterialIcons name="logout" size={18} color={"#A9329D"} />
            </View>
            <Text style={styles.settingsTextBold}>Logout</Text>
          </View>
          <View style={styles.settingsCardSecondaryWrapper}>
            <Entypo name="chevron-right" size={18} color={"#000000"} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 20,
  },
  userAvatarContainer: {
    position: "relative",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  settingsCardMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    marginBottom: 30,
  },
  settinggsCardSecondaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsCardSecondaryWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsCardSecondary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between",
    gap: 16,
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  settingsCardSecondaryIcon: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(169, 50, 157, 0.10)",
    padding: 8,
    borderRadius: 12,
    minWidth: 36,
  },
  settingsTextBold: {
    fontFamily: "Poppins-Bold",
  },
  settingsTextSmall: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
});
