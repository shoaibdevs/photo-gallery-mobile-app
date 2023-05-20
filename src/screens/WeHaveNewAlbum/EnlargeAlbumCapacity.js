import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Dimensions, Image, BackHandler } from 'react-native'
import { colors } from "../../colors"
import Button from "../../utilities/button"
import { updateAlbumApi } from "../../api"
import { useSelector } from "react-redux"
import { getAlbumById, getCounter } from "../../api"
import AnimatedLoader from "react-native-animated-loader"

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const source = require('../../../assets/images/iconsCircleCheck.png')

const EnlargeAlbumCapacity = ({ navigation }) => {
    const [currentAlbum, setCurrentAlbum] = useState(navigation.state.params.currentAlbum)
    const [newCapacity, setnawCapacity] = useState(currentAlbum.max_images);
    const [showBottomBlock, setShowBottomBlock] = useState(false)
    const { user, pictures, allSharedPictures } = useSelector(state => state.user)
    const [loading, setLoading] = useState(false)

    const updateAlbum = async (maxImages) => {
        const formData = new FormData
        formData.append('token', user.token)
        formData.append('id', currentAlbum.id)
        formData.append('albume_name', currentAlbum['albume_name'])
        formData.append('max_images', newCapacity)
        formData.append('status', '1')
        console.log("Form data ------>", formData);
        await updateAlbumApi(formData).then(res => {
            console.log("res --->", res);
            getAlbum()
        })

    }

    function handleBackButtonClick() {
        return true;
    }
    const [data, setData] = useState(false)
    useEffect(() => {
        if(data.length == 0){
            getCounter().then(res => {
                console.log("Counter res 7 ->", res)
                setData(res)})
        }
    }, [data])
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);

    const getAlbum = () => {
        getAlbumById(user.token, currentAlbum.id).then(res => {
            console.log(res);
            setCurrentAlbum(res.data)
        })
    }

    function cancelButtonHandler() {
        if (navigation.state.params?.photoFromGallery) {
            if (allSharedPictures.length > 1) {
                navigation.navigate("ChooseImages",
                    {
                        allSharedPictures, chosenPictureStartScreen: '2',
                    })
            } else {
                navigation.navigate('Camera')
            }
        } else {
            if (pictures.length > 1) {
                navigation.navigate("ChooseImages",
                    {
                        pictures, chosenPictureStartScreen: '1',
                    })
            } else if (navigation.state.params?.returnToAlbumPreview) {
                navigation.navigate('MyAlbums')
            } else {
                navigation.navigate('Camera')
            }
        }
    }

    const confirmAlbumUpdate = () => {
        if (navigation.state.params?.addToAlbum != undefined) navigation.state.params?.addToAlbum()
        updateAlbum(newCapacity)
        setLoading(true)

        setTimeout(() => {

            if (navigation.state.params?.photoFromGallery) {
                if (allSharedPictures.length > 1) {
                    navigation.navigate("ChooseImages",
                        {
                            allSharedPictures, chosenPictureStartScreen: '2',
                        })
                } else {
                    navigation.navigate('Camera')
                }
            } else {
                if (pictures.length > 1) {
                    navigation.navigate("ChooseImages",
                        {
                            pictures, chosenPictureStartScreen: '1',
                        })
                } else if (navigation.state.params?.returnToAlbumPreview) {
                    navigation.navigate('MyAlbums')
                } else {
                    navigation.navigate('Camera')
                }
            }
            setLoading(false)
        }, 4000);
    }

    const showMessage = () => {
        setShowBottomBlock(true)

        setTimeout(() => {
            setShowBottomBlock(false)
        }, 2000);
    }

    return (
        <View style={styles.wrapper}>
            <AnimatedLoader
                visible={loading} // was false on developer branch
                overlayColor="rgba(255,255,255,0.75)"
                source={require("../../../assets/picitLoader.json")}
                animationStyle={{ width: 100, height: 100 }}
                speed={1}
            ></AnimatedLoader>
            <View style={styles.container}>
                <Text style={styles.title}>{'הגדלת מספר תמונות'}</Text>
                <Text style={styles.title}>{'באלבום'}</Text>
                <Text style={[styles.albomName, { width: currentAlbum.albume_name.length > 18 ? '50%' : null }]}>{currentAlbum.albume_name || ''}</Text>
                <View style={{ marginTop: 19, alignItems: 'center' }}>
                    <Text style={styles.secondTitle}>{'כמה תמונות תרצו שהאלבום'}</Text>
                    <Text style={styles.secondTitle}>{'שלכם יכיל? אל תדאגו, המחיר נשאר'}</Text>
                    <Text style={styles.secondTitle}>{' אותו דבר - רק 79 ש"ח'}</Text>
                </View>

                {/* for client  */}
                {data && (
                currentAlbum["max_images"] == data[0].value
                ? (<View>
                    <Button text={data[0].value +" תמונות"} disabled buttonStyles={newCapacity === data[0].value  ? styles.defaultButton : { ...styles.button, color: colors.greyNotChosen }} textStyle={{ left: newCapacity == data[0].value ? 10 : 0 }} onPress={() => { setnawCapacity(data[0].value); showMessage() }} source={newCapacity == data[0].value ? source : null} imageStyle={{ height: 25, width: 25, left: 50 }} disabled={true} />
                    <Button text={data[1].value +" תמונות"} buttonStyles={newCapacity === data[1].value  ? styles.defaultButton : styles.button} textStyle={{ left: newCapacity == data[1].value ? 10 : 0 }} onPress={() => { setnawCapacity(data[1].value); showMessage() }} source={newCapacity === data[1].value ? source : null} imageStyle={{ height: 25, width: 25, left: 50 }} />
                    <Button text={data[2].value + " תמונות"} buttonStyles={newCapacity === data[2].value  ? styles.defaultButton : styles.button} textStyle={{ left: newCapacity == data[2].value ? 10 : 0 }} onPress={() => { setnawCapacity(data[2].value); showMessage() }} source={newCapacity === data[2].value ? source : null} imageStyle={{ height: 25, width: 25, left: 50 }} />
                </View>)
                : currentAlbum["max_images"] == data[1].value
                    ? (<View>
                        <Button text={data[0].value +" תמונות"} buttonStyles={newCapacity === data[0].value  ? styles.defaultButton : { ...styles.button, color: colors.greyNotChosen }} textStyle={{ left: newCapacity == data[0].value ? 10 : 0 }} onPress={() => { setnawCapacity(data[0].value); showMessage() }} disabled={false} />
                        <Button disabled={true} textStyle={{ left: newCapacity == data[1].value ? 10 : 0 }} text={data[1].value +" תמונות"} buttonStyles={newCapacity === data[1].value ? styles.defaultButton : { ...styles.button, color: colors.greyNotChosen }} onPress={() => { setnawCapacity(data[1].value); showMessage() }} source={newCapacity === data[1].value ? source : null} imageStyle={{ height: 25, width: 25, marginLeft: 50 }} />
                        <Button text={data[2].value + " תמונות"} textStyle={{ left: newCapacity == data[2].value ? 10 : 0 }} buttonStyles={newCapacity === data[2].value ? styles.defaultButton : styles.button} onPress={() => { setnawCapacity(data[2].value); showMessage() }} source={newCapacity === data[2].value ? source : null} imageStyle={{ height: 25, width: 25, left: 50 }} />
                    </View>)
                    : currentAlbum["max_images"] == data[2].value ?(<View>
                        <Button text={data[0].value +" תמונות"} onPress={() => { setnawCapacity(data[0].value); showMessage() }} source={newCapacity === data[0].value ? source : null}  buttonStyles={newCapacity === data[0].value ? styles.defaultButton : styles.button} disabled={currentAlbum.max_images == data[2].value ? true : false} imageStyle={{ height: 25, width: 25, left: 50 }}/>
                        <Button text={data[1].value +" תמונות"} onPress={() => { setnawCapacity(data[1].value); showMessage() }} source={newCapacity === data[1].value ? source : null}  buttonStyles={newCapacity === data[1].value ? styles.defaultButton : styles.button} disabled={false}  imageStyle={{ height: 25, width: 25, left: 50 }}/>
                        <Button text={data[2].value + " תמונות"} onPress={() => { setnawCapacity(data[2].value); showMessage()}} source={newCapacity === data[2].value ? source : null}   buttonStyles={newCapacity === data[1].value ? styles.defaultButton : { ...styles.button, color: colors.greyNotChosen }}  textStyle={{ left: newCapacity == data[2].value? 10 : 0 }}  imageStyle={{ height: 25, width: 25, left: 50 }} disabled={true} />
                    </View>) :(
                        
                        <View>
                        <Button text={data[0].value +" תמונות"} onPress={() => { setnawCapacity(data[0].value); showMessage() }} source={newCapacity === data[0].value ? source : null}  buttonStyles={newCapacity === data[0].value ? styles.defaultButton : styles.button} disabled={currentAlbum.max_images == data[2].value ? true : false} imageStyle={{ height: 25, width: 25, left: 50 }}/>
                        <Button text={data[1].value +" תמונות"} onPress={() => { setnawCapacity(data[1].value); showMessage() }} source={newCapacity === data[1].value ? source : null}  buttonStyles={newCapacity === data[1].value ? styles.defaultButton : styles.button} disabled={false}  imageStyle={{ height: 25, width: 25, left: 50 }}/>
                        <Button text={data[2].value + " תמונות"} onPress={() => { setnawCapacity(data[2].value); showMessage()}} source={newCapacity === data[2].value ? source : null}  buttonStyles={newCapacity === data[2].value ? styles.defaultButton : styles.button} textStyle={{ left: newCapacity == data[2].value? 10 : 0 }}  imageStyle={{ height: 25, width: 25, left: 50 }} disabled={false} />
                    </View>
                    )

            
                )}


                {/* for testing  */}

                {/* {currentAlbum["max_images"] == 18
                    ? (<View>
                        <Button text="18 תמונות" buttonStyles={newCapacity === '18' ? styles.defaultButton : { ...styles.button }} textStyle={{ left: newCapacity == 18 ? 10 : 0 }} onPress={() => { setnawCapacity('18'); showMessage() }} source={newCapacity == 18 ? source : null} imageStyle={{ height: 25, width: 25, left: 50 }} disabled={true} />
                        <Button text="24 תמונות" buttonStyles={newCapacity === '24' ? styles.defaultButton : styles.button} textStyle={{ left: newCapacity == 24 ? 10 : 0 }} onPress={() => { setnawCapacity('24'); showMessage() }} source={newCapacity === '24' ? source : null} imageStyle={{ height: 25, width: 25, left: 50 }} />
                        <Button text="30 תמונות" buttonStyles={newCapacity === '30' ? styles.defaultButton : styles.button} textStyle={{ left: newCapacity == 30 ? 10 : 0 }} onPress={() => { setnawCapacity('30'); showMessage() }} source={newCapacity === '30' ? source : null} imageStyle={{ height: 25, width: 25, left: 50 }} />
                    </View>)
                    : currentAlbum["max_images"] == 24
                        ? (<View>
                            <Button text="18 תמונות" buttonStyles={{ ...styles.button, marginTop: 10, color: colors.gray3 }} disabled={true} />
                            <Button disabled={true} textStyle={{ left: newCapacity == 24 ? 10 : 0 }} text="24 תמונות" buttonStyles={newCapacity === '24' ? styles.defaultButton : styles.button} onPress={() => { setnawCapacity('24'); showMessage() }} source={newCapacity === '24' ? source : null} imageStyle={{ height: 25, width: 25, marginLeft: 50 }} />
                            <Button text="30 תמונות" textStyle={{ left: newCapacity == 30 ? 10 : 0 }} buttonStyles={newCapacity === '30' ? styles.defaultButton : styles.button} onPress={() => { setnawCapacity('30'); showMessage() }} source={newCapacity === '30' ? source : null} imageStyle={{ height: 25, width: 25, left: 50 }} />
                        </View>)
                        : (<View>
                            <Button text="18 תמונות" buttonStyles={{ ...styles.button, marginTop: 10, color: colors.gray3 }} disabled={true} />
                            <Button text="24 תמונות" buttonStyles={{ ...styles.button, marginTop: 10, color: colors.gray3 }} disabled={true} />
                            <Button text="30 תמונות" textStyle={{ left: newCapacity == 30 ? 10 : 0 }} buttonStyles={{ ...styles.defaultButton, marginTop: 10 }} source={source} imageStyle={{ height: 25, width: 25, left: 50 }} disabled={true} />
                        </View>)

                } */}

                <View style={styles.buttonsBlock}>
                    <Button text="אישור" buttonStyles={styles.cancel} onPress={confirmAlbumUpdate} />
                    <Button text="ביטול" buttonStyles={styles.cancel} onPress={cancelButtonHandler} />
                </View>
            </View>
            {showBottomBlock ? (
                <View style={styles.bottomBlock}>
                    <Image style={{ height: 40, width: 230 }} source={require('../../../assets/images/buttonsNavBarButtonsLabelButtonRoundLeftAlignAlpha.png')} />
                </View>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        height: height,
        width: width,
        backgroundColor: 'rgba(159,156,165,0.3)',
        justifyContent: 'center',
        alignItems: "center"
    },
    container: {
        height: 550,
        width: 315,
        borderRadius: 50,
        backgroundColor: colors.white,
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop: 31,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Arimo-Bold',
        color: colors.primary
    },
    secondTitle: {
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
        color: colors.primary
    },
    albomName: {
        fontSize: 20,
        fontFamily: 'Arimo-Regular',
        color: colors.primary,
        textAlign: 'center',
        marginTop: 20
    },
    defaultButton: {
        height: 64,
        width: 265,
        backgroundColor: colors.secondaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 26,
        textAlign: 'center',
        color: colors.primary,
        fontSize: 17,
        fontFamily: 'Arimo-Bold',
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        height: 64,
        width: 265,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 26,
        color: colors.gray,
        marginTop: 10,
        fontSize: 17,
        fontFamily: 'Arimo-regular',
        borderWidth: 1,
        borderColor: colors.gray3
    },
    cancel: {
        color: colors.gray,
        marginTop: 20,
        fontSize: 17,
        fontFamily: 'Arimo-regular',
    },
    bottomBlock: {
        position: "absolute",
        bottom: height * 0.1
    },
    buttonsBlock: {
        width: '100%',
        flexDirection: "row",
        justifyContent: 'space-around',
        marginTop: 5,
    },
})

export default EnlargeAlbumCapacity