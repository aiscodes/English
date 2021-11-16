import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, ImageBackground, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import buttonGradient from '../../../assets/images/buttons.png';
import Eye from '../../../assets/images/Eye.svg'
import NoEye from '../../../assets/images/hide.svg'
import { setData } from "../../AsyncStorage/AsyncStorage";
import { updatePassword } from '../../actions/apiActions';
import { userRoutine } from '../../store/userReducer';
import { minPassLen } from '../../constants';

const LoginKode = ({ route, userRoutine }) => {

  const [pwdA, setPwdA] = useState('');
  const [pwdB, setPwdB] = useState('');
  const [secretPass, setSecretPass] = useState(true);

  const [errorButton, setErrorButton] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const { token, user } = route.params;

  const handleChange = () => {
    secretPass == true ? setSecretPass(false) : setSecretPass(true);
  };

  const testPwd = (value) => {
    setPwdA(value);
  }

  const testPassword = (value) => {
    value.length >= minPassLen && value === pwdA ? setErrorButton(false) : setErrorButton(true);
    setPwdB(value);
  }

  const onLoginSubmit = async () => {
    if (errorButton) {
      if (pwdA.length < minPassLen) Alert.alert(`Введите пароль не менее ${minPassLen} символов !`)
      else Alert.alert("Ошибка !", "Введенные пароли НЕ совпадают !");
      return;
    }
    setIsLogin(true);
    await setData(token);
    const password = pwdA;
    const result = await updatePassword(password);
    setIsLogin(false);
    if (!result) {
      Alert.alert("Ошибка !", "Нет связи с сервером. Попробуйте позже ...");
      return;
    }
    if (result.password === pwdA) {
      Alert.alert('Ваш пароль успешно изменен.');
      userRoutine({ user });
      return;
    }
    Alert.alert('Ошибка !', 'При записи пароля возникла ошибка !');
  }

  const passwordRef = useRef();
  const onPwdASubmit = () => {
    passwordRef.current.focus();
  }
  const onPwdBSubmit = () => {
    onLoginSubmit();
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Text style={styles.title}>
        Сброс пароля
      </Text>
      <Text style={styles.text}>
        Введите новый пароль
      </Text>
      <View style={{ flexDirection: "row", alignSelf: "center", marginTop: '40%' }}>
        <TextInput
          onChangeText={testPwd}
          placeholder="Пароль"
          placeholderTextColor='#BDBDBD'
          style={styles.Input}
          textAlign={'center'}
          secureTextEntry={secretPass}
          onSubmitEditing={onPwdASubmit}
        />
        {/* <TouchableOpacity style={{ marginTop: '8%' }} onPress={handleChange}>
          {secretPass == true
            ? <NoEye style={{ width: 24, height: 24 }} />
            : <Eye style={{ width: 24, height: 24 }} />
          }
        </TouchableOpacity> */}
      </View>
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        <TextInput
          onChangeText={testPassword}
          placeholder="Пароль еще раз"
          placeholderTextColor='#BDBDBD'
          style={styles.Input}
          textAlign={'center'}
          secureTextEntry={secretPass}
          ref={passwordRef}
          onSubmitEditing={onPwdBSubmit}
        />
        {/* <TouchableOpacity style={{ marginTop: '8%' }} onPress={handleChange}>
          {secretPass == true
            ? <NoEye style={{ width: 24, height: 24 }} />
            : <Eye style={{ width: 24, height: 24 }} />
          }
        </TouchableOpacity> */}
      </View>
      <TouchableOpacity onPress={onPwdBSubmit} >
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
      <Text  style={styles.assign}>Продолжая авторизация, вы соглашаетесь с <Text style={styles.assign1}>пользовательским соглашением</Text></Text>
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
    marginTop: 15,
    marginLeft: 17
  },
  text: {
    fontSize: 26,
    textAlign: 'left',
    color: '#333',
    fontFamily: 'Gilroy-Regular',
    fontWeight: '700',
    marginTop: 20,
    marginLeft: 17
  },
  mailtext: {
    fontSize: 22,
    textAlign: 'left',
    color: '#666',
    fontFamily: 'Gilroy-Regular',
    fontWeight: '300',
    marginTop: 20,
    marginLeft: 17
  },
  Input: {
    alignSelf: "center",
    width: "85%",
    fontSize: windowWidth * 0.06,
    height: 40,
    marginTop: "5%",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
  },
  assign:{
    fontSize:15,
    color:'#BDBDBD',
    textAlign:'center'
  },
  assign1:{
    fontSize:15,
    color:'#2A80F1',
    textAlign:'center'
  },
  ButtonErr: {
    width: '100%',
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: windowHeight * 0.2,
    opacity: 0.4,
  },
  ButtonErrFalse: {
    width: '100%',
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: windowHeight * 0.2,
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
    fontSize: 18,
    textAlign: 'center',
    color: '#2F80ED',
    fontFamily: 'Roboto',
    fontWeight: '400',
    marginTop: 5
  },
})

const mapDispatchToProps = { userRoutine };
export default connect(null, mapDispatchToProps)(LoginKode);
