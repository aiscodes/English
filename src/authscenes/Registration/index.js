import React, { useState, useRef } from "react";
import { connect } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, ImageBackground, ActivityIndicator } from "react-native";
import validator from 'validator';
import WebView from 'react-native-webview';
import queryString from 'query-string';
import Vk from "../../images/vk.svg";
import Fb from "../../images/facebook.svg";
import Google from "../../images/google.svg";
import Eye from '../../../assets/images/Eye.svg'
import NoEye from '../../../assets/images/hide.svg'
import { setData } from "../../AsyncStorage/AsyncStorage";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { register } from '../../actions/apiActions';
import { userRoutine } from '../../store/userReducer';
import { minPassLen } from "../../constants";
import buttonGradient from '../../../assets/images/buttons.png';

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const Registration = ({ navigation, userRoutine }) => {
    const [secretPass, setSecretPass] = useState(true);

    const [email, setEmail] = useState('');
    const [isEmailOk, setEmailOk] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordOk, setPasswordOk] = useState(false);
    const [buttonError, setButtonError] = useState(true);
    
    const [isRegister, setIsRegister] = useState(false);
    const [mode, setMode] = useState(false);
    const [url, setUrl] = useState();

    const handleChange = () => {
        secretPass == true ? setSecretPass(false) : setSecretPass(true);
    };

    function emailChange(data) {
        setEmail(data);
        const logg = data && validator.isEmail(data);
        setEmailOk(logg);
        setButtonError(!(logg && isPasswordOk));
    };
    function pwdChange(data) {
        setPassword(data);
        const logg = data && data.length >= minPassLen;
        setPasswordOk(logg);
        setButtonError(!(logg && isEmailOk));
    };

    const signup = async (email, password) => {
        if (!isRegister) {
            setIsRegister(true);
            let data = { password, email };
            const req = await register(data);
            setIsRegister(false);
            if (req) {
                if (await req?.message) {
                    Alert.alert(req?.message)
                } else {
                    const { user } = req;
                    setData(req.token)
                    userRoutine({ user });
                }
            } else {
                Alert.alert("Ошибка !", "Нет связи с сервером. Попробуйте позже ...");
            }
        }
    };

    const passwordRef = useRef();
    const onEmailSubmit = () => {
        passwordRef.current.focus();
    }

    const onPasswordSubmit = () => {
        if (buttonError) {
            if (password.length < minPassLen) Alert.alert(`Введите пароль не менее ${minPassLen} символов !`)
            else Alert.alert(`${email} - некорректный адрес электронной почты !`)
        } else signup(email, password);
    }

    const httpParce = (value) => {
        const index = value.indexOf('?');
        const vData = value.substr(index + 1).split('&');
        let result = { address: value.substr(0, index) };
        vData.forEach(item => {
            const itemData = queryString.parse(item);
            const key = Object.keys(itemData)[0];
            result[key] = itemData[key];
        })
        return result;
    }
    const ask = async (point) => {
        setMode(false);
        setIsRegister(true);
        const ress = await fetch(point, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        const response = await ress.json();
        setIsRegister(false);
        if (response?.status) {
            Alert.alert(response?.message)
        } else {
            const { user } = response;
            setData(response.token)
            userRoutine({ user });
        }
    }
    const corrAddress = value => {
        const index = value.lastIndexOf('/');
        return value.substr(0, index) + '/register';
    }
    const handleWebViewChange = async (newNavState) => {
        const { url, loading } = newNavState;
        if (url.includes('/login?code') || url.includes('/register?code')) {
            const { address, code } = httpParce(url);
            const query = `code=${code}`;
            const newUrl = corrAddress(address) + `?${query}`;
            if (loading) {
                try {
                    await delay(250);
                    ask(newUrl);
                } catch (error) {
                }
            }
        }
    }

    const goRegg = 'https://dict-server.herokuapp.com/api/auth/google?register';
    const fbRegg = 'https://dict-server.herokuapp.com/api/auth/facebook?register';
    const vkRegg = 'https://dict-server.herokuapp.com/api/auth/vkontakte?register';

    const handleGoogleReg = () => {
        setUrl(goRegg);
        setMode(true);
    }
    const handleFacebookReg = () => {
        setUrl(fbRegg);
        setMode(true);
    }
    const handleVkReg = () => {
        setUrl(vkRegg);
        setMode(true);
    }

    return (
        mode
            ? <View style={styles.topcontainer}>
                <WebView
                    source={{ uri: url }}
                    userAgent="Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
                    originWhitelist={["https://*", "http://*", "file://*", "sms://*"]}
                    onNavigationStateChange={handleWebViewChange}
                />
            </View>
            : <KeyboardAwareScrollView style={styles.container}>
                <ScrollView style={styles.container}>
                    <Text style={styles.title}>Добро пожаловать</Text>
                    <View>
                        <Text style={styles.titleBold}>Быстрая регистрация через: </Text>
                        <View style={styles.icons}>
                            <TouchableOpacity onPress={handleVkReg}>
                                <Vk />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleFacebookReg}>
                                <Fb />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleGoogleReg}>
                                <Google />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.subTitle}>или</Text>
                        <Text style={styles.titleBold}>Через электронную почту</Text>
                    </View>

                    <TextInput
                        style={[styles.placeholderTitle, { borderBottomColor: `${isEmailOk ? 'green' : 'grey'}` }]}
                        onChangeText={(text) => emailChange(text)}
                        placeholder={"Адрес электронной почты"}
                        placeholderTextColor='#BDBDBD'
                        keyboardType='email-address'
                        onSubmitEditing={onEmailSubmit}
                    />
                    <View style={{ flexDirection: "row", alignSelf: "center" }}>
                        <TextInput
                            style={styles.placeholderTitle1}
                            secureTextEntry={secretPass}
                            onChangeText={(text) => pwdChange(text)}
                            placeholder={"      Пароль"}
                            placeholderTextColor='#BDBDBD'
                            ref={passwordRef}
                            onSubmitEditing={onPasswordSubmit}
                        />
                        <TouchableOpacity onPress={() => handleChange()}>
                            {secretPass == true
                                ? <NoEye style={{ marginTop: windowHeight * 0.04, width: 24, height: 24 }} />
                                : <Eye style={{ marginTop: windowHeight * 0.04, width: 24, height: 24 }} />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '90%', height: 1, backgroundColor: `${isPasswordOk ? 'green' : 'grey'}`, alignSelf: 'center', }} ></View>

                    <TouchableOpacity
                        onPress={onPasswordSubmit}
                        style={Platform.OS == 'ios' ? styles.btn : styles.btnA}
                    >
                        <ImageBackground source={buttonGradient} style={buttonError ? styles.button : styles.buttonTrue}>
                            {isRegister
                                ? <ActivityIndicator size="large" color="#fff" style={{ marginBottom: 10 }} />
                                : <Text style={styles.buttonText}>Зарегистрироваться</Text>}
                        </ImageBackground>
                    </TouchableOpacity>


                    <View style={styles.agreementBlock}>
                        <Text style={styles.agreement}>
                            Продолжая авторизацию, вы соглашаетесь с
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Rules")}>
                            <Text style={(styles.agreement, styles.agreementLink)}>
                                пользовательским соглашением
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
    );
}

const windowDimensions = Dimensions.get('window')
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

const styles = StyleSheet.create({
    topcontainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: windowHeight
    },
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    title: {
        fontFamily: 'Gilroy-Regular',
        fontSize: 18,
        marginTop: windowHeight * 0.02,
        marginLeft: windowWidth * 0.05,
    },
    titleBold: {
        fontSize: 26,
        fontFamily: 'Gilroy-Regular',
        marginLeft: "5%",
        fontWeight: 'bold',
        marginTop: 10,
    },
    icons: {
        backgroundColor: "white",
        width: "70%",
        marginLeft: "15%",
        marginTop: windowHeight * 0.06,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    subTitle: {
        alignSelf: "center",
        marginTop: windowHeight * 0.05,
        fontFamily: 'Gilroy-Regular',
        fontSize: windowWidth * 0.056,
        marginBottom: windowHeight * 0.03,
    },
    placeholderTitle: {
        alignSelf: "center",
        width: "90%",
        fontSize: windowWidth * 0.06,
        height: 40,
        marginTop: windowHeight * 0.05,
        textAlign: "center",
        borderBottomWidth: 1,
        fontFamily: 'Gilroy-Regular',
    },
    placeholderTitle1: {
        alignSelf: "center",
        width: "82%",
        fontSize: windowWidth * 0.06,
        height: 40,
        marginTop: windowHeight * 0.03,
        textAlign: "center",
        fontFamily: 'Gilroy-Regular',
    },
    placeholderTitleFalse: {
        alignSelf: "center",
        width: "90%",
        fontSize: windowWidth * 0.06,
        height: 40,
        marginTop: windowHeight * 0.03,
        textAlign: "center",
        borderBottomWidth: 1,
        borderBottomColor: "red",
        fontFamily: 'Gilroy-Regular',
    },
    button: {
        width: '100%',
        height: 70,
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: windowHeight * 0.09,
        opacity: 0.4,
    },
    buttonTrue: {
        width: '100%',
        height: 70,
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: windowHeight * 0.09,
    },
    buttonText: {
        fontSize: 18,
        color: "white",
        fontFamily: 'Gilroy-Regular',
        alignSelf: "center",
        textAlign: 'center',
        marginTop: -10,
        fontWeight: '700'
    },
    agreementBlock: {
        height: 14,
        marginTop: windowHeight * 0.02,
        alignSelf: "center",
        marginBottom: '10%'
    },
    agreement: {
        fontSize: windowWidth * 0.03,
        textAlign: "center",
        color: "#BDBDBD",
        width: "90%",
        fontFamily: 'Gilroy-Regular',
    },
    agreementLink: {
        fontSize: windowWidth * 0.03,
        textAlign: "center",
        width: "90%",
        color: "#2F80ED",
        opacity: 0.6,
        fontFamily: 'Gilroy-Regular',
    },
});

const mapDispatchToProps = { userRoutine };
export default connect(null, mapDispatchToProps)(Registration);
