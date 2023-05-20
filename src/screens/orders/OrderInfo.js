import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Platform } from 'react-native'
import { colors } from '../../colors'
import { VerticalSpace } from '../../utilities/verticalSpace'
import Button from '../../utilities/button'
import FloatingLabelInput from '../../utilities/floatingLabelInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Autocomplete from 'react-native-autocomplete-input'
import { ScrollView } from 'react-native-gesture-handler'
import filter from 'lodash.filter';
import { color } from 'react-native-reanimated'
import { isIphoneX } from 'react-native-iphone-x-helper';
import { checkCupon } from '../../api'
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const OrderInfo = ({ navigation }) => {
    const coupon = 'PIC2021'
    const couponAmount = 25
    const albumPrice = '79.00'
    const { currentAlbum } = navigation.state.params
    const { user } = useSelector(state => state.user)
    const [fullName, setFullName] = useState(user.full_name)
    const [email, setEmail] = useState(user.email)
    const [phoneNumber, setPhoneNumber] = useState(user.phone)
    const [city, setCity] = useState('')
    const [street, setStreet] = useState('')
    const [bldNumber, setBldNumber] = useState('')
    const [clickedCity, setClickedCity] = useState(false)
    const [clickedStreet, setClickedStreet] = useState(false)
    const [clicked, setClicked] = useState(false)

    const [entrance, setEntrance] = useState('')
    const [floor, setFloor] = useState('')
    const [aptNumber, setAptNumber] = useState('')
    const [numCopies, setNumCopies] = useState('1')
    const [couponName, setCouponName] = useState('')
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [total, setTotal] = useState(albumPrice)
    const [errorMessage, setErrorMessage] = useState('')
    const [copunPercent, setCuponPercent] = useState(0)

    const [allCities, setAllCities] = useState([])
    const [filteredCities, setFilteredCities] = useState([])
    const [query, setQuery] = useState('')

    const [allStreets, setAllStreets] = useState([])
    const [filteredStreets, setFilteredStreets] = useState([])
    const [queryStreet, setQueryStreet] = useState('')

    const [focused, setFocused] = useState({
        city: false,
        street: false,
        number: false,
        entrance: false,
        floor: false,
        apartment: false
    })

    const dispatch = useDispatch()

    const [validValue, setValidValue] = useState({
        fullName: false,
        phoneNumber: false,
        email: false,
        password: false,
        city: false,
        cupon: false
    })

    const buttonStyles = {
        fontFamily: 'Arimo-Bold',
        backgroundColor: colors.nextButton,
        color: colors.black,
        height: 65,
        width: 196,
        paddingRight: 20,
        borderRadius: 26,
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 17
    }

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }


    useEffect(() => {
        axios
            .get(
                'https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=5000',
                config
            )
            .then(response => {
                //console.log('response data gov ', response.data.result.records)
                const cityArray = response.data.result.records.map((record, index) => {
                    const oneCity = record["שם_ישוב"]
                    return oneCity
                })
                //console.log('cityArray ', cityArray)
                // setAllCities([
                //     "Tel Aviv",
                //     "Jerusalem",
                //     "Haifa",
                //     "Eilat"
                // ])
                setAllCities(cityArray)
            })
            .catch(err => console.log(err))
    }, [])

    const searchDataFromAllCities = (query) => {
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i')
            setFilteredCities(
                allCities.filter((data) => data.search(regex) >= 0)
            )
        } else {
            setFilteredCities([]);
        }
    }
    const searchDataFromAllStreets = text => {
        if (text.length > 0) {
            const formattedQuery = text.toLowerCase();
            const filteredData = filter(allStreets, name => {
                return contains2(name, formattedQuery);
            });

            setFilteredStreets(filteredData);
        }
        else
            setFilteredStreets([]);

        setQueryStreet(text);
    };

    const contains2 = ({ שם_רחוב }, query) => {
        if (שם_רחוב.includes(query)) {
            return true;
        }
        return false;
    };

    // const searchDataFromAllStreets = (queryStreet) => {
    //     console.log(queryStreet);
    //     if (queryStreet) {
    //         setFilteredStreets(
    //             allStreets.filter((data) => data.search(queryStreet) >= 0)
    //         )
    //     } else {
    //         setFilteredStreets([]);
    //     }
    // }

    const handleSelectedStreet = (item) => {
        setClickedStreet(true)
        setQueryStreet(item)
        setFilteredStreets([])
    }

    const handleSelectedCity = (item) => {
        setClickedCity(true)
        setQuery(item)
        setFilteredCities([])

        axios
            .get(
                `https://data.gov.il/api/3/action/datastore_search?resource_id=a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3&q=${item}&limit=5000`,
                config
            )
            .then(response => {
                //console.log('response data gov streets', response.data.result.records)
                const streetArray = response.data.result.records.filter(
                    record => record["שם_רחוב"]
                )
                //console.log('streets by city array ', streetsOfCityArray)
                // const streetArray = streetsOfCityArray.map(record => {
                //     const oneStreet = record["שם_רחוב"]
                //     return oneStreet
                // })
                //console.log('streetArray ', streetArray)
                // setAllStreets([
                //     "arlozorov",
                //     "herzel",
                //     "weizman",
                //     "dizengof"
                // ])
                setAllStreets(streetArray)
            })
            .catch(err => console.log(err))
    }

    const checkCuponName = () => {
        const formData = new FormData()
        formData.append('token', user.token)
        formData.append('coupon_code', couponName)
        checkCupon(formData).then(res => {
            if (res.data != null) {
                const discount = total * 23 / 100
                setCouponDiscount((total * Number(res.data)) / 100)
                // setTotal(total - discount)
                setClicked(true)
                setCuponPercent(res.data)
                setValidValue({ ...validValue, cupon: false })
            }
            else {
                setValidValue({ ...validValue, cupon: true })
            }
        })
    }

    const nameValidation = () => {
        console.log('namevalid')
        const regExp = new RegExp(/[^A-Za-z\u0590-\u05FF '-]/i);
        let result = regExp.test(fullName) //should be false as valid
        let twoWordsMin = (fullName.trim().split(' ').length < 2) //should be false as valid
        if (result || twoWordsMin) setValidValue({ ...validValue, fullName: true })
        else setValidValue({ ...validValue, fullName: false })
    }

    const cityValidation = () => {
        console.log('cityvalid')
        const regExp = new RegExp(/[^A-Za-z\u0590-\u05FF '-]/i);
        let result = regExp.test(city) //should be false as valid
        if (result) setValidValue({ ...validValue, city: true })
        else setValidValue({ ...validValue, city: false })
    }

    const numberValidation = () => {
        if (!(phoneNumber.length === 10)) setValidValue({ ...validValue, phoneNumber: true })
        else setValidValue({ ...validValue, phoneNumber: false })
    }

    const emailValidation = () => {
        const regExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        let result = regExp.test(email) // should be true as valid
        if (result) setValidValue({ ...validValue, email: false })
        else setValidValue({ ...validValue, email: true })
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                style={{}}
            >
                <ImageBackground

                    source={require('../../../assets/images/orderBg.png')}
                    style={{ width: width, }}
                    imageStyle={{ width: width, height: 215 }}
                >
                    <View style={{ width: '85%', alignSelf: 'center', top: isIphoneX() ? 70 : 50 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 17 }]}>{'פרטי הזמנה'}</Text>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{ position: 'absolute', right: 0 }}
                            >
                                <Image
                                    source={require('../../../assets/images/buttonsNavBarX.png')}
                                    style={{ height: 40, width: 40 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <VerticalSpace height={0.02} />
                        {/* <FloatingLabelInput
                            label="שם מלא"
                            value={fullName}
                            heightInput={60}
                            screen={'order'}
                            onChangeText={txt => setFullName(txt)}
                            onBlur={nameValidation}
                        /> */}
                        <VerticalSpace height={0.02} />
                        <FloatingLabelInput
                            label="שם מלא"
                            value={fullName}
                            width={width - 60}
                            placeHolderStyle={10}
                            onChangeText={txt => setFullName(txt)}
                        />
                        <VerticalSpace height={0.02} />
                        <FloatingLabelInput
                            label={"אימייל"}
                            value={email}
                            keyboardType={'email-address'}
                            width={width - 60}
                            autoCapitalize='none'
                            placeHolderStyle={10}
                            onChangeText={txt => setEmail(txt.toLowerCase())}
                        />
                        <Text style={{ color: 'rgba(134,128,145,0.5)', textAlign: 'right', fontFamily: 'Arimo-Regular', fontSize: 13 }}>{'למייל זה נשלח את החשבונית ועדכונים על ההזמנה'}</Text>

                        <VerticalSpace height={0.02} />

                        <FloatingLabelInput
                            label={"טלפון"}
                            value={phoneNumber}
                            keyboardType={'numeric'}
                            width={width - 60}
                            placeHolderStyle={10}
                            onChangeText={txt => { setPhoneNumber(txt.replace(/[^0-9]/g, '')) }}
                        />
                        {/* <FloatingLabelInput
                            label={"אימייל"}
                            value={email}
                            screen={'order'}
                            heightInput={60}
                            onChangeText={txt => setEmail(txt.toLowerCase())}
                            onBlur={emailValidation}
                            style={{ borderColor: validValue.email ? 'red' : 'rgba(0,0,0,0.1)' }}
                        /> */}
                        {/* <FloatingLabelInput
                            label={"טלפון סלולרי"}
                            keyboardType={'numeric'}
                            value={phoneNumber}
                            screen={'order'}
                            heightInput={60}
                            onChangeText={txt => setPhoneNumber(txt.replace(/[^0-9]/g, ''))}
                            onBlur={numberValidation}
                            style={{ borderColor: validValue.phoneNumber ? 'red' : 'rgba(0,0,0,0.1)' }}
                        /> */}
                        <VerticalSpace height={0.05} />
                        <View style={{ backgroundColor: 'lightgray', height: 1 }}></View>
                        <VerticalSpace height={0.05} />
                        <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'right' }}>{'פרטי משלוח'}</Text>
                        <VerticalSpace height={0.02} />

                        <Autocomplete
                            inputContainerStyle={{ borderWidth: 0 }}
                            style={{ ...styles.containerAutocomplete, borderColor: focused.city ? colors.TEXT_LINK : errorMessage.length > 0 && !clickedCity ? 'red' : validValue.city ? 'red' : colors.textInputBorder, fontFamily: 'Arimo-Regular' }}
                            data={filteredCities}
                            value={query}
                            onFocus={() => setFocused({ ...focused, city: true })}
                            onBlur={() => setFocused({ ...focused, city: false })}
                            placeholder={'* עיר'}
                            placeholderTextColor="black"
                            onChangeText={(text) => {
                                setCity(text)
                                setQuery(text)
                                searchDataFromAllCities(text)
                                if (city === '') {
                                    setErrorMessage('עיר ורחוב הם שדות הכרחיים')
                                } else {
                                    setErrorMessage('')
                                }
                            }}
                            flatListProps={{
                                nestedScrollEnabled: true,
                                style: { height: filteredCities.length > 2 ? 170 : 50, width: width * 0.85, alignSelf: 'center', borderWidth: 1, borderColor: colors.textInputBorder },
                                keyExtractor: (_, idx) => idx,
                                renderItem: ({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelectedCity(item)}>
                                        <Text style={styles.autoText}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        {/* </View> */}
                        <VerticalSpace height={0.02} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextInput
                                style={{ ...styles.textInput, borderColor: focused.number ? colors.TEXT_LINK : colors.textInputBorder, width: width * 0.25, marginRight: 10 }}
                                value={bldNumber}
                                placeholder={'מספר בית'}
                                onFocus={() => setFocused({ ...focused, number: true })}
                                onBlur={() => setFocused({ ...focused, number: false })}
                                placeholderTextColor="black"
                                onChangeText={txt => setBldNumber(txt)}
                            />
                            <Autocomplete
                                inputContainerStyle={{ borderWidth: 0 }}
                                style={{ ...styles.containerAutocomplete, borderColor: focused.street ? colors.TEXT_LINK : errorMessage.length > 0 && !clickedStreet ? 'red' : colors.textInputBorder, width: width * 0.57, fontFamily: 'Arimo-Regular' }}
                                data={filteredStreets}
                                value={queryStreet}
                                onFocus={() => setFocused({ ...focused, street: true })}
                                onBlur={() => setFocused({ ...focused, street: false })}

                                placeholder={'* רחוב'}
                                placeholderTextColor="black"
                                onChangeText={(text) => {
                                    setStreet(text)
                                    setQueryStreet(text)
                                    searchDataFromAllStreets(text)
                                    if (street === '') {
                                        setErrorMessage('עיר ורחוב הם שדות הכרחיים')
                                    } else {
                                        setErrorMessage('')
                                    }
                                }}
                                flatListProps={{
                                    nestedScrollEnabled: true,
                                    style: { position: 'relative', zIndex: 1000, height: filteredStreets.length > 2 ? 150 : 50, width: width * 0.57, borderWidth: 1, borderColor: colors.textInputBorder, right: Platform.OS == 'ios' ? 0 : 10 },
                                    keyExtractor: (_, idx) => idx,
                                    renderItem: ({ item: { שם_רחוב } }) => (
                                        <TouchableOpacity onPress={() => handleSelectedStreet(שם_רחוב)}>
                                            <Text style={styles.autoText}>{שם_רחוב}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                        <VerticalSpace height={0.02} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextInput
                                style={{ ...styles.textInput, borderColor: focused.apartment ? colors.TEXT_LINK : colors.textInputBorder, width: '30%' }}
                                value={aptNumber}
                                placeholder={'דירה'}
                                onFocus={() => setFocused({ ...focused, apartment: true })}
                                onBlur={() => setFocused({ ...focused, apartment: false })}
                                placeholderTextColor="black"
                                onChangeText={txt => setAptNumber(txt)}
                            />
                            <TextInput
                                style={{ ...styles.textInput, borderColor: focused.floor ? colors.TEXT_LINK : colors.textInputBorder, width: '30%' }}
                                value={floor}
                                placeholder={'קומה'}
                                onFocus={() => setFocused({ ...focused, floor: true })}
                                onBlur={() => setFocused({ ...focused, floor: false })}

                                placeholderTextColor="black"
                                onChangeText={txt => setFloor(txt)}
                            />
                            <TextInput
                                style={{ ...styles.textInput, borderColor: focused.entrance ? colors.TEXT_LINK : colors.textInputBorder, width: '30%' }}
                                value={entrance}
                                placeholder={'כניסה'}
                                onFocus={() => setFocused({ ...focused, entrance: true })}
                                onBlur={() => setFocused({ ...focused, entrance: false })}
                                placeholderTextColor="black"
                                onChangeText={txt => setEntrance(txt)}
                            />
                        </View>
                        <View style={{ height: 30 }}></View>
                    </View>
                    <View style={{ width: '100%', height: 700, top: 50, paddingTop: 30, backgroundColor: colors.card }}>
                        <View style={{ width: 80, alignSelf: 'flex-end', backgroundColor: colors.card, top: 8, zIndex: 100, right: 37 }}>
                            <Text allowFontScaling={false} style={{ fontSize: 13, fontFamily: 'Arimo-Regular', color: 'black', textAlign: 'center' }} >{'כמות עותקים'}</Text>
                        </View>
                        <View style={styles.numCopiesInput}>
                            <TouchableOpacity onPress={() => {
                                setNumCopies(currNumCopies => (Number(currNumCopies) + 1).toString())
                                const temp = (Number(total) + Number(albumPrice)) * Number(copunPercent) / 100
                                setCouponDiscount(temp)
                                setTotal(currTotal => (Number(currTotal) + Number(albumPrice)))
                            }}
                            >
                                <Image
                                    source={require('../../../assets/images/plus.png')}
                                    style={{ width: 30, height: 30 }}
                                />
                            </TouchableOpacity>
                            <TextInput
                                value={numCopies}
                                editable={false}
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    console.log(text.length);
                                    setNumCopies(text); setTotal(currTotal => text * (currTotal + Number(albumPrice)))
                                    if (text.length > 0) {
                                        const temp = (Number(albumPrice) * Number(text)) * Number(copunPercent) / 100
                                        console.log(total, temp);
                                        setCouponDiscount(temp)
                                    }
                                }}
                                onBlur={() => numCopies == 0 && setErrorMessage('מס׳ עותקים לא יכול להיות 0')}
                                style={{ color: 'black', width: 80, textAlign: 'center', fontSize: 17, fontWeight: 'bold', fontFamily: 'Arimo-Bold' }}
                            />
                            <TouchableOpacity onPress={() => {
                                setNumCopies(currNumCopies => {
                                    if (currNumCopies !== '1') {
                                        const temp = (Number(total) - Number(albumPrice)) * Number(copunPercent) / 100
                                        console.log(total, temp);
                                        setCouponDiscount(temp)
                                        return (Number(currNumCopies) - 1).toString()
                                    } else {
                                        return currNumCopies
                                    }
                                })
                                setTotal(currTotal => {
                                    if (Number(currTotal) !== Number(albumPrice)) {

                                        return Number(currTotal) - Number(albumPrice)
                                    } else {
                                        return currTotal
                                    }
                                })
                            }}
                            >
                                <Image
                                    source={require('../../../assets/images/minus.png')}
                                    style={{ width: 30, height: 30 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <VerticalSpace height={0.02} />
                        <View style={styles.couponView}>
                            <View style={styles.send}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!clicked)
                                            checkCuponName()
                                    }}
                                    disabled={clicked}
                                >
                                    <Text style={{ fontSize: 15, fontFamily: 'Arimo-Regular', color: colors.secondary }}>{'שליחה'}</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={{ ...styles.textInput, width: '85%', alignSelf: 'center', paddingRight: 50, borderColor: !validValue.cupon ? clicked ? 'green' : colors.textInputBorder : 'red' }}
                                value={couponName}
                                autoCapitalize={'none'}
                                placeholder={'קוד קופון'}
                                placeholderTextColor="black"
                                onChangeText={txt => setCouponName(txt)}
                            />
                            <Image
                                source={require('../../../assets/images/iconsBankTag.png')}
                                style={styles.couponImg}
                            />
                        </View>
                        <VerticalSpace height={0.01} />
                        {validValue.cupon && <Text style={{ color: 'red', fontFamily: 'Arimo-Regular', textAlign: 'right', width: '92%' }}>{'קוד קופון לא תקין/פג תוקף'}</Text>}
                        <VerticalSpace height={0.05} />
                        <View style={{ backgroundColor: 'lightgray', height: 1, width: '85%', alignSelf: 'center' }}></View>
                        <VerticalSpace height={0.05} />
                        <View style={{ width: '85%', alignSelf: 'center' }}>
                            <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, alignSelf: 'flex-end' }}>{'סיכום הזמנה'}</Text>
                            <VerticalSpace height={0.02} />
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, alignSelf: 'flex-end', color: colors.whyPicIt }}>{`₪ ${(albumPrice * Number(numCopies)).toFixed(2)}`}</Text>
                                <Text style={{ width: width * 0.6, fontFamily: 'Arimo-Regular', fontSize: 15, alignSelf: 'flex-end', color: colors.whyPicIt, textAlign: 'right' }}>{`אלבום ${currentAlbum.albume_name} (${numCopies} עותקים)`}</Text>
                            </View>
                            <VerticalSpace height={0.02} />
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, alignSelf: 'flex-end', color: colors.whyPicIt }}>{`₪ 00.00`}</Text>
                                <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, alignSelf: 'flex-end', color: colors.whyPicIt }}>{`משלוח`}</Text>
                            </View>
                            <VerticalSpace height={0.02} />

                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, alignSelf: 'flex-end', color: colors.whyPicIt }}>{`₪ - ${(couponDiscount).toFixed(2)}`}</Text>
                                <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, alignSelf: 'flex-end', color: colors.whyPicIt }}>{`קופון (${couponName})`}</Text>
                            </View>
                        </View>
                        <VerticalSpace height={0.05} />
                        <View style={{ backgroundColor: 'lightgray', height: 1, width: '85%', alignSelf: 'center' }}></View>
                        <VerticalSpace height={0.05} />
                        <View style={{ flexDirection: 'row', width: '85%', justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, alignSelf: 'flex-end' }}>{`₪ ${(total - couponDiscount).toFixed(2)}`}</Text>
                            <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, alignSelf: 'flex-end' }}>{'סה"\כ'}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-start', paddingLeft: 20, marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Button text="לתשלום" buttonStyles={buttonStyles} onPress={() => {
                                    if (numCopies == 0) {
                                        setErrorMessage('מס׳ עותקים לא יכול להיות 0')
                                    }
                                    else if (city !== '' && street !== '' && clickedCity && clickedStreet) {
                                        setErrorMessage('')
                                        navigation.navigate('PaymentInfo', {
                                            total: total - couponDiscount,
                                            currentAlbum: currentAlbum,
                                            fullName: fullName,
                                            email: email,
                                            phone: phoneNumber,
                                            city: query,
                                            street: queryStreet,
                                            bldNumber: bldNumber,
                                            aptNumber: aptNumber,
                                            floor: floor,
                                            entrance: entrance,
                                            numCopies: numCopies,
                                            status: 1,
                                            coupon: couponName
                                        });
                                    } else {
                                        setErrorMessage('עיר ורחוב הם שדות הכרחיים')
                                    }
                                }} />
                                <Image
                                    source={require('../../../assets/images/iconsCircleLeft.png')}
                                    style={{ width: 20, height: 20, position: 'absolute', right: 55, top: 32 }}
                                />
                            </View>
                        </View>
                        <View style={{ width: width, height: 70, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'red', fontFamily: 'Arimo-Regular' }}>{errorMessage}</Text>
                        </View>
                    </View>
                    <View style={{ height: 20, backgroundColor: colors.card }}></View>
                </ImageBackground>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.white
    },
    cardText: {
        textAlign: 'center'
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 6,
        fontFamily: 'Arimo-Regular',
        padding: 10,
        height: 60,
        textAlign: 'right'
    },
    numCopiesInput: {
        width: '85%',
        height: 60,
        alignSelf: 'center',
        borderRadius: 10,
        borderColor: 'lightgray',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
        paddingLeft: 10
    },
    couponImg: {
        width: 30,
        height: 30,
        position: 'absolute',
        right: 40
    },
    couponView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    send: {
        position: 'absolute',
        left: 50,
        height: 60,
        justifyContent: 'center',
        zIndex: 10
    },
    selectedTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    selectedTextStyle: {
        textAlign: 'center',
        fontSize: 18,
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        //position: 'absolute',
        //right: 0,
        //top: 0,
        zIndex: 1
    },
    containerAutocomplete: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        fontFamily: 'Arimo-Regular',
        height: 60,
        textAlign: 'right'
    },
    autoText: {
        color: 'black',
        textAlign: 'right',
        fontFamily: 'Arimo-Regular',
        fontSize: 16,
        margin: 13
    },
})

export default OrderInfo