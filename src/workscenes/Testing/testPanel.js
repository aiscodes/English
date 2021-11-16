import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Animated, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, ImageBackground, Alert, BackHandler } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { waitDuration } from '../../constants';
import buttonGradient from '../../../assets/images/buttons.png';
import buttonRight from '../../../assets/images/buttonRight.png';
import { useNavigation } from '@react-navigation/native';

export default function TestPanel({ word, doAnswer, totalCount, mode }) {
  const navigation = useNavigation();

  const [timerKey, setTimerKey] = useState('x');
  const [arrProgress, setArrProgress] = useState([]);
  const [answer, setAnswer] = useState(false);
  const [itemWidth] = useState(`${100 / Math.max(2, totalCount - 1)}%`);

  const delay = (ms) => new Promise(res => setTimeout(res, ms))
  const answerFunc = async value => {
    if (!answer) {
      setAnswer(true);
      await delay(350);
      if (!value || mode === true) setArrProgress([...arrProgress, 1]);
      setTimerKey(timerKey + 'x');
      setAnswer(false)
      doAnswer(value);
    }
  }

  const noAnswerFunc = async () => {
    setAnswer(true);
    setTimeout(() => answerFunc(false), 100);
  }

  const textMaxLength = (text = String, max_length = Number) => text ? `${text.substring(0, max_length)}${text.length > max_length ? "..." : ""}` : ""

  const goBack = () => {
    Alert.alert(
      "Внимание !",
      `Вы действительно хотите прервать ${mode ? 'тестирование' : 'добор слов'} ?`,
      [
        {
          text: "Нет",
          style: "cancel"
        },
        {
          text: "Да", onPress: () => {
            navigation.goBack();
          }
        }
      ],
      { cancelable: true }
    );
    return true;
  }

  useEffect(() => {
    navigation.addListener('focus', (e) => {
      BackHandler.addEventListener('hardwareBackPress', goBack);
    });
    navigation.addListener('blur', (e) => {
      BackHandler.removeEventListener('hardwareBackPress', goBack);
    });
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.ScrollView}>
        <View>
          <View
            style={{
              width: "90%",
              height: 10,
              overflow: "hidden",
              flex: 1,
              flexDirection: "row",
              marginTop: 50,
              marginBottom: 50,
              marginLeft: "5%",
              borderRadius: 20,
              backgroundColor: '#F2F2F2'
            }}
          >
            {arrProgress.map((_el, k) => {
              return (
                <View
                  key={k}
                  style={{
                    width: itemWidth,
                    height: 10,
                    backgroundColor: "#2A80F1",
                  }}
                ></View>
              );
            })}
          </View>
        </View>

        <View style={styles.loader}>
          <CountdownCircleTimer
            key={timerKey}
            size={80}
            strokeWidth={5}
            isPlaying
            duration={waitDuration}
            colors={[
              ["#2A80F1", 0.4],
              ["#2A80F1", 0.4],
              ["#2A80F1", 0.2],
            ]}
            onComplete={() => {
              noAnswerFunc();
              return [true, 1000];
            }}
          >
            {({ remainingTime, animatedColor }) => (
              <Animated.Text style={{ color: animatedColor, fontSize: 40, fontFamily: 'Gilroy-Regular', }}>
                {remainingTime}
              </Animated.Text>
            )}
          </CountdownCircleTimer>
        </View>

        <Text style={styles.newWord}>{word.wordEn.WordEn}</Text>

        <View style={styles.buttons}>
          {word.translations.map((el, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  el == word.WordRu ? answerFunc(true) : answerFunc(false);
                }}
              >
                <ImageBackground
                  source={
                    answer
                    ? el == word.WordRu
                    ? buttonRight
                    : buttonGradient
                    : buttonGradient
                  }
                  style={styles.buttonVariant}
                >
                  <Text style={styles.textVariant}>{textMaxLength(el, 23)}</Text>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={styles.buttonCancell}
            onPress={() => {
              answerFunc(false)
              // reload();
            }}
          >
            <Text style={styles.buttonText1}>Не знаю</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const windowDimensions = Dimensions.get("window");
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "column",
  },
  loader: {
    alignSelf: "center",
    marginTop: windowHeight * 0.02,
    marginBottom: windowHeight * 0.05,
  },
  buttons: {
    marginTop: windowHeight * 0.099,
    marginBottom: windowHeight * 0.01,
  },
  buttonVariant: {
    width: '100%',
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textVariant: {
    fontSize: windowWidth * 0.06,
    color: 'white',
    lineHeight: windowWidth * 0.06,
    alignSelf: 'center',
    fontFamily: 'Gilroy-Regular',
    marginTop: -7
  },
  buttonCancell: {
    backgroundColor: "#fff",
    color: '#2A80F1',
    borderColor: '#2A80F1',
    borderWidth: 1,
    borderRadius: 49,
    width: '90%',
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: windowHeight * 0.01,
  },
  buttonText1: {
    color: "#2A80F1",
    fontSize: windowWidth * 0.06,
    lineHeight: windowWidth * 0.06,
    alignSelf: 'center',
    fontFamily: 'Gilroy-Regular',
  },
  newWord: {
    fontSize: windowWidth * 0.12,
    alignSelf: "center",
    marginBottom: windowWidth * 0.06,
    fontFamily: 'Gilroy-Regular',
  },
});
