import {
    POPUP_CONTACTS_PERMISSION,
    POPUP_TERMS,
    POPUP_ALBUM,
    POPUP_SAVE_PIC,
    POPUP_BEGIN,
    POPUP_CONTACTS,
    SET_CONTACTS,
    SET_USER,
    ADD_ALBUM,
    ADD_PICS,
    SET_PICS,
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
    SET_LOADED_IMAGES,
    PERMISSION_GRANTED
} from './userActionTypes'

const initialState = {
    popupContactsPermission: false,
    popupContacts: false,
    popupTerms: false,
    popupSavePic: false,
    popupAlbum: false,
    popupEditPhoto: false,
    popupBegin: false,
    popupConfirm: false,
    popupLogout: false,
    popupDeletePhoto: false,
    contacts: [],
    user: {},
    albums: {},
    sharedTo: [],
    pictures: [],
    pictureToDelete: '',
    pushMessages: [],
    pushAlert: false,
    popupOrderedAlbum: false,
    popupDeleteAlbum: false,
    popupExitFromAlbumPreview: false,
    popupSharedInvintationSent: false,
    allSharedPictures: [],
    countReadyForOrderAlbums: 0,
    popupNewAlbum: false,
    popupWarningFullAlbum: false,
    popupNewAlbumCreated: false,
    popupForgotPassword: false,
    popupAlbumInProgres: false,
    popupExitFromAlbumSettings: false,
    pushToken: '',
    chosenPicture: 0,
    popupError: false,
    routeFromNotification: '',
    isAlbumEmpty: null,
    permissionGranted: false,
    loadedImages: 0
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case POPUP_CONTACTS_PERMISSION:
            return {
                ...state,
                popupContactsPermission: action.payload,
            }
        case PERMISSION_GRANTED:
            return {
                ...state,
                permissionGranted: action.payload,
            }
        case SET_LOADED_IMAGES:
            return {
                ...state,
                loadedImages: action.payload,
            }
        case CLEAR_REDUX:
            return { ...initialState, pushToken: state.pushToken, };

        case SHARED_TO:
            return {
                ...state,
                sharedTo: action.payload
            }

        case ADD_ALBUM:
            return {
                ...state,
                albums: action.payload
            }

        case POPUP_ALBUM:
            return {
                ...state,
                popupAlbum: action.payload
            }

        case POPUP_CONTACTS:
            return {
                ...state,
                popupContacts: action.payload
            }

        case POPUP_SAVE_PIC:
            return {
                ...state,
                popupSavePic: action.payload
            }

        case SET_USER:
            return {
                ...state,
                user: action.payload
            }

        case POPUP_TERMS:
            return {
                ...state,
                popupTerms: action.payload
            }

        case SET_CONTACTS:
            return {
                ...state,
                contacts: action.payload
            }

        case POPUP_BEGIN:
            return {
                ...state,
                popupBegin: action.payload
            }

        case POPUP_EDIT_PHOTO:
            return {
                ...state,
                popupEditPhoto: action.payload
            }

        case POPUP_LOGOUT:
            return {
                ...state,
                popupLogout: action.payload
            }

        case ADD_PICS:
            return {
                ...state,
                pictures: [action.payload, ...state.pictures]
            }

        case SET_PICS:
            return {
                ...state,
                pictures: action.payload
            }

        case PICTURE_TO_DELETE: {
            return {
                ...state,
                pictureToDelete: action.payload
            }
        }

        case POPUP_CONFIRM: {
            return {
                ...state,
                popupConfirm: action.payload
            }
        }

        case SET_MESSAGES: {
            return {
                ...state,
                pushMessages: action.payload
            }
        }

        case POPUP_DELETE_PHOTO: {
            return {
                ...state,
                popupDeletePhoto: action.payload
            }
        }

        case SET_PUSH_ALERT: {
            return {
                ...state,
                pushAlert: action.payload
            }
        }

        case POPUP_ORDERED_ALXBUM:
            return {
                ...state,
                popupOrderedAlbum: action.payload
            }

        case POPUP_DELETE_ALBUM:
            return {
                ...state,
                popupDeleteAlbum: action.payload
            }

        case POPUP_EXIT_FROM_ALBUM_PREVIEW:
            return {
                ...state,
                popupExitFromAlbumPreview: action.payload
            }

        case POPUP_SHARED_INVINTATION_SENT:
            return {
                ...state,
                popupSharedInvintationSent: action.payload
            }

        case SET_SHARED_PHOTOS:
            return {
                ...state,
                allSharedPictures: [...action.payload]
            }

        case COUNT_READY_FOR_ORDER_ALBUS:
            return {
                ...state,
                countReadyForOrderAlbums: action.payload
            }

        case POPUP_NEW_ALBUM:
            return {
                ...state,
                popupNewAlbum: action.payload
            }

        case POPUP_WARNING_FULL_ALBUM:
            return {
                ...state,
                popupWarningFullAlbum: action.payload
            }

        case POPUP_NEW_ALBUM_CREATED:
            return {
                ...state,
                popupNewAlbumCreated: action.payload
            }

        case POPUP_FORGOT_PASSWORD:
            return {
                ...state,
                popupForgotPassword: action.payload
            }

        case SET_POPUP_ALBUM_IN_PROGRESS:
            return {
                ...state,
                popupAlbumInProgres: action.payload
            }

        case SET_POPUP_EXIT_FROM_ALBUM_SETTINGS:
            return {
                ...state,
                popupExitFromAlbumSettings: action.payload
            }

        case SET_PUSH_TOKEN:
            return {
                ...state,
                pushToken: action.payload
            }

        case SET_CHOSEN_PICTURE:
            return {
                ...state,
                chosenPicture: action.payload
            }

        case SET_POPUP_ERROR:
            return {
                ...state,
                popupError: action.payload
            }

        case SSET_ROUTE_FROM_NOTIFICATION:
            return {
                ...state,
                routeFromNotification: action.payload
            }

        default: return state
    }
}

export default userReducer