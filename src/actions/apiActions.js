import { getToken, setVocabulary } from '../AsyncStorage/AsyncStorage';

const url = 'https://enapp-server.herokuapp.com';
// const url = 'http://192.168.8.105:3001';

// const controller = new AbortController();

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const getApiData = async (endPoint, method, data, interval) => {
  const token = await getToken();
  const controller = new AbortController();
  const id = interval ? setTimeout(() => controller.abort(), interval) : null;
  const request = await fetch(`${url}${endPoint}`,
    {
      method: method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        authorization: token
      },
      body: data ? JSON.stringify(data) : null
    }
  );
  if (id) clearTimeout(id);
  return await request.json();
}

export const login = async (data) => {
  try {
    return await getApiData('/api/users/login', 'POST', data, 10000)
  } catch(e) {
    return null;
  }
}

export const register = async (data) => {
  try {
    return await getApiData('/api/users/register', 'POST', data, 10000);
  } catch(e) {
    return null
  }
}

export const writeUser = async (data) => {
  return await getApiData('/api/users', 'PUT', data);
}

export const writeUserPoint = async (point) => {
  return await getApiData('/api/users', 'PUT', { point });
}

export const emailReset = async (data) => {
  return await getApiData('/api/users/emailreset', 'POST', data)
}

export const putData = async (data) => {
  return await getApiData('/api/users', 'PUT', data);
}

export const putLogs = async (data) => {
  try {
    return await getApiData('/api/logs', 'PUT', data, 30000);
  } catch(e) {
    return null;
  }
}

export const emptyLogs = async (userId, wordId) => {
  return await getApiData('/api/logs/emptylogs', 'POST', { userId, wordId });
}

export const getUser = async () => {
  try {
    return await getApiData('/api/users/user', 'GET', null, 10000);
  } catch(e) {
    return { error: 1 };
  }
}

export const getWordsVocabulary = async () => {
  try {
    const result = await getApiData('/api/data/vocabulary', 'GET', null, 30000);
    await setVocabulary(result);
    return result;
  } catch (e) {
    return null;
  }
}

export const getWordsList = async () => {
  return await getApiData('/api/data/commonlist', 'GET');
}

export const getStatistic = async () => {
  return await getApiData('/api/statistic', 'GET')
}

export const getDataStatistic = async () => {
  try {
    const resp = await getApiData('/api/data/statistic', 'GET', null, 30000)
    return resp
  } catch(e) {
    return null;
  }
}

export const getWordsStatistic = async () => {
  try {
    const resp = await getApiData('/api/data/statcount', 'GET', null, 30000);
    return resp;
  } catch(e) {
    return null;
  }
}

export const getDictionary = async (data) => {
  const resp = await getApiData('/api/words/complex', "POST", data);
  return resp
}

export const getDictionaryAll = async (data) => {
  const resp = await getApiData('/api/words/complex/all', "POST", data);
  return resp
}

export const resetPassword = async (email, kode) => {
  try {
    const resp = await getApiData('/api/users/emailreset', "POST", { email, kode }, 30000);
    return resp
  } catch(e) {
    return null
  }
}

export const updatePassword = async (password) => {
  try {
    const resp = await getApiData('/api/users', "PUT", { password }, 30000);
    return resp
  } catch (e) {
    return null
  }
}
