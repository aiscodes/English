import { Alert } from 'react-native';
import { trainingPlane, getDate } from '../../constants';
import { putLogs, getDataStatistic, getWordsStatistic, getDictionaryAll } from '../../actions/apiActions';

const calcResults = async (user, vocabulary, learnVocabulary, vocabularyRoutine, learnRoutine, wordsUpdateRoutine, dataStatRoutine, wordStatRoutine) => {
  const findWord = (enId, ruId) => {
    for (let i = 0; i < vocabulary.length; i++) {
      if (vocabulary[i].id === enId && vocabulary[i].wordRus[0].id === ruId) {
        return i;
      }
    }
    return -1;
  }

  const getNewPlane = (logg, real) => {
    if (logg.plane) {
      let minutes = (real.getTime() - logg.plane.getTime()) / 60000;
      let line = logg.state;
      minutes = minutes - trainingPlane[line].interval;
      if (minutes <= 0) {
        return Math.min(trainingPlane.length - 1, line + 1);
      }
      do {
        if (line < trainingPlane.length - 1 && minutes >= trainingPlane[line + 1].interval) {
          line++;
          minutes = minutes - trainingPlane[line].interval;
          if (line == 16 || trainingPlane[line].zone != logg.wordzone) {
            return Math.min(trainingPlane.length - 1, line);
          }
        } else {
          break;
        }
      } while (true);
      return Math.min(trainingPlane.length - 1, line);
    }
    return 1;
  }

  const getStatistic = async () => {
    const { stat, statweek, statmonth, wordStat } = await getDataStatistic();
    dataStatRoutine({ stat, statweek, statmonth, wordStat });
    const words = await getWordsStatistic();
    wordStatRoutine({ words })
  }

  const save = async () => {
    const result = await putLogs(logs);
    if (!result) {
      Alert.alert('Ошибка связи !', 'Результаты тренировки не записаны ...');
      return;
    }
    getStatistic();
    wordsUpdateRoutine(await getDictionaryAll());
  }

  let count = 0;
  let experience = 0;
  let exppirOne = 0;
  let line = 0;
  const logs = [];
  const dats = getDate(); // new Date();
  learnVocabulary.forEach(item => {
    if (Boolean(item.time)) {
      const wordIndex = findWord(item.id, item.wordRus[0].id);
      if (wordIndex >= 0) {
        exppirOne = 0;
        let index = item.wordRus[0].loggs[0].index;
        index = (index) ? index + 1 : 1;
        for (let i = 0; i < item.falseAttempts; i++) {
          const log = item.wordRus[0].loggs[0];
          switch (log.wordzone) {
            case 3:
              line = log.state - 2;
              break;
            case 2:
              line = Math.max(6, log.state - 3);
              break;
            case 1:
              line = 1;
              break;
            default:
              line = 0;
          }
          let newPlane = getDate();
          newPlane.setMinutes(newPlane.getMinutes() + trainingPlane[line].interval);
          const newLogg = {
            mode: true,
            answer: false,
            plane: newPlane,
            state: line,
            wordstate: trainingPlane[line].status,
            wordzone: trainingPlane[line].zone,
            timing: item.timing,
            experience: 0,
            wordEnId: item.id,
            wordRuId: item.wordRus[0].id,
            index,
            createdAt: dats
          };
          index++;
          vocabulary[wordIndex].wordRus[0].loggs.splice(0, 0, newLogg);
          logs.push(newLogg);
        }

        if (item.errors === 0) {
          count++;
          line = Math.max(item.wordRus[0].loggs[0].state + 1, getNewPlane(item.wordRus[0].loggs[0], item.time));
          for (let i = item.wordRus[0].loggs[0].state + 1; i <= line; i++) {
            exppirOne = exppirOne + trainingPlane[i].experience;
          }
          experience = experience + exppirOne;
          let newPlane = getDate();
          newPlane.setMinutes(newPlane.getMinutes() + trainingPlane[line].interval);
          let lastPlane = getDate();
          lastPlane.setMinutes(lastPlane.getMinutes() + trainingPlane[16].interval);
          let index = item.wordRus[0].loggs[0].index;
          index = (index) ? index + 1 : 1;
          const newLogg = (item.isKnow === true)
          ? {
              mode: true,
              answer: true,
              plane: lastPlane,
              state: 16,
              wordstate: trainingPlane[16].status,
              wordzone: trainingPlane[16].zone,
              timing: item.timing,
              experience: exppirOne,
              userId: user.id,
              wordEnId: item.id,
              wordRuId: item.wordRus[0].id,
              index,
              createdAt: dats
            }
          : {
              mode: true,
              answer: (item.errors === 0),
              plane: newPlane,
              state: line,
              wordstate: trainingPlane[line].status,
              wordzone: trainingPlane[line].zone,
              timing: item.timing,
              experience: exppirOne,
              userId: user.id,
              wordEnId: item.id,
              wordRuId: item.wordRus[0].id,
              index,
              createdAt: dats
            }
          vocabulary[wordIndex].wordRus[0].loggs.splice(0, 0, newLogg);
          item.wordRus[0].loggs.splice(0, 0, newLogg);
          logs.push(newLogg);
        }
      }
    }
  })

  // procView(vocabulary);

  vocabularyRoutine({ vocabulary });
  learnRoutine({ learnVocabulary, learnState: false });
  save();
  // await putLogs(logs);
  // wordsUpdateRoutine(await getDictionaryAll());
  return { count, experience }
}

export default calcResults;
