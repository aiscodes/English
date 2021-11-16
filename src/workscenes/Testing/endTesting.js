import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native";
import sensei from "../../images/sensei.png";
import { wordsToLearn } from '../../constants';
import Target from "../../../assets/images/Target.svg";
import { putLogs, getDataStatistic, getWordsStatistic } from '../../actions/apiActions';
import { logsRoutine } from "../../store/wordsReducer";
import { dataStatRoutine, wordStatRoutine } from '../../store/statReducer';

const EndTesting = ({ learnCount, logs, logsRoutine, localNavigate, dataStatRoutine, wordStatRoutine }) => {

  const [countWordsToLearn] = useState(0); // wordsToLearn - learnCount);
  const [handle, sethandle] = useState(true);
  const message = (countWordsToLearn > 0)
    ? 
    // 'По результатам проверки словарного запаса нам нужно подобрать еще ' +
    // ` ${countWordsToLearn} слов для изучения.`
    `Выбери новые слова для запоминания`
    : 'Твой уровень словарного запаса определен';

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
  useEffect(() => {
    if (countWordsToLearn <= 0 && handle) {
      sethandle(false);
      handleLogs();
      getStatistic();
      // putLogs(logs);
      // logsRoutine({ logs: [] });
    }
  });

  const doNavigate = () => {
    if (countWordsToLearn > 0) {
      localNavigate(true);
    } else {
      localNavigate(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: windowWidth * 0.038 }}>
        <Image source={sensei} style={styles.master} />
        <Text style={styles.title}>
          {message}
        </Text>
      </View>
      <TouchableOpacity style={styles.containButton} onPress={doNavigate} >
      {message !== 'Твой уровень словарного запаса определен'  ? null : <Target style={styles.exerciseImage} />}
        {message==='Твой уровень словарного запаса определен' ?
          <Text style={styles.buttonText1}>Тренироваться</Text> : <Text style={styles.buttonText1}>Продолжить</Text>
        }
      </TouchableOpacity>
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
    justifyContent: "space-between"
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
  containButton: {
    backgroundColor: "#2A80F1",
    width: '90%',
    height: 45,
    justifyContent: "center",
    borderRadius: 39,
    flexDirection: "row",
    color: "white",
    marginTop: windowWidth * 0.01,
    marginBottom: windowWidth * 0.1,
    alignSelf: 'center'
  },
  exerciseImage: {
    width: 25,
    height: 25,
    marginRight: windowWidth * 0.015,
    alignSelf: "center",
    marginTop: -2
  },
  buttonText1: {
    fontSize: windowWidth * 0.06,
    color: 'white',
    lineHeight: windowWidth * 0.06,
    alignSelf: 'center',
    fontFamily: 'Gilroy-Regular',
  }
});

EndTesting.propTypes = {
  learnCount: PropTypes.number,
  logs: PropTypes.arrayOf(PropTypes.object)
};

EndTesting.defaultProps = {
  learnCount: 0,
  logs: []
};

const mapStateToProps = ({ words }) => ({
  learnCount: words.learnCount,
  logs: words.logs
});

const mapDispatchToProps = { logsRoutine, dataStatRoutine, wordStatRoutine };
export default connect(mapStateToProps, mapDispatchToProps)(EndTesting);
