import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, Image } from 'react-native';
import Contacts from 'react-native-contacts';
import { colors } from '../../colors'
import Button from '../../utilities/button'
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux'
import { setPopupContactsPermission, setContacts } from '../../redux'
import { PermissionsAndroid } from 'react-native';
import { VerticalSpace } from '../../utilities/verticalSpace'
import { openSettings } from 'react-native-permissions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function ContactsPermission(props) {
    const dispatch = useDispatch()
    const { popupContactsPermission } = props

    const buttonStyles = {
        backgroundColor: colors.register,
        color: colors.white,
        height: 65,
        width: width * 0.88,
        borderRadius: 26,
        justifyContent: 'center',
        top: 20,
        fontFamily: 'Arimo-Bold',
        fontSize: 17
    }

    async function CheckContactsPermission() {
        Contacts.checkPermission().then(permission => {
            console.log("permission ---<", permission);
        })
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Contacts',
                    message: ' This app would like to see your contacts'
                })
            console.log(granted);
            if (granted === 'never_ask_again') {
                openSettings()
            }
            else if (granted != 'denied') {
                Contacts.getAll()
                    .then((contacts) => {
                        dispatch(setContacts(contacts))
                        dispatch(setPopupContactsPermission(false))
                    })
                    .catch((e) => { console.log(e); })
            }

            else { console.log("Denied"); }

        }

        else if (Platform.OS === 'ios') {
            Contacts.getAll()
                .then((contacts) => {
                    dispatch(setContacts(contacts))
                    dispatch(setPopupContactsPermission(false))
                })
                .catch((e) => { console.log(e); })
        }
    }

    return (
        <View>
            <Modal animationOutTiming={500} animationInTiming={500} isVisible={popupContactsPermission}>
                <View style={styles.modal}>
                    <View style={styles.container}>
                        <Image source={require('../../../assets/images/iconsFolderContact2.png')} />
                        <VerticalSpace height={0.03} />
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 20 }]}>{'הזמנת שותפים לאלבום'}</Text>
                        <VerticalSpace height={0.03} />
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`כדי להזמין שותפים ליצירת האלבום${'\n'}האישי, עלינו לקבל גישה לאנשי הקשר`}</Text>
                        <Button text="אישור גישה לאנשי קשר" buttonStyles={buttonStyles} onPress={() => CheckContactsPermission()} />
                        <TouchableOpacity style={{ top: 50 }} onPress={() => { props.onClickNotPermission(); dispatch(setPopupContactsPermission(false)) }}>
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 17 }]}>{'לא מאושר, אולי אחר כך'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
        backgroundColor: 'rgb(219,215,215)',
    },
    cardText: {
        textAlign: 'center'
    },
    modal: {
        width: '100%',
    },
});
