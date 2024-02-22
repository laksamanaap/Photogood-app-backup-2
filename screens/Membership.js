import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

export default function Membership() {
  const [countdown, setCountdown] = useState("24:00:00");
  const [loading, setLoading] = useState(null);
  const [redirect, setRedirecting] = useState(null);

  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(now);
      target.setHours(now.getHours() + 24);
      target.setMinutes(0);
      target.setSeconds(0);

      const remainingTime = target.getTime() - now.getTime();
      const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );

      if (remainingTime <= 0) {
        clearInterval(timer);
        setCountdown("00:00:00");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    getTokenFromStorage();
    fetchUserDetail();
    // updateUserDetail();
  }, []);

  const storeMembership = async () => {
    setLoading(true);

    try {
      const payload = {
        price: 30000,
        item_name: "Membership",
        user_id: userData?.user_id,
      };

      const auth = "SB-Mid-server-jYmiUqM4L6NjnHaJncPQmekt";
      console.log(auth, "============ AUTH ENV MIDTRANS ===============");

      const response = await client.post(
        "/v1/store-midtrans-payment",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
        }
      );

      console.log(
        response,
        "================ RESPONSE MEMBERSHIP ====================="
      );

      if (
        response?.data.payment_info &&
        response?.data.payment_info.redirect_url
      ) {
        const redirectUrl = response?.data.payment_info.redirect_url;
        Linking.openURL(redirectUrl);
      } else {
        Alert.alert("Payment Error", "Failed to get redirect URL");
      }
    } catch (error) {
      // console.error(error);
      Alert.alert(
        "An error occurred!",
        `${error?.response?.data?.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // console.log(userData, "USER DATA MEMBERSHIP");

  return (
    <ImageBackground
      source={require("../assets/images/gallery-sample-image.png")}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(23, 5, 38,0.9)", "transparent"]}
        start={{ x: 1, y: 0.9 }}
        end={{ x: 1, y: 0 }}
        style={styles.linearGradient}
      />
      <View style={styles.container}>
        <View style={styles.vipWrapper}>
          <Text style={styles.vipTitle}>Photogood</Text>
          <View style={styles.vipBadge}>
            <Text style={styles.vipBadgeTitle}>VIP</Text>
          </View>
        </View>
        <Text style={styles.heading}>Upgrade Sekarang Diskon 60%</Text>
        <View style={styles.offerWrapper}>
          <Text style={styles.offerTitle}>Offer ends in</Text>
          <Text style={styles.offerValue}>{countdown}</Text>
        </View>
        <View style={styles.membershipCardContainer}>
          <View style={styles.membershipCardBadge}>
            <View style={styles.membershipCardContent}>
              <Text style={[styles.policyText, { fontFamily: "Poppins-Bold" }]}>
                1 Bulan VIP
              </Text>
              <Text
                style={[
                  styles.policyText,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                Membership
              </Text>
            </View>
            <View style={styles.membershipCardContent}>
              <Text
                style={[
                  styles.policyText,
                  {
                    color: "rgba(255, 255, 255, 0.4)",
                    fontFamily: "Poppins-Bold",
                    textDecorationLine: "line-through",
                    textDecorationStyle: "solid",
                  },
                ]}
              >
                Rp. 49000
              </Text>
              <Text style={[styles.policyText, { fontSize: 14 }]}>
                Rp. 30000
              </Text>
            </View>
          </View>
          <View style={styles.membershipCardDiscount}>
            <Text
              style={[
                styles.policyText,
                {
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                },
              ]}
            >
              60%
            </Text>
            <Text style={[styles.policyText, { fontSize: 14 }]}>OFF</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.membershipButton}
          onPress={() => storeMembership()}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Waiting Midtrans......"
              : redirect
              ? "Redirecting......"
              : "Upgrade Membership"}
          </Text>
        </TouchableOpacity>
        <View style={styles.policyContainer}>
          <Text
            style={[
              styles.policyText,
              {
                fontSize: 14,
                color: "rgba(230, 230, 230, 0.8)",
              },
            ]}
          >
            Dengan menekan tombol "Upgrade Membership", Anda menyetujui semua
            ketentuan dan kebijakan yang terkait dengan keanggotaan kami. Mari
            bergabung bersama Photogood dan ciptakan komunitas pencinta
            fotografi yang positif dan beretika!
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  membershipCardDiscount: {
    padding: 12,
    maxHeight: 70,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderRightWidth: 0,
    backgroundColor: "rgba(211, 172, 18, 0.9)",
  },
  membershipCardContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  membershipCardBadge: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    backgroundColor: "rgba(247, 214, 80, 0.2)",
    marginBottom: 48,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  membershipCardContent: {
    borderRightColor: "rgba(255, 255, 255, 0.15)",
    borderRightWidth: 1,
    paddingRight: 12,
  },
  policyContainer: {
    marginTop: 20,
  },
  policyText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    textAlign: "center",
  },
  heading: {
    fontSize: 48,
    color: "#FFFFFF",
    marginTop: 8,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  vipWrapper: {
    flexDirection: "row",
    gap: 12,
  },
  vipTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  offerWrapper: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 12,
  },
  offerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#F7D650",
  },
  offerValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 26,
    color: "#F7D650",
  },
  vipBadgeTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#A9329D",
  },
  vipBadge: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 2,
    backgroundColor: "white",
    maxHeight: 27,
    width: 45,
    borderRadius: 16,
  },
  infoTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    marginBottom: 10,
    color: "#FFFFFF",
  },
  infoText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  membershipButton: {
    backgroundColor: "#A9329D",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 3,
    marginBottom: 8,
    width: "80%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
