import React, { useEffect, useState } from "react";
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
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { useLoadFonts } from "../components/Fonts";
import client from "../utils/client";

export default function Register({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("An error occurred!", "All fields must be filled!");
      return;
    }

    setIsLoading(true);
    const payload = {
      username: username,
      password: password,
      email: email,
      status: 1,
    };

    client
      .post("auth/register", payload)
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        if (response.status === 200) {
          Alert.alert("Register Success!", "Account registered successfully", [
            {
              text: "OK",
              onPress: () => {
                setTimeout(() => {
                  navigation.navigate("Login");
                }, 1000);
              },
            },
          ]);
        }
      })
      .catch((error) => {
        // console.error("Error:", error);
        setIsLoading(false);
        Alert.alert("An error occurred!", error.response.data.message);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) {
    return null;
  }

  console.log("Register Username : ", username);
  console.log("Register Email : ", email);
  console.log("Register Password : ", password);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"height"}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            style={{
              width: 100,
              height: 100,
              resizeMode: "cover",
              marginBottom: 25,
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
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
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
            onPress={() => handleRegister()}
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
                  fontFamily: "Poppins-Regular",
                }}
              >
                Daftar
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
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.OAuthDescBottom}>Sudah punya akun? Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    fontFamily: "Poppins-Regular",
    position: "relative",
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
    fontFamily: "Poppins-Regular",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
    color: "#6B6B6B",
  },
  OAuthDescBottom: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
    color: "#6B6B6B",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  OAuthButton: {
    display: "flex",
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
