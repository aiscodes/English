import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ImageBackground, Platform, Animated, ScrollView} from "react-native";
import { Audio } from 'expo-av';
// import Speaker from '../../../../assets/images/Speaker.svg'
import swiperBG from '../../../../assets/images/swiperBG.png';
import swiperWhite from '../../../../assets/images/swiperWhite.png';


const audioClip = new Audio.Sound();
let currentId = '';
let currentIdId = '';

export const Preview = ({ data, checkResp, ready, onTap, isSwipe } = {}) => {
  const { id, title, transcription, translateWord, sameTranslateWord, examples, audios } = data;

  const play = async () => {
    currentId = id;
    if (audios.length > 0) {
      try {
        if (audioClip._loaded) {
          await audioClip.stopAsync();
          await audioClip.unloadAsync();
        }
        const uri = audios[0].link;
        if (uri && uri !== '') {
          await audioClip.loadAsync({ uri });
          if (audioClip._loaded) {
            await audioClip.playAsync();
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  if (!checkResp && ready && currentId !== id) play();

  const fadeIn = new Animated.Value(0);
  const fadeNot = new Animated.Value(0);
  const fadeYes = new Animated.Value(0);
  if (isSwipe < 0) {
    Animated.timing(fadeNot, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(fadeYes, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  }
  if (isSwipe > 0) {
    Animated.timing(fadeYes, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(fadeNot, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  }

  useEffect(() => {
    // if (!checkResp && ready && currentId !== id) play();
    if (checkResp) {
      const duration = currentIdId !== id ? 1000 : 0;
      currentIdId = id;
      Animated.timing(fadeIn, { toValue: 1, duration, useNativeDriver: true }).start();
    } else {
      currentIdId = null;
    }
    return function () {
      if (audioClip._loaded) {
        audioClip.stopAsync();
      }
    }
  }, [checkResp]);

  const getHintText = (id, hint, title) => {
    const index = hint.toLowerCase().indexOf(title.toLowerCase());
    if (index >= 0) {
      const len = title.length;
      return (
        <Text key={id} style={styles.example}>
          {hint.substr(0, index)}
          <Text style={styles.highlight}>{hint.substr(index, len)}</Text>
          {hint.substr(index + len)}
        </Text>
      )
    }
    return <Text key={id} style={styles.example}>{hint}</Text>
  }

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        resizeMode='stretch'
        style={Platform.OS == 'android' ? {
          width: '102%',
          height: '102%',
          paddingVertical: 0,
          paddingHorizontal: 0,
          alignSelf: 'center',
          marginLeft: -6
        } : {
          width: '100%',
          height: '97%',
          paddingVertical: 0,
          paddingHorizontal: 0,
          alignSelf: 'center',
          marginLeft: -6
        }}
        source={isSwipe ? swiperBG : swiperWhite}
      >
        <Animated.View style={[{ opacity: fadeNot }, styles.labelNot]}>
          <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 20, fontWeight: '700', color: '#EB5757' }}>Ошибка</Text>
        </Animated.View>
        <Animated.View style={[{ opacity: fadeYes }, styles.labelYes]}>
          <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 20, fontWeight: '700', color: '#65BB98' }}>Правильно</Text>
        </Animated.View>
        <TouchableWithoutFeedback onPress={() => onTap(true)}>
          <View style={styles.scroll} >
            <View style={{ height: windowHeight * 0.015 }} />
            <TouchableOpacity onPress={() => { if (audioClip._loaded) audioClip.replayAsync() }}>
              <View style={styles.center}>
                <Text style={styles.title}>{title ?? ""}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.transcription}>{transcription ?? ""}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View>
              <View style={styles.content}>
                { checkResp
                  ? <Animated.View style={{ opacity: fadeIn }}>
                      <View style={{ height: 90, }}>
                        <Text style={styles.answerTitle}>{translateWord ?? ""}</Text>
                        <Text style={styles.answerSubTitle}>{sameTranslateWord ?? ""}</Text>
                      </View>
                    </Animated.View>
                  : <View style={{ width: '100%', height: 0.2, backgroundColor: '#1068DC', marginTop: 90, opacity: 0.5 }}></View>
                }
                <View style={{ width: '100%', height: 1, backgroundColor: '#1068DC', opacity: 0.5 }}></View>
              </View>
              <View style={styles.centerDown}>
             
                {
                  examples?.length > 0
                    ? examples.map((el, i) => {
                      if (i < 3) return getHintText(el.id, el.Hint, title);
                    })
                    : <Text style={styles.example}>Нет примеров к этому слову :(</Text>
                }
             
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  );
// }
};


const windowDimensions = Dimensions.get('window')
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

const styles = StyleSheet.create({
  scroll: {
    marginTop: windowHeight * 0.04,
    marginLeft: windowWidth * 0.04,
    width: windowWidth * 0.905,
    height: windowHeight * 0.75,
    backgroundColor: 'white'
  },
  wrapper: {
    position: 'absolute',
    width: '100%',
    flex: 1,
    backgroundColor: "transparent",
    zIndex: 0
  },
  title: {
    color: "#2A80F1",
    fontSize: 38,
    fontFamily: 'helvetica',
  },
  transcription: {
    color: "#BDBDBD",
    fontSize:20,
    fontWeight: '300',
    fontFamily: 'Gilroy-Regular',
  },
  answerTitle: {
    color: "#65BB98",
    fontSize: 30,
    fontFamily: 'helvetica',
    textAlign: 'center',
    // width: windowWidth * 0.8,
  },
  answerSubTitle: {
    color: "#4F4F4F",
    fontSize: 28,
    fontFamily: 'helvetica',
    marginBottom: 5,
    textAlign: 'center'
  },
  example: {
    color: "#4F4F4F",
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 30,
    marginBottom: 20,
    textAlign: 'left',
    width: windowWidth * 0.90,
    fontFamily: 'helvetica',
  },
  highlight: {
    color: "#2A80F1",
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 20,
    textAlign: 'center',
    width: windowWidth * 0.8,
    fontFamily: 'helvetica',
  },
  center: {
    alignItems: 'center',
    // marginTop: windowHeight * 0.12,
  },
  content: {
    alignItems: 'center',
    marginTop: 10,
  },
  centerDown: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  text: {
    color: "#2A80F1",
  },
  labelNot: {
    position: 'absolute',
    top: 60,
    right: 12,
    width: 128,
    height: 41,
    backgroundColor: '#FDDFDF',
    borderWidth: 3,
    borderRadius: 36,
    borderColor: '#EB5757',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: "30deg" }],
    zIndex: 3
  },
  labelYes: {
    position: 'absolute',
    top: 60,
    left: 16,
    width: 128,
    height: 41,
    backgroundColor: '#DFFDDF',
    borderWidth: 3,
    borderRadius: 36,
    borderColor: '#65BB98',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: "-30deg" }],
    zIndex: 3
  }
});