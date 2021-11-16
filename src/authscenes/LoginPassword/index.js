import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Dimensions, ImageBackground } from 'react-native';
import validator from 'validator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import buttonGradient from '../../../assets/images/buttons.png';
import { resetPassword } from '../../actions/apiActions';

export default LoginPassword = ({ route, navigation }) => {
    const [email, setEmail] = useState(route.params.email);
    const [holderText, setText] = useState("Адрес электронной почты");
    const [buttonError, setButtonError] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [inputerror, setInputerror]=useState(true)

    function emailChange(value) {
        const isOk = value && validator.isEmail(value);
        setButtonError(!isOk);
        setEmail(value);
        setText('');
    };

    async function onKodeSubmit() {
        if (buttonError) {
            Alert.alert('', 'Введите корректный адрес электронной почты !')
        } else {
            setIsLogin(true);
            const result = await resetPassword(email);
            setIsLogin(false);
            if (!result) {
                Alert.alert("Ошибка !", "Нет связи с сервером. Попробуйте позже ...");
                return;
            } else {
                if (result.status === 200) {
                    navigation.navigate('LoginKode', { email });
                    return;
                }
                Alert.alert("Ошибка !", "Неизвестный адрес электронной почты ...");
            }
        }
    }

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <Text style={styles.title}>
                Сброс пароля
            </Text>
            <Text style={styles.text}>
                Введите адрес электронной почты, мы вышлем Вам код подтверждения
            </Text>
            <TextInput
                value={email}
                onChangeText={emailChange}
                placeholder={holderText}
                placeholderTextColor='#BDBDBD'
                style={inputerror?  styles.Input:  styles.Input1}
                textAlign='center'
                keyboardType='email-address'
                onSubmitEditing={onKodeSubmit}
            />
            <TouchableOpacity onPress={onKodeSubmit} style={{ marginTop: '55%' }}>
                <ImageBackground source={buttonGradient} style={buttonError ? styles.ButtonError : styles.ButtonErrFalse}>
                    {isLogin
                        ? <ActivityIndicator size="large" color="#fff" style={{ marginBottom: 10 }} />
                        : <Text style={styles.buttonText}>Отправить код</Text>}
                </ImageBackground>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
    )
}

const windowDimensions = Dimensions.get('window')

const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    title: {
        fontSize: 18,
        textAlign: 'left',
        color: '#828282',
        fontFamily: 'Gilroy-Regular',
        fontWeight: '600',
        lineHeight:20,
        marginTop: 15,
        marginHorizontal: 17
    },
    text: {
        fontSize: 26,
        textAlign: 'left',
        color: '#333',
        fontFamily: 'Gilroy-Regular',
        fontWeight: '700',
        marginTop: 20,
        marginHorizontal: 17
    },
    Input: {
        alignSelf: "center",
        width: "90%",
        fontSize: 24,
        fontWeight: '400',
        color: '#1D1F21',
        height: 40,
        marginTop: "30%",
        // textAlign: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EB5757",
    },
    Input1: {
        alignSelf: "center",
        width: "90%",
        fontSize: 24,
        fontWeight: '400',
        color: '#27AE60',
        height: 40,
        marginTop: "30%",
        // textAlign: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EB5757",
    },
    ButtonError: {
        width: '100%',
        height: 70,
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: '4%',
        marginTop: windowHeight * 0.07,
        opacity: 0.6,
    },
    ButtonErrFalse: {
        width: '100%',
        height: 70,
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: '4%',
        marginTop: windowHeight * 0.06,
    },
    buttonText: {
        fontSize: 18,
        color: "white",
        fontFamily: 'Gilroy-Regular',
        alignSelf: "center",
        textAlign: 'center',
        marginTop: -10,
        fontWeight: '700'
    }
})
