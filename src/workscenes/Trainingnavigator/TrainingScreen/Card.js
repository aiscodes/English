import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Preview } from './preview';

export const ACTION_OFFSET = 100;

export default function Card({ item, checkResp, isFirst, swipe, tiltSign, onTap, isSwipe, ...rest}) {
  const rotate = Animated.multiply(swipe.x, tiltSign).interpolate({
    inputRange: [-ACTION_OFFSET, 0, ACTION_OFFSET],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), { rotate }],
  };

  return (
    <Animated.View
      style={[styles.container, isFirst && animatedCardStyle]}
      {...rest}
    >
      <Preview 
        data={{
          id: item.id,
          title: item.WordEn,
          transcription: item.wordRus.length > 0 ? item.wordRus[0].Transcription : "Empty",
          translateWord: item.wordRus.length > 0 ? item.wordRus[0].WordRu : "Empty",
          sameTranslateWord: "",
          examples: item.wordRus.length > 0 ? item.wordRus[0].hints : [],
          audios: item.audios
        }}
        checkResp={checkResp}
        ready={isFirst}
        onTap={onTap}
        isSwipe={isSwipe}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 15,
    width: '95%',
    height: '90%',
    zIndex: 2
  },
  name: {
    position: 'absolute',
    bottom: 22,
    left: 22,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  }
});