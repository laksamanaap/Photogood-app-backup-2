import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
} from "react-native";
import React from "react";

const OnboardingItem = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={([styles.container], { width })}>
      <View
        style={{ height: 500, justifyContent: "center", alignItems: "center" }}
      >
        <Image
          source={item?.image}
          style={[styles.image, { width, resizeMode: "contain" }]}
        />
        <View style={{ marginTop: 32 }}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.subtitle}>{item?.description}</Text>
        </View>
      </View>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    textAlign: "center",
  },
});
