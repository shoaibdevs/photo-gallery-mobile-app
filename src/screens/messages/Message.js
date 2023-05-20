import React, { Fragment } from 'react'
import { View, Text, StyleSheet, Image, Dimensions, TouchableHighlight } from 'react-native'
import { colors } from '../../colors'


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


const Message = ({ item, navigation, setRefreshPage, key }) => {

    let year = item['date_time'].split(' ')[0].split('-')[0]
    let month = item['date_time'].split(' ')[0].split('-')[1]
    let day = item['date_time'].split(' ')[0].split('-')[2]
    let date = `${day}.${month}.${year}`
    console.log("item ----->", item);
    return (
        <>
            <View key={key} style={styles.container}>
                <TouchableHighlight style={styles.pressed} underlayColor={colors.hover} onPress={() => {
                    navigation.navigate('DisplayMessage', { item, date, setRefreshPage })
                }}>
                    <View style={styles.messageBlock}>
                        <View><Image source={require('../../../assets/images/iconsLeft.png')} style={{ height: 24, width: 24 }} /></View>
                        <View style={styles.right}>
                            <View style={styles.text}>
                                <Text numberOfLines={1} style={[styles.title, { fontWeight: item.read === '1' ? 'normal' : 'bold', color: item.read === '1' ? 'black' : colors.secondary }]}>
                                    {item.notification_data.title != undefined ? item.notification_data.title.length < 20
                                        ? `${item.notification_data.title}`
                                        : `${item.notification_data.title.substring(0, 20)}...` :
                                        item.message.length < 20
                                        ? `${ item.message}`
                                        : `${ item.message.substring(0, 20)}...`
                                        }
                                </Text>
                                <Text style={styles.date}>{date}</Text>
                            </View>
                            <Image source={item.read === '0' ? require('../../../assets/images/iconsMessageUnread.png') : require('../../../assets/images/iconsMessage.png')} style={{ height: 35, width: 35 }} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 78,
    },
    pressed: {
        height: 78,
        width: '100%',
        borderRadius: 15,
    },
    messageBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 78,
        paddingLeft: 20,
        paddingRight: 20,
        // borderWidth: 1,
    },
    right: {
        flexDirection: 'row',

    },
    text: {
        alignItems: 'flex-end',
        marginRight: 10,
        width: '80%'
    },
    title: {
        fontSize: 17,
        textAlign: 'right',
        // fontWeight: '700',
        fontFamily: 'Arimo-Regular'
    },
    date: {
        fontSize: 13,
        color: colors.gray2,
        // fontWeight: '700',
        letterSpacing: -0.08,
        fontFamily: 'Arimo-Bold'
    }
})

export default Message