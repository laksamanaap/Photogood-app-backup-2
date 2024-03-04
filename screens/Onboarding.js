import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";
import Slides from "./Slides";
import OnboardingItem from "./OnboardingItem";
import Paginator from "../components/Paginator";

const Onboarding = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThresold: 50 }).current;
  return (
    <View style={styles.container}>
      <FlatList
        data={Slides}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
      />
      <Paginator data={Slides} scrollX={scrollX} />
      <View
        style={{ padding: 30, width: "100%", paddingTop: 0, marginTop: 20 }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            Masuk
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonOutline, { marginTop: 12 }]}
          onPress={() => navigation.navigate("Register")}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 16,
              color: "#A9329D",
              fontFamily: "Poppins-Bold",
            }}
          >
            Saya baru, Daftar
          </Text>
        </TouchableOpacity>
        <View style={{ marginTop: 16 }}>
          <Text style={styles.privacyPolicy}>
            Dengan Login atau Registrasi, Anda menyetujui{" "}
            <Text style={{ color: "#A9329D" }}>Syarat dan Ketentuan</Text> serta{" "}
            <Text style={{ color: "#A9329D" }}>Kebijakan privasi</Text> dari
            kami.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    backgroundColor: "#A9329D",
    padding: 10,
    borderRadius: 50,
  },
  buttonOutline: {
    width: "100%",
    borderColor: "#A9329D",
    borderWidth: 2,
    padding: 10,
    borderRadius: 50,
  },
  privacyPolicy: {
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    color: "#7C7C7C",
  },
});
