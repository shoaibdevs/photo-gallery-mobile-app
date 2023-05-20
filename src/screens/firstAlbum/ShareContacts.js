import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { VerticalSpace } from '../../utilities/verticalSpace'
import { colors } from '../../colors'
import Button from '../../utilities/button'
import { useSelector } from 'react-redux'
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function ShareContacts({ setShared, shared }) {
    const { contacts } = useSelector(state => state.user)
    const [searchStr, setSearchStr] = useState('');
    const [isFocused, setIsFocused] = useState(false)

    const buttonStyles = {
        backgroundColor: colors.register,
        color: colors.white,
        height: 45,
        fontSize: 12,
        width: 105,
        borderRadius: 19,
        justifyContent: 'center',
        fontFamily: 'Arimo-Bold',
        bottom: 12,
    }


    function addToShared(item) { //++
        if (shared.includes(item)) {
            const newList = shared.filter((contact) => contact !== item);
            setShared(newList)
        } else {
            setShared(shared => [...shared, item])
        }
    }

    const renderItem = (item) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 60, width: '100%' }}>
                {shared.length && shared.map(item => item.recordID).includes(item.recordID)
                    ? <TouchableOpacity onPress={() => { console.log('remove from share'); addToShared(item) }} style={{ marginLeft: 31 }}>
                        <Image style={{ height: 33, width: 34, bottom: 2 }} source={require('../../../assets/images/iconsCircleCheckGreen.png')} />
                    </TouchableOpacity>
                    : <Button text="הזמן" onPress={() => { console.log('add to share'); addToShared(item) }} buttonStyles={buttonStyles} />
                }
                <View style={{ flexDirection: 'row', alignItems: 'center', right: 10 }}>
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17, paddingRight: 10, width: width * 0.5 }]}>{item.givenName} {item.familyName}</Text>
                    <Image source={require('../../../assets/images/iconsUser.png')} />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ width: '90%', alignItems: 'center', alignSelf: 'center' }}>
                <Image source={require('../../../assets/images/imgBackgroundCover.png')} />
                <View style={{ position: 'absolute', alignSelf: 'flex-end', top: 80 }}>
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Bold', fontSize: 34 }]}>{'שותפים לאלבום'}</Text>
                    <VerticalSpace height={0.03} />
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{'מי מהחברים יוכל להוסיף תמונות'}</Text>
                    <Text style={[styles.cardText, { fontFamily: 'Arimo-Regular', fontSize: 17 }]}>{'לאלבום המשותף?'}</Text>
                    <VerticalSpace height={0.03} />
                    <View style={{ width: width * 0.9 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Image style={{ position: 'absolute', top: 12 }} source={require('../../../assets/images/iconsSearch.png')} />
                            <TextInput onFocus={() => setIsFocused(true)}
                                placeholder={'חיפוש איש קשר'}
                                placeholderTextColor={'rgba(134,128,145,0.5)'}
                                onBlur={() => setIsFocused(false)}
                                style={{ height: 60, width: width * 0.9, textAlign: "right", fontFamily: 'Arimo-Bold', fontSize: 20 }} onChangeText={text => setSearchStr(text)} />
                        </View>
                        <View style={[styles.line, { borderColor: isFocused ? colors.whyPicIt : colors.textInputBorder }]} />
                    </View>
                    <VerticalSpace height={0.03} />
                    <MaskedView
                        maskElement={<View style={{ backgroundColor: 'transparent', flex: 1, }}>
                            <LinearGradient colors={['#FFFFFF', '#FFFFFF', '#FFFFFF00']} style={styles.linearGradient}>
                            </LinearGradient>
                        </View>}
                    >
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 120 }}
                            style={{ height: height * 0.57 }}
                            showsVerticalScrollIndicator={false}
                            data={contacts?.filter(contact =>
                                (contact?.givenName + ' ' + contact?.familyName)?.toLowerCase().includes(searchStr.toLowerCase())
                                || contact?.displayName?.toLowerCase().includes(searchStr.toLowerCase())
                            )}
                            renderItem={({ item }) => renderItem(item)}
                            keyExtractor={(item) => item.recordID}
                        />
                    </MaskedView>
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
    linearGradient: {
        flex: 1,
        width: '100%',
        borderRadius: 5
    },
    cardText: {
        textAlign: 'right'
    },
    line: {
        borderWidth: 0.5,
        borderColor: colors.textInputBorder,
    },
});


