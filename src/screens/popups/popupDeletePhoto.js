import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../colors'
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux'
import { setPopupDeletePhoto } from '../../redux'
import Button from '../../utilities/button';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function popupDeletePhoto(props) {
    const dispatch = useDispatch()
    const { popupDeletePhoto, deletePicture } = props

    return (
        <Modal propagateSwipe animationOutTiming={500} animationInTiming={500} backdropColor={'black'} isVisible={popupDeletePhoto}>
            <View style={styles.modal}>
                <View style={styles.container}>
                    <View style={styles.subContainer}>
                        <Text style={styles.headerText}>{'הסרת תמונה'}</Text>
                        <Text style={[styles.text, { marginTop: 20 }]}>{'האם להסיר את התמונה מ Pic.it?'}</Text>
                        <Text style={[styles.text, { marginTop: 20 }]}>{'תמונה שתוסר, תמשיך להיות זמינה'}</Text>
                        <Text style={styles.text}>{'במכשיר הטלפון.'}</Text>

                        <Button text={'הסרה מ Pic.it'} textStyle={styles.buttonText} buttonStyles={styles.button} onPress={() => {
                            deletePicture()
                            dispatch(setPopupDeletePhoto(false))
                        }} />

                        <Button text="ביטול" buttonStyles={styles.secondButton} textStyle={styles.secondButtonText}
                            onPress={() => { dispatch(setPopupDeletePhoto(false)) }}
                        />
                    </View>
                </View>
            </View>
        </Modal>


    );

}

const styles = StyleSheet.create({
    container: {
        elevation: 3,
        width: width,
        backgroundColor: 'transparent',
        alignSelf: 'center',
        overflow: 'hidden',
        top: height * 0.026,
        flex: 1,
        justifyContent: 'flex-end'
    },
    subContainer: {
        width: '100%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingBottom: 20,
        paddingTop: 20
    },
    cardText: {
        textAlign: 'right'
    },
    headerText: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Arimo-Bold',
        color: colors.primary,
        marginTop: 10
    },
    modal: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-end',
    },
    text: {
        textAlign: 'center',
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
        color: colors.primary
    },
    button: {
        height: 64,
        width: 325,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 26,
        marginTop: 10,
        fontSize: 17,
        color: colors.errorColor,
        letterSpacing: -0.41,
        backgroundColor: colors.errorLight
    },
    secondButton: {
        height: 30,
        width: 130,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 20,
        fontFamily: 'Arimo-Regular',
        marginBottom: 25
    },
    buttonText: {
        fontFamily: 'Arimo-Bold',
    },
    secondButtonText: {
        fontSize: 17,
        color: colors.gray,
        fontFamily: 'Arimo-Regular'
    }
});
