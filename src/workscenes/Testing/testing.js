import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import EndTesting from "./endTesting";
import TestPanel from './testPanel';
import Dobor from './dobor';
import { vocabularyWords } from "../Actions/vocabulary";
import { wordsPRoutine, countRoutine, learnRoutine, vocabularyRoutine, logsRoutine } from '../../store/wordsReducer';
import { wordsToLearn } from '../../constants';
import { getDate } from '../../constants';
import { writeUserPoint } from '../../actions/apiActions';

let top, bottom, current, learnCount = 0;
const logs = [];

const Testing = ({ words, wordsPRoutine, countRoutine, logsRoutine, learnRoutine, vocabularyRoutine }) => {
  const navigation = useNavigation();
  const [array] = useState(words);
  const [totalCount] = useState(Math.round(Math.log2(array.length)));
  const [word, setCurrentWord] = useState(array[0]);
  const [finish, setFinish] = useState(false);
  const [isDobor, setIsDobor] = useState(false);

  const doAnswer = (otvet) => {
    const dats = getDate(); // new Date();
    logs.push({ wordEnId: word.wordEn.id, wordRuId: word.id, answer: otvet, mode: false, index: 0, createdAt: dats });
    array.splice(current,1);
    top -= 1;
    if (otvet) {
      bottom = current;
    } else {
      learnCount += 1;
      top = current;
    }
    if (top - bottom < 2) {
      wordsPRoutine({ words: array, point: current });
      writeUserPoint(current);
      countRoutine({ learnCount });
      logsRoutine({ logs });
      setFinish(true);
    } else {
      current = Math.round((top + bottom) / 2);
      setCurrentWord(array[current]);
    }
  }

  useEffect(() => {
    top = array.length - 1;
    bottom = 0;
    current = Math.round((top + bottom) / 2);
    learnCount = 0;
    logs.length = 0;
    setCurrentWord(array[current]);
  }, []);

  const startTesting = async () => {
    const logg = false;
    const result = await vocabularyWords(navigation, learnRoutine, countRoutine, vocabularyRoutine, logg);
    if (result) navigation.navigate("Loading", { finish: startTesting, mode: false });
  }

  const localNavigate = value => {
    // if (value) {
    //   setIsDobor(true);
    // } else {
    //   navigation.navigate('Dashboard');
    // } 
    startTesting();
  }

  const doborFinish = () => {
    setIsDobor(false);
  }

  return (
    finish 
      ? isDobor 
        ? <Dobor doborFinish={doborFinish} />
        : <EndTesting localNavigate={localNavigate} />
      : <TestPanel word={word} doAnswer={doAnswer} totalCount={totalCount} mode={true} />
  );

}

Testing.propTypes = {
  words: PropTypes.arrayOf(PropTypes.object)
};

Testing.defaultProps = {
  words: []
};

const mapStateToProps = ({ words }) => ({
    words: words.words
});

const mapDispatchToProps = { wordsPRoutine, countRoutine, logsRoutine, learnRoutine, countRoutine, vocabularyRoutine };
export default connect(mapStateToProps, mapDispatchToProps)(Testing);
