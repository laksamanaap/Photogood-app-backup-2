import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import ChatBubble from "./ChatBubble";

export default function ChatBubbleList({ chatData, onRefresh }) {
  console.log(chatData, "CHAT DATA FROM CHAT DETAIL");
  const [refreshing, setRefreshing] = useState(false);

  return (
    <>
      <ScrollView
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
      >
        {chatData?.length > 0 ? (
          chatData.map((message, index) => (
            <ChatBubble key={index} message={message} />
          ))
        ) : (
          <Text>Gada</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
