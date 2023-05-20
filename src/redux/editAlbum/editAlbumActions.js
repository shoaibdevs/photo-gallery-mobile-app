import {
    ADD_DELETE_PHOTO_ID,
    ADD_NEW_IMAGE,
    ADD_UPLOADED_PHOTO_ID,
    CLEAR_STATE,
    EDIT_ALBUM_PICTURES,
    SET_ALBUM_PICTURES
} from "./editAlbumActionTypes"

export const setAlbumPictures = pictures => {
    return {
        type: SET_ALBUM_PICTURES,
        payload: pictures
    }
}

export const editAlbumPictures = pictures => {
    return {
        type: EDIT_ALBUM_PICTURES,
        payload: pictures
    }
}

export const clearEditPhotosState = () => {
    return {
        type: CLEAR_STATE
    }
}

export const setNewPhotoToDelete = id => {
    return {
        type: ADD_DELETE_PHOTO_ID,
        payload: id
    }
}

export const setNewUpdatedPhotoId = id => {
    return {
        type: ADD_UPLOADED_PHOTO_ID,
        payload: id
    }
}

export const addNewImage = item => {
    return {
        type: ADD_NEW_IMAGE,
        payload: item
    }
}