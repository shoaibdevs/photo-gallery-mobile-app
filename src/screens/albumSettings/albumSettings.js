import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Image,
    BackHandler,
    Keyboard,
    TouchableWithoutFeedback
} from "react-native";
import { VerticalSpace } from '../../utilities/verticalSpace'
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../colors";
import { setPopupContacts, setPopupError, setPopupExitFromAlbumSettings } from '../../redux'
import PopupContacts from '../popups/popupContacts'
import { editAlbumSettings, updateAlbumDate, deleteTempAlbum } from "../../api";
import {editAlbumSettingsData} from '../../helpers/albumHelper';
import PopupExitFromAlbumSettings from "../popups/popupExitFromAlbumSettings";
import PopupError from "../popups/popupError";
import AnimatedLoader from 'react-native-animated-loader';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default AlbumSettings = props => {
    const dispatch = useDispatch()
    const [isSharedAlbum={isSharedAlbum} , setIsSharedAlbum={isSharedAlbum}] = useState(false)
    const { popupContacts, user, contacts, popupExitFromAlbumSettings } = useSelector(state => state.user)
    const { navigation } = props
    const currentAlbum = navigation.state.params.currentAlbum
    const [sharedTo, setSharedTo] = useState(currentAlbum.shared_to != ''? currentAlbum.shared_to.split(',').filter(c => c):[])
    // console.log("Cureent--->", currentAlbum);
    const [albumName, setAlbumName] = useState(currentAlbum.albume_name)
    const [isNameFieldEmpty, setIsNameFieldEmpty] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [loading, setLoading] = useState(false)


    const [removeOwner, setRemoveOwner] = useState(true)
    const [selfPhone, setSelfPhone] = useState(false)

    const [oldSharedUser, setOldSharedUser] = useState(currentAlbum.shared != '' ? currentAlbum.shared_to.split(',').filter(c => c):[])
    useEffect(() => {
        if (isNameFieldEmpty) {
            setIsNameFieldEmpty(false)
        }
    }, [albumName])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove();
    }, [])
    const [ownerAlbum, setOwnerAlbum] = useState(false)
    const [isOwnerAlbum, setIsOwnerAlbum] = useState(false)
    const [ownerPhoneNumber, setOwnerPhoneNumber] = useState(false)
    const [no, setNo] = useState(0)
    const [isLoaded, setIsLoaded] = useState(true)
    useEffect(() => {
        const updateDate = () => {
            setLoading(true)
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            fetch("https://Picitsimple.com/api/rest/getAlbumsUsers?id="+currentAlbum.id, requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.albums.length != 0 && result.user.length != 0){
                    console.log("result.albums data",result.albums)
                    let userByAlbum = result.albums[0]
                    let newShared = userByAlbum.shared_to.split(',').filter(c => c)
                    setSharedTo(newShared)
                    setOldSharedUser(newShared)
                    console.log("Shared to: " + newShared)

                    setIsSharedAlbum(true)
                    setOwnerAlbum(result.user[0])
                    setOwnerPhoneNumber(false)
                    setSelfPhone(currentAlbum.phone)
                }else{
                    setOwnerAlbum(false)
                    setSelfPhone(false)
                    setSharedTo(currentAlbum.shared_to.split(',').filter(c => c))
                    console.log("currentAlbum", currentAlbum)
                    console.log("Shared to: " + sharedTo)
                    setOwnerPhoneNumber(currentAlbum.phone)
                    setIsSharedAlbum(false)
                    setIsOwnerAlbum(true)
                    setOldSharedUser(currentAlbum.shared_to.split(',').filter(c => c))
                }
                setLoading(false)
            })
            .catch(error => {console.log('error getting all user of shared album--?', error);setLoading(false);});
        }
        updateDate()
    },[])

    async function applyNewSettingsForAlbum() {
        if (albumName.length > 0) {
            console.log("Removed Myself from album", removeOwner)
            setLoading(true)
            let shareToString = sharedTo.join(',')
            let res;
            if(!removeOwner){
                res = await deleteTempAlbum(currentAlbum.id, currentAlbum.shared_by, currentAlbum.phone)
            }else{
                const reqObj = {
                    'token' : user.token,
                    'id': currentAlbum.id,
                    'albume_name': albumName,
                    'shared_to': shareToString
                }
                res = await editAlbumSettingsData(reqObj)
            }


            setLoading(false)
            if (res == 0) {
                dispatch(setPopupError(true))
            } else {
                navigation.goBack()
            }
        } else {
            setIsNameFieldEmpty(true)
        }
    }

    function formatNumber(num) {
        let formateNumber = num.replace(/[()/+ -]+/g, "")

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

        return formateNumber
    }

    const countUsersContactsInShared = () => {
        if (contacts.length > 0) {
            return sharedTo.reduce((res, sharedContact) => {
                const index = contacts.findIndex(c => {
                    const numbers = c.phoneNumbers.map(ph => formatNumber(ph.number))
                    return numbers.includes(sharedContact)
                }).toString()
                if (+index >= 0 && !res.includes(index)) {
                    return [...res, index]
                }

                return res

            }, []).length
        }
    }
    
    return (
        <TouchableWithoutFeedback style={{ height: '100%' }} onPress={() => { Keyboard.dismiss(); console.log('clicked'); }}>
            <View style={styles.container}>
                <AnimatedLoader //++
                    visible={loading}
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require("../../../assets/picitLoader.json")}
                    animationStyle={{ width: 100, height: 100 }}
                    speed={1}
                ></AnimatedLoader>
                <Image style={{ backgroundColor: colors.white, width: width, }} source={require('../../../assets/images/imgBackgroundCover.png')} />
                <View style={{ alignItems: 'center', bottom: 100, width: '85%', alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row-reverse', alignSelf: 'flex-end', bottom: 60, backgroundColor: colors.white }}>
                        <TouchableOpacity onPress={() => { dispatch(setPopupExitFromAlbumSettings(true)); }} style={{ alignSelf: 'flex-end' }} >
                            <Image source={require('../../../assets/images/buttonsNavBar.png')} />
                        </TouchableOpacity>
                        <Text style={styles.cardText}>{'הגדרות אלבום'}</Text>
                    </View>

                    <View style={[styles.SectionStyle, { bottom: 20, borderColor: isFocused ? colors.secondary : isNameFieldEmpty ? colors.red : colors.textInputBorder }]}>
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 13, color: isFocused ? colors.secondary : colors.length, position: 'absolute', top: -10, right: 10, left: 'auto', backgroundColor: '#fff', paddingHorizontal: 10 }]}>{'שם האלבום'}</Text>
                        <Text style={[styles.cardText, { position: 'absolute', fontFamily: 'Arimo-Regular', fontSize: 15, left: 10, color: colors.length }]}>{`${albumName?.length}/36`}</Text>
                        <TextInput
                            maxLength={36}
                            multiline={true}
                            placeholderTextColor={colors.black}
                            style={{ fontFamily: 'Arimo-Regular', paddingRight: 10, width: width * 0.7 }}
                            textAlign={'right'}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={'שם האלבום'}
                            value={albumName}
                            onChangeText={txt => setAlbumName(txt)}
                        />
                        {isNameFieldEmpty ? <Text style={styles.errorText}>{'יש לתת שם לאלבום'}</Text> : null}
                    </View>

                    <VerticalSpace height={0.0070} />
                    <View style={styles.line} />
                    <VerticalSpace height={0.03} />

                    <View style={{ backgroundColor: colors.card, width: '100%' }}>
                        {/* {currentAlbum.shared_user_name.length > 0 && <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'right', color: colors.register, marginBottom:10 }}>{`שותף ע״י ${currentAlbum.shared_user_name}`}</Text>} */}

                        <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'right', color: colors.text }}>{'שותפים לאלבום'}</Text>
                        <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, marginTop: 14, textAlign: 'right', color: colors.purpleGrey }}>{`באפשרותך לשתף חברים שיוכלו להוסיף תמונות לאלבום המשותף  `}</Text>
                        <VerticalSpace height={0.03} />

                        <TouchableOpacity onPress={() => dispatch(setPopupContacts(true))} style={styles.SectionStyle}>
                            <View style={{ flexDirection: 'row-reverse', alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between', width: width * 0.8 }}>
                                < View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Image style={{ width: 24, height: 24 }} source={require('../../../assets/images/iconsUserCopy.png')} />

                                    <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, textAlign: 'right', color: colors.text, left: 5 }}>{sharedTo.length == 0 ? `לא נוספו שותפים (פרטי)` : `${sharedTo.length + 1} שותפים`}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 15, color: colors.register }}>{'הוספה / הסרה'}</Text>
                                </View>

                            </View>
                        </TouchableOpacity>

                        <VerticalSpace height={0.05} />
                        <TouchableOpacity onPress={applyNewSettingsForAlbum} style={[styles.save, { opacity: albumName.length == 0 ? 0.5 : 1 }]}>
                            <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'center' }}>{'שמירה'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <PopupExitFromAlbumSettings navigation={navigation} popupExitFromAlbumSettings={popupExitFromAlbumSettings} />
                <PopupContacts selfPhone={selfPhone} removeOwner={removeOwner} setRemoveOwner={setRemoveOwner} isSharedAlbum={isSharedAlbum} isOwnerAlbum={isOwnerAlbum} ownerPhoneNumber={ownerPhoneNumber} ownerAlbum={ownerAlbum} album_id={currentAlbum.id} popupContacts={popupContacts} oldShared={oldSharedUser} albumSettings={true} navigation={navigation} setSharedTo={setSharedTo} sharedTo={sharedTo} cutNumbers={true} />
                <PopupError />

            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.card,
        height: height,
    },
    cardText: {
        fontFamily: 'Arimo-Regular',
        fontSize: 17,
        alignSelf: 'center',
        left: width * 0.19
    },
    line: {
        alignSelf: 'center',
        borderWidth: 0.5,
        width: width * 0.85,
        borderColor: 'rgba(223,225,240,0.5)',
    },
    largeImage: {
        width: '100%',
        height: "50%"
    },
    card: {
        height: 197,
        backgroundColor: colors.card,
        borderRadius: 50
    },
    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.textInputBorder,
        height: 56,
        backgroundColor: colors.white,
        borderRadius: 6,
        alignSelf: 'center',
        width: width * 0.85,
        color: colors.black,
        position: 'relative',
        paddingHorizontal: 10,
    },
    save: {
        backgroundColor: colors.nextButton,
        height: 55,
        width: width * 0.5,
        borderRadius: 26,
        justifyContent: 'center',
    },
    errorText: {
        color: colors.red,
        position: 'absolute',
        bottom: -20,
        fontFamily: 'Arimo-Regular'
    }
})