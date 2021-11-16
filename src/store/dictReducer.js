import { createRoutine } from 'redux-saga-routines';

export const wordsUpdateRoutine = createRoutine('WORDS_WORDS_DICT');
export const wordsNewUpdateRoutine = createRoutine('WORDS_NEW_DICT');
export const wordsLearnUpdateRoutine = createRoutine('WORDS_LEARN_DICT');
export const wordsKnowUpdateRoutine = createRoutine('WORDS_KNOW_DICT');
export const currentUpdateRoutine = createRoutine('WORDS_CURRENT_DICT');
export const dictDefaultRoutine = createRoutine('DEFAULT_DICT_ROUTINE');

const defCurrentWords = { newWords: 0, knowWords: 0, learnWords: 0 };

export default (state = { wordsKnow: [], wordsLearn: [], wordsNew: [], currentWords: defCurrentWords }, { type, payload }) => {
  switch (type) {
    case dictDefaultRoutine.TRIGGER:
      return { wordsKnow: [], wordsLearn: [], wordsNew: [], currentWords: defCurrentWords };
    case wordsUpdateRoutine.TRIGGER:
      return {
        ...state,
        wordsNew: [ ... payload.listNew],
        wordsNewList: payload.listNew,
        wordsKnow: [ ...payload.listKnow],
        wordsKnowList: payload.listKnow,
        wordsLearn: [ ...payload.listLearn],
        wordsLearnList: payload.listLearn
      };
    case wordsNewUpdateRoutine.TRIGGER:
      return {
        ...state,
        wordsNew: payload.words,
        wordsNewList: payload.wordsList
      };
    case wordsLearnUpdateRoutine.TRIGGER:
      return {
        ...state,
        wordsLearn: payload.words,
        wordsLearnList: payload.wordsList
      };
    case wordsKnowUpdateRoutine.TRIGGER:
      return {
        ...state,
        wordsKnow: payload.words,
        wordsKnowList: payload.wordsList
      };
    case currentUpdateRoutine.TRIGGER:
      return {
        ...state,
        currentWords: payload.currentWords,
      };
    default:
      return state;
  }
};
