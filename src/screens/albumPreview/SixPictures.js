import React, { useLayoutEffect, useState } from 'react'
import { View, StyleSheet, Image, ImageBackground } from 'react-native'
import { setPopupEditPhoto } from '../../redux'
import { useDispatch } from 'react-redux'
import ImageBlock from './imageBlock'

const SixPictures = ({ pictures, setEditImage, currentBg, isAlbumLocked, setLastPhoto}) => {
    const dispatch = useDispatch()
    const [groupSizes, setGroupSizes] = useState([])
    // console.log("pic6 --->", pictures);

    useLayoutEffect(() => {
        setGroupSizes(prew => {
            return pictures.map((picture, index) => {
                let res = {
                    width: 137,
                    height: 129,
                    justifyContent: 'center',
                }

                if (index < 3 && index !== 0) {
                    res = {
                        ...res,
                        marginRight: 7,
                        marginTop: 7
                    }
                }

                if (index === 1 || index === 2 || index === 4 || index === 5) {
                    res = {
                        ...res,
                        marginRight: 7,
                        marginTop: 7
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
                    paddingHorizontal: 27
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

export default SixPictures;