import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { useLoadFonts } from "../components/Fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../utils/client";

export default function Login(props) {
  console.log(props);
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) {
    return null;
  }

  const handleAuthenticated = props.screenProps.handleAuthenticated;
  console.log(handleAuthenticated);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  console.log("login username : ", username);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("An error occurred!", "All fields must be filled!");
      return;
    }

    setIsLoading(true);
    const payload = {
      username: username,
      password: password,
    };

    // Perform login request
    client
      .post("/auth/login", payload)
      .then(async (response) => {
        setIsLoading(false);
        if (response.status === 200) {
          // Save token in AsyncStorage
          AsyncStorage.setItem("token", response?.data.login_tokens)
            .then(() => {
              console.log("Token saved in AsyncStorage");
              // Update authenticated status
              handleAuthenticated();
            })
            .catch((error) => {
              console.error("Error saving token in AsyncStorage:", error);
              Alert.alert("An error occurred!", "Failed to save token.");
            });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert("An error occurred!", error.response.data.message);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "cover",
            marginBottom: 45,
          }}
          source={require("../assets/icon/logo2.png")}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
            }}
          >
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 12, top: 12 }}
              onPress={toggleShowPassword}
            >
              <Entypo
                name={showPassword ? "eye-with-line" : "eye"}
                style={{ color: "#7C7C7C", fontSize: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLogin()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Masuk
            </Text>
          )}
        </TouchableOpacity>
        <View>
          <Text style={styles.OAuthDesc}>Atau masuk menggunakan</Text>
        </View>
        <View style={styles.OAuthContainer}>
          <TouchableOpacity style={styles.OAuthButton}>
            <AntDesign
              name="google"
              style={{ color: "#A9329D", fontSize: 20 }}
            />
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "500",
                fontFamily: "Poppins-Regular",
              }}
            >
              Google
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.OAuthContainer}>
          <TouchableOpacity style={styles.OAuthButton}>
            <AntDesign
              name="facebook-square"
              style={{ color: "#A9329D", fontSize: 20 }}
            />
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "500",
                fontFamily: "Poppins-Regular",
              }}
            >
              Facebook
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    marginBottom: 10,
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  input: {
    fontFamily: "Poppins-Regular",
    backgroundColor: "#ECECEC",
    height: 40,
    width: "100%",
    borderColor: "#ECECEC",
    borderWidth: 1,
    marginBottom: 25,
    padding: 10,
    borderRadius: 50,
  },
  button: {
    width: "100%",
    backgroundColor: "#A9329D",
    padding: 10,
    borderRadius: 50,
  },
  OAuthContainer: {
    width: "100%",
    marginBottom: 18,
  },
  OAuthDesc: {
    marginTop: 15,
    marginBottom: 15,
    color: "#6B6B6B",
    fontFamily: "Poppins-Regular",
  },
  OAuthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#F9F9F9",
    gap: 8,
    padding: 10,
    borderRadius: 50,
  },
});
