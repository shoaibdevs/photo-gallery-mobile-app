import React, { Fragment, useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Message from './Message'
import { setPushMessages, setPushAlert } from '../../redux'
import { getMessagesApi } from '../../api'
import { isIphoneX } from 'react-native-iphone-x-helper'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


const Messages = ({ navigation }) => {
    const { pushMessages, user } = useSelector(state => state.user)
    const [refreshPage, setRefreshPage] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        getMessagesApi(user.token).then(res => {
            dispatch(setPushMessages(res.notifications))
            dispatch(setPushAlert(false))
        })
    }, [refreshPage])

    return (
        <>
            {pushMessages.length == 0
                ? <Fragment>
                    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(248,248,247)', height: height }}>
                        <Image source={require('../../../assets/images/coverBackgroundsiMgBackgroundCover5.png')} style={{ height: height, width: width, position: 'absolute', top: 0, left: 0 }} />
                        <View style={{ width: '95%', alignSelf: 'center' }}>
                            <View style={styles.header}>
                                <View style={{ width: '33%' }}></View>
                                <View style={{ width: '40%' }}><Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'Arimo-Regular' }}>{'עדכונים והודעות'}</Text></View>
                                <View style={{ width: '33%', alignItems: 'flex-end', marginRight: 15 }}>
                                    <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                                        <Image style={{ width: 40, height: 40 }} source={require('../../../assets/images/buttonsNavBarX.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: height * 0.7 }}>
                                <Image source={require('../../../assets/images/iconsMessageBig.png')} style={{ height: 75, width: 75 }} />
                                <Text style={{ fontSize: 17, marginTop: 20, fontFamily: 'Arimo-Bold', textAlign: 'center' }}>{`עדכונים חמים יעלו בקרוב...${'\n'}בינתיים, לכו לתפוס את הרגע`}</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </Fragment>
                : <Fragment>

                    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(248,248,247)', height: height }}>
                        <Image source={require('../../../assets/images/coverBackgroundsiMgBackgroundCover5.png')} style={{ height: height, width: width, position: 'absolute', top: 0, left: 0 }} />
                        <View style={{ width: '95%', alignSelf: 'center' }}>
                            <View style={styles.header}>
                                <View style={{ width: '33%' }}></View>
                                <View style={{ width: '40%' }}><Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'Arimo-Regular' }}>{'עדכונים והודעות'}</Text></View>
                                <View style={{ width: '33%', alignItems: 'flex-end', marginRight: 15 }}>
                                    <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                                        <Image style={{ width: 40, height: 40 }} source={require('../../../assets/images/buttonsNavBarX.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ width: width, height: height, alignSelf: 'center', marginTop: 10 }}>
                                <ScrollView contentContainerStyle={{ width: '100%' }}>
                                    {pushMessages.map((mes) => {
                                        return (
                                            <Message item={mes} key={mes.messageId} navigation={navigation} setRefreshPage={setRefreshPage} />
                                        )
                                    })}
                                </ScrollView>
                                <View style={{height:30}}/>
                            </View>
                        </View>
                    </SafeAreaView>

                </Fragment>
            }
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: isIphoneX() ? 50 : 20,
        justifyContent: 'space-around'
    }
})

export default Messages