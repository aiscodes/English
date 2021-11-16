import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ImageBackground, BackHandler, Image } from "react-native";
import { ChartsExperience } from '../Dashboard/Profile/Charts-Experience';
import { useState } from "react";
import None00 from "../../images/coins/none00.png";
import Bronze20 from "../../images/coins/bronze20.png";
import Bronze40 from "../../images/coins/bronze40.png";
import Bronze60 from "../../images/coins/bronze60.png";
import Bronze80 from "../../images/coins/bronze80.png";
import Bronze100 from "../../images/coins/bronze100.png";
import Silver20 from "../../images/coins/silver20.png";
import Silver40 from "../../images/coins/silver40.png";
import Silver60 from "../../images/coins/silver60.png";
import Silver80 from "../../images/coins/silver80.png";
import Silver100 from "../../images/coins/silver100.png";
import Gold20 from "../../images/coins/ggold20.png";
import Gold40 from "../../images/coins/ggold40.png";
import Gold60 from "../../images/coins/ggold60.png";
import Gold80 from "../../images/coins/ggold80.png";
import Gold100 from "../../images/coins/ggold100.png";
import GoldAll from "../../images/coins/ggoldAll.png";
import buttonGradient from '../../../assets/images/buttons.png';

const windowDimensions = Dimensions.get("window");
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

function Statistics2({ navigation, route, learnVocabulary, data }) {

  const [coins] = useState(
    [
      <Image source={None00} style={styles.coin} />,
      <Image source={Bronze20} style={styles.coin} />,
      <Image source={Bronze40} style={styles.coin} />,
      <Image source={Bronze60} style={styles.coin} />,
      <Image source={Bronze80} style={styles.coin} />,
      <Image source={Bronze100} style={styles.coin} />,
      <Image source={Silver20} style={styles.coin} />,
      <Image source={Silver40} style={styles.coin} />,
      <Image source={Silver60} style={styles.coin} />,
      <Image source={Silver80} style={styles.coin} />,
      <Image source={Silver100} style={styles.coin} />,
      <Image source={Gold20} style={styles.coin} />,
      <Image source={Gold40} style={styles.coin} />,
      <Image source={Gold60} style={styles.coin} />,
      <Image source={Gold80} style={styles.coin} />,
      <Image source={Gold100} style={styles.coin} />,
      <Image source={GoldAll} style={styles.coin} />
    ]
  );

  const getStateCoin = index => {
    if (index >= 0 && index < coins.length) {
      return coins[index];
    }
    return coins[0];
  }

  const goBack = () => {
    return true;
  }

  const { wordExp } = route.params;
  useEffect(() => {
    navigation.addListener('focus', (e) => {
      BackHandler.addEventListener('hardwareBackPress', goBack);
    });
    navigation.addListener('blur', (e) => {
      BackHandler.removeEventListener('hardwareBackPress', goBack);
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Получено опыта</Text>

      <Text style={styles.result}>+{wordExp}</Text>
      <View style={styles.graph}>
      <View style={{ backgroundColor: 'white', width: '100%', height: 20, alignSelf: 'center', marginTop:0, position:'absolute', zIndex:30 }} />
        <ChartsExperience data={data} len={7} />
      </View>
      <ScrollView style={styles.resultWords}>

        {learnVocabulary.map((el, index) => {
          return (
            <View key={index} style={styles.divider}>
              <View style={styles.resultCoins}>
                <Text style={styles.resultText}>
                  {el.WordEn} -{" "}
                  {el.wordRus.map((w, ind) => {
                    return (
                      <Text key={ind}>
                        {w.WordRu.length > 15
                          ? w.WordRu.substring(0, 11) + "..."
                          : w.WordRu}
                      </Text>
                    );
                  })}
                </Text>
                <Text style={styles.resultText1}>+
                { el.wordRus[0].loggs[0].experience}
                </Text>
                {getStateCoin(el.wordRus[0].loggs[0].state)}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate("Statistics3")}
        style={{ width: "100%" }}
      >
        <ImageBackground
          source={buttonGradient}
          style={styles.trainingButton}
        >
          <Text style={styles.buttonText}>Продолжить</Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 30,
    color: "black",
    alignSelf: "center",
    marginTop: 40,
    fontFamily: 'Gilroy-Regular',
  },
  coin: {
    marginTop: 10,
  },
  graph: {
    width: '100%',
    marginTop: '3%',
    marginBottom: windowHeight * 0.02
  },
  result: {
    fontSize: windowHeight * 0.075,
    color: "#2F80ED",
    alignSelf: "center",
    marginTop: windowHeight * 0.020,
    fontFamily: 'Gilroy-Regular',
  },
  resultCoins: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: windowWidth * 0.86,
    alignSelf: 'center',
    height: 60,
  },
  resultText: {
    alignSelf: "center",
    fontSize: 20,
    fontFamily: 'Gilroy-Regular',
    width: '77%'
  },
  resultText1: {
    alignSelf: "center",
    fontSize: 17,
    fontFamily: 'Gilroy-Regular',
    width: '14%'
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    width: windowWidth * 0.86,
    alignSelf: 'center'
  },
  trainingButton: {
    width: "100%",
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: windowWidth * 0.02,
    marginBottom: windowWidth * 0.05,
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 18,
    textAlign: "center",
    fontFamily: 'Gilroy-Regular',
    marginTop: -13,
    fontWeight:'700'
  },
  coin: {
    width: windowWidth * 0.09,
    height: windowWidth * 0.09,
    alignSelf: 'center'
  }
});

Statistics2.propTypes = {
  learnVocabulary: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.arrayOf(PropTypes.object)
};

Statistics2.defaultProps = {
  learnVocabulary: [],
  data: []
};

const mapStateToProps = ({ words, stat }) => ({
  learnVocabulary: words.learnVocabulary,
  data: stat.stat
});

export default connect(mapStateToProps)(Statistics2);
