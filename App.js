import { StatusBar } from "expo-status-bar";
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
  KeyboardAvoidingView,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import AuthNavigator from "./routes/authStack";
import ClientNavigator from "./routes/indexStack";
import { useFonts } from "expo-font";
import AppLoading from "./components/AppLoading";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [authenticated, setAuthenticated] = useState(true);

  const handleAuthenticated = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    AsyncStorage.removeItem("token");
  };

  return (
    <>
      {authenticated ? (
        <>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
            <ClientNavigator screenProps={{ handleLogout: handleLogout }} />
          </KeyboardAvoidingView>
        </>
      ) : (
        <AuthNavigator
          screenProps={{ handleAuthenticated: handleAuthenticated }}
        />
      )}
    </>
  );
}
