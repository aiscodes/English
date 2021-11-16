import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { StyleSheet, Dimensions, TouchableOpacity, Text, View, TextInput } from "react-native";
import { getDictionaryAll } from "../../actions/apiActions";
import { wordsUpdateRoutine, currentUpdateRoutine, wordsNewUpdateRoutine, wordsLearnUpdateRoutine, wordsKnowUpdateRoutine } from "../../store/dictReducer";
import { wordStatRoutine } from '../../store/statReducer';
import { putLogs, emptyLogs } from "../../actions/apiActions";
import Know from "./Know";
import Learning from "./Learning";
import NewWord from "./Newword";
import Search from "../../images/search.svg";
import { Tooltip } from 'react-native-elements';
import { trainingPlane } from '../../constants';

let currentTop = 0;
let currentBottom = 0;
let currentLines = { newWords: 0, knowWords: 0, learnWords: 0 };

const DictionaryLearning = ({
  user,
  wordCount,
  currentWords,
  wordsNew,
  wordsNewList,
  wordsLearn,
  wordsLearnList,
  wordsKnow,
  wordsKnowList,
  wordsUpdateRoutine,
  currentUpdateRoutine,
  wordsNewUpdateRoutine,
  wordsLearnUpdateRoutine,
  wordsKnowUpdateRoutine,
  wordStatRoutine }) => {
  const [page, setPage] = useState(0);
  const [currentNew, setCurrentNew] = useState(currentWords.newWords);
  const [currentLearn, setCurrentLearn] = useState(currentWords.learnWords);
  const [currentKnow, setCurrentKnow] = useState(currentWords.knowWords);
  const [findText, setFindtext] = useState();
  const [input, setInput] = useState(false);
  const wordInput = useRef();

  const setCurrentPage = value => {
    setPage(value);
    setFindtext('');
  }

  const diapazon = (top, bottom) => {
    currentTop = top;
    currentBottom = bottom;
  }
  const listener = (iPage) => {
    switch (iPage) {
      case 0:
        currentLines.newWords = currentTop;
        setCurrentNew(currentTop);
        return;
      case 1:
        currentLines.learnWords = currentTop;
        setCurrentLearn(currentTop);
        return;
      case 2:
        currentLines.know = currentTop;
        setCurrentKnow(currentTop);
        return;
    }
  };

  const doFind = () => {
    setInput(false)
    if (findText) {
      switch (page) {
        case 0:
          wordsNew = wordsNewList.filter(item => item.WordEn.startsWith(findText.toLowerCase()))
          wordsNewUpdateRoutine({ words: wordsNew, wordsList: wordsNewList })
          break;
        case 1:
          wordsLearn = wordsLearnList.filter(item => item.WordEn.startsWith(findText.toLowerCase()))
          wordsLearnUpdateRoutine({ words: wordsLearn, wordsList: wordsLearnList })
          break;
        default:
          wordsKnow = wordsKnowList.filter(item => item.WordEn.startsWith(findText.toLowerCase()))
          wordsKnowUpdateRoutine({ words: wordsKnow, wordsList: wordsKnowList })
          break;
      }
    } else {
      switch (page) {
        case 0:
          wordsNewUpdateRoutine({ words: [ ...wordsNewList], wordsList: wordsNewList })
          break;
        case 1:
          wordsLearnUpdateRoutine({ words: [ ...wordsLearnList], wordsList: wordsLearnList })
          break;
        default:
          wordsKnowUpdateRoutine({ words: [ ...wordsKnowList], wordsList: wordsKnowList })
          break;
      }
    }
  };

  const updateWords = async () => {
    wordsUpdateRoutine(await getDictionaryAll());
  };

  useEffect(() => {
    updateWords();
    return () => {
      currentUpdateRoutine({ currentWords: currentLines });
    };
  }, []);

  const setLearningLogs = async word => {
    emptyLogs(user.id, word.id);
    const loggs = [];
    word.wordRus.forEach(item => {
      item.loggs = [];
      const logg = { wordEnId: word.id, wordRuId: item.id, answer: false, state: 0, mode: false, index: 0, createdAt: new Date() };
      item.loggs.push(logg)
      loggs.push(logg);
      logg.mode = true;
      item.loggs.push(logg)
      loggs.push(logg);
    });
    putLogs(loggs); 
    return word;
  }

  const setKnowLogs = async word => {
    const loggs = [];
    word.wordRus.forEach(item => {
      let logg;
      if (item.loggs.length > 0) {
        logg = { ...item.loggs[0] };
        logg.state = 16;
        logg.index += 1;
        logg.answer = true;
        logg.mode = true;
        const date = new Date();
        logg.plane = date.setMinutes(date.getMinutes() + trainingPlane[16].interval);
      } else {
        logg = { wordEnId: word.id, wordRuId: item.id, answer: true, state: 0, mode: false, index: 0, createdAt: new Date() };
      }
      item.loggs.splice(0, 0, logg)
      loggs.push(logg);
    });
    putLogs(loggs);
    return word;
  }

  const wordToLearnRoutine = async word => {
    const item = await setLearningLogs(word);
    wordsLearn.push(item);
    wordsLearn.sort((itemA, itemB) => {
      let stateA = 0;
      let stateB = 0;
      itemA.wordRus.forEach(item => {
        if (item.loggs.length > 0) stateA = Math.max(stateA, item.loggs[0].state)
      });
      itemB.wordRus.forEach(item => {
        if (item.loggs.length > 0) stateB = Math.max(stateB, item.loggs[0].state)
      });
      return stateB - stateA;
    });
    wordsLearnList.push(item);
    wordsLearnList.sort((itemA, itemB) => {
      let stateA = 0;
      let stateB = 0;
      itemA.wordRus.forEach(item => {
        if (item.loggs.length > 0) stateA = Math.max(stateA, item.loggs[0].state)
      });
      itemB.wordRus.forEach(item => {
        if (item.loggs.length > 0) stateB = Math.max(stateB, item.loggs[0].state)
      });
      return stateB - stateA;
    });
    wordsLearnUpdateRoutine({ words: wordsLearn, wordsList: wordsLearnList });
    const newWordCount = { newWords: wordsNewList.length, learned: wordCount.learned, toLearn: wordsLearnList.length }
    wordStatRoutine({ words: newWordCount });
  };

  const wordToLearn = async wordId => {
    const wordIndex = wordsNew.findIndex((item) => item.id === wordId);
    const listIndex = wordsNewList.findIndex((item) => item.id === wordId);
    if (wordIndex >= 0 && listIndex >= 0) {
      setTimeout(wordToLearnRoutine, 0, wordsNew[wordIndex]);
      const newWords = [...wordsNew];
      newWords.splice(wordIndex, 1);
      wordsNewList.splice(listIndex, 1);
      wordsNewUpdateRoutine({ words: newWords, wordsList: wordsNewList });
    }
  }

  const wordToLearnReturnRoutin = async word => {
    const item = await setLearningLogs(word);
    wordsLearn.push(item);
    wordsLearn.sort((itemA, itemB) => {
      let stateA = 0;
      let stateB = 0;
      itemA.wordRus.forEach(item => {
        if (item.loggs.length > 0) stateA = Math.max(stateA, item.loggs[0].state)
      });
      itemB.wordRus.forEach(item => {
        if (item.loggs.length > 0) stateB = Math.max(stateB, item.loggs[0].state)
      });
      return stateB - stateA;
    });
    wordsLearnList.push(item);
    wordsLearnList.sort((itemA, itemB) => {
      let stateA = 0;
      let stateB = 0;
      itemA.wordRus.forEach(item => {
        if (item.loggs.length > 0) stateA = Math.max(stateA, item.loggs[0].state)
      });
      itemB.wordRus.forEach(item => {
        if (item.loggs.length > 0) stateB = Math.max(stateB, item.loggs[0].state)
      });
      return stateB - stateA;
    });
    wordsLearnUpdateRoutine({ words: wordsLearn, wordsList: wordsLearnList });
    const newWordCount = { newWords: wordCount.newWords, learned: wordsKnowList.length, toLearn: wordsLearnList.length }
    wordStatRoutine({ words: newWordCount });
  }

  const wordToLearnReturn = async wordId => {
    const wordIndex = wordsKnow.findIndex((item) => item.id === wordId);
    const listIndex = wordsKnowList.findIndex((item) => item.id === wordId);
    if (wordIndex >= 0 && listIndex >= 0) {
      setTimeout(wordToLearnReturnRoutin, 0, wordsKnow[wordIndex]);
      const newWords = [...wordsKnow];
      newWords.splice(wordIndex, 1);
      wordsKnowList.splice(listIndex, 1);
      wordsKnowUpdateRoutine({ words: newWords, wordsList: wordsKnowList });
    }
  }

  const wordToNewRoutin = async word => {
    emptyLogs(user.id, word.id);
    wordsNew.push(word);
    wordsNew.sort((itemA, itemB) => (itemB.WordEnFrq - itemA.WordEnFrq));
    wordsNewList.push(word);
    wordsNewList.sort((itemA, itemB) => (itemA.WordEnFrq - itemB.WordEnFrq));
    wordsNewUpdateRoutine({ words: wordsNew, wordsList: wordsNewList });
    const newWordCount = { newWords: wordsNewList.length, learned: wordCount.learned, toLearn: wordsLearnList.length }
    wordStatRoutine({ words: newWordCount });
  }

  const wordToNew = async wordId => {
    const wordIndex = wordsLearn.findIndex((item) => item.id === wordId);
    const listIndex = wordsLearnList.findIndex((item) => item.id === wordId);
    if (wordIndex >= 0 && listIndex >= 0) {
      setTimeout(wordToNewRoutin, 0, wordsLearn[wordIndex]);
      const newWords = [...wordsLearn];
      newWords.splice(wordIndex, 1);
      wordsLearnList.splice(listIndex, 1);
      wordsLearnUpdateRoutine({ words: newWords, wordsList: wordsLearnList });
    }
  }

  const wordToKnowRoutin = async word => {
    const item = await setKnowLogs(word);
    wordsKnow.push(item);
    // wordsKnow.sort((itemA, itemB) => itemA.WordEn.localeCompare(itemB.WordEn));
    wordsKnow.sort((itemA, itemB) => (itemA.WordEnFrq - itemB.WordEnFrq));
    wordsKnowList.push(item);
    wordsKnowUpdateRoutine({ words: wordsKnow, wordsList: wordsKnowList });
    const newWordCount = { newWords: wordCount.newWords, learned: wordsKnowList.length, toLearn: wordsLearnList.length }
    wordStatRoutine({ words: newWordCount });
  }

  const wordToKnow = async wordId => {
    const wordIndex = wordsLearn.findIndex((item) => item.id === wordId);
    const listIndex = wordsLearnList.findIndex((item) => item.id === wordId);
    if (wordIndex >= 0 && listIndex >= 0) {
      setTimeout(wordToKnowRoutin, 0, wordsLearn[wordIndex]);
      const newWords = [...wordsLearn];
      newWords.splice(wordIndex, 1);
      wordsLearnList.splice(listIndex, 1);
      wordsLearnUpdateRoutine({ words: newWords, wordsList: wordsLearnList });
    }
  }

  const wordToKnowSkipRoutin = async word => {
    const item = await setKnowLogs(word);
    wordsKnow.push(item);
    wordsKnow.sort((itemA, itemB) => (itemA.WordEnFrq - itemB.WordEnFrq));
    wordsKnowList.push(item);
    wordsKnowList.sort((itemA, itemB) => itemA.WordEn.localeCompare(itemB.WordEn));
    wordsKnowUpdateRoutine({ words: wordsKnow, wordsList: wordsKnowList });
    const newWordCount = { newWords: wordsNewList.length, learned: wordsKnowList.length, toLearn: wordCount.toLearn }
    wordStatRoutine({ words: newWordCount });
  }

  const wordToKnowSkip = async wordId => {
    const wordIndex = wordsNew.findIndex((item) => item.id === wordId);
    const listIndex = wordsNewList.findIndex((item) => item.id === wordId);
    if (wordIndex >= 0 && listIndex >= 0) {
      setTimeout(wordToKnowSkipRoutin, 0, wordsNew[wordIndex]);
      const newWords = [...wordsNew];
      newWords.splice(wordIndex, 1);
      wordsNewList.splice(listIndex, 1);
      wordsNewUpdateRoutine({ words: newWords, wordsList: wordsNewList });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.dictionaryPanel}>
        {input 
          ? <View style={styles.dictionaryPanelActive}>
            <TextInput
              ref={wordInput}
              placeholder="Введите слово"
              style={styles.input}
              onChangeText={(text)=>setFindtext(text)}
              onBlur={() => setInput(false)}
              onSubmitEditing={doFind}
              value={findText}
            />
            <TouchableOpacity onPress={doFind} style={styles.dictionaryPanelsearchBtn}>
              <Text style={styles.dictionaryPanelsearchText}>Найти</Text>
            </TouchableOpacity>
          </View>
          : <View style={styles.dictionaryPanelNotActive}>
            <Text style={{ fontWeight: "700", fontSize: 20, marginTop: 5, fontFamily: "Gilroy-Regular", lineHeight: 29 }}>
              Словарь
            </Text>
            <Tooltip popover={<Text>Искать в словаре</Text>}>
              <TouchableOpacity
                onPress={() => {
                  setInput(true);
                  setTimeout(() => wordInput.current.focus(), 10);
                }}
              >
                <Search marginRight={15} marginTop={15} />
              </TouchableOpacity>
            </Tooltip>
          </View>
        }
      </View>

      <View style={styles.tytlePanel}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={[ styles.touchContainer, page === 0 ? styles.touchSelect : null ]} onPress={() => setCurrentPage(0)}>
            <Text style={[ styles.textContainer, page === 0 ? { color: "black" } : {} ]}>
              {wordCount.newWords}
            </Text>
            <Text style={[ styles.textTypeContainer, page === 0 ? { color: "#2A80F1" } : {} ]}>
              Новые
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ styles.touchContainer, page === 1 ? styles.touchSelect : null ]} onPress={() => setCurrentPage(1)}>
            <Text style={[ styles.textContainer, page === 1 ? { color: "black" } : {} ]}>
              {wordCount.toLearn}
            </Text>
            <Text style={[ styles.textTypeContainer, page === 1 ? { color: "#2A80F1" } : {} ]}>
              Учу
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ styles.touchContainer, page === 2 ? styles.touchSelect : null ]} onPress={() => setCurrentPage(2)}>
            <Text style={[ styles.textContainer, page === 2 ? { color: "black" } : {} ]}>
              {wordCount.learned}
            </Text>
            <Text style={[ styles.textTypeContainer, page === 2 ? { color: "#2A80F1" } : {} ]}>
              Знаю
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.dataContainer} >
        {page === 0 && <NewWord words={wordsNew} current={currentNew} listener={listener} diapazon={diapazon} wordToLearn={wordToLearn} wordToKnow={wordToKnowSkip} />}
        {page === 1 && <Learning words={wordsLearn} current={currentLearn} listener={listener} diapazon={diapazon} wordToNew={wordToNew} wordToKnow={wordToKnow} />}
        {page === 2 && <Know words={wordsKnow} current={currentKnow} listener={listener} diapazon={diapazon} wordToLearn={wordToLearnReturn} />}
      </View>
    </View>
  );
};

const windowDimensions = Dimensions.get("window");
// const windowWidth = windowDimensions.width;
// const windowHeight = windowDimensions.height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  dictionaryPanel: {
    width: "90%",
    marginBottom: 22,
    marginTop: 30,
    justifyContent: "center",
    flexDirection: "row",
    height: 45,
    borderRadius: 22,
    alignSelf: "center",
    overflow: "hidden",
  },
  dictionaryPanelActive:{
    width: "97%",
    justifyContent: "space-between",
    flexDirection: "row",
    height: 35,
    borderWidth: 1,
    borderRadius: 22,
    borderColor: "#2F80ED",
    alignSelf: "center",
    overflow: "hidden",
    marginTop: 4
  },
  dictionaryPanelNotActive:{
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    height: 35,
    borderRadius: 22,
    alignSelf: "center",
    overflow: "hidden",
  },
  dictionaryPanelsearchBtn: {
    flexBasis: "30%",
    height: "100%",
    flexShrink: 1,
    flexGrow: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2F80ED",
    borderRadius: 22,
  },
  dictionaryPanelsearchText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "#fff",
    fontSize: 13,
  },
  input: {
    textAlign: "left",
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    flexBasis: "70%",
    flexShrink: 1,
    flexGrow: 0,
    textAlignVertical: "center",
    fontWeight: "500",
    color: "#000",
  },
  tytlePanel: {
    height: 50,
    marginBottom: 10,
    width: "100%",
  },
  dataContaner: {
    height: 50,
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  touchContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 15,
    marginHorizontal: 20,
  },
  touchSelect: {
    borderBottomWidth: 2,
    borderBottomColor: "#2A80F1",
  },
  textContainer: {
    color: "#828282",
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Gilroy-Regular",
    lineHeight: 35,
  },
  textTypeContainer: {
    color: "#BDBDBD",
    fontSize: 22,
    fontWeight: "400",
    fontFamily: "Gilroy-Regular",
  },
});

DictionaryLearning.propTypes = {
  user: PropTypes.object,
  wordCount: PropTypes.object,
  currentWords: PropTypes.object,
  wordsNew: PropTypes.arrayOf(PropTypes.object),
  wordsNewList: PropTypes.arrayOf(PropTypes.object),
  wordslearn: PropTypes.arrayOf(PropTypes.object),
  wordslearnList: PropTypes.arrayOf(PropTypes.object),
  wordsKnow: PropTypes.arrayOf(PropTypes.object),
  wordsKnowList: PropTypes.arrayOf(PropTypes.object),
};

DictionaryLearning.defaultProps = {
  user: {},
  wordCount: {},
  currentWords: {},
  wordsNew: [],
  wordsNewList: [],
  wordsLearn: [],
  wordsLearnList: [],
  wordsKnow: [],
  wordsKnowList: [],
};

const mapStateToProps = ({ users, stat, dictionary }) => ({
  user: users.user,
  wordCount: stat.wordCount,
  currentWords: dictionary.currentWords,
  wordsNew: dictionary.wordsNew,
  wordsNewList: dictionary.wordsNewList,
  wordsLearn: dictionary.wordsLearn,
  wordsLearnList: dictionary.wordsLearnList,
  wordsKnow: dictionary.wordsKnow,
  wordsKnowList: dictionary.wordsKnowList,
});

const mapDispatchToProps = { wordsUpdateRoutine, currentUpdateRoutine, wordsNewUpdateRoutine, wordsLearnUpdateRoutine, wordsKnowUpdateRoutine, wordStatRoutine };
export default connect(mapStateToProps, mapDispatchToProps)(DictionaryLearning);
