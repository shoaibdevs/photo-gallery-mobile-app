import React, { Component } from 'react';
import {
    StyleSheet,     
    Text,          
    TouchableOpacity,
    View,
    Dimensions,
    Image
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class Button extends Component {
    render({ onPress, buttonStyles, textStyle, source, imageStyle, disabled } = this.props) {
        return (
            <TouchableOpacity style={{top:10}} onPress={onPress} disabled={disabled}>
                <View style={buttonStyles}>
                    <Text style={[styles.text, 
                        {color:buttonStyles.color, fontSize:buttonStyles.fontSize, fontFamily:buttonStyles.fontFamily}, textStyle]}>{this.props.text}</Text>
                        {source ? <Image source={source} style={imageStyle}/> : null}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    // Button text
    text: {
        alignSelf: 'center',
        // right:10
    },
});