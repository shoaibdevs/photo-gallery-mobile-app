import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import SixPictures from './SixPictures'
import FivePictures from './FivePictures'
import FourPictures from './FourPictures'
import ThreePictures from './ThreePictures'
import TwoPictures from './TwoPictures'
import OnePicture from './OnePicture'

import firstBg from '../../../assets/images/pageTemplateMaterialsLeftPagePattern2.png'
import secondBg from '../../../assets/images/pageTemplateMaterialsLeftPagePattern3.png'
import thirdBg from '../../../assets/images/pageTemplateMaterialsLeftPagePattern4.png'
import fourthBg from '../../../assets/images/pageTemplateMaterialsRightPagePattern1.png'
import fivethBg from '../../../assets/images/pageTemplateMaterialsRightPagePattern2.png'
import sixth from '../../../assets/images/pageTemplateMaterialsRightPagePattern3.png'
import seventh from '../../../assets/images/pageTemplateMaterialsRightPagePattern4.png'

const PreviewAlbumPage = ({ pages, groupIndex, setChosenPicToEdit, setLastPhoto, isAlbumLocked }) => {
    const backgroundUri = [firstBg, secondBg, thirdBg, fourthBg, fivethBg, sixth, seventh]
    const [currentBg, setCurrenBg] = useState(backgroundUri[0])

    useEffect(() => {
        console.log(groupIndex);
        if (groupIndex > 7) {
            setCurrenBg(backgroundUri[groupIndex % 7])
        } else {
            setCurrenBg(backgroundUri[groupIndex])
        }
    }, [])

    return (
        <View>
            {pages.length == 6 && <SixPictures isAlbumLocked={isAlbumLocked} currentBg={currentBg} pictures={pages} groupIndex={groupIndex} setEditImage={setChosenPicToEdit} setLastPhoto={setLastPhoto}/>}
            {pages.length == 5 && <FivePictures isAlbumLocked={isAlbumLocked} currentBg={currentBg} pictures={pages} groupIndex={groupIndex} setEditImage={setChosenPicToEdit} setLastPhoto={setLastPhoto}/>}
            {pages.length == 4 && <FourPictures isAlbumLocked={isAlbumLocked} currentBg={currentBg} pictures={pages} groupIndex={groupIndex} setEditImage={setChosenPicToEdit} setLastPhoto={setLastPhoto}/>}
            {pages.length == 3 && <ThreePictures isAlbumLocked={isAlbumLocked} currentBg={currentBg} pictures={pages} groupIndex={groupIndex} setEditImage={setChosenPicToEdit} setLastPhoto={setLastPhoto}/>}
            {pages.length == 2 && <TwoPictures isAlbumLocked={isAlbumLocked} currentBg={currentBg} pictures={pages} groupIndex={groupIndex} setEditImage={setChosenPicToEdit} setLastPhoto={setLastPhoto}/>}
            {pages.length == 1 && <OnePicture isAlbumLocked={isAlbumLocked} currentBg={currentBg} pictures={pages} groupIndex={groupIndex} setEditImage={setChosenPicToEdit} setLastPhoto={setLastPhoto} />}
        </View>
    )
}


export default PreviewAlbumPage;