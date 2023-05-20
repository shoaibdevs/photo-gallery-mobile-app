import React, { Component, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ImageBackground, TouchableOpacity } from 'react-native'
import { VerticalSpace } from '../utilities/verticalSpace'
import { colors } from '../colors'
import Button from '../utilities/button'
import coverImg from '../../assets/images/coverPhotosImgDialogCoverWireframe1.png'
import coverImg2 from '../../assets/images/coverPhotosImgDialogCoverWireframe2.png'
import coverImg3 from '../../assets/images/coverPhotosImgDialogCoverWireframe3.png'


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function UseGuideInfo({ navigation }) {

    const buttonStyles = {
        backgroundColor: colors.nextButton,
        color: colors.black,
        height: 64,
        fontSize: 17,
        width: 196,
        borderRadius: 26,
        fontFamily: 'Arimo-Bold',
        justifyContent: 'center',
        bottom: 12
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <Image source={require('../../assets/images/imgBackgroundCover.png')} style={{ height: 215, left: 8 }} />
                <View style={{ width: '90%', alignSelf: 'center', marginTop: -175 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ width: '33%' }}></View>
                        <View style={{ width: '33%' }}><Text style={{ textAlign: 'center', fontSize: 17, color: colors.primary, fontFamily: 'Arimo-Regular', marginLeft: 10 }}>{'מדריך שימוש'}</Text></View>
                        <View style={{ width: '33%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { navigation.navigate('Camera'); navigation.openDrawer() }}>
                                <Image source={require('../../assets/images/buttonsNavBar.png')} style={{ height: 40, width: 40 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34, marginTop: 20 }]}>{'אז מה עושים'}</Text>
                    <VerticalSpace height={0.03} />
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`תתחדשו! יש לכם מצלמה חדשה וקוראים${'\n'}לה Pic.it`}</Text>
                    <VerticalSpace height={0.03} />
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`מהיום פותחים רק אותה במקום המצלמה${'\n'}הישנה.`}</Text>
                    <VerticalSpace height={0.03} />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                        <Image style={{ width: 315, height: 197 }} source={coverImg} />
                    </View>
                    <VerticalSpace height={0.03} />
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{`מצלמים`}</Text>
                    <VerticalSpace height={0.03} />
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`פותחים את המצלמה של Pic.it ומצלמים את${'\n'}הרגעים החשובים לכם.`}</Text>
                    <VerticalSpace height={0.03} />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                        <Image style={{ width: 315, height: 197 }} source={coverImg2} />
                    </View>
                    <VerticalSpace height={0.03} />
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{`בוחרים`}</Text>
                    <VerticalSpace height={0.03} />
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`בוחרים לאיזה אלבום לצרף את התמונה${'\n'}שצילמתם.`}</Text>
                    <VerticalSpace height={0.03} />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                        <Image style={{ width: 315, height: 197 }} source={coverImg3} />
                    </View>
                    <ImageBackground style={{ width: width, alignSelf: 'center', }} source={require('../../assets/images/coverBackgroundsiImgBackgroundCover2.png')}>
                        <VerticalSpace height={0.03} />
                        <View style={{ width: '90%', alignSelf: 'center' }}>
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{`מזמינים`}</Text>
                            <VerticalSpace height={0.03} />
                            <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{`מזמינים אלבום תמונות דיגיטלי כשמקבלים${'\n'}הודעה שהוא מלא ומוכן להדפסה.`}</Text>
                        </View>
                    </ImageBackground>
                </View>
                <VerticalSpace height={0.03} />
                <View style={{ flexDirection: 'row', alignItems: 'center', top: 15, left: 15 }}>
                    <Button text="המשך" buttonStyles={buttonStyles} onPress={() => {
                        navigation.navigate('Camera');
                        navigation.openDrawer()
                    }} />
                    <Image style={{ right: 74, bottom: 1 }} source={require('../../assets/images/iconsCircleCheck.png')} />
                </View>
                <VerticalSpace height={0.08} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: 'transparent',
        backgroundColor: colors.white,
        height: height,
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
