import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import React, { Component } from "react";

export default class AppLoading extends Component {
  render() {
    return (
      <View>
        <ActivityIndicator size="medium" color="#A9329D" />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
