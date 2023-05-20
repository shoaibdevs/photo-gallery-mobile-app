import React from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    TouchableOpacity,
    Image
} from "react-native";
import Modal from 'react-native-modal'
import { useDispatch } from "react-redux";
import { colors } from '../../colors'
import { setpopupSharedInvintationSent } from "../../redux";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function PopupSharedInvintationSent(props) {
    const dispatch = useDispatch()
    const { popupSharedInvintationSent, item, addToShared, resendinvite ,removedContactFromShared} = props

    return <>
        {item !== null ? (
            <Modal isVisible={popupSharedInvintationSent}>
                <View style={styles.modal}>
                    <View style={styles.container}>
                        <View style={{ width: '85%', alignSelf: 'center', top: 20 }}>

                            <View style={{ alignItems: 'flex-end', flexDirection: 'row-reverse' }}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontFamily: 'Arimo-Bold',
                                            padding: 10,
                                            paddingTop: 15,
                                            paddingBottom: 30
                                        }}
                                    >
                                        {`${item.givenName} ${item.familyName}`}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    dispatch(setpopupSharedInvintationSent(false))
                                    resendinvite()
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    marginTop: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Arimo-Bold',
                                        fontSize: 17,
                                        color: colors.gray,
                                        textAlign: 'right',
                                        right: 10
                                    }}
                                >
                                    {'שליחת הזמנה נוספת'}
                                </Text>
                                <Image
                                    style={{ width: 25, height: 25 }}
                                    source={require('../../../assets/images/resendInvite.png')}
                                />
                            </TouchableOpacity>

                            <View
                                style={[styles.line, { borderWidth: 0.6, borderColor: colors.textInputBorder, marginTop: 25 }]}
                            />

                            <TouchableOpacity
                                onPress={() => {
                                    removedContactFromShared(item)
                                    dispatch(setpopupSharedInvintationSent(false))
                                    console.log("remove mself")
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    marginTop: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Arimo-Regular',
                                        fontSize: 17, color:
                                            colors.red,
                                        textAlign: 'right',
                                        right: 10
                                    }}
                                >
                                    {'הסרת הרשאת שיתוף'}
                                </Text>
                                <Image
                                    style={{ width: 25, height: 25 }}
                                    source={require('../../../assets/images/removeContactFromShared.png')}
                                />
                            </TouchableOpacity>

                            <View
                                style={[styles.line, { borderWidth: 0.6, borderColor: colors.textInputBorder, marginTop: 25 }]}
                            />

                            <TouchableOpacity
                                onPress={() => dispatch(setpopupSharedInvintationSent(false))}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    marginTop: 20,
                                }}

                            >
                                <Text
                                    style={{
                                        fontFamily: 'Arimo-Bold',
                                        fontSize: 17,
                                        color: colors.gray,
                                        textAlign: 'right',
                                        right: 10
                                    }}
                                >
                                    {'ביטול'}
                                </Text>
                                <Image
                                    style={{ width: 25, height: 25 }}
                                    source={require('../../../assets/images/popupSharedInvintationSent.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        ) : null}
    </>
}

const styles = StyleSheet.create({
    modal: {
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    container: {
        elevation: 3,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        width: width,
        height: height * 0.45,
        backgroundColor: colors.white,
        alignSelf: 'center',
        overflow: 'hidden',
        top: height * 0.03
    },
    line: {
        alignSelf: 'center',
        borderWidth: 2,
        width: width * 0.85,
        borderColor: colors.album,
        marginTop: 40,
    },
})