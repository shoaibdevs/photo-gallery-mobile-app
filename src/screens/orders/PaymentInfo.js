import React, { useState, useEffect } from 'react'
import { View, Text, Image, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, KeyboardAvoidingView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Button from '../../utilities/button'
import { WebView } from 'react-native-webview'
import axios from 'axios'
import { colors } from '../../colors';
import { updateAlbumApi, createOrder, fetchAlbums, } from '../../api'
import moment from 'moment'
import { setCountReadyForOrderAlbums } from '../../redux'
import AnimatedLoader from "react-native-animated-loader";

const { width, height } = Dimensions.get('window');

const PaymentInfo = ({ navigation }) => {
    const [webViewUri, setWebViewUri] = useState('')
    const [webViewChange, setWebViewChange] = useState('')
    const { currentAlbum, fullName, email, phone, city, street, bldNumber, aptNumber, floor, entrance, numCopies, status, coupon } = navigation.state.params
    const { user } = useSelector(state => state.user)
    const nameArray = fullName.split(' ')
    const firstName = nameArray[0]
    const lastName = nameArray[1]
    const totalAmount = navigation.getParam('total') * 100
    const cost = navigation.getParam('total')
    console.log(cost);
    const today = moment().format("YYYY-MM-DD HH:MM:SS");
    const dispatch = useDispatch()
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    useEffect(() => {
        if (webViewChange == 'Payme Success') updateAlbumStatus()
    }, [webViewChange])

    useEffect(() => {
        const address = `${street.replace(/ /g, "%20")},${bldNumber},${city.replace(/ /g, "%20")},${floor},${aptNumber},${entrance}`.replace(' ', '')
        axios
            .post(
                'https://ng.paymeservice.com/api/generate-sale',
                {
                    "seller_payme_id": "MPL16364-46418Q6C-UMPJIKIY-4HT0GY7Q",
                    "sale_price": totalAmount,
                    "currency": "ILS",
                    "product_name": "אלבום Pic.it",
                    "transaction_id": email,
                    "installments": 1,
                    // "sale_callback_url": "https://10.0.2.2:3000/addPaymeToken",
                    "sale_return_url": `https://picitsimple.com/front/success?album_id=${currentAlbum.id}&user_id=${user.userId}&coupon=${coupon}&address=${address}&price=${cost}&number_of_copies=${numCopies}`,
                    "capture_buyer": 0
                },
                config
            )
            .then(response => {
                const url = response.data.sale_url + `?first_name=${firstName}&last_name=${lastName}&phone=${phone}&email=${email}`
                console.log(url);
                setWebViewUri(url)
            })
            .catch(err => {
                console.log('error in payme')
                console.log(err.response)
            })
    }, [])

    const updateAlbumStatus = () => {
        const formData = new FormData
        formData.append('token', user.token)
        formData.append('id', currentAlbum.id)
        formData.append('albume_name', currentAlbum['albume_name'])
        formData.append('max_images', currentAlbum.max_images)
        formData.append('status', '3')

        updateAlbumApi(formData).then(res => {
            console.log('responce update album status', res)
        })
        const formData2 = new FormData
        formData2.append('token', user.token)
        formData2.append('album_id', currentAlbum.id)
        formData2.append('full_name', fullName)
        formData2.append('email', email)
        formData2.append('phone', phone)
        formData2.append('city', city)
        formData2.append('street', street)
        formData2.append('house_number', bldNumber)
        formData2.append('flat_number', aptNumber)
        formData2.append('floor', floor)
        formData2.append('entrance', entrance)
        formData2.append('number_of_copies', numCopies)
        formData2.append('status', status)
        formData2.append('user_id', user.userId)

        createOrder(formData2).then(res => {
            fetchAlbums(user.token).then(response => {
                if(!response.data){return}
                const countAlbusReadyForOrder = response.data.filter(album => album.status === '1' && album.isAlbumLocked == '0').length
                console.log("count Ready ---->", countAlbusReadyForOrder);
                dispatch(setCountReadyForOrderAlbums(countAlbusReadyForOrder))
            })
            console.log('responce update album status', res)
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {webViewChange != 'Payme Success' && <View style={{
                height: 70,
                paddingTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}>
                <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 24, textAlign: 'center' }}>
                    {'פרטי תשלום'}
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', right: 14, paddingTop: 15 }}
                >
                    <Image
                        source={require('../../../assets/images/buttonsNavBarRight.png')}
                        style={{ height: 40, width: 40 }}
                    />
                </TouchableOpacity>
            </View>}

            <View style={styles.webViewContainer}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={30}>
                    {webViewUri != '' ?
                        <WebView
                            onNavigationStateChange={(webViewState) => {
                                setWebViewChange(webViewState.title)
                            }}

                            originWhitelist={['*']}
                            style={styles.webView}
                            source={{ uri: webViewUri }}
                        /> :
                        <AnimatedLoader
                            visible={true} // was false on developer branch
                            overlayColor="rgba(255,255,255,0.75)"
                            source={require('../../../assets/picitLoader.json')}
                            animationStyle={{ width: 100, height: 100 }}
                            speed={1}
                        ></AnimatedLoader>
                    }
                </KeyboardAvoidingView>
            </View>

            {webViewChange == 'Payme Success' && <TouchableOpacity onPress={() => { navigation.navigate('Camera') }} style={{
                backgroundColor: colors.nextButton,
                height: 64,
                width: width - 90,
                bottom: 10,
                borderRadius: 26,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
            }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: colors.black, fontSize: 17, fontFamily: 'Arimo-Bold', paddingRight: 2 }}>{'אישור'}</Text>
                    <Image source={require('../../../assets/images/iconsCircleCheck.png')} />
                </View>
            </TouchableOpacity>}
        </SafeAreaView>
    )

}

const buttonStyles = {
    backgroundColor: colors.nextButton,
    color: colors.black,
    height: 55,
    fontSize: 17,
    width: width * 0.5,
    borderRadius: 26,
    justifyContent: 'center',
    fontFamily: 'Arimo-Bold',
}

const styles = StyleSheet.create({
    webViewContainer: {
        flex: 1,
        alignSelf: 'stretch',
        marginBottom: 20
    },
    webView: {
        flex: 1,
        width: '100%'
    }
})

export default PaymentInfo