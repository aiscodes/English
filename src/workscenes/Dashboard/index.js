import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Dimensions, TouchableOpacity, Text, View, Alert, BackHandler } from 'react-native';
import Line from '../../../assets/images/line.svg'
import Bookmark from '../../../assets/images/bookmark.svg'
import SenseiIcon from '../../../assets/images/senseiIcon.svg'
import DictionaryLearning from '../DictionaryLearning';
import Profile from './Profile'
import Wellcome from '../Wellcome';
import { getDataStatistic, getWordsStatistic, getDictionaryAll } from '../../actions/apiActions';
import { dataStatRoutine, wordStatRoutine, countStatRoutine } from '../../store/statReducer';
import { wordsUpdateRoutine } from "../../store/dictReducer";

let waiting = 0;

const Dashboard = ({ navigation, route, dataStatRoutine, wordStatRoutine, countStatRoutine, wordsUpdateRoutine }) => {
  const [page, setPagePage] = useState(0);
  const [isWaiting, setWaiting] = useState(0);
  const [startMode, setStartMode] = useState(route.params ? route.params.startMode : false);

  const getStatistic = async () => {
    const result = await getDataStatistic();
    if (!result) {
      Alert.alert('Ошибка связи !', 'Нет ответа от сервера ...');
      return;
    }
    const { stat, statweek, statmonth, wordStat } = result;
    dataStatRoutine({ stat, statweek, statmonth, wordStat });
    const words = await getWordsStatistic();
    if (!words) {
      Alert.alert('Ошибка связи !', 'Нет ответа от сервера ...');
      return;
    }
    wordStatRoutine({ words });
    waiting ++;
    setWaiting(waiting);
  }

  const updateWords = async () => {
    wordsUpdateRoutine(await getDictionaryAll());
  };

  const setPage = (iPage = 0) => {
    if (iPage === 0 && page !== 0) getStatistic();
    setPagePage(iPage);
    return true;
  }

  useEffect(() => {
    if (startMode === true) {
      navigation.push('Start');
      setStartMode(false);  
    } else {
      updateWords();
      navigation.addListener('focus', (e) => {
        BackHandler.addEventListener('hardwareBackPress', setPage);
        getStatistic();
      });
      navigation.addListener('blur', (e) => {
        BackHandler.removeEventListener('hardwareBackPress', setPage);
      });
    }
  }, [navigation]);

  return (
    startMode === true ||
    <>
      <View style={styles.topContainer}>
        {page === 0 && <Profile wait={isWaiting} />}
        {page === 1 && <DictionaryLearning />}
        {page === 2 && <Wellcome />}
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchContainer} onPress={() => setPage(0)}>
          <Line />
          <Text  style={[styles.textTypeContainer, page === 0 ? { color: '#2A80F1' } : { color: 'black'}]}>
            Я
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchContainer} onPress={() => setPage(1)}>
          <Bookmark />
          <Text  style={[styles.textTypeContainer, page === 1 ? { color: '#2A80F1' } : { color: 'black'}]}>
            Словарь
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchContainer} onPress={() => setPage(2)}>
          <SenseiIcon />
          <Text  style={[styles.textTypeContainer, page === 2 ? { color: '#2A80F1' } : { color: 'black'}]}>
            Сенсей
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const windowDimensions = Dimensions.get('window')
const windowHeight = windowDimensions.height;

const styles = StyleSheet.create({
  topContainer: {
    height: windowHeight * 0.92
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    height: windowHeight * 0.05
  },
  touchContainer: {
    fontSize:14,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textTypeContainer: {
 
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Gilroy-Regular',
  }
})

const mapDispatchToProps = { dataStatRoutine, wordStatRoutine, countStatRoutine, wordsUpdateRoutine };
export default connect(null, mapDispatchToProps)(Dashboard);
