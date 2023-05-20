import React, {useEffect} from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { VerticalSpace } from '../../utilities/verticalSpace'
import { useSelector, useDispatch } from 'react-redux'
import { colors } from '../../colors'
import Button from '../../utilities/button'
import {checkNetInfo } from '../../helpers/albumHelper';
import { setPopupBegin } from '../../redux'
import { BlurView } from "@react-native-community/blur";
import { newAlbum, getCounter } from '../../api' //+

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function BeginAlbum(props) {
    const dispatch = useDispatch()
    const { popupBegin, shared, albumName, createdDate, deadLine } = props
    const { user } = useSelector(state => state.user)
    const [data, setData] = React.useState([])

    useEffect(() => {
        if(data.length == 0){
            getCounter().then(res => {
                console.log("Counter res 1 ->", res)
                setData(res)})
        }

    }, [data]);

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

    async function createNewAlbum() {
        let sharedNumbers = '';
        if (shared.length > 0) {

            shared.map(phone => {
                const numberArr = phone.phoneNumbers.reduce((formatedNumbersArr, number) => {
                    let formateNumber = number.number.replace(/[()/+ -]+/g, "")

                    if (formateNumber.length > 12) {
                        formateNumber = formateNumber.slice(formateNumber.length - 12)
                    }

                    formateNumber = formateNumber.split('')

                    if (formateNumber[0] === '9' && formateNumber[1] === '7' && formateNumber[2] === '2') {
                        formateNumber.shift()
                        formateNumber.shift()
                        formateNumber.shift()
                    }
                    formateNumber = formateNumber.join('')

                    if (formatedNumbersArr.length === 0) {
                        return [formateNumber]
                    }

                    const isNumberInArr = formatedNumbersArr.findIndex(num => num === number)

                    if (isNumberInArr !== -1) {
                        return [...formateNumber, formateNumber]
                    }

                    return [...formatedNumbersArr]
                }, [])

                sharedNumbers += numberArr.map(number => number).join(',') + ',';
            })

            sharedNumbers = sharedNumbers.replace(/[()/+ -]+/g, "").trim().slice(0, -1)
        }

        const formData = new FormData()
        formData.append('token', user.token)
        formData.append('albume_name', albumName || 'First Album')
        formData.append('max_images', data[0].value)
        formData.append('shared_to', sharedNumbers)
        formData.append('status', '2')
        formData.append('date_created', createdDate)
        formData.append('deadline', deadLine)

        newAlbum(formData, user.token).then(async (response) => {
            console.log('responce', response)
            await checkNetInfo();
        })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <Modal animationOutTiming={500} animationInTiming={500} isVisible={popupBegin}>
                <BlurView
                    style={styles.blurView}
                    blurType="light" // Values = dark, light, xlight .
                    blurAmount={10}
                    reducedTransparencyFallbackColor="black"
                />

                <View style={styles.background}>
                    <View style={{ top: 20 }}>
                        <Text style={[styles.cardText, { fontSize: 20, fontFamily: 'Arimo-Bold' }]}>{'יאללה, מתחילים לצלם!'}</Text>
                        <VerticalSpace height={0.02} />
                        <Text style={[styles.cardText]}>{'לא לשכוח לבחור לאיזה אלבום לצרף את התמונה והשאר כבר עלינו'}</Text>
                        <Button
                            text="קדימה"
                            buttonStyles={buttonStyles} onPress={() => { createNewAlbum(); dispatch(setPopupBegin(false)); props.navigation.navigate('Camera') }}
                        />
                    </View>
                </View>
            </Modal>

        </View >
    );
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


export default BeginAlbum;

