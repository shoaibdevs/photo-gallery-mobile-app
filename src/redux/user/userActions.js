import {
    POPUP_CONTACTS_PERMISSION,
    POPUP_TERMS,
    SET_CONTACTS,
    POPUP_BEGIN,
    SET_USER,
    ADD_ALBUM,
    POPUP_CONTACTS,
    POPUP_ALBUM,
    ADD_PICS,
    SET_PICS,
    POPUP_SAVE_PIC,
    SHARED_TO,
    CLEAR_REDUX,
    PICTURE_TO_DELETE,
    POPUP_EDIT_PHOTO,
    POPUP_CONFIRM,
    SET_MESSAGES,
    POPUP_LOGOUT,
    POPUP_DELETE_PHOTO,
    SET_PUSH_ALERT,
    POPUP_ORDERED_ALXBUM,
    POPUP_DELETE_ALBUM,
    POPUP_EXIT_FROM_ALBUM_PREVIEW,
    POPUP_SHARED_INVINTATION_SENT,
    SET_SHARED_PHOTOS,
    COUNT_READY_FOR_ORDER_ALBUS,
    POPUP_NEW_ALBUM,
    POPUP_WARNING_FULL_ALBUM,
    POPUP_NEW_ALBUM_CREATED,
    POPUP_FORGOT_PASSWORD,
    SET_POPUP_ALBUM_IN_PROGRESS,
    SET_POPUP_EXIT_FROM_ALBUM_SETTINGS,
    SET_PUSH_TOKEN,
    SET_CHOSEN_PICTURE,
    SET_POPUP_ERROR,
    SSET_ROUTE_FROM_NOTIFICATION,
    SET_IS_ALBUM_EMPTY,
    SET_LOADED_IMAGES,
    PERMISSION_GRANTED
} from './userActionTypes'

export const setPopupContactsPermission = isVisible => {
    return {
        type: POPUP_CONTACTS_PERMISSION,
        payload: isVisible
    }
}


export const setPermissionGranted = isVisible => {
    return {
        type: PERMISSION_GRANTED,
        payload: isVisible
    }
}

export const setLoadedImages = count => {
    return {
        type: SET_LOADED_IMAGES,
        payload: count
    }
}


export const setPopupContacts = isVisible => {
    return {
        type: POPUP_CONTACTS,
        payload: isVisible
    }
}

export const setPopupDeletePhoto = isVisible => {
    return {
        type: POPUP_DELETE_PHOTO,
        payload: isVisible
    }
}

export const setPopupSavePic = isVisible => {
    return {
        type: POPUP_SAVE_PIC,
        payload: isVisible
    }
}

export const addPic = pic => {
    return {
        type: ADD_PICS,
        payload: pic
    }
}

export const clearRedux = () => {
    return {
        type: CLEAR_REDUX,
    }
}


export const setPics = pics => {
    return {
        type: SET_PICS,
        payload: pics
    }
}

export const setPopupAlbum = isVisible => {
    return {
        type: POPUP_ALBUM,
        payload: isVisible
    }
}

export const setPopupEditPhoto = isVisible => {
    return {
        type: POPUP_EDIT_PHOTO,
        payload: isVisible
    }
}

export const setShared = contacts => {
    return {
        type: SHARED_TO,
        payload: contacts
    }
}

export const addAlbum = album => {
    return {
        type: ADD_ALBUM,
        payload: album
    }
}

export const setUser = user => {
    return {
        type: SET_USER,
        payload: user
    }
}

export const setPopupTerms = isVisible => {
    return {
        type: POPUP_TERMS,
        payload: isVisible
    }
}

export const setContacts = contacts => {
    return {
        type: SET_CONTACTS,
        payload: contacts
    }
}

export const setPopupBegin = isVisible => {
    return {
        type: POPUP_BEGIN,
        payload: isVisible
    }
}

export const setPictureToDelete = uri => {
    return {
        type: PICTURE_TO_DELETE,
        payload: uri
    }
}

export const setPopupConfirm = isVisible => {
    return {
        type: POPUP_CONFIRM,
        payload: isVisible
    }
}

export const setPopupLogout = isVisible => {
    return {
        type: POPUP_LOGOUT,
        payload: isVisible
    }
}

export const setPushMessages = messages => {
    return {
        type: SET_MESSAGES,
        payload: messages
    }
}

export const setPushAlert = alert => {
    return {
        type: SET_PUSH_ALERT,
        payload: alert
    }
}

export const setPopupOrderedAlbum = isVisible => {
    return {
        type: POPUP_ORDERED_ALXBUM,
        payload: isVisible
    }
}

export const setPopupDeleteAlbum = isVisible => {
    return {
        type: POPUP_DELETE_ALBUM,
        payload: isVisible
    }
}

export const setPopupExitFromAlbumPreview = isVisible => {
    return {
        type: POPUP_EXIT_FROM_ALBUM_PREVIEW,
        payload: isVisible
    }
}

export const setpopupSharedInvintationSent = isVisible => {
    return {
        type: POPUP_SHARED_INVINTATION_SENT,
        payload: isVisible
    }
}

export const setSharedPhotos = photosArr => {
    return {
        type: SET_SHARED_PHOTOS,
        payload: photosArr
    }
}

export const setCountReadyForOrderAlbums = count => {
    return {
        type: COUNT_READY_FOR_ORDER_ALBUS,
        payload: count
    }
}

export const setPopupNewAlbum = isVisible => {
    return {
        type: POPUP_NEW_ALBUM,
        payload: isVisible
    }
}

export const setPopupWarningFullAlbum = isVisible => {
    return {
        type: POPUP_WARNING_FULL_ALBUM,
        payload: isVisible
    }
}

export const setPopupNewAlbumCreated = isVisible => {
    return {
        type: POPUP_NEW_ALBUM_CREATED,
        payload: isVisible
    }
}

export const setPopupForgotPassword = isVisible => {
    return {
        type: POPUP_FORGOT_PASSWORD,
        payload: isVisible
    }
}

export const setPopupAlbumInProgress = isVisible => {
    return {
        type: SET_POPUP_ALBUM_IN_PROGRESS,
        payload: isVisible
    }
}

export const setPopupExitFromAlbumSettings = isVisible => {
    return {
        type: SET_POPUP_EXIT_FROM_ALBUM_SETTINGS,
        payload: isVisible
    }
}

export const setPushToken = token => {
    return {
        type: SET_PUSH_TOKEN,
        payload: token
    }
}

export const setChosenPicture = num => {
    return {
        type: SET_CHOSEN_PICTURE,
        payload: num
    }
}

export const setPopupError = isVisible => {
    return {
        type: SET_POPUP_ERROR,
        payload: isVisible
    }
}

export const setRouteFromNotification = route => {
    return {
        type: SSET_ROUTE_FROM_NOTIFICATION,
        payload: route
    }
}

export const setIsAlbumEmpty = isEmpty => {
    return {
        type: SET_IS_ALBUM_EMPTY,
        payload: isEmpty
    }
}