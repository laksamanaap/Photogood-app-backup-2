import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import moment from "moment";

export default function ChatList({
  chatData,
  navigation,
  onRefresh,
  openBottomSheet,
}) {
  const formatDate = (createdAt) => {
    const formattedDate = moment(createdAt).format("HH:mm");

    return formattedDate;
  };

  return (
    <>
      {chatData?.length > 0 ? (
        chatData?.map((chat, index) => (
          <TouchableOpacity
            style={styles.chatAvatarContainer}
            key={index}
            onPress={() =>
              navigation.navigate("ChatDetail", { ruang_id: chat?.ruang_id })
            }
          >
            <View style={styles.chatAvatarWrapper}>
              {chat?.profil_ruang ? (
                <Image
                  source={{ uri: chat?.profil_ruang }}
                  style={styles.chatAvatar}
                />
              ) : (
                <Image
                  source={require("../assets/images/placeholder-image-3.png")}
                  style={styles.chatAvatar}
                />
              )}
              <View>
                <Text
                  style={styles.chatAvatarTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {chat?.nama_ruang}
                </Text>
                <Text
                  style={[styles.chatAvatarSubtitle, { width: 220 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {chat?.last_message ? (
                    <Text style={{ color: "#7C7C7C" }}>
                      {chat?.last_message?.user?.username} :{" "}
                      {chat?.last_message?.isi_pesan}
                    </Text>
                  ) : (
                    <Text style={{ color: "#7C7C7C" }}>
                      {chat?.owner?.username} baru saja membuat grup ini
                    </Text>
                  )}
                </Text>
              </View>
            </View>
            <Text
              style={[styles.chatAvatarSubtitle, { marginTop: 4 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {chat?.last_message ? (
                <Text>{formatDate(chat?.last_message?.created_at)}</Text>
              ) : (
                <Text>{formatDate(chat?.created_at)}</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.textWrapper}>
          <Text style={styles.textBookmark}>
            Ruang diskusi kosong!. Tambah ruang untuk memulai!
          </Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => openBottomSheet()}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                }}
              >
                Tambah Ruang
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overlayColor: "#F2F2F2",
    backgroundColor: "#F2F2F2",
  },
  chatAvatarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  chatAvatarTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  chatAvatarSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  chatAvatarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
    backgroundColor: "#F2F2F2",
  },
  textBookmark: {
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  textWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 30,
    gap: 16,
  },
  button: {
    width: "50%",
    backgroundColor: "#A9329D",
    padding: 4,
    borderRadius: 50,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
