import React, { useEffect, useState } from 'react'
import { VerticalSpace } from '../src/utilities/verticalSpace'
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Text, TouchableHighlight, Linking, ImageBackground, ScrollView } from 'react-native'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { useSelector, useDispatch } from 'react-redux'
import { colors } from './colors'
import { setCountReadyForOrderAlbums, setPopupError, setPopupLogout, setPushAlert, setPushMessages } from './redux'
import PopupLogout from './screens/popups/popupLogout'
import { getMessagesApi, fetchAlbums } from './api'
import moment from 'moment'
import PopupError2 from './screens/popups/popupError2'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default function DrawerView({ navigation }) {
    const { user, countReadyForOrderAlbums } = useSelector(state => state.user)
    const { pushAlert } = useSelector(state => state.user)
    const [push, setPush] = useState(pushAlert)
    const { pushMessages } = useSelector(state => state.user)
    const today = moment().format("YYYY-MM-DD HH:MM:SS");
    const dispatch = useDispatch()
    const [zal, setZal] = useState(0)
    function onPressLogout() {
        dispatch(setPopupLogout(true))
    }
    useEffect(() => {
        setZal(countReadyForOrderAlbums)
    }, [countReadyForOrderAlbums])
    const [no, setNo] = useState(true)
    let mess = pushMessages?.filter(item => item.read == '0').length
    useEffect(() => {

        fetchAlbums(user.token).then(response => {
            if (response !== 0) {
                setNo(true)
                const countAlbusReadyForOrder = response?.data.filter(album => album.status === '1' && album.isAlbumLocked == '0').length
                dispatch(setCountReadyForOrderAlbums(countAlbusReadyForOrder))
            } else {
                setNo(false)
                dispatch(setCountReadyForOrderAlbums(0))
            }
        }).catch(err => {console.log(err); setNo(false)})
    }, [])
    const [display, setDisplay] = React.useState(false)
    useEffect(() => {
        getMessagesApi(user.token).then(res => {
            dispatch(setPushMessages(res.notifications))
            dispatch(setPushAlert(false))

        })
        // navigation.navigate('MyAlbums'); 
    }, [push])

    function updateDisplay(){
        setDisplay(false)
    }

    return (
        <ScrollView>
            {Object.keys(user).length > 0 ?
                <ImageBackground source={require('../assets/images/menuBackgournd.png')} style={{ height: height }}>
                    <PopupError2 display={display} updateDisplay={updateDisplay} />
                    <DrawerContentScrollView
                        bounces={true}
                        contentContainerStyle={{ height: height }}
                        style={{ height: height }}
                        showsVerticalScrollIndicator={false}>
                        <ScrollView>
                            <VerticalSpace height={0.03} />
                            <Image style={{ alignSelf: 'center' }} source={require('../assets/images/brandingLogoPicitWhite.png')} />
                            <View style={{ width: width * 0.7, alignSelf: 'center' }}>
                                <View style={{}}>
                                    <VerticalSpace height={0.03} />
                                    <TouchableHighlight style={[styles.drawerButton]} underlayColor={colors.register} onPress={() => { navigation.navigate('MyAlbums'); }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', right: 10 }}>
                                            {countReadyForOrderAlbums
                                                ? <View style={[styles.notificationDisplay, { left: 15 }]}>
                                                    <Text style={{ color: 'white' }}>
                                                        {zal}
                                                    </Text></View>
                                                : <View style={{
                                                    left: 15,
                                                    height: 30,
                                                    width: 30
                                                }} />}
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                         {/** My albums */}<Text style={styles.drawerText}>{'האלבומים שלי'}</Text>
                                                <Image source={require('../assets/images/iconsAlbumWhite.png')} />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    <VerticalSpace height={0.03} />
                                    <TouchableHighlight style={styles.drawerButton} underlayColor={colors.register} onPress={() => { 
                                        if(no){
                                            navigation.navigate('Messages', { navigation });
                                        }else{
                                            setDisplay(true)
                                            navigation.closeDrawer()
                                        }
                                        
                                        }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', right: 10 }}>
                                            {mess > 0
                                                ? <View style={[styles.notificationDisplay, { left: 15 }]}>
                                                    <Text style={{ color: 'white' }}>
                                                        {mess}
                                                    </Text></View>
                                                : <View style={{
                                                    left: 15,
                                                    height: 30,
                                                    width: 30
                                                }} />}
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.drawerText}>{'עדכונים והודעות'}</Text>
                                                <Image style={{ width: 30, height: 30 }} source={require('../assets/images/drawerNotificatinsIcon.png')} />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    <VerticalSpace height={0.03} />
                                    <TouchableHighlight style={styles.drawerButton} underlayColor={colors.register} onPress={() => { navigation.navigate('UseGuideInfo', { navigation }) }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', right: 10 }}>
            {/**  so what are we doing? s */}<Text style={styles.drawerText}>{'אז מה עושים?'}</Text>
                                            <Image source={require('../assets/images/iconsHelp.png')} />
                                        </View>
                                    </TouchableHighlight>
                                    <VerticalSpace height={0.03} />
                                    <TouchableHighlight style={styles.drawerButton} underlayColor={colors.register} onPress={() => { 
                                        if(no){
                                            navigation.navigate('ContactUs', navigation)
                                        }else{
                                            setDisplay(true)
                                            navigation.closeDrawer()
                                        }

                                        }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', right: 10 }}>
                                            <Text style={styles.drawerText}>{'דברו איתנו'}</Text>
                                            <Image source={require('../assets/images/iconsContact.png')} />
                                        </View>
                                    </TouchableHighlight>
                                    <VerticalSpace height={0.03} />
                                    <TouchableHighlight style={styles.drawerButton} underlayColor={colors.register} onPress={() => { navigation.navigate('TermsAndPrivacy', { navigation }) }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', right: 10 }}>
                                            <Text style={styles.drawerText}>{'תנאי השימוש והפרטיות'}</Text>
                                            <Image source={require('../assets/images/iconsTerms.png')} />
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <VerticalSpace height={0.03} />
                                <View style={styles.line} />
                                <VerticalSpace height={0.025} />
                                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('CreateAlbum')}>
                                    <Text style={{ color: colors.black, fontSize: 17, fontFamily: 'Arimo-Bold', textAlign: 'center', right: 10 }}>
                                        {'יצירת אלבום חדש'}
                                    </Text>
                                    <Image source={require('../assets/images/iconsCirclePlus.png')} />
                                </TouchableOpacity>
                                <VerticalSpace height={0.025} />
                                <View style={styles.line} />
                                <VerticalSpace height={0.03} />
                                <TouchableHighlight style={styles.drawerButton} underlayColor={colors.buttons} underlayColor={colors.register}/* underlayColor={colors.register} */ onPress={() => { onPressLogout() }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', right: 10 }}>
                                        <Text style={styles.drawerText}>{'התנתקות'}</Text>
                                        <Image source={require('../assets/images/iconsDisconnect.png')} />
                                    </View>
                                </TouchableHighlight>
                                <View>
                                    <PopupLogout navigation={navigation} />
                                </View>
                            </View>
                        </ScrollView>
                    </DrawerContentScrollView >
                </ImageBackground>

                :
                <DrawerContentScrollView>

                </DrawerContentScrollView >}
        </ScrollView>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    logo: {
        height: undefined,
        aspectRatio: 403 / 403,
        width: width * 0.3,
    },
    cardText: {
        textAlign: 'center',
        color: colors.black,
        fontFamily: 'Arimo-Regular'
    },
    registerButton: {
        backgroundColor: colors.nextButton,
        width: width * 0.7,
        borderRadius: 27,
        justifyContent: 'center',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row'
    },
    drawerButton: {
        width: width * 0.75,
        marginLeft: 5,
        left: 10,
        justifyContent: 'center',
        alignSelf: 'flex-end',
        borderRadius: 7,
        height: 56,
    },
    drawerText: {
        right: 10,
        color: colors.white,
        fontFamily: 'Arimo-Regular',
        fontSize: 17,
        textAlign: 'right'
    },
    registerText: {
        color: colors.white,
        textAlign: 'center',
        fontFamily: 'Arimo-Regular',
        fontSize: 15,
    },
    line: {
        alignSelf: 'center',
        borderWidth: 0.5,
        width: width * 0.72,
        borderColor: 'rgba(223,225,240,0.5)',
    },
    notificationDisplay: {
        height: 30,
        width: 30,
        backgroundColor: 'rgba(229,90,90,1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowColor: 'rgba(223,88,88,0.4)',
        shadowOpacity: 20,
        shadowRadius: 20,
    }
});
