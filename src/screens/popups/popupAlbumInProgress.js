import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../colors'
import Modal from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux'
import { setPopupAlbumInProgress, setPopupDeleteAlbum } from '../../redux'
import { VerticalSpace } from '../../utilities/verticalSpace'
import moment from 'moment'
import { getAlbumById } from '../../api'
import { countPhotosInAlbum } from '../../utilities/lpicturesCounter';
import PopupDeleteAlbum from './popupDeleteAlbum';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function PopupAlbumInProgress(props) {

    const dispatch = useDispatch()
    const { user, popupDeleteAlbum, popupAlbumInProgres } = useSelector(state => state.user)
    const { popupAlbums, item, navigation, setAlbumsReady,
        setAlbumsInProgress,
        setAlbumsFinished } = props
    const today = moment().format("YYYY-MM-DD HH:MM:SS")
    const [currentAlbum, setCurrentAlbum] = useState(item.picures);

    useEffect(() => {
        if (Object.keys(item).length > 0)
            getAlbum();
    }, [popupAlbums])

    const getAlbum = () => {
        getAlbumById(user.token, item.id).then(res => {
            const photosInAlbum = countPhotosInAlbum(item, user.userId)
            const album = {
                ...res.data,
                photosInAlbum
            }
            setCurrentAlbum(res.data)
        })
    }

    return (
        <>
            {Object.keys(item).length > 0 ?
                <View>
                    <Modal animationOutTiming={500} animationInTiming={500} onBackdropPress={() => dispatch(setPopupAlbumInProgress(false))} backdropColor={'rgb(220,219,223)'} isVisible={popupAlbumInProgres}>
                        <View style={styles.modal}>
                            <View style={[styles.container, { height: item.isAlbumLocked == '0' ? height * 0.55 : height * 0.45 }]}>
                                <View style={{ width: '85%', alignSelf: 'center', top: 20 }}>
                                    <View style={{ alignItems: 'flex-end', flexDirection: 'row-reverse' }}>
                                        {
                                            item.status == '4' ?
                                                <View style={{ flexDirection: 'row-reverse' }}>
                                                    <Image style={{ width: 60, height: 60 }} source={item.status == '3' ? require('../../../assets/images/iconsCircleAlbumOrdered.png') : require('../../../assets/images/iconsCircleAlbumReadyExpiresSoon2.png')} />
                                                    <View style={{ justifyContent: 'center', alignItems: 'flex-end', left: 10 }}>
                                                        <Text style={[{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'right' }, { width: item.albume_name.length > 18 ? '70%' : null }]}>{item.albume_name}</Text>
                                                        <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 13, textAlign: 'center', color: colors.maxImage }}>{item.status == '3' ? `הוזמן ${item.created.slice(0, 10).split('-').reverse().join('.')}` : `נוצר ${item.created.slice(0, 10).split('-').reverse().join('.')}`}</Text>
                                                    </View>
                                                </View> :
                                                item.isAlbumLocked == '0' ? // ready
                                                    <View style={{ flexDirection: 'row-reverse' }}>
                                                        <Image style={{ width: 60, height: 60 }} source={item.status == '1' ? require('../../../assets/images/iconsCircleAlbumReady.png') : item.status == '2' ? require('../../../assets/images/iconsCircleAlbumDefault.png') : require('../../../assets/images/iconsCircleAlbumOrdered.png')} />
                                                        <View style={{ justifyContent: 'center', alignItems: 'flex-end', left: 10 }}>
                                                            <Text style={[{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'right' }, { width: item.albume_name.length > 18 ? '70%' : null }]}>{item.albume_name}</Text>
                                                            <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 13, textAlign: 'center', color: colors.maxImage }}>{item.status == '3' ? `הוזמן ${item.created.slice(0, 10).split('-').reverse().join('.')}` : `נוצר ${item.created.slice(0, 10).split('-').reverse().join('.')}`}</Text>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View style={{ flexDirection: 'row-reverse' }}>
                                                        <Image style={{ width: 60, height: 60 }} source={item.status == '3' ? require('../../../assets/images/iconsCircleAlbumOrdered.png') : require('../../../assets/images/iconsCircleAlbumReadyLock2.png')} />
                                                        <View style={{ justifyContent: 'center', alignItems: 'flex-end', left: 10 }}>
                                                            <Text style={[{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'right' }, { width: item.albume_name.length > 18 ? '70%' : null }]}>{item.albume_name}</Text>
                                                            <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 13, textAlign: 'center', color: colors.maxImage }}>{item.status == '3' ? `הוזמן ${item.created.slice(0, 10).split('-').reverse().join('.')}` : `נוצר ${item.created.slice(0, 10).split('-').reverse().join('.')} (אלבום נעול לשינוים)`}</Text>
                                                        </View>
                                                    </View>
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' }}>
                                        <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, color: colors.whyPicIt, textAlign: 'center' }}>{item.photosInAlbum + ' / ' + item.max_images}</Text>
                                        <Image style={{ width: 20, height: 20 }} source={require('../../../assets/images/iconsPhoto.png')} />
                                    </View>
                                    <VerticalSpace height={0.03} />
                                    <View style={styles.line} />
                                    <VerticalSpace height={0.03} />
                                    {item.isAlbumLocked == 0 &&
                                        <>
                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate('AlbumSetting', { currentAlbum: item })
                                                dispatch(setPopupAlbumInProgress(false));
                                            }} >

                                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
                                                    <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 17, textAlign: 'right', right: 10 }}>{'הגדרות אלבום'}</Text>
                                                    <Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/iconsGreySetting.png')} />
                                                </View>
                                            </TouchableOpacity>
                                            <VerticalSpace height={0.03} />
                                            <View style={[styles.line, { borderWidth: 0.6, borderColor: colors.textInputBorder }]} />
                                            <VerticalSpace height={0.03} />
                                        </>}

                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}
                                        onPress={() => {
                                            // dispatch(setPopupAlbumInProgress(false))
                                            dispatch(setPopupDeleteAlbum(true))
                                        }}
                                    >
                                        <PopupDeleteAlbum
                                            item={item}
                                            popupDeleteAlbum={popupDeleteAlbum}
                                            setAlbumsReady={setAlbumsReady}
                                            setAlbumsInProgress={setAlbumsInProgress}
                                            setAlbumsFinished={setAlbumsFinished}
                                            navigation={navigation}
                                        />
                                        <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 17, color: colors.red, textAlign: 'right', right: 10 }}>{'מחיקת אלבום'}</Text>
                                        {/* <Text>Delete album</Text> */}
                                        <Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/iconsDeleteOutlined.png')} />
                                    </TouchableOpacity>
                                    <VerticalSpace height={0.03} />
                                    <View style={[styles.line, { borderWidth: 0.6, borderColor: colors.textInputBorder }]} />
                                    <VerticalSpace height={0.03} />

                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }} onPress={() => dispatch(setPopupAlbumInProgress(false))}>
                                        <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 17, textAlign: 'right', right: 10 }}>{'ביטול'}</Text>
                                        {/* <Text>Close</Text> */}
                                        <Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/iconsCircleX.png')} />
                                    </TouchableOpacity>
                                    <VerticalSpace height={0.03} />
                                </View>

                            </View>
                        </View>
                    </Modal>


                </View> : null}

        </>
    );

}

const styles = StyleSheet.create({
    container: {
        elevation: 3,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        width: width,
        height: height * 0.55,
        backgroundColor: colors.white,
        alignSelf: 'center',
        overflow: 'hidden',
        top: height * 0.03
    },
    cardText: {
        textAlign: 'right'
    },
    modal: {
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    line: {
        alignSelf: 'center',
        borderWidth: 2,
        width: width * 0.85,
        borderColor: colors.album,
    },
});
