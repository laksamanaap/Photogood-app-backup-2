import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";

const RenderMasonryList = ({ gif, selectedPhotos, setSelectedPhotos }) => {
  const togglePhotoSelection = (photoId) => {
    if (selectedPhotos.includes(photoId)) {
      setSelectedPhotos(selectedPhotos.filter((id) => id !== photoId));
    } else {
      setSelectedPhotos([...selectedPhotos, photoId]);
    }
  };

  const itemsPerRow = 4;
  const albumDetailPhotos = gif?.bookmark_fotos;
  console.log(albumDetailPhotos, "MASONRY ALBUM DETAIL ");

  return (
    <ScrollView>
      <View style={styles.container}>
        {albumDetailPhotos?.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.cardContainer]}
            onPress={() => togglePhotoSelection(item?.bookmark_id)}
          >
            <Image
              source={{ uri: item?.foto?.lokasi_file }}
              style={styles.image}
            />
            <View style={styles.checkboxContainer}>
              <Text style={styles.checkbox}>
                {selectedPhotos?.includes(item?.bookmark_id) ? "✓" : ""}
              </Text>
            </View>
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
    position: "relative",
  },
  image: {
    marginTop: 16,
    width: 70,
    height: 70,
    borderRadius: 8,
    overlayColor: "#F2F2F2",
    position: "relative",
  },
  checkboxContainer: {
    position: "absolute",
    top: 20,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    height: 15,
    width: 15,
  },
  checkbox: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 3,
  },
});

export default RenderMasonryList;
