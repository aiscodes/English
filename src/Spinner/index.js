import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const Spinner = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" width="350" color= "#2A80F1" />
      {/* <Text style={styles.textloading}>
        Loading...
      </Text> */}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor:'white',
  },
  textloading: {
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: "Gilroy-Regular",
    alignSelf: 'center',
    color: "#2A80F1",
  }
});

export default Spinner;