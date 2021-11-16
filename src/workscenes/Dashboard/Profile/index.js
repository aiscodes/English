import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground, Platform, Alert, ActivityIndicator } from "react-native";
import Target from "../../../../assets/images/Target.svg";
import Sword from '../../../../assets/images/Sword.svg'
import Hearts from '../../../../assets/images/Hearts.svg'
import GameController from '../../../../assets/images/GameController.svg'
import BG from '../../../../assets/images/dashboard_BG1.png'
import { useNavigation } from "@react-navigation/native";
import { ChartsIntensity } from "./Charts-intensity";
import { ChartsExperience } from "./Charts-Experience";
import { ChartsKnow } from "./Charts-Know";
import buttonGradient from '../../../../assets/images/buttons.png';
import { defLevel } from '../../../constants';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet from 'reanimated-bottom-sheet';
import { clearAll } from "../../../AsyncStorage/AsyncStorage";
import { userRoutine } from '../../../store/userReducer';
import { learnRoutine, countRoutine, vocabularyRoutine, wordsDefaultRoutine } from "../../../store/wordsReducer";
import { dictDefaultRoutine } from '../../../store/dictReducer';
import { statDefaultRoutine } from '../../../store/statReducer';
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDate, setDate } from "../../../constants";
import { vocabularyWords } from "../../Actions/vocabulary";
import Group from '../../../../assets/Group1.svg'
import Avatar from '../../../../assets/avatar.svg'
import CircularProgress from 'react-native-circular-progress-indicator';

let defPage = 0;

const windowDimensions = Dimensions.get("window");
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

const Profile = ({ wait, wordCount, stat, statweek, statmonth, userRoutine, learnRoutine, countRoutine, vocabularyRoutine, wordsDefaultRoutine, dictDefaultRoutine, statDefaultRoutine }) => {
  const navigation = useNavigation();
  const [page, setPagePage] = useState(defPage);
  const [data, setCurrentDate] = useState(getDate());
  const [isDatePicker, setDatePicker] = useState(false);
  const [isTimePicker, setTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ExpirChart = (data, len, hidden) => <ChartsExperience data={data} len={len} hidden={hidden} />;
  const IntensChart = (data, len, hidden, koe) => <ChartsIntensity data={data} len={len} hidden={hidden} koe={koe} />;
  const KnowChart = (data, len, hidden) => <ChartsKnow data={data} len={len} hidden={hidden} />;
  const [initialSnapShot, setInitialSnapShot] = useState([270, windowHeight - 360]);

  useEffect(() => {
    const snapShotHeight = getWordsExp(stat) ? windowHeight - 170 : windowHeight - 360;
    setInitialSnapShot([270, snapShotHeight]);
  }, [stat]);

  const setPage = (value) => {
    defPage = value;
    setPagePage(value);
  }

  const confirmExit = () =>
    Alert.alert(
      "Внимание !",
      "Вы действительно хотите выйти из профиля ?",
      [
        {
          text: "Нет",
          style: "cancel"
        },
        {
          text: "Да", onPress: () => {
            clearAll();
            // wordsDefaultRoutine({});
            // dictDefaultRoutine({});
            // statDefaultRoutine({});
            userRoutine({ user: null });
          }
        }
      ],
      { cancelable: true }
    );

  const showPicker = () => {
    setDatePicker(true);
  };

  const doOnChange = (_event, value) => {
    if (value) {
      setDate(value);
      setCurrentDate(value);
      setTimePicker(true);
    }
    setDatePicker(false);
  };

  const doOnTimeChange = (_event, value) => {
    if (value) {
      setDate(value);
      setCurrentDate(value);
      const current = new Date((new Date(getDate())).setSeconds(0)).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
      Alert.alert(current);
    }
    setTimePicker(false);
  };

  function getWordsKnow(array) {
    const result = array.length > 0 && array[array.length - 1].know > 0;
    return result;
  }
  function getWordsExp(array) {
    const result = array.length > 0 && array[array.length - 1].experience > 0;
    return result;
  }

  const SlideContent = () => {
    return (
      <View style={{ paddingTop: 10, backgroundColor: 'white', borderTopEndRadius: 26, borderTopStartRadius: 26, marginBottom: '25%' }}>
        <View stickyHeaderIndices={[0]} >
          <View style={{ width: 50, height: 4, backgroundColor: '#E0E0E0', borderRadius: 30, position: 'absolute', top: 0, left: windowWidth / 2 - 25, }} ></View>
          <View
            // source={BG}
            resizeMode='stretch'
            style={styles.bg__achievements}
          >
            <View style={styles.awardsContainer}>
              <View style={styles.awardsHeader}>
                <View>
                  <Text style={styles.awardsTitle}>
                    Достижения
                  </Text>
                </View>
                {/* <View>
                  <TouchableOpacity
                    style={styles.awardsShowAll}
                  >
                    <Text style={styles.awardsShowAll}>
                      Все
                    </Text>
                  </TouchableOpacity>
                </View> */}
              </View>

              <View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: windowWidth * 0.80, marginLeft: windowWidth * 0.1 }}>
                <View style={{ width: windowWidth * 0.29, alignSelf: 'flex-end' }}>
                  <Sword style={{ width: windowWidth * 0.20, height: windowWidth * 0.15, alignSelf: 'center' }} />
                  <Text style={{ textAlign: 'center', paddingTop: '5%', fontSize: 11, fontFamily: "Gilroy-Regular", fontWeight: "700", }}>
                    Целеустремленный
                  </Text>
                </View>
                <View style={{ width: windowWidth * 0.29, alignSelf: 'flex-end' }}>
                  <Hearts style={{ width: windowWidth * 0.20, height: windowWidth * 0.15, alignSelf: 'center' }} />
                  <Text style={{ textAlign: 'center', paddingTop: '5%', fontSize: 11, fontFamily: "Gilroy-Regular", fontWeight: "700", }}>
                    Знаток
                  </Text>
                </View>
                <View style={{ width: windowWidth * 0.29, alignSelf: 'flex-end' }}>
                  <GameController style={{ width: windowWidth * 0.20, height: windowWidth * 0.15, alignSelf: 'center' }} />
                  <Text style={{ textAlign: 'center', paddingTop: '5%', fontSize: 11, fontFamily: "Gilroy-Regular", fontWeight: "700", }}>
                    Неутомимый
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginTop: (Platform.OS == 'android' ? 200 : 190) }}>
            {getWordsExp(stat) &&
              <>
                <View key={`k${wait}`} style={styles.graph}>
                  {page === 0 && IntensChart(stat, 7, true)}
                  {page === 1 && IntensChart(stat, 30, true)}
                  {page === 2 && IntensChart(stat, 100000, true)}
                </View>
                {TimeSelector()}
              </>
            }
            {getWordsExp(stat) &&
              <>
                <View key={`k${wait}`} style={styles.graph}>
                  {page === 0 && ExpirChart(stat, 7, true)}
                  {page === 1 && ExpirChart(stat, 30, true)}
                  {page === 2 && ExpirChart(stat, 100000, true)}
                </View>
                {TimeSelector()}
              </>
            }
            {getWordsKnow(stat) &&
              <>
                <View key={`k${wait}`} style={styles.graph}>
                  {page === 0 && KnowChart(stat, 7, true)}
                  {page === 1 && KnowChart(stat, 30, true)}
                  {page === 2 && KnowChart(stat, 100000, true)}
                </View>
                {TimeSelector()}
              </>
            }
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("TrainingsScreen")}
          >
            <ImageBackground
              style={styles.trainingButton}
            >
              <Text style={styles.exerciseText}></Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

      </View>
    )
  }

  const TimeSelector = () => (
    <View style={styles.monthContainer}>
      <TouchableOpacity style={[styles.touchContainer, page === 0 ? { backgroundColor: "#7FB3F7" } : {}]} onPress={() => setPage(0)}>
        <Text style={[styles.textContainer, page === 0 ? { color: "#ffff" } : {}]}>
          Н
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touchContainer, page === 1 ? { backgroundColor: "#7FB3F7" } : {},]} onPress={() => setPage(1)}>
        <Text style={[styles.textContainer, page === 1 ? { color: "#ffff" } : {}]}>
          М
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.touchContainer, page === 2 ? { backgroundColor: "#7FB3F7" } : {}]} onPress={() => setPage(2)}>
        <Text style={[styles.textContainer, page === 2 ? { color: "#ffff" } : {}]}>
          Всe
        </Text>
      </TouchableOpacity>
    </View>
  )

  const startTesting = async () => {
    if (!isLoading) {
      setIsLoading(true);
      const result = await vocabularyWords(navigation, learnRoutine, countRoutine, vocabularyRoutine);
      if (result) navigation.navigate("Loading", { finish: startTesting, mode: false });
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        resizeMode='stretch'
        colors={['#24C9FF', '#5E46F9']}
        style={Platform.OS == 'android' ? styles.background : styles.backgroundIOS}
      >
        <View style={styles.vocabulary}>
          <View style={Platform.OS == 'android' ?
            { flexDirection: 'row', width: '90%', justifyContent: 'space-between', marginBottom: windowHeight * 0.1, alignContent: 'flex-start', }
            : { flexDirection: 'row', width: '90%', justifyContent: 'space-between', marginBottom: windowHeight * 0.1, alignContent: 'flex-start', }}>
            <View style={styles.vocabularyLeft}>
              <Text style={styles.vocabularyLeftTitle}>Словарный запас</Text>
              <Text style={styles.vocabularyLeftCountWord}>
                <Text style={{ color: '#9cf' }}>{''.padStart(5 - wordCount.toString().length, "0")}</Text>
                {wordCount}
              </Text>
            </View>
            <Avatar style={styles.vocabularyUserName} onPress={confirmExit} />
          </View>
          <View style={styles.covid}>
            <TouchableOpacity
              style={Platform.OS == 'android' ?
                { zIndex: 0, position: 'absolute', top: 30, alignSelf: 'center', }
                : { zIndex: 0, position: 'absolute', top: 30, alignSelf: 'center' }
              }
              onPress={() =>
                navigation.navigate('Tarif')}>
              <Group
                style={styles.covidimg}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.progress}>
            <CircularProgress
              value={wordCount % defLevel}
              radius={73}
              duration={100}
              textColor={'#ecf0f1'}
              activeStrokeColor={'#A0FEA9'}
              strokeLinecap={'round'}
              activeStrokeSecondaryColor={'#2FED42'}
              inActiveStrokeColor={'#ffff'}
              inActiveStrokeOpacity={1}
              inActiveStrokeWidth={21}
              activeStrokeWidth={19}
              showProgressValue={false}
            />
            {wordCount % defLevel < 97 && <View style={{ position: 'absolute', top: 9, left: 65, width: 8, height: 15, borderBottomLeftRadius: 8, borderTopLeftRadius: 8, backgroundColor: '#ffff', }} />}
            <View style={styles.progresstext}>
              <Text style={styles.loaderResult}>{Math.floor(wordCount / defLevel)}</Text>
              <Text style={styles.loaderLevel}>Уровень</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <BottomSheet
        snapPoints={initialSnapShot}
        borderRadius={26}
        renderContent={SlideContent}
        enabledInnerScrolling={true}
        enabledBottomInitialAnimation={true}
        enableOverDrag={true}
        enabledContentTapInteraction={false}
     
      />

      <View style={{ backgroundColor: 'white', zIndex: 555, width: windowWidth, position: 'absolute', bottom: 0 }}>
        <TouchableOpacity onPress={startTesting} >
          <ImageBackground
            source={buttonGradient}
            style={styles.trainingButton}
          >
            {isLoading ? null : <Target style={styles.exerciseImage} />}
            {isLoading
              ? <ActivityIndicator size="large" color="#fff" style={{ marginBottom: 10 }} />
              : <Text style={styles.exerciseText}>Тренироваться</Text>}
          </ImageBackground>
        </TouchableOpacity>

        {isDatePicker && (
          <DateTimePicker
            mode={"date"}
            value={data}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            is24Hour={true}
            onChange={doOnChange}
            style={styles.datePicker}
          />
        )}
        {isTimePicker && (
          <DateTimePicker
            mode={"time"}
            value={data}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            is24Hour={true}
            onChange={doOnTimeChange}
            style={styles.datePicker}
          />
        )}
        <TouchableOpacity onPress={showPicker}>
          <ImageBackground
            source={buttonGradient}
            style={styles.trainingButton}
          >
            <Target style={styles.exerciseImage} />
            <Text style={styles.exerciseText}>Дата и Время</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lineIos: {
    zIndex: 0,
    position: 'absolute',
    top: windowHeight * -0.003,
    left: -75,
  },
  container: {
    flex: 1,
    backgroundColor: "#24C9FF",

  },
  background: {
    height: '100%',
    zIndex: -1
  },
  backgroundIOS: {
    height: '100%'
  },
  graph: {
    width: '100%',
    shadowColor: "#000",
  },
  headerCard: {
    flex: 1,
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: windowWidth * 0.06,
    textAlign: 'center',
    fontFamily: 'Gilroy-Regular',
    color: 'white',
    width: 120
  },
  headerExitWorkout: {
    width: windowWidth * 0.1,
    height: windowWidth * 0.1,
    alignSelf: 'center'
  },
  headerTop: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingTop: windowHeight * 0.02,

  },
  headerSubtitle: {
    color: "#1D1F21",
    textAlign: "center",
    fontFamily: "Gilroy-Regular",
  },
  vocabulary: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: windowHeight * 0.16,
    marginTop: windowHeight * 0.05,
    width: '100%',
    alignSelf: "center",
    alignItems: 'center'
  },
  vocabularyLeft: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: 68
  },
  vocabularyLeftTitle: {
    fontSize: 17,
    color: "white",
    fontFamily: "Gilroy-Regular",
    lineHeight: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
    alignSelf: 'center',
  },
  vocabularyLeftCountWord: {
    fontSize: 50,
    color: "white",
    fontFamily: "Gilroy-Regular",
    alignSelf: 'center',
    fontWeight: '600',
    letterSpacing: -0.3
  },
  vocabularyLeftScholar: {
    width: windowWidth * 0.49,
    height: windowWidth * 0.6,
    alignSelf: "center",
  },
  vocabularyRight: {
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
    width: windowWidth * 0.8,
  },
  trainingButton: {
    width: "100%",
    height: 70,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: 'center',
    flexDirection: "row",
    marginTop: windowHeight * 0.003,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: 25,
    height: 25,
    marginRight: windowWidth * 0.015,
    alignSelf: "center",
    marginTop: -13
  },
  exerciseText: {
    fontSize: 18,
    fontWeight: '700',
    color: "white",
    lineHeight: windowWidth * 0.06,
    alignSelf: "center",
    fontFamily: "Gilroy-Regular",
    marginTop: -10
  },
  icon: {
    width: 30,
    height: 30,
    color: "black",
    alignSelf: "center",
    justifyContent: "center",
  },
  belt: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.04,
    marginBottom: "3%",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#1D1F21",
  },
  beltpole: {
    width: windowWidth * 0.4 - 4,
    height: windowHeight * 0.04 - 4,
    borderRadius: 4,
    alignItems: "center",
  },
  belttext: {
    position: "absolute",
    alignSelf: "center",
    width: windowWidth * 0.4,
    textAlign: "center",
    textAlignVertical: "center",
    color: "grey",
    alignItems: "center",
    paddingTop: 3,
    fontSize: 14
  },
  date: {
    fontFamily: "Gilroy-Regular",
    fontSize: 16,
    color: "#828282",
  },
  date1: {
    fontFamily: "Gilroy-Regular",
    fontSize: 16,
    color: "#2A80F1",
  },
  monthContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    width: windowWidth * 0.5,
    // height: windowHeight * 0.05,
    marginTop: '3%',
    marginBottom: '10%'
  },
  touchContainer: {
    flex: 1,
    flexDirection: "column",
    width: windowWidth * 0.03,
    height: windowHeight * 0.036,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: windowHeight * 0.025
  },
  textContainer: {
    color: "#2A80F1",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: '7%'
  },

  //===============

  bg__achievements: {
    width: '102%',
    height: 320,
    overflow: 'hidden',
    marginLeft: '-2%',
    zIndex: 0,
    position: 'absolute'
  },
  bg: {
    width: "102%",
    height: Platform.OS == 'android'? windowHeight * 0.40: 260,
    overflow: 'hidden',
    marginLeft: '-2%',
  },
  awardsContainer: {
    marginBottom: windowWidth * 0.085,
    marginTop: windowWidth * 0.08,
    borderRadius: 50,
    paddingTop: 10
  },
  awardsHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '86%',
    marginLeft: '7%',
    marginBottom: 35,
  },
  awardsTitle: {
    fontSize: 16,
    color: "#2A80F1",
    fontFamily: "Gilroy-Regular",
    fontWeight: '700'

  },
  awardsShowAll: {
    fontFamily: "Gilroy-Regular",
    color: '#2A80F1',
    fontSize: 14
  },
  awardsCard: {
    alignSelf: 'center',
    width: windowWidth * 0.3,
  },
  awardsCardImage: {
    width: 40,
    height: 40,
    marginBottom: windowWidth * 0.012,
    backgroundColor: 'red',
    alignSelf: 'center',
  },
  awardsCardText: {
    fontFamily: "Gilroy-Regular",
    color: 'black',
    alignSelf: 'center',
    fontSize: windowHeight * 0.014,
    textAlign: 'center'
  },

  //==============
  loaderLevel: {
    fontSize: 14,
    lineHeight: 14,
    color: '#fff',
    fontFamily: "Gilroy-Regular",
    alignSelf: 'center',
    zIndex: 10
  },
  loaderResult: {
    fontSize: 45,
    lineHeight: 45,
    color: '#fff',
    fontFamily: "Gilroy-Regular",
    alignSelf: 'center',
    zIndex: 10
  },
  covid: {
    width: '40%',
    height: 145,
    alignSelf: 'center',
    position: 'absolute',
    top: 25
  },
  progress: {
    alignSelf: 'center',
    position: 'absolute',
    top: 124,
  },
  progresstext: {
    alignSelf: 'center',
    position: 'absolute',
    top: 40,
    // width:'50%',
    // height:'50%',
    // backgroundColor:'#389DFD'
    // zIndex:10
  },
  covidimg: {
  },
  covid__item: {
    width: 100,
    height: 5,
    backgroundColor: 'red',
    position: 'absolute',
    right: -100,
  },
  cancel: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '81%',
    alignItems: 'center',
    marginLeft: '15%',
    marginBottom: '2%'
  }
});

Profile.propTypes = {
  wordCount: PropTypes.number,
  stat: PropTypes.arrayOf(PropTypes.object),
  statweek: PropTypes.arrayOf(PropTypes.object),
  statmonth: PropTypes.arrayOf(PropTypes.object),
};

Profile.defaultProps = {
  wordCount: 0,
  stat: [],
  statweek: [],
  statmonth: [],
};

const mapStateToProps = ({ stat }) => ({
  wordCount: stat.wordCount.learned,
  stat: stat.stat,
  statweek: stat.statweek,
  statmonth: stat.statmonth
});

const mapDispatchToProps = { userRoutine, learnRoutine, countRoutine, vocabularyRoutine, wordsDefaultRoutine, dictDefaultRoutine, statDefaultRoutine };
export default connect(mapStateToProps, mapDispatchToProps)(Profile);