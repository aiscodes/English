import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, SafeAreaView, ImageBackground, Alert, BackHandler } from "react-native";
import sensei from "../../images/sensei.png";
import Dobor from './dobor';
import { wordsToLearn } from '../../constants';
import { putLogs, getDataStatistic, getWordsStatistic } from '../../actions/apiActions';
import { logsRoutine } from "../../store/wordsReducer";
import { dataStatRoutine, wordStatRoutine } from '../../store/statReducer';
import buttonGradient from '../../../assets/images/buttons.png';

const Loading = ({ route, learnCount, logs, logsRoutine, dataStatRoutine, wordStatRoutine }) => {

  const { finish, mode } = route.params;

  const navigation = useNavigation();
  const [handle, sethandle] = useState(true);
  const [isDobor, setIsDobor] = useState(false);
  const [isMode] =useState(mode);
  const message = (wordsToLearn - learnCount > 0)
    // ? 'По результатам проверки словарного запаса нам нужно подобрать еще ' +
    // ` ${wordsToLearn - learnCount} слов для изучения.`
    // : 'Нужное количество слов набрано, можешь приступать к тренировке.';
    ? 'Для старта тренировки нужно выбрать новые слова для запоминания.' 
    : 'Нужное количество слов набрано.'
    // 'Нужное количество слов набрано, можешь приступать к тренировке.';

  const handleLogs = () => {
    const addLogs = [];
    logs.filter(item => (item.answer === false)).forEach(item => {
      const { userId, wordEnId, wordRuId, answer, createdAt } = item;
      addLogs.push({ userId, wordEnId, wordRuId, answer, state: 0, mode: true, index: 0, createdAt });
    })
    addLogs.forEach(item => logs.push(item));
  }

  const getStatistic = async () => {
    await putLogs(logs);
    logsRoutine({ logs: [] });
    const { stat, statweek, statmonth, wordStat } = await getDataStatistic();
    dataStatRoutine({ stat, statweek, statmonth, wordStat });
    const words = await getWordsStatistic();
    wordStatRoutine({ words });
  }

  const goBack = () => {
    Alert.alert(
      "Внимание !",
      isDobor ? "Вы действительно хотите прервать добор слов ?" : "Вы хотите вернуться на дашбоард ?",
      [
        {
          text: "Нет",
          style: "cancel"
        },
        {
          text: "Да", onPress: () => {
            navigation.navigate('Dashboard');
          }
        }
      ],
      { cancelable: true }
    );
    return true;
  }
  useEffect(() => {
    if (wordsToLearn - learnCount <= 0 && handle) {
      sethandle(false);
      handleLogs();
      getStatistic();
      // putLogs(logs);
      // logsRoutine({ logs: [] });
    }
    BackHandler.addEventListener('hardwareBackPress', goBack);
    navigation.addListener('blur', (e) => {
      BackHandler.removeEventListener('hardwareBackPress', goBack);
    });
  });

  const doborFinish = () => {
    setIsDobor(false);
  }

  return (
    isDobor 
      ? <Dobor doborFinish={doborFinish} />
      : <SafeAreaView style={styles.container} >
        <View style={{ paddingHorizontal: windowWidth * 0.038 }}>
          <Image source={sensei} style={styles.master} />
          <Text style={styles.title}>
          {message}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.containButton}
          onPress={() => {
            (wordsToLearn - learnCount > 0)
              ? setIsDobor(true)
              : finish()
          }}
        >
          <ImageBackground source={buttonGradient} style={styles.trainingButton} >
            {(wordsToLearn - learnCount > 0)
              ? <Text style={styles.buttonText}>Выбрать</Text>
              : <Text style={styles.buttonText}>Тренировать</Text>}
          </ImageBackground>
        
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.cancellButton}
          onPress={() => {
            navigation.navigate('Dashboard')
          }}
        >
          {isMode
            ? <Text style={styles.buttonText1}>Вернуться в словарь</Text>
            : <Text style={styles.buttonText1}>Вернуться в Дашборд</Text>}
        </TouchableOpacity> */}
      </SafeAreaView>
  );
}

const windowDimensions = Dimensions.get("window");
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: windowWidth * 0.038,
    flexDirection: "column",
  },
  master: {
    width: 330,
    height: windowHeight * 0.4,
    alignSelf: "center",
    marginTop: windowWidth * 0.3,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "black",
    fontFamily: 'Gilroy-Regular',
    marginTop: windowWidth * 0.2,
  },
  cancellButton: {
    backgroundColor: "#fff",
    width: '90%',
    height: 42,
    color: '#2A80F1',
    borderColor: '#2A80F1',
    borderWidth: 1,
    borderRadius: 39,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: windowWidth * 0.002,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    lineHeight: windowWidth * 0.06,
    alignSelf: 'center',
    fontFamily: 'Gilroy-Regular',
    marginTop: -7,
    fontWeight: '700'
  },
    buttonText1: {
    color: "#2A80F1",
    fontSize: 18,
    lineHeight: windowWidth * 0.06,
    alignSelf: 'center',
    fontFamily: 'Gilroy-Regular',
    fontWeight: '700'
  },
  trainingButton: {
    width: '100%',
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
      marginTop: windowWidth * 0.2,
      alignSelf: 'center'
},
});

Loading.propTypes = {
  learnCount: PropTypes.number,
  logs: PropTypes.arrayOf(PropTypes.object)
};

Loading.defaultProps = {
  learnCount: 0,
  logs: []
};

const mapStateToProps = ({ words }) => ({
  learnCount: words.learnCount,
  logs: words.logs
});

const mapDispatchToProps = { logsRoutine, dataStatRoutine, wordStatRoutine };
export default connect(mapStateToProps, mapDispatchToProps)(Loading);
