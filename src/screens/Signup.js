import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, ImageBackground, Image, Keyboard, ScrollView } from 'react-native';
import { colors } from '../colors'
import { VerticalSpace } from '../utilities/verticalSpace'
import Button from '../utilities/button'
import FloatingLabelInput from '../utilities/floatingLabelInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector, useDispatch } from 'react-redux'
import { setPopupError, setPopupTerms, setUser } from '../redux'
import PopupTerms from './popups/PopupTerms'
import { createUser } from '../api'
import {checkNetInfo } from '../helpers/albumHelper';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import AnimatedLoader from "react-native-animated-loader"
import { isIphoneX } from 'react-native-iphone-x-helper';
import PopupError from './popups/popupError';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Signup({ navigation }) {
    const dispatch = useDispatch()
    const { popupTerms, user } = useSelector(state => state.user)
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState('')

    const [age, setAge] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [verifyPassword, setVerifyPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [clickRegister, setClickRegister] = useState(false)

    const [pushToken, setPushToken] = useState()

    const [validValue, setValidValue] = useState({
        fullName: false,
        phoneNumber: false,
        email: false,
        password: false
    })

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'רווק/ה', value: 'רווק/ה' },
        { label: 'נשוי/נשואה', value: 'נשוי/נשואה' },
        { label: 'גרוש/ה', value: 'גרוש/ה' }

    ]);
    const buttonStyles = {
        fontFamily: 'Arimo-Bold',
        backgroundColor: colors.nextButton,
        color: colors.black,
        height: 65,
        width: width * 0.88,
        borderRadius: 26,
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 17
    }

    const nameValidation = () => {
        const regExp = new RegExp(/[^A-Za-z\u0590-\u05FF '-]/i);
        let result = regExp.test(fullName) //should be false as valid
        // let twoWordsMin = (fullName.trim().split(' ').length < 2) //should be false as valid
        if (result) setValidValue({ ...validValue, fullName: true })
        else setValidValue({ ...validValue, fullName: false })
    }

    const numberValidation = () => {
        if (!(phoneNumber.length === 10)) setValidValue({ ...validValue, phoneNumber: true })
        else setValidValue({ ...validValue, phoneNumber: false })
    }

    const emailValidation = () => {
        const regExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        let result = regExp.test(email) // should be true as valid
        if (result) setValidValue({ ...validValue, email: false })
        else setValidValue({ ...validValue, email: true })

    }

    const passwordValidation = () => {
        let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;
        if (reg.test(password) === false) {
            console.log('password invalid')
            setValidValue({ ...validValue, password: true })
        }
        else {
            console.log("password valid");
            setValidValue({ ...validValue, password: false })

        }
        // let result = regExp.test(txt) // should be true as valid
        // console.log("result --->", result);
        // if (result) setValidValue({ ...validValue, password: false })
        // else setValidValue({ ...validValue, password: false })
    }

    const passwordVerifyValidation = () => {
        if (password != verifyPassword) {
            console.log('password invalid')
            setValidValue({ ...validValue, verifyPassword: true })
        }
        else {
            console.log("password valid");
            setValidValue({ ...validValue, verifyPassword: false })
        }
        // let result = regExp.test(txt) // should be true as valid
        // console.log("result --->", result);
        // if (result) setValidValue({ ...validValue, password: false })
        // else setValidValue({ ...validValue, password: false })
    }

    const getPushToken = async () => {
        try {
            const pushToken = await AsyncStorage.getItem('push_token')
            if (pushToken !== null) {
                setPushToken(pushToken)
            }
        } catch (e) {
            console.log('error getItem', e)
        }
    }

    useEffect(() => {
        getPushToken()
    }, [])

    function onPressRegister() {
        passwordVerifyValidation()
        setClickRegister(true)
        if (!Object.values(validValue).every(item => !item)) return;

        setLoading(true) //++ 

        const index = items.findIndex(item => item.value === value)

        const formData = new FormData()
        formData.append('full_name', fullName)
        formData.append('age', age)
        formData.append('marital_status', index + 1)
        formData.append('phone', phoneNumber)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('imei', String(DeviceInfo.getUniqueId()));
        formData.append('push_token', pushToken);
        formData.append('is_android', Platform.OS == 'ios' ? '0' : '1')

        createUser(formData).then(async (data) => {
            console.log(data, 'response sign up');
            setLoading(false)
            if (data !== 0) {
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
                    navigation.navigate('FirstAlbum')
                }
                else if (data.error == 'User already exist') setError('המשתמש קיים במערכת')
            } else {
                const isAnyFieldsEmpty = (fullName != '' && age != '' && phoneNumber != '' && email != '' && password != '')
                if (isAnyFieldsEmpty) {
                    dispatch(setPopupError(true))
                }
            }
        })
    }


    return (
        <View style={styles.container}>
            <ScrollView>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.white, flex: 1 }}>
                    <ImageBackground

                        source={require('../../assets/images/orderBg.png')}
                        style={{ width: width, }}
                        imageStyle={{ width: width, height: 215 }}
                    >
                        <View style={{ right: 20, marginTop: isIphoneX() ? 70 : 50, lexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{ position: 'absolute', right: 0 }}
                            >
                                <Image
                                    source={require('../../assets/images/buttonsNavBarRight.png')}
                                    style={{ height: 40, width: 40 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '85%', alignSelf: 'center', top: 40 }}>
                            <AnimatedLoader //++
                                visible={loading}
                                overlayColor="rgba(255,255,255,0.75)"
                                source={require("../../assets/picitLoader.json")}
                                animationStyle={{ width: 100, height: 100 }}
                                speed={1}
                            ></AnimatedLoader>
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{'חדשים פה?'}</Text>
                            <VerticalSpace height={0.02} />
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{'מלאו את הפרטים הבאים ונשמח להכיר 😀'}</Text>
                            <VerticalSpace height={0.02} />
                            <FloatingLabelInput
                                label="שם מלא"
                                value={fullName}
                                width={width - 60}
                                mandatoryMark={true}
                                onBlur={nameValidation}
                                placeHolderStyle={10}
                                isError={fullName.length == 0 && !validValue.fullName ? clickRegister ? true : false : validValue.fullName}
                                onChangeText={txt => setFullName(txt)}
                            />
                            {/* <FloatingLabelInput
                                label="שם מלא"
                                value={fullName}
                                heightInput={60}
                                screen={'register'}
                                onChangeText={txt => setFullName(txt)}
                                onBlur={nameValidation}
                                error={fullName.length == 0 && !validValue.fullName ? clickRegister ? true : false : validValue.fullName}
                            // style={{borderColor: validValue.fullName ? colors.red : 'rgba(0,0,0,0.1)'}}
                            /> */}
                            <VerticalSpace height={0.02} />

                            <FloatingLabelInput
                                label={"גיל"}
                                value={age}
                                keyboardType={'numeric'}
                                width={width - 60}
                                placeHolderStyle={10}
                                isError={age.length == 0 && !validValue.age ? clickRegister ? true : false : validValue.age}
                                onChangeText={txt => setAge(txt.replace(/[^0-9]/g, ''))}
                            />
                            {/* <FloatingLabelInput
                                label={"גיל"}
                                value={age}
                                keyboardType={'numeric'}
                                heightInput={60}
                                screen={'register'}
                                require={true}
                                onChangeText={txt => setAge(txt.replace(/[^0-9]/g, ''))}
                            /> */}
                            <VerticalSpace height={0.03} />
                            <DropDownPicker
                                open={open}
                                value={value}
                                placeholder={'מצב משפחתי'}
                                items={items}
                                labelStyle={{ fontFamily: 'Arimo-Regular', textAlign: 'right' }}
                                setOpen={setOpen}
                                setValue={setValue}
                                listItemLabelStyle={{ fontFamily: 'Arimo-Regular', textAlign: 'right' }}
                                placeholderStyle={{ fontFamily: 'Arimo-Regular', textAlign: 'right' }}
                                style={styles.drop}
                            />
                            <VerticalSpace height={0.03} />
                            <FloatingLabelInput
                                label={"טלפון"}
                                value={phoneNumber}
                                mandatoryMark={true}
                                keyboardType={'numeric'}
                                width={width - 60}
                                onBlur={numberValidation}
                                placeHolderStyle={10}
                                isError={error.length > 0 ? true : phoneNumber.length == 0 && !validValue.phoneNumber ? clickRegister ? true : false : validValue.phoneNumber}
                                onChangeText={txt => { setPhoneNumber(txt.replace(/[^0-9]/g, '')) }}
                            />
                            {/* <FloatingLabelInput
                                label={"טלפון"}
                                keyboardType={'numeric'}
                                value={phoneNumber}
                                screen={'register'}
                                heightInput={60}
                                onChangeText={txt => { setPhoneNumber(txt.replace(/[^0-9]/g, '')) }}
                                onBlur={numberValidation}
                                error={error.length > 0 ? true : phoneNumber.length == 0 && !validValue.phoneNumber ? clickRegister ? true : false : validValue.phoneNumber}
                            // style={{borderColor: validValue.phoneNumber ? colors.red  : 'rgba(0,0,0,0.1)'}}
                            /> */}
                            <VerticalSpace height={0.02} />
                            <FloatingLabelInput
                                label={"כתובת מייל"}
                                value={email}
                                keyboardType={'email-address'}
                                mandatoryMark={true}
                                width={width - 60}
                                autoCapitalize='none'
                                onBlur={emailValidation}
                                placeHolderStyle={10}
                                isError={email.length == 0 && !validValue.email ? clickRegister ? true : false : validValue.email}
                                onChangeText={txt => setEmail(txt)}
                            />
                            {/* <FloatingLabelInput
                                label={"כתובת מייל"}
                                value={email}
                                screen={'register'}
                                keyboardType={'email-address'}
                                heightInput={60}
                                autoCapitalize='none'
                                onChangeText={txt => setEmail(txt)}
                                onBlur={emailValidation}
                                error={email.length == 0 && !validValue.email ? clickRegister ? true : false : validValue.email}
                            /> */}
                            <VerticalSpace height={0.03} />
                            {validValue.email ? <Text style={{ fontSize: 13, fontFamily: 'Arimo-Regular', color: colors.red, textAlign: 'right' }}>{'נראה שכתובת המייל לא תקינה'}</Text> : null}
                            <FloatingLabelInput
                                label={"סיסמא"}
                                value={password}
                                mandatoryMark={true}
                                secureTextEntry={true}
                                width={width - 60}
                                placeHolderStyle={10}
                                onBlur={passwordValidation}
                                isError={password.length == 0 && !validValue.password ? clickRegister ? true : false : validValue.password}
                                onChangeText={txt => { setPassword(txt) }}
                            />
                            <VerticalSpace height={0.02} />

                            {/* <FloatingLabelInput
                                label={"סיסמא"}
                                value={password}
                                screen={'register'}
                                heightInput={60}
                                onBlur={passwordValidation}
                                onChangeText={txt => { setPassword(txt) }}
                                error={password.length == 0 && !validValue.password ? clickRegister ? true : false : validValue.password}
                            /> */}
                            {validValue.password ? <Text style={{ fontSize: 13, fontFamily: 'Arimo-Regular', color: colors.red, textAlign: 'right' }}>{'הסיסמא חייבת להכיל מינימום 8 תווים באנגלית ומספרים'}</Text> : null}
                            <FloatingLabelInput
                                label={"אימות סיסמא"}
                                value={verifyPassword}
                                mandatoryMark={true}
                                secureTextEntry={true}
                                width={width - 60}
                                placeHolderStyle={10}
                                onBlur={passwordVerifyValidation}
                                isError={password.length == 0 && !validValue.verifyPassword ? clickRegister ? true : false : validValue.verifyPassword}
                                onChangeText={txt => { setVerifyPassword(txt) }}
                            />
                            {/* <FloatingLabelInput
                                label={"אימות סיסמא"}
                                value={verifyPassword}
                                screen={'register'}
                                heightInput={60}
                                onBlur={passwordVerifyValidation}
                                onChangeText={txt => { setVerifyPassword(txt) }}
                                error={password.length == 0 && !validValue.verifyPassword ? clickRegister ? true : false : validValue.verifyPassword}
                            /> */}
                            {validValue.verifyPassword ? <Text style={{ fontSize: 13, fontFamily: 'Arimo-Regular', color: colors.red, textAlign: 'right' }}>{'הסיסמאות אינן זהות'}</Text> : null}
                            {error.length > 0 ? <Text style={{ fontSize: 13, fontFamily: 'Arimo-Regular', color: colors.red, textAlign: 'center' }}>{error}</Text> : null}

                            <VerticalSpace height={0.05} />
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 15 }]}>{'בלחיצה על כפתור ההרשמה אני מסכים'}</Text>
                            <TouchableOpacity onPress={() => dispatch(setPopupTerms(true))}>
                                <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 15, color: colors.register }]}>{'לתנאי השימוש והפרטיות'}</Text>
                            </TouchableOpacity>
                            <VerticalSpace height={0.05} />
                            <Button text="הרשמה" buttonStyles={buttonStyles} onPress={() => onPressRegister()} />
                            <VerticalSpace height={0.05} />
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 17, color: colors.register }]}>{'התחברו עכשיו'}</Text>
                                </TouchableOpacity>
                                <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{'כבר חברים? '}</Text>
                            </View>
                            <VerticalSpace height={0.18} />
                        </View>
                    </ImageBackground>
                </KeyboardAwareScrollView>
                <PopupTerms popupTerms={popupTerms} />
                <PopupError />
            </ScrollView>
        </View>
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
    drop: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        textAlign: 'right',
        paddingRight: 10,
        borderWidth: 1,
        borderColor: colors.textInputBorder,
        height: 56,
        width: width - 60,
        borderRadius: 6,
        color: colors.black,
    }
});
