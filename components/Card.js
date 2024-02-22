import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";

export default function Card({ text, image }) {
  const getRandomHeight = () => {
    return Math.floor(Math.random() * 50 + 150);
  };

  const sheetRef = useRef(null);

  const openBottomSheet = () => {
    sheetRef.current?.open();
  };

  return (
    <>
      <TouchableOpacity onPress={openBottomSheet}>
        <View style={[styles.container, { height: getRandomHeight() }]}>
          <Image source={image} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.title}>{text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginTop: 24,
    backgroundColor: "white",
    height: 200,
    width: 150,
    overflow: "hidden",
    marginRight: 16,
  },
  image: {
    width: "100%",
    height: "70%",
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
