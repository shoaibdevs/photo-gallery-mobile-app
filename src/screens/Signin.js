import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { colors } from '../colors'
import { VerticalSpace } from '../utilities/verticalSpace'
import { checkNetInfo } from '../helpers/albumHelper';
import Button from '../utilities/button'
import { login, updatePushToken } from '../api'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux'
import { setPopupError, setUser } from '../redux'
import AnimatedLoader from "react-native-animated-loader"
import PopupError from './popups/popupError';

const width = Dimensions.get('window').width;

export default function Signin({ navigation }) {
    const { pushToken } = useSelector(state => state.user)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)
    const [passFocused, setPassFocused] = useState(false)
    const [clickSign, setClickSign] = useState(false)
    const dispatch = useDispatch()

    const buttonStyles = {
        backgroundColor: colors.nextButton,
        color: colors.black,
        height: 65,
        width: width * 0.88,
        borderRadius: 26,
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 17,
        fontFamily: 'Arimo-Bold',

    }

    function onPressRegister() {
        setClickSign(true)
        setLoading(true)
        const formData = new FormData()

        // formData.append('email', 'segovik2015@gmail.com')
        // formData.append('email', 'testacc153957@gmail.com')
        // formData.append('password', 'qwerty123')
        formData.append('email', email.toLowerCase())
        formData.append('password', password)

        login(formData).then(async (response) => {
            console.log(response, 'respose sign in');
            setLoading(false)
            if (response != 0) {
                if (response.data != null) {
                    const data = response.data.user
                    if (data.id) {
                        const userInfo = {
                            email: data.email,
                            full_name: data.full_name, // seperate
                            token: data.token,
                            userId: data.id,
                            age: data.age,
                            phone: data.phone,
                            marital_status: data.marital_status
                        };
                        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                        await checkNetInfo();
                        dispatch(setUser(userInfo))
                        navigation.navigate('Camera')
                        const formData = new FormData()
                        formData.append('token', data.token)
                        formData.append('push_token', pushToken)
                        updatePushToken(formData).then(res => console.log(res, 'token res'))
                    }
                }
                else {
                    if (response.message == 'Wrong Login')
                        setMessage('כתובת המייל או הסיסמא אינם נכונים')
                    else if (response.message == 'Missing Inputs')
                        setMessage('אנא מלא את כל הפרטים')
                }
            } else {
                if (email != '' && password != '') {
                    dispatch(setPopupError(true))
                }
            }

        })
    }

    return (
        <TouchableWithoutFeedback style={{ height: '100%' }} onPress={() => { Keyboard.dismiss(); console.log('clicked'); }}>
            <View style={styles.container}>
                <AnimatedLoader
                    // visible={loading} // was false on developer branch
                    visible={loading} // was false on developer branch
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require("../../assets/picitLoader.json")}
                    animationStyle={{ width: 100, height: 100 }}
                    speed={1}
                ></AnimatedLoader>
                <View style={{ width: '85%', alignSelf: 'center', top: 50 }}>
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{'בואו נתחבר'}</Text>
                    <VerticalSpace height={0.02} />
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`כדי להמשיך מאיפה שהפסקנו, תזכירו לנו${'\n'}מייל וסיסמה…`}</Text>
                    <VerticalSpace height={0.03} />
                    <View style={[styles.SectionStyle, { borderColor: emailFocused ? colors.secondary : clickSign && email.length == 0 ? 'red' : colors.textInputBorder }]}>
                        <TextInput
                            placeholderTextColor={colors.black}
                            style={{ fontSize: 15, fontFamily: 'Arimo-Regular', paddingRight: 10, width: width, color: colors.black }}
                            textAlign={'right'}
                            keyboardType={'email-address'}
                            placeholder={'כתובת מייל'}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            value={email}
                            onChangeText={txt => setEmail(txt)}
                        />
                        <Image style={{ marginRight: 10, width: 25, height: 25 }} source={require('../../assets/images/iconsMessage.png')} />
                    </View>
                    <VerticalSpace height={0.04} />
                    <View style={[styles.SectionStyle, { borderColor: passFocused ? colors.secondary : clickSign && password.length == 0 ? 'red' : colors.textInputBorder }]}>
                        <TextInput
                            placeholderTextColor={colors.black}
                            style={{ fontSize: 15, fontFamily: 'Arimo-Regular', paddingRight: 10, width: width, color: colors.black }}
                            textAlign={'right'}
                            placeholder={'סיסמא'}
                            onFocus={() => setPassFocused(true)}
                            onBlur={() => setPassFocused(false)}
                            value={password}
                            secureTextEntry={true}
                            onChangeText={txt => setPassword(txt)}
                        />
                        <Image style={{ marginRight: 10 }} source={require('../../assets/images/iconsLock.png')} />
                    </View>
                    <VerticalSpace height={0.02} />
                    <Button text="שכחתי סיסמה" buttonStyles={{ fontSize: 15, marginTop: -10, alignSelf: 'flex-end', fontFamily: 'Arimo-Regular', color: '#4e5bc8' }} onPress={() => { navigation.navigate('ForgotPassword') }} />
                    <VerticalSpace height={0.02} />
                    {message.length > 0 ? <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 13, textAlign: 'center', color: colors.red, }]}>{'* ' + message}</Text> : null}
                    <Button text="התחברות" buttonStyles={buttonStyles} onPress={() => onPressRegister()} />
                    <VerticalSpace height={0.05} />
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 17, color: colors.register }]}>{'להרשמה'}</Text>
                        </TouchableOpacity>
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{'עוד לא הכרנו? '}</Text>
                    </View>
                </View>
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
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.textInputBorder,
        height: 56,
        borderRadius: 6,
        color: colors.black,
    },
    cardText: {
        textAlign: 'right'
    },
});
