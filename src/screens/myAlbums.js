import React, { Component, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableHighlight, FlatList, TouchableOpacity, Platform, } from 'react-native';
import { VerticalSpace } from '../utilities/verticalSpace'
import { colors } from '../colors'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import PopupAlbums from './popups/popupAlbum'
import { setPopupAlbum, setPopupAlbumInProgress, setPopupError, setPopupOrderedAlbum, setRouteFromNotification } from '../redux'
import { fetchAlbumsData } from '../helpers/albumHelper';
import { checkNetInfo } from '../helpers/albumHelper';
import { countPhotosInAlbum } from '../utilities/lpicturesCounter';
import PopupOrderedAlbum from './popups/popupOrderedAlbum';
import PopupDeleteAlbum from './popups/popupDeleteAlbum';
import AnimatedLoader from 'react-native-animated-loader';
import PopupAlbumInProgress from './popups/popupAlbumInProgress';
import PopupError from './popups/popupError';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function myAlbums({ navigation }) {
    const [chosen, setChosen] = useState('1')
    const { user, popupAlbum, albums, popupOrderedAlbum, popupDeleteAlbum } = useSelector(state => state.user)
    const [albumsReady, setAlbumsReady] = useState([])
    const [albumsInProgress, setAlbumsInProgress] = useState([])
    const [albumsFinished, setAlbumsFinished] = useState([])
    const [chosenAlbum, setChosenAlbum] = useState({})
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const today = moment().format("YYYY-MM-DD HH:MM:SS");
    
     async function fetchAlbum() {  //++
        setLoading(true)
        setAlbumsFinished([])
        setAlbumsReady([])
        setAlbumsInProgress([])
        // console.log('response', userInfo.token);
        var result = await fetchAlbumsData();
        if(result == -1){
            setLoading(false);
        }
        else if (result != 0) {
            result.data.forEach(album => {
                const photosInAlbum = countPhotosInAlbum(album, user.userId)
                const newAlbum = {
                    ...album,
                    photosInAlbum
                }
                // console.log('checking', album.status, album)
                if (album.status == '1') {
                    setAlbumsReady(prevState => [...prevState, newAlbum]);
                }
                else if (album.status == '2') {
                    setAlbumsInProgress(prevState => [...prevState, newAlbum])
                }
                else {
                    setAlbumsFinished(prevState => [...prevState, newAlbum])
                }
            })
            setLoading(false)
        } else {
            dispatch(setPopupError(true))
            setLoading(false)
        }
    }

    // async function fetchAlbumsCall() {
        
    //     const userInfoString = await AsyncStorage.getItem('userInfo');
    //     const userInfo = JSON.parse(userInfoString);
    //     fetchAlbums(userInfo.token).then(response => {
    //         console.log('checkU')
           
    //     })
    // }

    useEffect(() => { //++
        setLoading(true)
        const unsubscribed = navigation.addListener('didFocus', () => {
            setLoading(true)
            fetchAlbum()
        })
        fetchAlbum()
        dispatch(setRouteFromNotification(''))
        return unsubscribed
    }, [])

    return (
        <View style={styles.container}>
            <AnimatedLoader //++
                visible={loading}
                overlayColor="rgba(255,255,255,0.75)"
                source={require("../../assets/picitLoader.json")}
                animationStyle={{ width: 100, height: 100 }}
                speed={1}
            ></AnimatedLoader>
            <Image source={require('../../assets/images/coverBackgroundsiImgBackgroundCover2.png')} />
            <View style={{ alignItems: 'center', bottom: 100 }}>
                <View style={{ flexDirection: 'row-reverse', width: '90%', bottom: 60 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Camera')} style={{ alignSelf: 'flex-end' }} >
                        <Image source={require('../../assets/images/buttonsNavBar.png')} />
                    </TouchableOpacity>
                    <Text style={styles.cardText}>{'האלבומים שלי'}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.white, height: height, bottom: 50, }}>
                    <VerticalSpace height={0.03} />
                    <ScrollView
                        horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', direction: 'rtl', transform: [{ scaleX: Platform.OS == 'android' ? -1 : 1 }] }} >
                        <View style={{ flexDirection: Platform.OS == 'ios' ? 'row-reverse' : 'row', transform: [{ scaleX: Platform.OS == 'android' ? -1 : 1 }] }}>
                            <TouchableOpacity onPress={() => setChosen('4')} style={{
                                backgroundColor: chosen == '4' ? colors.register : colors.album,
                                height: 45,
                                width: 120,
                                borderRadius: 19,
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 5
                            }}>
                                <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                    <Text style={{ color: chosen === '4' ? colors.white : colors.black, fontSize: 12, fontFamily: 'Arimo-Bold', }}>{'הסתיימו'}</Text>
                                    {/* <Text>Are over</Text> */}
                                    {chosen == '4' ? <Image source={require('../../assets/images/iconsCircleCheckWhite.png')} /> : null}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setChosen('3')} style={{
                                backgroundColor: chosen == '3' ? colors.register : colors.album,
                                height: 45,
                                width: 120,
                                borderRadius: 19,
                                justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center',
                                margin: 5
                            }}>
                                <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                    <Text style={{ color: chosen === '3' ? colors.white : colors.black, fontSize: 12, fontFamily: 'Arimo-Bold', }}>{'בתהליך'}</Text>
                                    {/* <Text>in progress</Text> */}
                                    {chosen == '3' ? <Image source={require('../../assets/images/iconsCircleCheckWhite.png')} /> : null}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setChosen('2')} style={{
                                backgroundColor: chosen == '2' ? colors.register : colors.album,
                                height: 45,
                                width: 120,
                                borderRadius: 19,
                                justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center',
                                margin: 5
                            }}>
                                <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                    <Text style={{ color: chosen === '2' ? colors.white : colors.black, fontSize: 12, fontFamily: 'Arimo-Bold', }}>{'מוכנים להדפסה'}</Text>
                                    {/* <Text>Ready to print</Text> */}
                                    {chosen == '2' ? <Image source={require('../../assets/images/iconsCircleCheckWhite.png')} /> : null}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setChosen('1')} style={{
                                backgroundColor: chosen == '1' ? colors.register : colors.album,
                                height: 45,
                                width: 120,
                                borderRadius: 19,
                                justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center',
                                margin: 5
                            }}>
                                <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                    <Text style={{ color: chosen === '1' ? colors.white : colors.black, fontSize: 12, fontFamily: 'Arimo-Bold', }}>{'הצג הכל'}</Text>
                                    {/* <Text>Show all</Text> */}
                                    {chosen == '1' ? <Image source={require('../../assets/images/iconsCircleCheckWhite.png')} /> : null}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <VerticalSpace height={0.03} />
                    {chosen == '1' || chosen == '2' ?
                        <View style={{ width: width * 0.8, alignSelf: 'center', alignItems: 'flex-end' }}>
                            <Text style={styles.title}>{'אלבומים מוכנים להדפסה'}</Text>
                            {/* <Text>Albums Ready</Text> */}
                            <VerticalSpace height={0.03} />
                            <FlatList
                                data={albumsReady}
                                numColumns={2}
                                contentContainerStyle={{ alignItems: 'flex-end' }}
                                scrollEnabled={false}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableHighlight underlayColor={colors.hover} onPress={() => {
                                            setChosenAlbum(item);
                                            dispatch(setPopupAlbum(true));
                                        }} style={{ borderRadius: 20, width: width * 0.4 }}>
                                            <View style={{ bottom: 10 }}>
                                                <VerticalSpace height={0.03} />
                                                {
                                                    item.isAlbumLocked === '0'
                                                        ? <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/iconsCircleAlbumReady.png')} />
                                                        : <Image style={{ alignSelf: 'center', width: 104, height: 102 }} source={require('../../assets/images/iconsCircleAlbumReadyLockGreen.png')} />
                                                }
                                                <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 15, textAlign: 'center' }}>{item.albume_name}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 13, color: colors.maxImage, textAlign: 'center' }}>{item.photosInAlbum + ' / ' + item.max_images}</Text>
                                                    <Image source={require('../../assets/images/iconsPhoto.png')} />
                                                </View>
                                            </View>
                                        </TouchableHighlight>

                                    )
                                }}
                            />
                        </View> : null}
                    {chosen == '1' ? <View style={styles.line} /> : null}
                    {chosen == '1' || chosen == '3' ?
                        <View style={{ width: width * 0.8, alignSelf: 'center', alignItems: 'flex-end' }}>
                            <Text style={styles.title}>{'אלבומים בתהליך צבירה'}</Text>
                            {/* <Text style={styles.title}>Albums in progress</Text> */}
                            <VerticalSpace height={0.03} />
                            <FlatList
                                data={albumsInProgress}
                                numColumns={2}
                                contentContainerStyle={{ alignItems: 'flex-end' }}
                                scrollEnabled={false}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableHighlight underlayColor={colors.hover} onPress={() => { setChosenAlbum(item); dispatch(setPopupAlbumInProgress(true)) }} style={{ borderRadius: 20, width: width * 0.4 }}>
                                            <View style={{ bottom: 10 }}>
                                                <VerticalSpace height={0.03} />
                                                {
                                                    item.isAlbumLocked == '0' ?
                                                        <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/iconsCircleAlbumDefault.png')} />
                                                        :
                                                        <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/iconsCircleAlbumReadyLock2.png')} />
                                                }
                                                <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 15, textAlign: 'center' }}>{item.albume_name}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 13, color: colors.maxImage, textAlign: 'center' }}>{item.photosInAlbum + ' / ' + item.max_images}</Text>
                                                    <Image source={require('../../assets/images/iconsPhoto.png')} />
                                                </View>
                                            </View>
                                        </TouchableHighlight>

                                    )
                                }}
                            />
                        </View> : null}
                    {chosen == '1' ? <View style={styles.line} /> : null}
                    {chosen == '1' || chosen == '4' ?
                        <View style={{ width: width * 0.8, alignSelf: 'center', alignItems: 'flex-end' }}>
                            <Text style={styles.title}>{'אלבומים שהוזמנו'}</Text>
                            {/* <Text style={styles.title}>Invited albums</Text> */}
                            <VerticalSpace height={0.03} />

                            <FlatList
                                data={albumsFinished}
                                numColumns={2}
                                contentContainerStyle={{ alignItems: 'flex-end' }}
                                style={{ paddingBottom: 100 }}
                                scrollEnabled={false}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableHighlight underlayColor={colors.hover} onPress={() => { setChosenAlbum(item); dispatch(setPopupOrderedAlbum(true)) }} style={{ borderRadius: 20, width: width * 0.4 }}>
                                            <View style={{ bottom: 10 }}>
                                                <VerticalSpace height={0.03} />
                                                <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/iconsCircleAlbumOrdered.png')} />
                                                <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 15, textAlign: 'center' }}>{item.albume_name}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 13, color: colors.maxImage, textAlign: 'center' }}>{item.photosInAlbum + ' / ' + item.max_images}</Text>
                                                    <Image source={require('../../assets/images/iconsPhoto.png')} />
                                                </View>
                                            </View>
                                        </TouchableHighlight>

                                    )
                                }}
                            />
                        </View> : null}
                    <VerticalSpace height={0.05} />
                </ScrollView>
            </View>

            <PopupAlbums popupAlbums={popupAlbum}
                item={chosenAlbum}
                setAlbumsReady={setAlbumsReady}
                setAlbumsInProgress={setAlbumsInProgress}
                setAlbumsFinished={setAlbumsFinished}
                navigation={navigation} />
            {popupOrderedAlbum &&
                <PopupOrderedAlbum
                    item={chosenAlbum}
                    navigation={navigation}
                    popupOrderedAlbum={popupOrderedAlbum}
                />}
            <PopupAlbumInProgress
                popupAlbums={popupAlbum}
                item={chosenAlbum}
                setAlbumsReady={setAlbumsReady}
                setAlbumsInProgress={setAlbumsInProgress}
                setAlbumsFinished={setAlbumsFinished}
                navigation={navigation}
            />
            <PopupError />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        height: height,
    },
    cardText: {
        fontFamily: 'Arimo-Regular',
        fontSize: 17,
        alignSelf: 'center',
        left: width * 0.25
    },
    line: {
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 10,
        width: width,
        borderColor: colors.album,
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
    title: {
        textAlign: 'right',
        fontFamily: 'Arimo-Bold',
        fontSize: 20
    }

});
