import { Text, StyleSheet, View, Image, ScrollView } from "react-native";
import React, { Component } from "react";
import SearchHistory from "../components/SearchHistory";

export default function History() {
  return (
    <View style={styles.container}>
      <SearchHistory />
      <ScrollView>
        <View style={styles.historyWrapper}>
          <Image
            style={styles.historyImage}
            source={require("../assets/images/placeholder-image.png")}
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text style={styles.text}>Anda baru saja menjadi member</Text>
          </View>
        </View>
        <View style={styles.historyWrapper}>
          <Image
            style={styles.historyImage}
            source={require("../assets/images/placeholder-image.png")}
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              Anda baru saja mendownload gambar berjudul "Wave to earth"
            </Text>
          </View>
        </View>
        <View style={styles.historyWrapper}>
          <Image
            style={styles.historyImage}
            source={require("../assets/images/placeholder-image.png")}
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              Anda baru saja mendownload gambar berjudul "Wave to earth"
            </Text>
          </View>
        </View>
        <View style={styles.historyWrapper}>
          <Image
            style={styles.historyImage}
            source={require("../assets/images/placeholder-image.png")}
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              Anda baru saja mendownload gambar berjudul "Wave to earth"
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 35,
  },
  historyWrapper: {
    marginTop: 20,
    gap: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  historyImage: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
  },
});
