import { Alert } from "react-native";
import { getWordsVocabulary } from "../../actions/apiActions";
import { wordsToLearn, wordsLimit, getDate } from "../../constants";

const getPlane = (value) => {
  if (value) return new Date(value);
  const date = getDate(); // new Date(); 
  date.setMinutes(date.getMinutes() - 1);
  return date;
};

export const vocabularyWords = async (navigation, learnRoutine, countRoutine, vocabularyRoutine, logg = true) => {
  let list = await getWordsVocabulary();
  if (!list) {
    Alert.alert('Ошибка связи !', 'Нет ответа от сервера ...');
    return false;
  }
  vocabularyRoutine({ vocabulary: list });
  if (logg && (!list || list.length === 0)) {
    navigation.navigate("Start");
    return false;
  }
  list.sort((itemA, itemB) => {
    const logA = itemA.wordRus[0].loggs[0];
    const logB = itemB.wordRus[0].loggs[0];
    if (logA.wordzone === logB.wordzone) {
      logA.plane = getPlane(logA.plane);
      logB.plane = getPlane(logB.plane);
      return logA.plane.getTime() - logB.plane.getTime();
    }
    return logB.wordzone - logA.wordzone;
  });

  let bronze = 0;
  const timing = getDate().getTime();
  const trList = [];
  const bronzeList = [];
  list.forEach((item) => {
    const log = item.wordRus[0].loggs[0];
    log.plane = getPlane(log.plane);
    if (log.wordzone < 2) bronze++;
    if (log.plane.getTime() <= timing && trList.length < wordsToLearn) {
      trList.push(item);
    } else {
      if (log.wordzone < 2) bronzeList.push(item);
    }
  });

  if (trList.length < wordsToLearn) {
    let learnCount = Math.min(
      wordsToLearn - trList.length,
      wordsLimit - bronze
    );
    if (learnCount > 0) {
      learnCount = wordsToLearn - learnCount;
      countRoutine({ learnCount });
      return true;
    } else {
      do {
        trList.push(bronzeList[0]);
        bronzeList.splice(0, 1);
      } while (trList.length < wordsToLearn && bronzeList.length > 0);
    }
  }

  for (let i = 0; i < trList.length; i++) {
    const log = trList[i].wordRus[0].loggs[0];
    if (log.wordzone < 2) {
      const koe = trList.length - i - 1;
      for (let j = 1; j <= trList.length; j++) {
        const index = i + Math.round(koe * Math.random() - 0.499999);
        trList.splice(index, 0, trList.pop());
      }
      break;
    }
  }

  learnRoutine({ learnVocabulary: trList, learnState: true });
  navigation.navigate("TrainingsScreen");
  return false;
};