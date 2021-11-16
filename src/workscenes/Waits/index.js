import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Dimensions, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ImageBackground } from 'react-native';
import buttonGradient from '../../../assets/images/buttons.png';
import Spinner from '../../Spinner';
import { getWordsVocabulary, getWordsList, getDataStatistic, getWordsStatistic } from '../../actions/apiActions';
import { wordsPRoutine } from '../../store/wordsReducer';
import { dataStatRoutine, wordStatRoutine } from '../../store/statReducer';
import Screen from '../../../assets/splash.png';

const Wait = ({ navigation, user, wordsPRoutine, dataStatRoutine, wordStatRoutine }) => {

  const { expo: { version } } = require('../../../app.json');

  const [isError, setError] = useState(false);
  const [isStarted, setStarted] = useState(false);

  const testWords = async () => {
    if (isStarted) return;
    setStarted(true);
    const { stat, statweek, statmonth, wordStat } = await getDataStatistic();
    dataStatRoutine({ stat, statweek, statmonth, wordStat });
    let words = await getWordsStatistic();
    if (words) {
      wordStatRoutine({ words });
      words = await getWordsList();
      let point = user.point ? user.point : Math.round(words.length /  2);
      wordsPRoutine({ words, point });
      words = await getWordsVocabulary();
      if (words) {
        if (words && words.length > 0) {
          navigation.push('Dashboard', { startMode: false });
          return;
        }
        navigation.push('Dashboard', { startMode: true });
        // navigation.push('Start');
        return;
      }
    }
    setError(true);
    setStarted(false);
  }

  const repeat = () => {
    setError(false);
    testWords();
  }

  useEffect(() => {
    testWords();
  })

  return (
    <View style={{ height: '100%' }}>
      <ImageBackground source={Screen} style={{ position: 'absolute', top: 0, width: '100%', height: '100%' }}>
        <View style={styles.container}>
          {isError 
          ? <View style={styles.message}>
              <Text style={styles.exerciseText}>Плохое интернет - соединение !</Text>
              <Text style={styles.exerciseText}>Попробуйте позже</Text>
              <TouchableOpacity onPress={repeat} >
                <ImageBackground source={buttonGradient} style={styles.trainingButton}>
                  <Text style={styles.buttonText}>Повторить</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          : <ActivityIndicator size="large" width="350" color="white" />}
        </View>
        <View style={styles.vers}>
          <Text style={styles.versText}>App Version {version}</Text>
        </View>
      </ImageBackground>
    </View>  
  )
}

const windowDimensions = Dimensions.get("window");
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: windowWidth,
    bottom: 0,
    height: 200,
    alignSelf: 'center',
  },
  message: {
    position: 'absolute',
    paddingTop: 20,
    width: windowWidth,
    bottom: 0,
    backgroundColor: 'white',   
  },
  vers: {
    position: 'absolute',
    width: windowWidth,
    alignSelf: "center",
    paddingBottom: 5,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  versText: {
    fontSize: 14,
    fontWeight: '500',
    color: "white",
    alignSelf: "center",
    fontFamily: "Gilroy-Regular",
  },
  exerciseText: {
    fontSize: 18,
    fontWeight: '700',
    color: "black",
    lineHeight: windowWidth * 0.06,
    alignSelf: "center",
    fontFamily: "Gilroy-Regular",
    marginBottom: 5
  },
  trainingButton: {
    width: windowWidth,
    height: 70,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: 'center',
    flexDirection: "row",
    marginTop: windowHeight * 0.03,
    marginBottom: windowHeight * 0.03,
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: "white",
    lineHeight: windowWidth * 0.06,
    alignSelf: "center",
    fontFamily: "Gilroy-Regular",
    marginTop: -10
  }
});

Wait.propTypes = {
  user: PropTypes.object
};

Wait.defaultProps = {
  user: {}
};

const mapStateToProps = ({ users }) => ({
  user: users.user
});

const mapDispatchToProps = { wordsPRoutine, dataStatRoutine, wordStatRoutine };
export default connect(mapStateToProps, mapDispatchToProps)(Wait);
