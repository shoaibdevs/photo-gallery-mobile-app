import React, { useLayoutEffect, useState } from 'react'
import { View, StyleSheet, Image, ImageBackground } from 'react-native'
import { setPopupEditPhoto } from '../../redux'
import { useDispatch } from 'react-redux'
import ImageBlock from './imageBlock'

const FivePictures = ({ pictures, setEditImage, currentBg, isAlbumLocked, setLastPhoto }) => {
    const dispatch = useDispatch()
    const [groupSizes, setGroupSizes] = useState([])

    useLayoutEffect(() => {
        setGroupSizes(prew => {
            return pictures.map((picture, index) => {
                let res = {
                    width: index > 2 ? 161 : 105,
                    height: index > 2 ? 175 : 114,
                    justifyContent: 'center',
                }

                if (index === 0) {
                    res = {
                        ...res,
                        marginRight: 7,
                    }
                }

                if (index === 0 || index === 1 || index === 3) {
                    res = {
                        ...res,
                        marginBottom: 7,
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
        <>
            <View style={styles.albumPage}>
                <ImageBackground source={currentBg} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    height: 474,
                    width: 335,
                    paddingHorizontal: 27,
                    paddingVertical: 27
                }}>
                    {pictures.map((pic, index) => {
                        return <ImageBlock isAlbumLocked={isAlbumLocked} containerStyle={groupSizes[index]} imageUri={pic.picture} item={pic} pressHandler={pressHandler} key={pic.id} />
                    })}
                </View>
            </View>
        </>
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
})

export default FivePictures;