import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, SafeAreaView, ImageBackground } from "react-native";
import RNSpeedometer from 'react-native-speedometer'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import { ChartsIntensity } from "../Dashboard/Profile/Charts-intensity";
import { defIntensity } from '../../constants';
import arrow from '../../../assets/arrow.png'
import buttonGradient from '../../../assets/images/buttons.png';

const Statistics3 = ({ navigation, count, data }) => {
  const [countWord, setCountWord] = useState(0);
  const [training, setTraining] = useState(0);

  useEffect(() => {
    let days = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].count <= 0) break;
      days++;
    }
    setTraining(days);
    const intens = Math.ceil(data[data.length - 1].countTrue / defIntensity * 100);
    setCountWord(intens);
  }, [])

  let arr = [
    { name: 'n01', key: 'k01', labelColor: 'white', activeBarColor: '#F97272' },
    { name: 'n02', key: 'k02', labelColor: 'white', activeBarColor: '#F97272' },
    { name: 'n03', key: 'k03', labelColor: 'white', activeBarColor: '#F97272' },
    { name: 'n04', key: 'k04', labelColor: 'white', activeBarColor: '#F97272' },
    { name: 'n05', key: 'k05', labelColor: 'white', activeBarColor: '#F97272' },
    { name: 'n06', key: 'k06', labelColor: 'white', activeBarColor: '#FFEF60' },
    { name: 'n07', key: 'k07', labelColor: 'white', activeBarColor: '#FFEF60' },
    { name: 'n08', key: 'k08', labelColor: 'white', activeBarColor: '#FFEF60' },
    { name: 'n09', key: 'k09', labelColor: 'white', activeBarColor: '#FFEF60' },
    { name: 'n10', key: 'k10', labelColor: 'white', activeBarColor: '#FFEF60' },
    { name: 'n11', key: 'k11', labelColor: 'white', activeBarColor: '#53E773' },
    { name: 'n12', key: 'k12', labelColor: 'white', activeBarColor: '#53E773' },
    { name: 'n13', key: 'k13', labelColor: 'white', activeBarColor: '#53E773' },
    { name: 'n14', key: 'k14', labelColor: 'white', activeBarColor: '#53E773' },
    { name: 'n15', key: 'k15', labelColor: 'white', activeBarColor: '#53E773' },
    { name: 'n16', key: 'k16', labelColor: 'white', activeBarColor: '#53E773' }
  ]

  const daysText = (value) => {
    const vall = value % 100;
    switch (vall) {
      case 1: case 21: case 31: case 41: case 51: case 61: case 71: case 81: case 91:
        return `${value} день`;
      case 2: case 22: case 32: case 42: case 52: case 62: case 72: case 82: case 92:
      case 3: case 23: case 33: case 43: case 53: case 63: case 73: case 83: case 93:
      case 4: case 24: case 34: case 44: case 54: case 64: case 74: case 84: case 94:
        return `${value} дня`;
      default:
        return `${value} дней`;
    }
  }

  return (
    <View style={styles.hostcontainer}>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.title}>Интенсивность</Text>
          <Text style={styles.result}>{Math.floor(countWord)}%</Text>
          <SafeAreaView style={[styles.container, { height: (windowHeight * 0.18) }]}>
            <RNSpeedometer
              value={countWord}
              defaultValue={0}
              size={260}
              labels={arr}
              labelStyle={{ display: 'none', width: 0, fontSize: 0, color: 'transparent' }}
              innerCircleStyle={{ width: '85%', height: '85%' }}

              needleImage={arrow}
              imageWrapperStyle={{
                width: "100%", 
                height: "100%", 
                marginTop: 70
              }}
              imageStyle={{
                alignSelf: 'center',
                height: 100,
                width: 25,
                justifyContent:'center',
                marginTop:'-10%'
              }}
            />
            {/* <View style={{ backgroundColor: 'white', width: 30, height: 18, alignSelf: 'center' }} /> */}
          </SafeAreaView>
          <View style={styles.graph}>
            <ChartsIntensity data={data} len={7} hidden={false} koe={1} />
          </View>
          {/* {training > 0 && <Text style={styles.resultTextBold}>{daysText(training)} в ударном режиме</Text>} */}
          <Text style={styles.resultText}>
            {/* Занимайтесь ежедневно, чтобы это вошло в привычку */}
            Ежедневные тренировки улучшают запоминание.
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate("Dashboard")}
        style={{ width: "100%" }}
      >
        <ImageBackground
          source={buttonGradient}
          style={styles.trainingButton}
        >
          <Text style={styles.buttonText}>Продолжить</Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}
const windowDimensions = Dimensions.get("window");
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

const styles = StyleSheet.create({
  hostcontainer: {
    backgroundColor: "white"
  },
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 28,
    color: "black",
    alignSelf: "center",
    marginTop: 40,
    fontFamily: 'Gilroy-Regular',
  },
  graph: {
    width: '100%',
    marginTop: '3%',
    marginBottom: windowHeight * 0.02
  },
  result: {
    fontSize: windowHeight * 0.06,
    color: "#2F80ED",
    alignSelf: "center",
    marginTop: 15,
    fontFamily: 'Gilroy-Regular',
  },
  inform: {
    fontSize: 18,
    marginLeft: windowWidth * 0.05,
    marginTop: 15,
    marginBottom: 20,
    fontFamily: 'Gilroy-Regular',
  },
  resultTextBold: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: 'Gilroy-Regular',
    marginTop: -15,
  },
  resultText: {
    fontSize: 22,
    width: "80%",
    alignSelf: 'center',
    lineHeight: 20,
    textAlign: "center",
    marginTop: windowHeight * 0.015,
    fontFamily: 'Gilroy-Regular',
  },
  trainingButton: {
    width: "100%",
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: windowWidth * 0.02,
    marginBottom: windowWidth * 0.1,
  },
  scroll: {
    height: windowHeight - 40 - windowWidth * 0.12
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 18,
    textAlign: "center",
    fontFamily: 'Gilroy-Regular',
    marginTop: -13,
    fontWeight: '700'
  },
  cancel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '82%',
    alignItems: 'center',
    marginLeft: '10%'
  }
});

Statistics3.propTypes = {
  count: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.object)
};
Statistics3.defaultProps = {
  count: 0,
  data: []
};
const mapStateToProps = ({ stat }) => ({
  count: stat.count,
  data: stat.stat
});

export default connect(mapStateToProps)(Statistics3);