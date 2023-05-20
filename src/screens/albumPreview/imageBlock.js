import { values } from "lodash";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";

const ImageBlock = props => {
    const { containerStyle, imageUri, pressHandler, item, isAlbumLocked } = props
 
    const [imageStyle, setImageStyle] = useState(containerStyle != undefined ? countImageSize() : {})

    async function countImageSize() {
        if (containerStyle.width === 0) {
            setImageStyle({ width: 0, height: 0 })
        } else {
            await Image.getSize(imageUri, (width, height) => {
                let imageStyles = {}
                if (width < height) {
                    if (Math.floor(width * containerStyle?.height / height) > containerStyle.width) {
                        imageStyles = {
                            width: Math.floor(width * containerStyle?.height / height) - (Math.floor(width * containerStyle?.height / height) - containerStyle.width),
                            height: containerStyle.height - (Math.floor(width * containerStyle?.height / height) - containerStyle.width)
                        }
                    } else {
                        imageStyles = {
                            width: Math.floor(width * containerStyle?.height / height),
                            height: containerStyle.height
                        }
                    }
                } else if (width > height) {
                    imageStyles = {
                        width: containerStyle?.width,
                        height: Math.floor(height * containerStyle?.width / width)
                    }
                } else {
                    imageStyles = {
                        width: containerStyle?.width,
                        height: containerStyle.height
                    }
                }

                imageStyles = {
                    ...imageStyles,
                    borderRadius: 10,
                }

                if (JSON.stringify(imageStyle) !== JSON.stringify(imageStyles)) {
                    setImageStyle(imageStyles)
                }
            })
        }
    }

    function onPressHandler() {
        pressHandler(item)
    }

    return <TouchableOpacity disabled={isAlbumLocked != undefined && isAlbumLocked == '1'} style={[containerStyle, { alignItems: 'center', borderRadius: 10 }]} onPress={onPressHandler}>
        <Image onLoad={() => console.log("loaded")} style={[imageStyle]} source={{ uri: imageUri }} />
    </TouchableOpacity>
}

export default ImageBlock