import React, { forwardRef, useImperativeHandle } from 'react';
import {
  type ImageSourcePropType,
  StyleSheet,
  View,
  Image,
} from 'react-native';
// import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface Frame {
  filename: string;
  frame: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface SpriteProps {
  spriteSheetWidth: number;
  spriteSheetHeight: number;
  width: number;
  height: number;
  frames: Frame[];
  source: ImageSourcePropType;
}

interface SpriteRef {
  setCurrentFrameIndex: (frameIndex: number) => void;
}

const Sprite = forwardRef<SpriteRef, SpriteProps>((props, ref) => {
  const { spriteSheetWidth, spriteSheetHeight, width, height, frames, source } =
    props;
  const currentFrameIndex = useSharedValue(0);

  useImperativeHandle(
    ref,
    () => ({
      setCurrentFrameIndex: (frameIndex: number) => {
        if (frameIndex < 0 || frameIndex >= frames.length) {
          console.warn(`Invalid frame index: ${frameIndex}`);
          return;
        }
        currentFrameIndex.value = frameIndex;
      },
    }),
    [currentFrameIndex, frames.length]
  );

  const animatedStyle = useAnimatedStyle(() => {
    const selectedFrame = frames[currentFrameIndex.value]?.frame;
    if (!selectedFrame) return { width: 0, height: 0, opacity: 0 };

    const scaleX = width / selectedFrame.w;
    const scaleY = height / selectedFrame.h;

    return {
      width: spriteSheetWidth * scaleX,
      height: spriteSheetHeight * scaleY,
      transform: [
        { translateX: -selectedFrame.x * scaleX },
        { translateY: -selectedFrame.y * scaleY },
      ],
    };
  }, [width, height, spriteSheetWidth, spriteSheetHeight]);

  const containerStyle = StyleSheet.compose(styles.container, {
    width,
    height,
  });

  return (
    <View style={containerStyle}>
      <AnimatedImage
        source={source}
        style={animatedStyle}
        // contentFit="contain"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default Sprite;
