import React, { Component } from 'react';
import {
    View,
    StatusBar,
    TextInput,
    Animated,
    Dimensions
} from 'react-native';
import { colors } from '../utilities/colors/colors'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { TextInputMask } from 'react-native-masked-text'

export class FloatingLabelMaskInput extends Component {
    state = {
        isFocused: false,
    };

    UNSAFE_componentWillMount() {
        this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
    }

    handleFocus = () => this.setState({ isFocused: true });
    handleBlur = () => this.setState({ isFocused: false });

    componentDidUpdate() {
        Animated.timing(this._animatedIsFocused, {
            toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }

    render() {
        const { screen, widthInput, label, ...props } = this.props;
        const labelStyle = {
            fontFamily: 'OpenSansHebrew-Regular',
            zIndex: 1,
            backgroundColor: colors.white,
            position: 'absolute',
            left: 20,
            top: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 8],
            }),
            fontSize: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 15],
            }),
            color: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [colors.black, screen == 'register' ? colors.searchText : colors.black],
            }),
        };
        const labelTwoStyle = {
            fontFamily: 'OpenSansHebrew-Regular',
            zIndex: 1,
            backgroundColor: colors.white,
            position: 'absolute',
            left: 10,
            top: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 8],
            }),
            fontSize: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 15],
            }),
            color: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [colors.red, colors.searchText],
            }),
        };
        return (
            <View style={{ paddingTop: 18 }}>
                <Animated.Text style={labelStyle}>
                    {label}
                </Animated.Text>
                {screen == 'register' ?
                    <Animated.Text style={labelTwoStyle}>
                        {'*'}
                    </Animated.Text> : null
                }

                <TextInputMask
                    {...props}
                    style={{
                        borderWidth: 2,
                        height: 70,
                        width: widthInput,
                        color: label == 'מספר נייד' ? colors.searchText : colors.black,
                        borderColor: colors.line,
                        fontFamily: 'OpenSansHebrew-Regular',
                        textAlign: 'right',
                        paddingLeft: 10,
                        fontSize: 15,
                        borderRadius: 6,
                    }}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    blurOnSubmit
                />
            </View>
        );
    }
}
