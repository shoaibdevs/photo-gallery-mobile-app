import React, { useEffect, useState } from "react"
import { View, Text, Image, Dimensions, StyleSheet, ScrollView, BackHandler } from 'react-native'
import { colors } from "../../colors"
import Button from "../../utilities/button"
import { getAlbumById, sendAlbumReminder } from "../../api"
import { useDispatch, useSelector } from "react-redux"
import { setPopupNewAlbum } from "../../redux"
import PopupNewAlbum from "./popupNewAlbum"

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const WeHaveNewAlbum = ({ navigation }) => {
    const dispatch = useDispatch()
    const [currentAlbum, setCurrentAlbum] = useState()
    const { user } = useSelector(state => state.user)
    let item = navigation.state.params.item
    useEffect(() => {
        getAlbum()
    }, [])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    const getAlbum = () => {
        getAlbumById(user.token, item.id).then(res => {
            setCurrentAlbum(res.data)
        })
    }

    function sendReminder(item)  {
        console.log("here");
        const formData =  new FormData()
        formData.append('token', user.token)
        formData.append('album_id', item.id)
        formData.append('remind', '1')
        sendAlbumReminder(formData).then(res => {
            console.log(res);
        })
        dispatch(setPopupNewAlbum(true))
    }

    return (
        <View>
            <ScrollView contentContainerStyle={{ height: height }}>
                <View>
                    <Image source={require('../../../assets/images/componentsDialogAlertBoxsCoverPhotosImgDialogCoverAlbumfull2.png')} style={{ height: height * 0.45, width: width }} />
                </View>
                <View style={styles.contatiner}>
                    <Text style={styles.title}>{'יש לנו אלבום!'}</Text>
                    <View style={{ paddingTop: 19 }}>
                        <Text style={styles.secondTitle}>{'האלבום'} {`"${item["albume_name"]}"`}</Text>
                        <Text style={styles.secondTitle}>{'מלא ומוכן להפקה'}</Text>
                    </View>
                    <View>
                        <Button text={'תצוגה מקדימה והזמנת אלבום'} buttonStyles={styles.button} onPress={() => { navigation.navigate('PreviewAlbum', { currentAlbum }) }} />
                        <Button text={'הגדלת מספר התמונות באלבום'} buttonStyles={styles.secondButton} onPress={() => { navigation.replace('EnlargeAlbumCapacity', { currentAlbum: item, photoFromGallery: navigation.state.params?.photoFromGallery, addToAlbum: navigation.state.params?.addToAlbum }) }} />
                        {item.remind == "0" && <Button text={'הזכירו לי מאוחר יותר'} buttonStyles={styles.thirdButton} onPress={() => { sendReminder(item); }} />}
                    </View>
                </View>
            </ScrollView>
            <PopupNewAlbum navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    contatiner: {
        alignItems: 'center',
        paddingTop: 30,
    },
    title: {
        color: colors.primary,
        fontSize: 20,
        fontFamily: 'Arimo-Bold',
    },
    secondTitle: {
        fontSize: 17,
        textAlign: 'center',
        fontFamily: 'Arimo-Regular',
    },
    button: {
        backgroundColor: colors.secondary,
        height: 64,
        width: 325,
        fontFamily: 'Arimo-Regular',
        color: colors.white,
        justifyContent: 'center',
        borderRadius: 26,
        marginTop: 25,
    },
    secondButton: {
        backgroundColor: 'transparent',
        height: 64,
        width: 325,
        fontFamily: 'Arimo-Regular',
        color: colors.gray,
        justifyContent: 'center',
        borderRadius: 26,
        marginTop: 10,
        borderColor: 'rgba(131,128,145,0.2)',
        borderWidth: 1,
    },
    thirdButton: {
        backgroundColor: 'transparent',
        color: colors.gray,
        fontFamily: 'Arimo-Regular',
        justifyContent: 'center',
        marginTop: 20,
    }
})

export default WeHaveNewAlbum;