import React, { useState } from 'react'
import { SafeAreaView, View, Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback, TouchableOpacity, Linking, Platform, TextInput, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { colors } from '../../colors'
import { contactUsApi } from '../../api'
import PopupConfirm from './PopupConfirm'
import { setPopupConfirm, setPopupError } from '../../redux'
import { Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PopupError from '../popups/popupError'
import AnimatedLoader from 'react-native-animated-loader';

const width = Dimensions.get('window').width

const ContactUs = ({ navigation }) => {
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const popupConfirm = useSelector(state => state.user.popupConfirm)
    const [subject, setSubject] = useState('')
    const [fullName, setFullName] = useState(user['full_name'])
    const [email, setEmail] = useState(user.email)
    const [phone, setPhone] = useState(user.phone)
    const [message, setMessage] = useState('')

    const [subjectFocused, setSubjectFocused] = useState(false)
    const [fullNameFocused, setFullNameFocused] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)
    const [phoneFocused, setPhoneFocused] = useState(false)
    const [messageFocused, setMessageFocused] = useState(false)
    const [loading, setLoading] = useState(false)

    const [validValue, setValidValue] = useState({
        subject: false,
        email: false,
        message: false
    })

    const checkSubject = () => {
        if (subject === '') setValidValue({ ...validValue, subject: true })
        else setValidValue({ ...validValue, subject: false })
    }
    const checkEmail = () => {
        if (email === '') setValidValue({ ...validValue, email: true })
        else setValidValue({ ...validValue, email: false })
    }
    const checkMessage = () => {
        if (message === '') setValidValue({ ...validValue, message: true })
        else setValidValue({ ...validValue, message: false })
    }


    const sendMessage = () => {
        if (email === '') {
            setValidValue({ ...validValue, email: true });
            return;
        } else if (subject === '') {
            setValidValue({ ...validValue, subject: true });
            return;
        } else if (message === '') {
            setValidValue({ ...validValue, message: true });
            return;
        }

        const formData = new FormData();
        formData.append('token', user.token)
        formData.append('name', fullName)
        formData.append('subject', subject)
        formData.append('phone', phone)
        formData.append('email', email)
        formData.append('message', message)
        setLoading(true)

        contactUsApi(formData).then(res => {
            console.log(res, 'resresresres');
            if (res === true) {
                setLoading(false)
                dispatch(setPopupConfirm(true))
                setSubject('')
                setMessage('')
            } else if (res == 0) {
                dispatch(setPopupError(true))
            }
        })
    }

    const callUs = (type) => {
        const getSMSDivider = () => {
            return Platform.OS === "ios" ? "&" : "?";
        }
        switch (type) {
            case 'call':
                Linking.openURL(`tel:0548385571`)
                break;
            case 'sms':
                Linking.openURL(`whatsapp://send?phone=972548385571`);
                break;
            case 'email':
                Linking.openURL(`mailto:pic.it.service@gmail.com`)
                break;
            default:
                console.log('default case');
        }
    }

    return (
        <TouchableWithoutFeedback style={{ height: '100%', }} onPress={() => { Keyboard.dismiss(); console.log('clicked'); }}>
            <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
                <AnimatedLoader
                    visible={loading} // was false on developer branch
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require("../../../assets/picitLoader.json")}
                    animationStyle={{ width: 100, height: 100 }}
                    speed={1}
                ></AnimatedLoader>
                <View style={{ backgroundColor: 'white' }}>
                    <SafeAreaView style={styles.saveArea}>
                        <View style={styles.background}>
                            <Image source={require('../../../assets/images/coverBackgroundsiMgBackgroundCover4.png')} style={styles.bgImage} />
                            <View style={styles.header}>
                                <View style={styles.positioning}></View>
                                <View style={styles.positioning}>
                                    <Image source={require('../../../assets/images/brandingLogoPicitHorizontalWhitte.png')} style={styles.logo} />
                                </View>
                                <TouchableOpacity style={styles.closeButton} onPress={() => { navigation.goBack(); navigation.openDrawer() }}>
                                    <Image source={require('../../../assets/images/buttonsNavBarButtonsCircleButtonWhiteAlpha.png')}
                                        style={styles.closeImage} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.headerText}>
                                <Text style={styles.text}>{'לשירותכם ובשבילכם '}</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                    <ScrollView>
                        <View style={styles.background}>
                            <View style={[styles.container, { backgroundColor: 'rgb(78,91,200)' }]}>
                                <View style={styles.block}>
                                    <View style={styles.borderBottom}>
                                        <TouchableOpacity onPress={() => { callUs('sms') }}>
                                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                                <Text style={styles.contact}>054-8385571</Text>
                                                <Text style={styles.contactDef}>{'בווטסאפ - '}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={styles.def}>{'(בין השעות 10:00-17:10)'}</Text>
                                    </View>
                                    <View><Image source={require('../../../assets/images/iconsWhatsAppSquare.png')} style={styles.icons} /></View>
                                </View>
                                <View style={styles.block}>
                                    <View style={styles.borderBottom}>
                                        <TouchableOpacity onPress={() => { callUs('call') }}>
                                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                                <Text style={styles.contact}>054-8385571</Text>
                                                <Text style={styles.contactDef}>{'בטלפון - '}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={styles.def}>{'(בימי א-ה)'}</Text>
                                    </View>
                                    <View><Image source={require('../../../assets/images/iconsPhoneSquare.png')} style={styles.icons} /></View>
                                </View>
                                <View style={styles.block}>
                                    <View>
                                        <TouchableOpacity onPress={() => { callUs('email') }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.contact}>pic.it.service@gmail.com </Text>
                                                <Text style={styles.contactDef}>{'במייל -'}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={styles.def}>{'(מתי שבא לכם)'}</Text>
                                    </View>
                                    <View><Image source={require('../../../assets/images/iconsEmailSquare.png')} style={styles.icons} /></View>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.container, { backgroundColor: 'white', alignSelf: 'center', width: width }]}>
                            <View>
                                <Text style={styles.secondHeaderText}>{'דברו איתנו'}</Text>
                            </View>
                            <View style={{ marginTop: 30 }}>
                                <TextInput placeholder={'נושא הפנייה'}
                                    value={subject}
                                    onChangeText={(txt) => { setSubject(txt); checkSubject() }}
                                    onBlur={() => { checkSubject(); setSubjectFocused(false) }}
                                    onFocus={() => setSubjectFocused(true)}
                                    style={[styles.textInputStyle, { borderColor: subjectFocused ? colors.secondary : validValue.subject ? 'red' : 'rgba(0,0,0,0.1)' }]}
                                    textAlign={'right'}
                                    placeholderTextColor={colors.primary}
                                    fontSize={17} />
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <TextInput placeholder={'שם מלא'}
                                    value={fullName}
                                    onChangeText={(txt) => { setFullName(txt) }}
                                    style={[styles.textInputStyle, { borderColor: fullNameFocused ? colors.secondary : 'rgba(0,0,0,0.1)' }]}
                                    onBlur={() => setFullNameFocused(false)}
                                    onFocus={() => setFullNameFocused(true)}
                                    textAlign={'right'}
                                    placeholderTextColor={colors.primary}
                                    fontSize={17} />
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <TextInput placeholder={'מספר טלפון'}
                                    value={phone}
                                    onChangeText={(txt) => { setPhone(txt) }}
                                    style={[styles.textInputStyle, { borderColor: phoneFocused ? colors.secondary : 'rgba(0,0,0,0.1)' }]}
                                    textAlign={'right'}
                                    onBlur={() => setPhoneFocused(false)}
                                    onFocus={() => setPhoneFocused(true)}
                                    placeholderTextColor={colors.primary}
                                    fontSize={17} />
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <TextInput placeholder={'כתובת מייל'}
                                    value={email}
                                    onChangeText={(txt) => { setEmail(txt); checkEmail() }}
                                    onBlur={() => { checkEmail(); setEmailFocused(false) }}
                                    onFocus={() => setEmailFocused(true)}

                                    style={[styles.textInputStyle, { borderColor: emailFocused ? colors.secondary : validValue.email ? 'red' : 'rgba(0,0,0,0.1)' }]}
                                    textAlign={'right'}
                                    placeholderTextColor={colors.primary}
                                    fontSize={17} />
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <TextInput placeholder={'תוכן ההודעה'}
                                    value={message}
                                    onChangeText={(message) => { setMessage(message); checkMessage(); }}
                                    onBlur={() => { checkMessage(); setMessageFocused(false) }}
                                    onFocus={() => setMessageFocused(true)}
                                    style={[styles.textInputStyle, { height: 130, paddingTop: 15 }, { borderColor: messageFocused ? colors.secondary : validValue.message ? 'red' : 'rgba(0,0,0,0.1)' }]}
                                    textAlign={'right'}
                                    placeholderTextColor={colors.primary}
                                    fontSize={17}
                                    textAlignVertical={'top'}
                                    multiline={true}
                                    numberOfLines={4}
                                    onEndEditing={() => { Keyboard.dismiss() }} />
                            </View>
                        </View>
                        <View style={{ height: 120, backgroundColor: 'white', top: 4 }}>
                            <TouchableOpacity style={styles.button} onPress={() => { sendMessage() }}>
                                <Text style={{ fontSize: 17, fontFamily: 'Arimo-Bold' }}>{'שליחת טופס'}</Text>
                                <Image source={require('../../../assets/images/iconsCircleCheck.png')} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <PopupConfirm navigation={navigation} />
                </View>
                <PopupError />
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    saveArea: {
        paddingTop: 25,
        backgroundColor: 'rgb(78,91,200)',
    },
    background: {
        width: width,
    },
    bgImage: {
        width: width,
        height: 406,
        position: 'absolute',
        top: 0,
        left: 0
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    logo: {
        height: 30,
        width: 72,
    },
    closeButton: {
        width: '33%',
        alignItems: 'flex-end',
        right: 15
    },
    closeImage: {
        height: 40,
        width: 40
    },
    positioning: {
        width: '33%',
        alignItems: 'center'
    },
    headerText: {
        alignSelf: 'flex-end'
    },
    text: {
        color: colors.white,
        fontSize: 28,
        marginTop: 20,
        marginRight: 30,
        fontFamily: 'Arimo-Regular'
    },
    container: {
        paddingLeft: 30,
        paddingRight: 30,
        alignItems: 'flex-end',
        paddingTop: 25,
    },
    block: {
        flexDirection: 'row',
        height: 80,
        width: 255,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    icons: {
        height: 50,
        width: 50,
        marginLeft: 10
    },
    contact: {
        color: colors.white,
        textDecorationLine: 'underline',
        fontFamily: 'Arimo-Regular',
        fontSize: 17,
    },
    contactDef: {
        fontFamily: 'Arimo-Regular',
        color: colors.white,
        fontSize: 17,
    },
    def: {
        fontFamily: 'Arimo-Regular',
        color: 'rgba(255,255,255,.5)',
        alignSelf: 'flex-end',
        fontSize: 15,
    },
    borderBottom: {
        height: 80,
        width: 255,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,.2)',
        justifyContent: 'center'
    },
    secondHeaderText: {
        fontSize: 28,
        color: colors.primary,
        fontWeight: 'bold'
    },
    textInputStyle: {
        height: 56,
        width: 315,
        borderWidth: 1,
        fontFamily: 'Arimo-Regular',
        borderColor: 'rgba(128,129,145,0.2)',
        borderRadius: 6,
        padding: 10,
        fontSize: 15,
    },
    underText: {
        textAlign: 'right',
        color: 'rgba(134,128,145,0.5)',
        letterSpacing: -.08,
        marginRight: 10,
        fontSize: 13,
    },
    button: {
        height: 64,
        width: 315,
        backgroundColor: 'rgb(255,232,150)',
        borderRadius: 26,
        alignSelf: 'center',
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }

})

export default ContactUs