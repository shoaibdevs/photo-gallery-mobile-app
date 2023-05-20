import React from 'react';
import {View, Dimensions} from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


export const VerticalSpace = props => <View style={{height: props.height* height}} />;

export const HorizontalSpace = props => <View style={{width: props.width* width}} />;


