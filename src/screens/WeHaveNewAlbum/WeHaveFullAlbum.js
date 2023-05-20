import React, { useEffect, useState } from "react"
import { View, Text, Image, Dimensions, StyleSheet, ScrollView, BackHandler } from 'react-native'
import { colors } from "../../colors"
import Button from "../../utilities/button"
import { getAlbumById } from "../../api"
import { useDispatch, useSelector } from "react-redux"
import { setPopupNewAlbum ,setPopupWarningFullAlbum} from "../../redux"
import PopupNewAlbum from "./popupNewAlbum"
import PopupWarningFullAlbum from "../popups/popupWarningFullAlbum"

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const WeHaveFullAlbum = ({ navigation }) => {
    const dispatch = useDispatch()
    const [currentAlbum, setCurrentAlbum] = useState()
    const { user, popupWarningFullAlbum } = useSelector(state => state.user)
    let item = navigation.state.params.item

    useEffect(() => {
        getAlbum()
    }, [])

    const getAlbum = () => {
        getAlbumById(user.token, item.id).then(res => {
            setCurrentAlbum(res.data)
        })
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    return (
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
                    <Button buttonStyles={styles.button} text={'תצוגה מקדימה והזמנת אלבום'} onPress={() => { navigation.navigate('PreviewAlbum', { currentAlbum }) }} />
                    <Button text="חזרה למצלמה" buttonStyles={styles.buttonCamera} onPress={() => {
                        dispatch(setPopupWarningFullAlbum(true))
                        // navigation.navigate('Camera')
                    }} />
                </View>
            </View>
            <PopupNewAlbum navigation={navigation} />
            <PopupWarningFullAlbum popupWarningFullAlbum={popupWarningFullAlbum} navigation={navigation} currentAlbum={currentAlbum} />
        </ScrollView>
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
        textAlign: 'center',
        fontSize: 17,
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
        marginTop: 30,
    },
    buttonCamera: {
 
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 26,
        marginTop: 10,
        fontSize: 17,
        color: colors.errorColor,
        fontFamily: 'Arimo-Regular',
    },
    secondButton: {
        backgroundColor: 'transparent',
        height: 64,
        width: 325,
        color: colors.gray,
        fontFamily: 'Arimo-Regular',
        justifyContent: 'center',
        borderRadius: 26,
        marginTop: 10,
        borderColor: 'rgba(131,128,145,0.2)',
        borderWidth: 1,
    },
    thirdButton: {
        backgroundColor: 'transparent',
        color: colors.red,
        fontFamily: 'Arimo-Regular',
        justifyContent: 'center',
        marginTop: 20,
    }
})

export default WeHaveFullAlbum;