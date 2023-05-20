import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, PanResponder } from 'react-native';

const Crop = ({ imageUri }) => {
  const [cropCoords, setCropCoords] = useState(null);
  const imageRef = useRef(null);

  const handlePanResponderMove = (evt, gestureState) => {
    const { pageX, pageY } = evt.nativeEvent;
    const { width, height, x, y } = imageRef.current.getLayout();
    const left = pageX - x;
    const top = pageY - y;
    const right = width - left;
    const bottom = height - top;
    setCropCoords({ top, left, right, bottom });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
  });

  return (
    <View style={styles.container}>
      <Image ref={imageRef} source={{ uri: imageUri }} style={styles.image} {...panResponder.panHandlers} />
      {cropCoords && (
        <View
          style={[
            styles.cropContainer,
            { top: cropCoords.top, left: cropCoords.left, right: cropCoords.right, bottom: cropCoords.bottom },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  cropContainer: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default Crop;
