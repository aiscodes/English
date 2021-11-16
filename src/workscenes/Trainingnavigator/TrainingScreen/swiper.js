import React, { useState, useCallback, useRef } from 'react';
import { Animated, PanResponder, View, StyleSheet, Dimensions } from 'react-native';
import Card, { ACTION_OFFSET } from './Card';
import Footer from './Footer';

const { width, height } = Dimensions.get('screen');
const CARD = {
  WIDTH: width * 0.9,
  HEIGHT: height * 0.78,
  BORDER_RADIUS: 20,
  OUT_OF_SCREEN: width + 0.5 * width,
};

let dirr = 0;

export default function Swiper({ data, checkResp, onSwipeDirection, progress }) {
  const swipe = useRef(new Animated.ValueXY()).current;
  const tiltSign = useRef(new Animated.Value(1)).current;
  const [isSwipe, setSwipe] = useState(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy, y0 }) => {
      if (checkResp) {
        swipe.setValue({ x: dx, y: dy });
        tiltSign.setValue(y0 > CARD.HEIGHT / 2 ? 1 : -1);
        setSwipe(Math.sign(dx));
      } else {
        swipe.setValue({ x: 0, y: 0 });
      }
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const direction = Math.sign(dx);
      dirr = direction;
      const isActionActive = Math.abs(dx) > ACTION_OFFSET;
      if (checkResp) {
        setSwipe(0);
        if (isActionActive) {
          Animated.timing(swipe, {
            duration: 200,
            toValue: {
              x: direction * CARD.OUT_OF_SCREEN,
              y: dy,
            },
            useNativeDriver: true,
          }).start(removeTopCard);
        } else {
          Animated.spring(swipe, {
            toValue: {
              x: 0,
              y: 0,
            },
            useNativeDriver: true,
            friction: 5,
          }).start();
        }
      } else {
        onSwipeDirection(true);
      }
    },
  });

  const removeTopCard = useCallback(() => {
    swipe.setValue({ x: 0, y: 0 });
    onSwipeDirection(dirr > 0);
  }, [swipe]);

  // const handleChoice = useCallback(
  //   (direction) => {
  //     dirr = direction;
  //     Animated.timing(swipe.x, {
  //       toValue: direction * CARD.OUT_OF_SCREEN,
  //       duration: 400,
  //       useNativeDriver: true,
  //     }).start(removeTopCard);
  //   },
  //   [removeTopCard, swipe.x]
  // );

  function getCards() {
    const result = [];
    if (progress >= data.length) {
      return result;
    }
    if (checkResp) {
      const { id } = data[progress];
      let dragHandlers = panResponder.panHandlers;
      result.push(
        <Card
          key={id}
          name={id}
          item={data[progress]}
          checkResp={true}
          isFirst={true}
          swipe={swipe}
          tiltSign={tiltSign}
          onTap={() => {}}
          isSwipe={isSwipe}
          {...dragHandlers}
        />
      );
      if (progress < data.length - 1) {
        const { id } = data[progress + 1];
        dragHandlers = {};
        result.push(
          <Card
            key={`dub${id}`}
            name={`dub${id}`}
            item={data[progress + 1]}
            checkResp={false}
            isFirst={false}
            swipe={swipe}
            tiltSign={tiltSign}
            onTap={() => { }}
            isSwipe={false}
            {...dragHandlers}
          />
        );
      }
    } else {
      const { id } = data[progress];
      let dragHandlers = panResponder.panHandlers;
      result.push(
        <Card
          key={id}
          name={id}
          item={data[progress]}
          checkResp={false}
          isFirst={true}
          swipe={swipe}
          tiltSign={tiltSign}
          onTap={onSwipeDirection}
          isSwipe={false}
          {...dragHandlers}
        />
      );
      // dragHandlers = {};
      // result.push(
      //   <Card
      //     key={`dub${id}`}
      //     name={`dub${id}`}
      //     item={data[progress]}
      //     checkResp={false}
      //     isFirst={false}
      //     swipe={swipe}
      //     tiltSign={tiltSign}
      //     {...dragHandlers}
      //   />
      // )
    }
    return result.reverse();
  }

  return (
    <View style={styles.container}>
      {getCards()}
      {/* <Footer handleChoice={handleChoice} checkResp={checkResp} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fafafa',
    alignItems: 'center'
  }
});
