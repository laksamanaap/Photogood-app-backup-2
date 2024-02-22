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
  Button,
  FlatList,
} from "react-native";
import React, { Component } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";

export default class SearchHistory extends Component {
  render() {
    return (
      <View style={styles.inputSearchContainer}>
        <AntDesign name="search1" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.inputSearch}
          placeholder="Temukan Riwayat Anda"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECECEC",
    height: 40,
    width: "100%",
    borderRadius: 50,
    paddingHorizontal: 15,
  },
  inputSearch: {
    flex: 1,
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  icon: {
    marginRight: 10,
  },
});
