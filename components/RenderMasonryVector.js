import React from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

const RenderMasonryList = ({ gif, vector, openBottomSheet }) => {
  const getRandomHeight = () => {
    return Math.floor(Math.random() * 200) + 100;
  };

  const oddItems = gif.filter((_, index) => index % 2 !== 0);
  const evenItems = gif.filter((_, index) => index % 2 === 0);

  return (
    <ScrollView>
      <View style={{ flexDirection: "row", paddingBottom: 100 }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          {oddItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openBottomSheet(item.key, item.name, item.image)}
            >
              <View style={[styles.card, { height: getRandomHeight() }]}>
                <Image source={item.image} style={styles.image} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flex: 1, flexDirection: "column" }}>
          {evenItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openBottomSheet(item.key, item.name, item.image)}
            >
              <View style={[styles.card, { height: getRandomHeight() }]}>
                <Image source={item.image} style={styles.image} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default RenderMasonryList;
