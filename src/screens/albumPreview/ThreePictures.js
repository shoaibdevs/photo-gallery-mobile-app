import React, { useState, useLayoutEffect } from 'react'
import { View, StyleSheet, ImageBackground } from 'react-native'
import ImageBlock from './imageBlock'
import { useDispatch } from "react-redux";
import { setPopupEditPhoto } from "../../redux";

const ThreePictures = ({ pictures, setEditImage, currentBg, isAlbumLocked, setLastPhoto }) => {
    const dispatch = useDispatch()
    const [groupSizes, setGroupSizes] = useState([])
    // console.log("pic3 --->", pictures);

    useLayoutEffect(() => {
        setGroupSizes(prew => {
            return pictures.map((picture, index) => {
                let res = {
                    width: index === 0 ? 271 : 133,
                    height: 197,
                    justifyContent: 'center',
                }

                if (index !== 0) {
                    res = {
                        ...res,
                        marginTop: 7
                    }
                }

                if (index === 2) {
                    res = {
                        ...res,
                        marginLeft: 6
                    }
                }

                return res
            })
        })
    }, [])

    const pressHandler = item => {
        setEditImage(item)
        dispatch(setPopupEditPhoto(true))
        setLastPhoto(false)

    }

    return (
        <View style={styles.albumPage}>
            <ImageBackground source={currentBg} style={{ width: '100%', height: '100%', position: 'absolute' }} />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                height: 474,
                width: 335,
                paddingHorizontal: 27,
                paddingVertical: 27
            }}>
                {pictures.map((pic, index) => {
                    return <ImageBlock  isAlbumLocked={isAlbumLocked} containerStyle={groupSizes[index]} imageUri={pic.picture} item={pic} pressHandler={pressHandler} key={pic.id} />
                })}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    albumPage: {
        height: 474,
        width: 335,
        backgroundColor: 'rgb(255,255,255)',
        alignSelf: 'center',
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
})

export default ThreePictures;