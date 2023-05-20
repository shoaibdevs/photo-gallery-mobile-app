import React from "react";
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import Modal from 'react-native-modal';
import { useDispatch } from "react-redux";
import { setPopupOrderedAlbum } from "../../redux";
import { colors } from "../../colors";
import { VerticalSpace } from '../../utilities/verticalSpace'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PopupOrderedAlbum = (props) => {
    const dispatch = useDispatch()
    const { item, navigation, popupOrderedAlbum } = props

    return (
        popupOrderedAlbum ?
            (
                <View>
                    <Modal animationOutTiming={500} animationInTiming={500} onBackdropPress={() => dispatch(setPopupOrderedAlbum(false))} backdropColor={'rgb(220,219,223)'} isVisible={popupOrderedAlbum}>
                        <View style={styles.modal}>
                            <View style={styles.container}>
                                <View style={{ width: '85%', alignSelf: 'center', top: 20 }}>
                                    <View style={{ alignItems: 'flex-end', flexDirection: 'row-reverse' }}>
                                        <View style={{ flexDirection: 'row-reverse' }}>
                                            <Image style={{ width: 60, height: 60 }}
                                                source={item.status == '1' ? require('../../../assets/images/iconsCircleAlbumReady.png') :
                                                    item.status == '2' ? require('../../../assets/images/iconsCircleAlbumDefault.png') :
                                                        require('../../../assets/images/iconsCircleAlbumOrdered.png')}
                                            />
                                            <View style={{ justifyContent: 'center', alignItems: 'flex-end', left: 10 }}>
                                                <Text style={[{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'right' }, { width: item.albume_name.length > 18 ? '55%' : null }]}>{item.albume_name}</Text>
                                                <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 13, textAlign: 'center', color: colors.maxImage }}>{item.status == '3' ? `הוזמן ${item.created.slice(0, 10)?.split('-').reverse()?.join('.')}` : `נוצר ${item.created.slice(0, 10)?.split('-')?.reverse()?.join('.')}`}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' }}>
                                        <Text style={{ marginRight: 5, fontFamily: 'Arimo-Bold', fontSize: 17, color: colors.whyPicIt, textAlign: 'center' }}>{item.photosInAlbum}</Text>
                                        <Image style={{ width: 20, height: 20 }} source={require('../../../assets/images/iconsPhoto.png')} />
                                    </View>

                                    <VerticalSpace height={0.03} />
                                    <View style={styles.line} />
                                    <VerticalSpace height={0.03} />

                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}
                                        onPress={() => {
                                            navigation.navigate('OrderInfo', { currentAlbum: item })
                                            dispatch(setPopupOrderedAlbum(false))
                                        }}
                                    >
                                        <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, color: colors.register, textAlign: 'right', right: 10 }}>{'הזמנת עותק נוסף'}</Text>
                                        <Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/iconGreyRefresh.png')} />
                                    </TouchableOpacity>

                                    <VerticalSpace height={0.03} />
                                    <View style={[styles.line, { borderWidth: 0.6, borderColor: colors.textInputBorder }]} />
                                    <VerticalSpace height={0.03} />

                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}
                                        onPress={() => {

                                        }}
                                    >
                                        <Text style={{ fontFamily: 'Arimo-Bold', fontSize: 17, textAlign: 'right', right: 10 }}>{'פרטי הזמנה'}</Text>
                                        <Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/iconsInfoGreySquare.png')} />
                                    </TouchableOpacity>

                                    <VerticalSpace height={0.03} />
                                    <View style={[styles.line, { borderWidth: 0.6, borderColor: colors.textInputBorder }]} />
                                    <VerticalSpace height={0.03} />

                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }} onPress={() => dispatch(setPopupOrderedAlbum(false))}>
                                        <Text style={{ fontFamily: 'Arimo-Regular', fontSize: 17, textAlign: 'right', right: 10 }}>{'ביטול'}</Text>
                                        <Image style={{ width: 25, height: 25 }} source={require('../../../assets/images/iconsCircleX.png')} />
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>

            ) : null
    )

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
        bottom: 0,

    },
    line: {
        alignSelf: 'center',
        borderWidth: 2,
        width: width * 0.85,
        borderColor: colors.album,
    },
});

export default PopupOrderedAlbum