import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Dimensions, FlatList } from 'react-native'
import Swiper from '../../utilities/swiper'
import FirstSetting from './FirstSetting'
import ShareContacts from './ShareContacts'
import UseGuide from './UseGuide'
import { colors } from '../../colors'
import moment from 'moment'

const width = Dimensions.get('window').width;

export default function FirstAlbum({ navigation }) {
    const [albumName, setAlbumName] = useState('')
    const [shared, setShared] = useState('')
    const [createdDate, setCreadtedDate] = useState(moment().format('DD-MM-YYYY'))
    const [deadLine, setDeadLine] = useState(moment().add(1, 'months').format('DD-MM-YYYY'))

    return (
        <Swiper navigation={navigation} screen={'firstAlbum'}>
            <FirstSetting setAlbumName={setAlbumName} albumName={albumName} />
            <ShareContacts setShared={setShared} shared={shared} />
            <UseGuide navigation={navigation} shared={shared} albumName={albumName} createdDate={createdDate} deadLine={deadLine} />
        </Swiper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    cardText: {
        textAlign: 'right'
    },
    line: {
        borderWidth: 0.5,
        borderColor: colors.textInputBorder,
    },
});
