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

const PopupAlbumCreated = (props) => {
    const dispatch = useDispatch()
    const { albumName, navigation, pictures, allSharedPictures, 
        chosenPic, setAlbumName, setSharedTo, photoFromGallery, deletePhoto, savedPhoto } = props
    const { popupNewAlbumCreated } = useSelector(state => state.user)

    console.log("saved photo ---->", savedPhoto, chosenPic);

    const buttonStyles = {
        fontFamily: 'Arimo-Bold',
        backgroundColor: colors.nextButton,
        color: colors.black,
        height: 64,
        width: 265,
        borderRadius: 26,
        justifyContent: 'center',
        alignSelf: 'center',
        top: 20,
        fontSize: 17,
    }

    function onButtonPress() {
        console.log(chosenPic)
        if (deletePhoto != null && savedPhoto)
            deletePhoto()
        if (!photoFromGallery) {
            if (pictures.length > 0) {
                navigation.navigate("ChooseImages",
                    {
                        pictures, chosenPictureStartScreen: '1',chosenPics:chosenPic
                    })
            } else {
                navigation.navigate('Camera')
            }
        } else {
            console.log("More Shared --->", allSharedPictures);
            if (allSharedPictures.length > 0)
                navigation.navigate("ChooseImages",
                    {
                        pictures, chosenPictureStartScreen: '2',
                    })
            else navigation.navigate('Camera')
        }

        dispatch(setPopupNewAlbumCreated(false));

        setAlbumName('')
        setSharedTo('')
        setAlbumName('')
    }

    return <View style={{ flex: 1, justifyContent: 'center' }}>

        <Modal animationOutTiming={500} animationInTiming={500} isVisible={popupNewAlbumCreated}>
            <BlurView
                style={styles.blurView}
                blurType="light" // Values = dark, light, xlight .
                blurAmount={10}
                reducedTransparencyFallbackColor="black"
            />

            <View style={styles.background}>
                <View style={{ top: 20 }}>
                    <Text style={[styles.cardText, { fontSize: 20, fontFamily: 'Arimo-Bold' }]}>{'נוצר אלבום חדש'}</Text>
                    <VerticalSpace height={0.02} />
                    <Text style={[styles.cardText]}>{'האלבום' + ' ' + albumName + ' ' + 'נוצר בהצלחה'}</Text>
                    <Button text="קדימה" buttonStyles={buttonStyles} onPress={() => { onButtonPress() }} />
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
        width: '100%',
        height: 229,
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

export default PopupAlbumCreated