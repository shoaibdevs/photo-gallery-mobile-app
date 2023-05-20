import React, { useLayoutEffect, useState } from 'react'
import { View, StyleSheet, ImageBackground } from 'react-native'
import { setPopupEditPhoto } from '../../redux'
import { useDispatch } from 'react-redux'
import ImageBlock from './imageBlock'

const ThreePictures = ({ pictures, setEditImage, setLastPhoto, currentBg, isAlbumLocked }) => {
    const dispatch = useDispatch()
    const [groupSizes, setGroupSizes] = useState([])
    // console.log("pic1 --->", pictures);

    useLayoutEffect(() => {
        setGroupSizes(prew => {
            return pictures.map((picture, index) => {
                let res = {
                    width: 335,
                    height: 475,
                    justifyContent: 'center',
                }

                return res
            })
        })
    }, [])

    const pressHandler = item => {
        dispatch(setPopupEditPhoto(true));
        setEditImage(pictures[0]);
        setLastPhoto(true)
    }

    return (
        <View style={styles.albumPage}>
            <ImageBackground source={currentBg} style={{ width: '100%', height: '100%', position: 'absolute' }} />
            <ImageBlock  isAlbumLocked={isAlbumLocked} containerStyle={groupSizes[0]} imageUri={pictures[0].picture} item={pictures[0]} pressHandler={pressHandler} key={pictures[0].id} />
        </View>
    )
}

const styles = StyleSheet.create({
    albumPage: {
        width: 335,
        height: 475,
        backgroundColor: 'rgb(255,255,255)',
        alignSelf: 'center',
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
        marginBottom: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default ThreePictures;