import React, { Component } from 'react';
import {
    View,
    StatusBar,
    TextInput,
    Animated,
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
import { colors } from '../colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class FloatingLabelInput extends Component {
    state = {
        isFocused: false,
    };

    componentWillMount() {
        this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
    }

    handleFocus = () => this.setState({ isFocused: true });
    handleBlur = () => {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
        this.setState({ isFocused: false });
    };
    componentDidUpdate() {
        Animated.timing(this._animatedIsFocused, {
            useNativeDriver: false,
            toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
            duration: 200,
        }).start();
    }

    render() {
        const { label, ...props } = this.props;
        const labelStyle = {
            position: 'absolute',
            backgroundColor: 'white',
            zIndex: 1,
            fontFamily: 'Arimo-Regular',
            // right: this.props.placeHolderStyle ? this.props.placeHolderStyle : 11,
            right: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [this.props.placeHolderStyle, 12],
            }),
            paddingLeft: 2,
            top: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 2],
            }),
            fontSize: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 13],
            }),
            color: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [this.props.isError ? 'red' : colors.TEXT_CODE, this.state.isFocused ? this.props.isError ? 'red' : colors.TEXT_LINK : colors.TEXT_CODE],
            }),
        };
        return (
            <View >
                <Animated.Text onBlur={this.handleBlur} onPress={() => this.inputText.focus()} style={labelStyle}>
                    {this.props.mandatoryMark && <Text style={{ color: colors.red }}>* </Text>}

                    {label}
                </Animated.Text>
                <TextInput
                    ref={ref => this.inputText = ref}
                    {...props}
                    style={[
                        {
                            textAlign: 'right',
                            fontFamily: 'Arimo-Regular',
                            width: this.props.width != undefined ? this.props.width : width - 50,
                            height: this.props.height != undefined ? this.props.height : 56,
                            color: colors.TEXT_CODE,
                            borderRadius: 6,
                            paddingRight: this.props.placeHolderStyle ? this.props.placeHolderStyle : 10,
                            fontSize: 15,
                            borderWidth: this.state.isFocused ? 2 : 1,
                            borderColor: this.props.isError
                                ? colors.red
                                : this.state.isFocused
                                    ? colors.TEXT_LINK
                                    : 'rgba(128,129,145,0.2)',
                        },
                    ]}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    blurOnSubmit
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    inputText: {
        justifyContent: 'center',
        fontWeight: '400',
        color: 'rgb(64,64,64)',
        padding: 0,
        margin: 0,
        fontSize: 15,
        letterSpacing: 0.19,
        marginTop: Platform.OS === 'ios' ? 16 : 11,
        marginHorizontal: 15,
        textAlign: 'right',
        fontFamily: 'Arimo-Regular',
    },
    placeholderText: {
        fontWeight: '400',
        color: colors.TEXT_GRAY,
        padding: 0,
        fontSize: 15,
        letterSpacing: 0.14,
        marginTop: Platform.OS === 'ios' ? 13 : 8,
        marginHorizontal: 15,
        paddingRight: 15,
        textAlign: 'right',
        fontFamily: 'Arimo-Regular',
    },
});


FloatingLabelInput.defaultProps = {
    // marginBottom: 18,
    width: width - 50 ,
    marginTop: 10,
    extraMarginTop: 0,
    onChange: () => null,
    secureTextEntry: false,
    editable: true,
    isError: false,
    keyboardType: 'default',
};