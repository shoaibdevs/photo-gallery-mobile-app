import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../colors';
import { countPhotosInAlbum } from './lpicturesCounter';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class radioButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value : props.chosenValue(props.item),
            chosen: props.selected
        };
        if(props.selected){
            this.sendData(this.props.item.id)
        }
        
    }


    sendData = (albumId) => {
        this.props.parentCallback(albumId)
    }

    render() {
        const { item, userId } = this.props
        return (
            <TouchableOpacity onPress={() => { this.setState({ chosen: !this.state.chosen }), this.sendData(item.id) }} style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                <View style={{ alignSelf: 'center', width: width * 0.87, height: 60, borderRadius: 15, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', backgroundColor: this.state.chosen ? 'rgba(255,232,150,0.3)' : 'transparent' }}>
                    <View style={this.state.chosen ? styles.circleChosen : styles.circleNotChosen}>
                        <View style={[styles.circleNotChosenSmall, { backgroundColor: this.state.chosen ? 'white' : 'transparent' }]} />
                    </View>
                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', width: '90%' }}>
                        <Text style={[styles.text, { width: item.albume_name.length > 18 ?'55%' : null }]}>{item.albume_name}</Text>
                        <Text style={styles.max}>{countPhotosInAlbum(item, userId).toString() + ' / ' + item.max_images + ' '}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    circleNotChosen: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(231,229,234,0.5)',
        justifyContent: 'center',
        borderWidth: 2,
        marginRight: 10,
        borderColor: 'rgba(231,229,234,0.3)'
    },
    circleNotChosenSmall: {
        width: 9,
        alignSelf: 'center',
        height: 9,
        borderRadius: 4.5,

    },
    circleChosen: {
        width: 30,
        height: 30,
        marginRight: 10,
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: colors.register
    },
    text: {
        fontFamily: 'Arimo-Regular',
        fontSize: 17,
        textAlign: 'right',
        paddingRight: 10
    },
    max: {
        fontFamily: 'Arimo-Regular',
        fontSize: 17,
        paddingLeft: 15,
        color: colors.whyPicIt
    }
})