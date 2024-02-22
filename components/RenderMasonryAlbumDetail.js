import React from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";

const RenderMasonryList = ({ gif }) => {
  const itemsPerRow = 4;

  const albumDetailPhotos = gif?.bookmark_fotos;
  console.log(albumDetailPhotos, "MASONRY ALBUM DETAIL ");

  return (
    <ScrollView>
      <View style={styles.container}>
        {albumDetailPhotos?.map((item, index) => (
          <TouchableOpacity key={index} style={[styles.cardContainer]}>
            <Image
              source={{ uri: item?.foto.lokasi_file }}
              style={styles.image}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardContainer: {
    width: "25%",
  },
  image: {
    marginTop: 16,
    width: 70,
    height: 70,
    borderRadius: 8,
  },
});

export default RenderMasonryList;
