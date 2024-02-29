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

export default function ChatBubbleList({
  chatData,
  onRefresh,
  join,
  lastMember,
}) {
  console.log(chatData, "CHAT DATA FROM CHAT DETAIL");
  const [refreshing, setRefreshing] = useState(false);

  return (
    <>
      <ScrollView>
        {chatData?.length > 0 ? (
          chatData.map((message, index) => (
            <ChatBubble
              key={index}
              message={message}
              join={join}
              lastMember={lastMember}
            />
          ))
        ) : (
          <Text>Gada</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
