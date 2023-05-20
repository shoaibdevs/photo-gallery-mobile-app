import React, { useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { colors } from '../../colors'
import { markNotificationAsRead, getMessagesApi } from '../../api'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { setPushMessages, setPushAlert } from '../../redux'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const DisplayMessage = ({ navigation }) => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    let item = navigation.state.params.item
    let date = navigation.state.params.date

    useEffect(() => {
        console.log("markAsRead --->");
        const formData = new FormData()
        formData.append('token', user.token)
        formData.append('notification_id', item.id)
        markNotificationAsRead(formData).then(response => {
            getMessagesApi(user.token).then(res => {
                dispatch(setPushMessages(res.notifications))
                dispatch(setPushAlert(false))
            })
            console.log("res -->", response);
        })
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(248,248,247)', height: height }}>
            <Image source={require('../../../assets/images/coverBackgroundsiMgBackgroundCover5.png')} style={styles.image} />
            <View style={{ width: '95%', alignSelf: 'center' }}>
                <View style={styles.header}>
                    <View style={{ width: '33%' }}></View>
                    <View style={{ width: '33%' }}><Text style={styles.date}>{date}</Text></View>
                    <View style={{ width: '33%', alignItems: 'flex-end', marginRight: 15 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack(); navigation.state.params.setRefreshPage(); navigation.navigate('Messages') }}>
                            <Image source={require('../../../assets/images/gobackbutton.png')} style={{ height: 40, width: 40 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.textBlock}>
                    <View>
                        <Text style={styles.title}>{item.notification_data.title != undefined ? item.notification_data.title : item.message}</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>{'כדי לראות תמונות מאלבומים משותפים, יש לאשר גישה לאנשי הקשר'}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        marginTop: isIphoneX() ? 50 : 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    image: {
        height: height,
        width: width,
        position: 'absolute',
        top: 0,
        left: 0
    },
    textBlock: {
        padding: 20
    },
    date: {
        textAlign: 'center',
        fontSize: 17,
        letterSpacing: -0.41,
        fontFamily: 'Arimo-Regular',
        color: colors.primary
    },
    title: {
        textAlign: 'right',
        fontSize: 34,
        textTransform: 'uppercase',
        letterSpacing: -0.09,
        color: colors.primary,
        fontFamily: 'Arimo-Bold'
    },
    text: {
        textAlign: 'right',
        fontFamily:'Arimo-Regular',
        fontSize: 17,
        lineHeight: 20,
        color: 'rgb(64,64,64)',
        marginTop: 20,
    }
})

export default DisplayMessage