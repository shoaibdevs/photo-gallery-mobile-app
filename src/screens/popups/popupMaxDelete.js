import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { VerticalSpace } from '../../utilities/verticalSpace'
import { useSelector, useDispatch } from 'react-redux'
import { colors } from '../../colors'
import Button from '../../utilities/button'
import { setPopupNewAlbumCreated } from '../../redux'
import { BlurView } from "@react-native-community/blur";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PopupMaxDelete = (props) => {
    const { maxDelete } = props


    const buttonStyles = {
        fontFamily: 'Arimo-Bold',
        backgroundColor: colors.nextButton,
        color: colors.black,
        height: 50,
        width: 200,
        borderRadius: 26,
        justifyContent: 'center',
        alignSelf: 'center',
        top: 20,
        fontSize: 17,
    }


    return <View style={{ flex: 1, justifyContent: 'center' }}>

        <Modal animationOutTiming={500} animationInTiming={500} isVisible={maxDelete}>
            <BlurView
                style={styles.blurView}
                blurType="light" // Values = dark, light, xlight .
                blurAmount={10}
                reducedTransparencyFallbackColor="black"
            />

            <View style={styles.background}>
                <View style={{ top: 20 }}>
                    <Text style={[styles.cardText, { fontSize: 20, fontFamily: 'Arimo-Bold' }]}>{'הרגעים החשובים כבר בפנים!'}</Text>
                    <View style={{ marginTop: 10 }} />
                    <Text style={[styles.cardText, { fontSize: 17, fontFamily: 'Arimo-Regular' }]}>{'הגעתם לכמות התמונות המינימלית לאלבום, אז אל תפספסו אפילו רגע נוסף - הזמינו עכשיו!'}</Text>

                    <Button text="אישור" buttonStyles={buttonStyles} onPress={() => { props.setMaxDelete(false) }} />
                </View>
            </View>
        </Modal>

    </View >
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12
    },

    blurView: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: 'rgba(159,156,165,0.3)',
        flex: 1,
        width: width,
        height: height
    },
    background: {
        elevation: 3,
        borderRadius: 50,
        width: '80%',
        height: 220,
        backgroundColor: colors.white,
        alignSelf: 'center',
        alignItems: 'center',
        padding: 15
    },
    cardText: {
        textAlign: 'center',
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
    },
    modal: {
        width: '100%',
        top: 20,
        justifyContent: 'center',
        flex: 1,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
})

export default PopupMaxDelete