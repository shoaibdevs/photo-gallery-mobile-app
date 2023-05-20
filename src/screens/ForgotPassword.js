import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { colors } from '../colors'
import { VerticalSpace } from '../utilities/verticalSpace'
import Button from '../utilities/button'
import { sendEmailApi } from '../api'
import { useDispatch } from 'react-redux'
import { setPopupError, setPopupForgotPassword } from '../redux'
import AnimatedLoader from "react-native-animated-loader";
import FloatingLabelInput  from '../utilities/floatingLabelInput'
import PopupForgotPassword from './popups/popupForgotPassword';
import PopupError from './popups/popupError';

const width = Dimensions.get('window').width;

export default function ForgotPassword({ navigation }) {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [validValue, setValidValue] = useState({
        email: false,
    })

    const buttonStyles = {
        backgroundColor: colors.nextButton,
        color: colors.black,
        height: 65,
        width: width * 0.88,
        borderRadius: 26,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 17,
        fontFamily: 'Arimo-Bold',

    }

    useEffect(() => {
        setValidValue({ ...validValue, email: false })
    }, [email])

    function sendEmail() {
        if (emailValidation()) {
            setLoading(true)
            const formData = new FormData()
            formData.append('email', email.toLowerCase())
            sendEmailApi(formData).then((response) => {
                console.log(response, 'response forgot password');
                setLoading(false)
                if (response != 0) {
                    if (response.message) {
                        setMessage(response.message)
                    }
                    dispatch(setPopupForgotPassword(true))
                } else {
                    dispatch(setPopupError(true))
                }
            })
        }
    }

    const checkEmail = () => {
        const regExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        let result = regExp.test(email) // should be true as valid
        setIsEmailValid(result)
    }

    const emailValidation = () => {
        const regExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        let result = regExp.test(email) // should be true as valid
        if (result) setValidValue({ ...validValue, email: false })
        else setValidValue({ ...validValue, email: true })
        return result
    }

    return (
        <TouchableWithoutFeedback style={{ height: '100%' }} onPress={() => { Keyboard.dismiss(); }}>
            <View style={styles.container}>
                <AnimatedLoader
                    visible={loading} // was false on developer branch
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require("../../assets/picitLoader.json")}
                    animationStyle={{ width: 100, height: 100 }}
                    speed={1}
                ></AnimatedLoader>
                <Image source={require('../../assets/images/coverBackgroundsiImgBackgroundCover2.png')} style={{ height: 215, top: 40, left: 8 }} />
                <View style={{ width: '90%', alignSelf: 'center', marginTop: -150 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ width: '33%' }}></View>
                        <View style={{ width: '33%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { navigation.goBack() }}>
                                <Image source={require('../../assets/images/buttonsNavBarRight.png')} style={{ height: 40, width: 40 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ width: '85%', alignSelf: 'center', top: 30 }}>
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{'שכחתם סיסמה?'}</Text>
                    <VerticalSpace height={0.02} />
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`הזינו כתובת מייל ונשלח לכם קישור`}</Text>
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`לאיפוס הסיסמה`}</Text>
                    <VerticalSpace height={0.03} />

                    <View style={[styles.SectionStyle]}>
                        <FloatingLabelInput
                            label={"כתובת מייל"}
                            value={email}
                            placeHolderStyle={10}
                            height={60}
                            width={width - 60}
                            mandatoryMark={true}
                            editable={true}
                            isError={email.length == 0 && !validValue.email ? false : validValue.email}
                            onChangeText={txt => { setEmail(txt.toLowerCase()); checkEmail() }}
                        />
                        {/* <FloatingLabelInput
                            label={"כתובת מייל"}
                            value={email}
                            placeHolderStyle={10}

                            screen={'register'}
                            heightInput={60}
                            keyboardType={'email-address'}
                            onChangeText={txt => { setEmail(txt.toLowerCase()); checkEmail() }}
                            onBlur={emailValidation}
                            error={email.length == 0 && !validValue.email ? false : validValue.email}
                            style={{ width: width - 60, color: colors.black, position: 'relative', right: 5 }}
                        /> */}
                        {validValue.email ? <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 13, textAlign: 'center', color: colors.red }]}>{'נראה שכתובת המייל לא תקינה'}</Text> : null}
                    </View>
                    <VerticalSpace height={0.05} />
                    <Button text="שליחה" buttonStyles={buttonStyles} imageStyle={{ width: 20, height: 20 }} source={require('../../assets/images/iconsCircleCheck.png')} onPress={() => {
                        sendEmail()
                    }} />
                    <VerticalSpace height={0.05} />
                </View>

                <PopupForgotPassword navigation={navigation} />
                <PopupError />

            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.white
    },
    SectionStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        borderRadius: 6,
        color: colors.black,
        position: 'relative'
    },
    cardText: {
        textAlign: 'right',
        paddingRight: 5,
        marginTop: 5
    },
    buttonStyle: {
        backgroundColor: colors.nextButton,
        color: colors.black,
        height: 65,
        width: width * 0.88,
        borderRadius: 26,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 17,
        fontFamily: 'Arimo-Bold',
    }
});
