import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Platform, TextInput } from 'react-native';
import { VerticalSpace } from '../../utilities/verticalSpace'
import { colors } from '../../colors'

const width = Dimensions.get('window').width;

export default function FirstSetting({ setAlbumName, albumName }) {
  const [isFocused, setIsFocused] = useState(false)

  return (

    <View style={styles.container}>
      <View style={{ width: '90%', alignItems: 'center', alignSelf: 'center' }}>
        <Image source={require('../../../assets/images/imgBackgroundCover.png')} />
        <View style={{ position: 'absolute', alignSelf: 'flex-end', top: 80 }}>
          <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{'האלבום'}</Text>
          <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{'הראשון שלי!'}</Text>
          <VerticalSpace height={0.03} />
          <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{'בואו ניצור את האלבום הראשון יחד!'}</Text>
          <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{'איך נקרא לו?'}</Text>
          <VerticalSpace height={0.03} />
          <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 15, textAlign: 'center', top: 25 }]}>{'שם האלבום'}</Text>
          <TextInput
            value={albumName}
            onChangeText={txt => setAlbumName(txt)}
            placeholder={`האלבום${"\n"}הראשון שלי!`}
            maxLength={36}
            blurOnSubmit={true}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor={colors.textInputBorder}
            multiline={true}
            style={{
              fontFamily: 'Arimo-Regular',
              textAlign: 'center',
              paddingTop: Platform.OS == 'ios' ? 50 : 0,
              borderWidth: 1,
              borderColor: isFocused ? colors.secondary : colors.textInputBorder,
              height: 190,
              width: width * 0.88,
              fontSize: 34,
              borderRadius: 20,
              right: 5,
              color: colors.black,
            }}
          />
          <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 15, textAlign: 'center', bottom: 23, color: colors.whyPicIt }]}>{`${albumName.length}/36`}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  cardText: {
    textAlign: 'right'
  }
});
