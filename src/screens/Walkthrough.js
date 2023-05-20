import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { colors } from '../colors'
import { VerticalSpace } from '../utilities/verticalSpace'
import Swiper from '../utilities/swiper';

const { height, width } = Dimensions.get('window');
const RatioH = height / 812;
const RatioW = width / 375;

const windowHeight = Dimensions.get('window').height;

export default class Walkthrough extends Component {
  render() {
    console.log(windowHeight);
    return (
        <Swiper screen={'Walkthrough'} navigation={this.props.navigation} >
          {/* First screen */}
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ flex: 1 }} horizontal={false} >
            <View style={[styles.container]}>
              <Image style={{ width: '100%', height: '70%' }} source={require('../../assets/images/Walkthrough1.png')} />
              <View style={styles.card}>
                <View style={{ width: '86%', alignSelf: 'center' }}>
                  <VerticalSpace height={0.01} />
                  <Text style={styles.emoji}>{'😀'}</Text>
                  <VerticalSpace height={0.01} />
                  <Text style={[styles.cardText, { fontSize: 34, fontFamily: 'Arimo-Bold', }]}>{'מה זה Pic.it?'}</Text>
                  <VerticalSpace height={0.01} />
                  <Text style={[styles.cardText, { fontSize: 17, fontFamily: 'Arimo-Regular' }]}>{"\u200E" + `היא מצלמה חברתית חכמה שמייצרת` + ' Pic.it'}</Text>
                  <Text style={[styles.cardText, { fontSize: 17, fontFamily: 'Arimo-Regular' }]}>{'בקלות אלבומי תמונות עד הבית.'}</Text>
                  <Text style={[styles.cardText, { fontSize: 17, fontFamily: 'Arimo-Regular' }]}>{'פשוט מצלמים, בוחרים רגעים ומזמינים אלבום.'}</Text>
                </View>
              </View>
            </View>
          </ScrollView >
          {/* Second screen */}
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ flex: 1 }} horizontal={false} >
            <View style={[styles.container]}>
              <Image style={{ width: '100%', height: '70%' }} source={require('../../assets/images/Walkthrough2.png')} />
              <View style={styles.card}>
                <View style={{ width: '86%', alignSelf: 'center' }}>
                  <VerticalSpace height={0.01} />
                  <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                    <Text style={[styles.cardText, { fontSize: 15, fontFamily: 'Arimo-Regular', color: colors.whyPicIt, alignSelf: 'flex-end' }]}>{'למה Pic.it?'}</Text>
                    <Text style={styles.emoji}>{'🐥'}</Text>
                  </View>
                  <VerticalSpace height={0.01} />
                  <Text style={[styles.cardText, { fontSize: 34, fontFamily: 'Arimo-Bold', alignSelf: 'flex-end' }]}>{`אין לנו זמן או כוח למיין!`}</Text>
                  <VerticalSpace height={0.01} />
                  <Text style={[styles.cardText, { fontSize: 17, fontFamily: 'Arimo-Regular' }]}>{`בוחרים ברגע הצילום רק מה שמתאים ומזמינים אלבומי תמונות בלי להמתין.`}</Text>
                </View>
              </View>
            </View>
          </ScrollView >
          {/* Third screen */}
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ flex: 1 }} horizontal={false} >
            <View style={[styles.container, { backgroundColor: '#313634' }]}>
              <Image style={{ width: '100%', height: '70%' }} source={require('../../assets/images/Walkthrough3.png')} />
              <View style={styles.card}>
                <View style={{ width: '86%', alignSelf: 'center' }}>
                  <VerticalSpace height={0.01} />
                  <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                    <Text style={[styles.cardText, { fontSize: 15, fontFamily: 'Arimo-Regular', color: colors.whyPicIt, alignSelf: 'flex-end' }]}>{'למה Pic.it?'}</Text>
                    <Text style={styles.emoji}>{'🌩'}</Text>
                  </View>
                  <VerticalSpace height={0.01} />
                  <Text style={[styles.cardText, { fontSize: 34, fontFamily: 'Arimo-Bold', alignSelf: 'flex-end' }]}>{`שטח האחסון עומד להסתיים!`}</Text>
                  <VerticalSpace height={0.01} />
                  <Text style={[styles.cardText, { fontSize: 17, fontFamily: 'Arimo-Regular' }]}>{`מה שלא יעבור לאלבום ייאבד או יעלה הרבה מאוד כסף. סיפור אמיתי, לא נגענו.`}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          {/* Forth screen */}
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ flex: 1 }} horizontal={false} >
            <View style={[styles.container]}>
              <Image style={{ width: '100%', height: '70%' }} source={require('../../assets/images/Walkthrough4.png')} />
              <View style={styles.card}>
                <View style={{ width: '86%', alignSelf: 'center' }}>
                  <VerticalSpace height={0.01} />
                  <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                    <Text style={[styles.cardText, { fontSize: 15, fontFamily: 'Arimo-Regular', color: colors.whyPicIt, alignSelf: 'flex-end' }]}>{'למה Pic.it?'}</Text>
                    <Text style={styles.emoji}>{'🌈'}</Text>
                  </View>
                  <VerticalSpace height={0.01} />
                  <Text style={[styles.cardText, { fontSize: 34, fontFamily: 'Arimo-Bold', alignSelf: 'flex-end' }]}>{`לחלוק עם אחרים זה הרבה יותר כיף!`}</Text>
                  <VerticalSpace height={0.01} />
                  <Text style={[styles.cardText, { fontSize: 17, fontFamily: 'Arimo-Regular' }]}>{`תוכלו ליצור אלבומים עם מי שתרצו, לשתף באלבומים קיימים ולשלוח מזכרות לסבתות תוך כדי.`}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          {/* Fifth screen */}
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ flex: 1 }} horizontal={false} >
            <View style={[styles.container]}>
              <Image style={{ width: '100%', height: '70%' }} source={require('../../assets/images/Walkthrough5.png')} />
              <View style={styles.card}>
                <View style={{ width: '86%', alignSelf: 'center' }}>
                  <VerticalSpace height={0.01} />
                  <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                    <Text style={[styles.cardText, { fontSize: 15, fontFamily: 'Arimo-Regular', color: colors.whyPicIt, alignSelf: 'flex-end' }]}>{'למה Pic.it?'}</Text>
                    <Text style={styles.emoji}>{'🎉'}</Text>
                  </View>
                  <VerticalSpace height={0.01} />
                  <Text style={[styles.cardText, { fontSize: 34, fontFamily: 'Arimo-Bold', alignSelf: 'flex-end' }]}>{`המחיר קבוע ואין הפתעות`}</Text>
                  <VerticalSpace height={0.01} />
                  <Text style={[styles.cardText, { fontSize: 17, fontFamily: 'Arimo-Regular', writingDirection: "rtl" }]}>{`לא משנה אם תגדילו את מכסת התמונות או תרצו לשתף אלבומים, המחיר יישאר תמיד רק 79 ש"ח לאלבום!`}</Text>

                </View>
              </View>
            </View>
          </ScrollView>
        </Swiper>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 100,
    height: 386,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    // top:'55%'
  },
  emoji: {
    fontSize: 40,
    textAlign: 'right',
    left: 10
  },
  cardText: {
    textAlign: 'right'
  },
});
