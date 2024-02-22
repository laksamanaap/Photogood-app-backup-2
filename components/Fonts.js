import { View, Text } from "react-native";
import React from "react";
import { useFonts } from "expo-font";

export const useLoadFonts = () => {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  return fontsLoaded;
};
