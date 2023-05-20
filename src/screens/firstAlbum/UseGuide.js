import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ImageBackground } from 'react-native'
import { VerticalSpace } from '../../utilities/verticalSpace'
import { colors } from '../../colors'
import BeginAlbum from './BeginAlbum'
import { useSelector } from 'react-redux'
import coverImg from '../../../assets/images/coverPhotosImgDialogCoverWireframe1.png'
import coverImg2 from '../../../assets/images/coverPhotosImgDialogCoverWireframe2.png'
import coverImg3 from '../../../assets/images/coverPhotosImgDialogCoverWireframe3.png'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function UseGuide({ navigation, shared, albumName, createdDate, deadLine }) {
    const { popupBegin } = useSelector(state => state.user)

    return (
        <View style={styles.container}>
            <ImageBackground imageStyle={{ width: width, height: 215 }} style={{ height: height, width: width, alignSelf: 'center', }} source={require('../../../assets/images/imgBackgroundCover.png')}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 210 }} style={{ backgroundColor: colors.white, top: 100 }}>
                    <View style={{ width: '90%', alignSelf: 'center', }}>
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34, }]}>{'אז מה עושים'}</Text>
                        <VerticalSpace height={0.03} />
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`תתחדשו! יש לכם מצלמה חדשה וקוראים${'\n'}לה Pic.it`}</Text>
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`מהיום פותחים רק אותה במקום המצלמה${'\n'}הישנה.`}</Text>
                        <VerticalSpace height={0.03} />
                        <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                            <Image style={{ width: 315, height: 197 }} source={coverImg} />
                        </View>
                        <VerticalSpace height={0.03} />
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{`מצלמים`}</Text>
                        <VerticalSpace height={0.01} />
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`פותחים את המצלמה של Pic.it ומצלמים את${'\n'}הרגעים החשובים לכם.`}</Text>
                        <VerticalSpace height={0.03} />
                        <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                            <Image style={{ width: 315, height: 197 }} source={coverImg2} />
                        </View>
                        <VerticalSpace height={0.03} />
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{`בוחרים`}</Text>
                        <VerticalSpace height={0.01} />
                        <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`בוחרים לאיזה אלבום לצרף את התמונה${'\n'}שצילמתם.`}</Text>
                        <VerticalSpace height={0.03} />
                        <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                            <Image style={{ width: 315, height: 197 }} source={coverImg3} />
                        </View>
                        <ImageBackground style={{ width: width, alignSelf: 'center', }} source={require('../../../assets/images/coverBackgroundsiImgBackgroundCover2.png')}>
                            <VerticalSpace height={0.03} />
                            <View style={{ width: '90%', alignSelf: 'center' }}>
                                <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{`מזמינים`}</Text>
                                <VerticalSpace height={0.01} />
                                <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`מזמינים אלבום תמונות דיגיטלי כשמקבלים${'\n'}הודעה שהוא מלא ומוכן להדפסה.`}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                </ScrollView>
                <BeginAlbum navigation={navigation} popupBegin={popupBegin} shared={shared} albumName={albumName} createdDate={createdDate} deadLine={deadLine} />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        height: height * 1.1,
    },
    cardText: {
        textAlign: 'right'
    },
    line: {
        borderWidth: 0.5,
        borderColor: colors.textInputBorder,
    },
    largeImage: {
        width: '100%',
        height: "50%"
    },
    card: {
        height: 197,
        backgroundColor: colors.card,
        borderRadius: 50
    }
});

