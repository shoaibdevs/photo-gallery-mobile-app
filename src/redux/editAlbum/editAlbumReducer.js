import {
    ADD_DELETE_PHOTO_ID,
    ADD_NEW_IMAGE,
    ADD_UPLOADED_PHOTO_ID,
    CLEAR_STATE,
    EDIT_ALBUM_PICTURES,
    SET_ALBUM_PICTURES
} from "./editAlbumActionTypes"

const initialState = {
    albumImages: [],
    editedAlbumImages: [],
    deletePhotosIds: [],
    updatePhotosids: [],
    newImages: []
}

const editAlbumreducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALBUM_PICTURES:
            return {
                ...state,
                albumImages: [...action.payload],
            }

        case EDIT_ALBUM_PICTURES:
            return {
                ...state,
                editedAlbumImages: [...action.payload],
            }

        case CLEAR_STATE:
            return initialState

        case ADD_DELETE_PHOTO_ID:
            return {
                ...state,
                deletePhotosIds: [...state.deletePhotosIds, action.payload]
            }

        case ADD_UPLOADED_PHOTO_ID:
            return {
                ...state,
                updatePhotosids: [...state.updatePhotosids, action.payload]
            }

        case ADD_NEW_IMAGE:
            return {
                ...state,
                newImages: [...state.newImages, action.payload]
            }

        default:
            return state
    }
}

export default editAlbumreducer