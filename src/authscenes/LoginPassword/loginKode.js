import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, ImageBackground, Alert } from 'react-native'
// import { multiply } from 'react-native-reanimated'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import buttonGradient from '../../../assets/images/buttons.png';
import { resetPassword } from '../../actions/apiActions';

export default LoginKode = ({ route, navigation }) => {

  const [kode, setKode] = useState('');
  const [errorButton, setErrorButton] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const testKode = (value) => {
    const kode = value.replace(/[^0-9]/g, '');
    kode !== '' && kode.length === 6 ? setErrorButton(false) : setErrorButton(true);
    setKode(kode);
  }

  const sendKode = () => {
    const email = route.params.email;
    resetPassword(email);
  }

  const onLoginSubmit = async () => {
    if (errorButton) {
      Alert.alert("Введите код длиной 6 символов.");
      return;
    }
    setIsLogin(true);
    const email = route.params.email;
    const result = await resetPassword(email, kode);
    setIsLogin(false);
    if (!result) {
      Alert.alert("Ошибка !", "Нет связи с сервером. Попробуйте позже ...");
      return;
    }
    if (result.status && result.status === 403) {
        Alert.alert("Ошибка !", "Код введен неправильно !");
        setKode('');
        return;
    };
    const { token, user } = result;
    if (token && user) {
      navigation.navigate('LoginNew', { token, user });
    }
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Text style={styles.title}>
      Сброс пароля
      </Text>
      <Text style={styles.text}>
      Мы отправили вам код   </Text>
        <Text style={styles.mailtext}>
       На почту: 
       <Text  style={styles.email}> {route.params.email}</Text>
      </Text>
      <TextInput
        value={kode}
        onChangeText={testKode}
        // placeholder="код"
        // placeholderTextColor='#BDBDBD'
        // type={"number"}
        style={styles.Input}
        textAlign={'center'}
        keyboardType='numeric'
        onSubmitEditing={onLoginSubmit}
      />
      <TouchableOpacity onPress={onLoginSubmit} >
        <ImageBackground
          source={buttonGradient}
          style={errorButton ? styles.ButtonErr : styles.ButtonErrFalse}
        >
          {isLogin
            ? <ActivityIndicator size="large" color="#fff" style={{ marginBottom: 10 }} />
            : <Text style={styles.buttonText}>
              Сбросить пароль
            </Text>}
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity onPress={sendKode} >
          <View>
            <Text style={styles.submitText}>
              Отправить мне код повторно
            </Text>
          </View>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  )
}

const windowDimensions = Dimensions.get('window')
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  title: {
    fontSize: 18,
    textAlign: 'left',
    color: '#828282',
    fontFamily: 'Gilroy-Regular',
    fontWeight: '300',
    marginTop: 8,
    marginLeft: 17
  },
  text: {
    fontSize: 26,
    textAlign: 'left',
    color: '#333',
    fontFamily: 'Gilroy-Regular',
    fontWeight: '700',
    marginTop: 15,
    marginLeft: 17
  },
  mailtext: {
    fontSize: 18,
    textAlign: 'left',
    color: '#666',
    fontFamily: 'Gilroy-Regular',
    fontWeight: '600',
    marginTop: 15,
    marginLeft: 17
  },
  email: {
    fontSize: 18,
    textAlign: 'left',
    color: '#2A80F1',
    fontFamily: 'Gilroy-Regular',
    fontWeight: '600',
    // paddingTop: 20,
    marginLeft: 17
  },
  Input: {
    alignSelf: "center",
    width: "80%",
    height: 60,
    marginTop: "28%",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
    color: '#BDBDBD',
    fontSize: 48,
    fontWeight: '300'
  },
  ButtonErr: {
    width: '100%',
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: windowHeight * 0.28,
    opacity: 0.4,
  },
  ButtonErrFalse: {
    width: '100%',
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: windowHeight * 0.28,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontFamily: 'Gilroy-Regular',
    fontWeight: '700',
    alignSelf: "center",
    marginTop: -8,
  },
  submitText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2F80ED',
    fontFamily: 'Roboto',
    fontWeight: '400',
    marginTop: 5
  },
})
