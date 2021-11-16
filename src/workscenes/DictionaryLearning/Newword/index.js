import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useNavigation } from "@react-navigation/native";
import Spinner from "../../../Spinner";

const ITEM_HEIGHT = 60;

export default Newword = ({ words, current, listener, diapazon, wordToLearn, wordToKnow }) => {
  const navigation = useNavigation();
  const [textIndex, setTextIndex] = useState(-1);
  const [text, setText] = useState(words.map(() => (false)));

  useEffect(() => {
    return () => {
      listener(0);
    };
  }, []);

  const setsetText = (index, value) => {
    if (textIndex >= 0) {
      text[textIndex] = false;
    }
    text[index] = value;
    setText(text);
    setTextIndex(value ? index : -1);
  }

  // const swiperRef = useRef();
  // if (serchIndex >= 0 && swiperRef.current) {
  //   const index = Math.min(lastRow, serchIndex);
  //   swiperRef.current._listView.scrollToIndex({ index: index, animated: false });
  // }

  const changeItem = (_rowMap, rowKey) => {
    wordToLearn(rowKey);
  };
  
  const changeItemKnow = (_rowMap, rowKey) => {
    wordToKnow(rowKey);
  };

  const onItemOpen = (rowKey, rowMap, toValue) => {
    if (toValue > 100) {
      changeItem(rowMap, rowKey);
    } else if (toValue < -100) {
      changeItemKnow(rowMap, rowKey);
    }
  };

  const renderItem = (data) => {
    return (
    <View>
      <TouchableHighlight
        onLongPress={() => navigation.navigate('TestingDetail', { word: data })}
        onPress={() => {
          setsetText(data.index, true);
          setTimeout(() => setsetText(data.index, false), 1000);
        }}
        style={[styles.rowFront, text[data.index] === true ? { backgroundColor: '#2A80F1' } : {}]}
        underlayColor={"white"}
      >
        <View style={styles.resultCoins}>
            <View style={styles.resultCoins}>
              <Text style={[styles.resultText1, text[data.index] === true ? { color: 'white' } : {}]}>
                {data.item.WordEn}
                {" - "}
              </Text>
              <Text style={[styles.resultText2, text[data.index] === true ? { color: 'white' } : {}]}>
                {data.item.wordRus[0].WordRu.length > 16 ? data.item.wordRus[0].WordRu.slice(0,16)+ '...' : data.item.wordRus[0].WordRu}
              </Text>
            </View>
        </View>
      </TouchableHighlight>
    </View>
  )};

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteBtn]}
        onPress={() => changeItemKnow(rowMap, data.item.id)}
      >
        <Text style={styles.btnText1}>Знаю  →</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.closeBtn]}
        onPress={() => changeItem(rowMap, data.item.id)}
      >
        <Text style={styles.btnText1}>Учить →</Text>
      </TouchableOpacity>
    </View>
  );

  const onViewRef = React.useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      try {
        diapazon(viewableItems[0].index, viewableItems[viewableItems.length - 1].index);
      } catch (e) {}
    }
  })
  // const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

  return (
    words.length === 0
    ? <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    : <View style={styles.resultWords} key={current}>
        <SwipeListView
          useFlatList={true}
          // ref={swiperRef}
          data={words}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={120}
          rightOpenValue={-120}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={30}
          onRowOpen={onItemOpen}
          initialNumToRender={10}
          initialScrollIndex={current}
          keyExtractor={item => item.id}
          getItemLayout={(_data, index) => (
            { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
          )}
          // onScrollToIndexFailed={info => {
          //   const wait = new Promise(resolve => setTimeout(resolve, 500));
          //   wait.then(() => {
          //     swiperRef.current._listView.scrollToIndex({ index: info.index, animated: false });
          //   });
          // }}
          itemVisiblePercentThreshold={75}
          onViewableItemsChanged={onViewRef.current}
        />
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    height: '79%'
  },
  resultWords: {
    marginTop: 5,
    fontSize: 22,
    fontFamily: "Gilroy-Regular",
  },
  resultCoins: {
    flexDirection: "row",
    marginLeft: 0,
    marginRight: 20,
    width: '90%'
  },
  resultCoins1: {
    flexDirection: "row",
    width: '85%',
    marginRight: 30,
  
  },
  resultText1: {
    alignSelf: "center",
    fontSize: 20,
    color: "#1D1F21",
    fontFamily: "Gilroy-Regular",
    fontWeight: "700",
    
  },
  resultText2: {
    alignSelf: "center",
    fontSize: 20,
    color: "#1D1F21",
    fontFamily: "Gilroy-Regular",
    textAlign: "left",
    width: '80%'
  },
  trainingButton: {
    width: '100%',
    height: 70,
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom:20,
    marginTop:-15
  },
  exerciseImage: {
    width: 15,
    height: 15,
    marginRight: 10,
    alignSelf: "center",
    marginTop: -13,

  },
  exerciseText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Gilroy-Regular',
    marginTop: -10,
    fontWeight:'700'
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "white",
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 0.5,
    justifyContent: "center",
    height: ITEM_HEIGHT
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5,
  },
  actionButton: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 150,
  },
  closeBtn: {
    left: 0,
  },
  deleteBtn: {
    right: 0,
  },
  btnText:{
    fontSize:18,
color:"#219653"
  },
  btnText1:{
    fontSize:18,
color:"#EB5757"
  }
});