import React, { forwardRef, useState, useRef } from "react";
import {
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  TextInput,
} from "react-native";
import BottomSheetCommentUI from "./BottomSheetCommentUI";
import BottomSheet from "@devvie/bottom-sheet";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";

const BottomSheetUI = forwardRef(({ height, id, name, image }, ref) => {
  const [isLoved, setIsLoved] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const loveAnimation = useRef(new Animated.Value(0)).current;

  const toggleLove = () => {
    setIsLoved(!isLoved);
    startLoveAnimation();
  };

  const toggleBookmark = () => {
    setIsBookmark(!isBookmark);
  };

  const startLoveAnimation = () => {
    Animated.timing(loveAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      loveAnimation.setValue(0);
    });
  };

  const loveStyle = {
    transform: [
      {
        translateY: loveAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, -200],
        }),
      },
      {
        scale: loveAnimation.interpolate({
          inputRange: [0, 1, 1],
          outputRange: [0, 5, 1],
        }),
      },
    ],
  };

  const dummyComments = [
    {
      author: "Cak Imin Slepet",
      text: "Sangar awmu cak!.",
      image: require("../assets/images/placeholder-image-3.png"),
    },
    {
      author: "Cak Imin Slepet",
      text: "Sangar awmu cak!.",
      image: require("../assets/images/placeholder-image-3.png"),
    },
  ];

  const slicedComments = dummyComments.slice(0, 2);

  const sheetRef = useRef(null);

  const openBottomSheet = () => {
    sheetRef.current?.open();
  };

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  return (
    <BottomSheet
      ref={ref}
      style={styles.container}
      animationType="slide"
      height={height}
      containerHeight={Dimensions.get("window").height + 75}
    >
      <View style={styles.contentContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={image}
            style={{ width: 50, height: 50, borderRadius: 100 }}
          />
          <Text style={styles.textBold}>Laksamana</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={toggleLove}
          >
            <AntDesign
              name={"hearto"}
              style={{ color: "#A9329D", fontSize: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={toggleBookmark}
          >
            <FontAwesome
              name={isBookmark ? "bookmark" : "bookmark-o"}
              style={{ color: "#A9329D", fontSize: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.bottomSheetImage} />
          {isMenuExpanded ? (
            <>
              <View style={styles.downloadIcons}>
                <TouchableOpacity
                  style={styles.downloadIcon}
                  onPress={toggleMenu}
                >
                  <Entypo
                    name={"download"}
                    style={{ color: "#FFF", fontSize: 16 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.menuIcons}>
                <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
                  <Entypo
                    name={"share"}
                    style={{ color: "#FFF", fontSize: 16 }}
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity style={styles.moreButton} onPress={toggleMenu}>
              <Feather
                name={"more-horizontal"}
                style={{ color: "#FFF", fontSize: 20 }}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.bottomSheetTop}>
          <Text style={[styles.textBold, { fontSize: 24 }]}>Gadis Sampul</Text>
          <Text style={[styles.text, { color: "#7C7C7C" }]}>
            24 Februari 2024
          </Text>
        </View>
        <View style={styles.commentContainer}>
          <Text style={[styles.text, { fontSize: 16 }]}>Komentar</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openBottomSheet()}
          >
            <Feather
              name={"more-horizontal"}
              style={{ color: "#FFF", fontSize: 18 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 8 }}>
          {slicedComments.map((comment, index) => (
            <View style={styles.comment} key={index}>
              <Image
                source={comment.image}
                style={{ width: 40, height: 40, borderRadius: 50 }}
              ></Image>
              <View>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Animated.View style={[styles.loveIcon, loveStyle]}>
        <AntDesign name="heart" style={{ color: "#A9329D", fontSize: 30 }} />
      </Animated.View>
      <BottomSheetCommentUI ref={sheetRef} />
    </BottomSheet>
  );
});

export default BottomSheetUI;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loveIcon: {
    position: "absolute",
    alignSelf: "center",
    top: -40,
    right: 70,
    opacity: 0.25,
  },
  imageContainer: {
    position: "relative",
  },
  moreButton: {
    position: "absolute",
    top: 15,
    right: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A9329D",
    padding: 4,
    borderRadius: 60,
  },
  buttonContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bottomSheetButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 35,
    backgroundColor: "#F9F9F9",
    padding: 8,
    borderRadius: 60,
    shadowColor: "#717171",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    elevation: 20,
  },
  bottomSheetImage: {
    borderRadius: 16,
    resizeMode: "cover",
    width: "100%",
    height: 200,
  },
  bottomSheetTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  commentContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  commentHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  comment: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  commentAuthor: {
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
  },
  commentText: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  addComment: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#A9329D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A9329D",
    padding: 4,
    borderRadius: 50,
    color: "white",
  },
  buttonDownload: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A9329D",
    color: "white",
    borderRadius: 50,
    padding: 7,
    marginTop: 20,
  },
  menuIcons: {
    position: "absolute",
    top: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A9329D",
    padding: 6,
    borderRadius: 60,
    zIndex: 1,
  },
  downloadIcons: {
    position: "absolute",
    top: 15,
    right: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A9329D",
    padding: 6,
    borderRadius: 60,
    zIndex: 1,
  },
  menuIcon: {
    marginHorizontal: 5,
  },
  downloadIcon: {
    marginHorizontal: 5,
  },
  text: {
    fontFamily: "Poppins-Regular",
  },
  textBold: {
    fontFamily: "Poppins-Bold",
  },
});
