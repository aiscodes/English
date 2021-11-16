import { createRoutine } from 'redux-saga-routines';

export const wordsPRoutine = createRoutine('WORDS_ROUTINE');
export const logsRoutine = createRoutine('LOGGS_ROUTINE');
export const countRoutine = createRoutine('COUNT_ROUTINE');
export const vocabularyRoutine = createRoutine('VOCABULARY_ROUTINE');
export const learnRoutine = createRoutine('LEARN_ROUTINE');
export const wordsDefaultRoutine = createRoutine('DEFAULT_WORD_ROUTINE');

export default (state = { words: null, logs: [] }, { type, payload }) => {
  switch (type) {
    case wordsDefaultRoutine.TRIGGER:
      return { words: null, logs: [] };
    case wordsPRoutine.TRIGGER:
      return {
        ...state,
        words: payload.words,
        point: payload.point
      };
    case logsRoutine.TRIGGER:
      return {
        ...state,
        logs: payload.logs
      };
    case countRoutine.TRIGGER:
      return {
        ...state,
        learnCount: payload.learnCount
      };
    case vocabularyRoutine.TRIGGER:
      return {
        ...state,
        vocabulary: payload.vocabulary
      };
    case learnRoutine.TRIGGER:
      return {
        ...state,
        learnVocabulary: payload.learnVocabulary,
        learnState: payload.learnState
      };
    default:
      return state;
  }
};
