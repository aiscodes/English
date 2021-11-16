import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LeftArrow from '../../../images/leftArrow.svg'
import RightArrow from '../../../images/rightArrow.svg'

export default function Footer({ handleChoice, checkResp }) {
  return (
    <View style={[ styles.navigationBtn, !checkResp ? { justifyContent: "center" } : {} ]}>
      {!checkResp 
        ? <TouchableOpacity onPress={() => handleChoice(1)} style={styles.button}>
            <Text style={styles.correct}>Ответ</Text>
            <RightArrow alignSelf='center' width={16}/>
          </TouchableOpacity>
        : <>
            <TouchableOpacity onPress={() => handleChoice(-1)} style={styles.button}>
              <LeftArrow alignSelf='center' width={16}/>
              <Text style={styles.incorrect}>Ошибка</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChoice(1)} style={styles.button}>
              <Text style={styles.correct}>Правильно</Text>              
              <RightArrow alignSelf='center' width={16}/>
            </TouchableOpacity>
          </>}
    </View>
  );
}

const styles = StyleSheet.create({
  navigationBtn: {
    position: 'absolute',
    width: '100%',
    bottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15
  },
  button: {
    display: "flex",
    flexDirection: "row",
  },
  incorrect: {
    fontSize: 22,
    color: "#EB5757",
    fontWeight: "400",
    lineHeight: 22,
    marginLeft: 10,
    fontFamily: 'Gilroy-Regular',
  },
  correct: {
    fontSize: 22,
    color: "#27AE60",
    fontWeight: "400",
    lineHeight: 22,
    marginRight: 10,
    fontFamily: 'Gilroy-Regular',
  },
});