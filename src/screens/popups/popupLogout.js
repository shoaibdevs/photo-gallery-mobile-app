import React from "react"
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import { useDispatch, useSelector } from "react-redux"
import Button from "../../utilities/button"
import { colors } from "../../colors"
import { clearRedux, setPopupLogout } from '../../redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackActions, NavigationActions } from 'react-navigation'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const PopupLogout = ({ navigation }) => {
    const resetAction = StackActions.reset({
        index: 0, // <-- currect active route from actions array
        actions: [
            NavigationActions.navigate({ routeName: 'LoginStack' }),
        ],
    });
    const { popupLogout } = useSelector(state => state.user)
    const dispatch = useDispatch()
    return (
        <Modal animationOutTiming={300} animationInTiming={300} backdropColor={'rgba(159,156,165,0.4)'} style={{ height: height }} isVisible={popupLogout}>
            <View style={styles.absolute}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.container}>
                        <Text style={styles.headerTitle}>{'התנתקות'}</Text>
                        <Text style={styles.headerText}>{'חבל 🙄 בטוחים שאתם רוצים להתנתק?'}</Text>
                        <Button text="התנתקות" buttonStyles={styles.button} onPress={async () => {
                            dispatch(clearRedux())
                            AsyncStorage.removeItem('albumData');
                            // AsyncStorage.removeItem('contacts');

                            AsyncStorage.getAllKeys()
                            .then(keys => {
                                const filteredKeys = keys.filter(key => key !== "contacts");
                                return AsyncStorage.multiRemove(filteredKeys);
                            })
                            .then(() => {
                                console.log("All keys except 'contact' have been deleted");
                                AsyncStorage.setItem('walkedThrough', 'yes')
                                AsyncStorage.setItem('sawInfo', 'yes')
                                navigation.navigate('SplashScreen')
                            });
                        }} />
                        <Button
                            text="ביטול"
                            buttonStyles={{
                                fontFamily: 'Arimo-Regular',
                                height: 30,
                                width: 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 10,
                                fontSize: 17,
                                color:
                                    colors.gray
                            }}
                            onPress={() => { dispatch(setPopupLogout(false)) }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: -20,
        left: -20,
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(215,215,215,.3)',
    },
    button: {
        height: 64,
        width: 265,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 26,
        marginTop: 10,
        fontSize: 17,
        color: colors.errorColor,
        fontFamily: 'Arimo-Bold',
        backgroundColor: colors.errorLight
    },
    container: {
        height: 258,
        width: 315,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 50,
        padding: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Arimo-Bold',
        color: colors.primary
    },
    headerText: {
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
        color: colors.primary,
        textAlign: 'center',
        marginTop: 10,
    }
})

export default PopupLogout