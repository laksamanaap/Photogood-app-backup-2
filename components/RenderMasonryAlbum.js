import React from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";

const RenderMasonryList = ({ album, photo, navigation }) => {
  const oddItems = album.filter((_, index) => index % 2 !== 0);
  const evenItems = album.filter((_, index) => index % 2 === 0);

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          paddingBottom: 40,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          {evenItems?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cardContainer}
              onPress={() => navigation(item.album_id)}
            >
              <View style={[styles.card, { height: 150 }]}>
                {item?.bookmark_fotos?.length > 0 ? (
                  <Image
                    source={{
                      uri: item?.bookmark_fotos[
                        item?.bookmark_fotos?.length - 1
                      ]?.foto.lokasi_file,
                    }}
                    style={styles.image}
                  />
                ) : (
                  <Image
                    source={require("../assets/images/placeholder-image-3.png")}
                    style={styles.image}
                  />
                )}
              </View>
              <Text style={styles.cardText}>{item.nama_album}</Text>
              <Text style={styles.cardTextSmall}>
                {item?.total_bookmark_data}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flex: 1, flexDirection: "column" }}>
          {oddItems?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cardContainer}
              onPress={() => navigation(item.album_id)}
            >
              <View style={[styles.card, { height: 150 }]}>
                {item?.bookmark_fotos?.length > 0 ? (
                  <Image
                    source={{
                      uri: item?.bookmark_fotos[
                        item?.bookmark_fotos?.length - 1
                      ]?.foto.lokasi_file,
                    }}
                    style={styles.image}
                  />
                ) : (
                  <Image
                    source={require("../assets/images/placeholder-image-3.png")}
                    style={styles.image}
                  />
                )}
              </View>
              <Text style={[styles.cardText, { flex: 1 }]} numberOfLines={1}>
                {item.nama_album}
              </Text>
              <Text style={styles.cardTextSmall}>
                {item.total_bookmark_data}
              </Text>
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
  cardContainer: {
    marginBottom: 8,
  },
  cardText: {
    marginLeft: 16,
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },
  cardTextSmall: {
    marginLeft: 16,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
});

export default RenderMasonryList;
