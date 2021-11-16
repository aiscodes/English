import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, ImageBackground } from "react-native";
import buttonGradient from '../../../assets/images/buttons1.png';
import buttonRight from '../../../assets/images/RButton.png';
// import { useNavigation } from '@react-navigation/native';

export default function TestPanel({ word, doAnswer, doSkip, totalCount }) {
  // const navigation = useNavigation()

  const [timerKey, setTimerKey] = useState('x');
  const [arrProgress, setArrProgress] = useState([]);

  const answerFunc = async value => {
    if (!value) setArrProgress([...arrProgress, 1]);
    setTimerKey(timerKey + 'x');
    doAnswer(value);
  }

  const skipFunc = async () => {
    doSkip();
  }

  const title = word.wordEn.WordEn;
  const transcription = word.Transcription;
  const translateWord = word.WordRu;

  // const goBack = () => {
  //   Alert.alert(
  //     "Внимание !",
  //     "Вы действительно хотите прервать добор слов ?",
  //     [
  //       {
  //         text: "Нет",
  //         style: "cancel"
  //       },
  //       {
  //         text: "Да", onPress: () => {
  //           navigation.goBack();
  //         }
  //       }
  //     ],
  //     { cancelable: true }
  //   );
  //   return true;
  // }
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', goBack);
  //   navigation.addListener('blur', (e) => {
  //     BackHandler.removeEventListener('hardwareBackPress', goBack);
  //   });
  // })

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
            {arrProgress.map((el, k) => {
              return (
                <View
                  key={k}
                  style={{
                    width: `${110 / totalCount}%`,
                    height: 10,
                    backgroundColor: "#2A80F1",
                  }}
                ></View>
              );
            })}
          </View>
        </View>

        <View style={styles.loader}>
        </View>

        <View style={styles.center}>
          <Text style={styles.title}>{title ?? ""}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.transcription}>{transcription ?? ""}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={{ height: 100, }}>
            <Text style={styles.answerTitle}>{translateWord ?? ""}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.buttonCancell} onPress={() => {skipFunc()}}>
            <Text style={styles.buttonText1}>Пропустить</Text>
          </TouchableOpacity>          
          <TouchableOpacity onPress={() => {answerFunc(true)}}>
            <ImageBackground source={buttonGradient} style={styles.buttonVariant}>
              <Text style={styles.textVariant}>Знаю</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {answerFunc(false)}}>
            <ImageBackground source={buttonRight} style={styles.buttonVariant}>
              <Text style={styles.textVariant}>Учить</Text>
            </ImageBackground>
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
    fontSize: 18,
    color: 'white',
    lineHeight: windowWidth * 0.06,
    alignSelf: 'center',
    fontFamily: 'Gilroy-Regular',
    marginTop: -5,
    fontWeight: '700'
  },
  buttonCancell: {
    backgroundColor: "#fff",
    color: '#2A80F1',
    borderColor: '#2A80F1',
    borderWidth: 1,
    borderRadius: 49,
    width: '85%',
    height: 42,
    marginBottom: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText1: {
    color: "#2A80F1",
    fontSize: 18,
    lineHeight: windowWidth * 0.06,
    alignSelf: 'center',
    fontFamily: 'Gilroy-Regular',
    fontWeight: '700'
  },
  newWord: {
    fontSize: windowWidth * 0.14,
    alignSelf: "center",
    marginBottom: windowWidth * 0.06,
    fontFamily: 'Gilroy-Regular',
  },
  center: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    color: "#2A80F1",
    fontWeight: '600',
    fontSize: 40,
    fontFamily: 'Gilroy-Regular',
  },
  transcription: {
    color: "#BDBDBD",
    fontSize: 24,
    fontWeight: '300',
    fontFamily: 'Gilroy-Regular',
  },
  content: {
    alignItems: 'center',
    marginTop: 20,
  },
  answerTitle: {
    color: "#1D1F21",
    fontSize: 28,
    fontFamily: 'Gilroy-Regular',
    fontWeight: '400',
    textAlign: 'center'
  }
});
