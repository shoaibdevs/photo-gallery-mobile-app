import { createStore, combineReducers, applyMiddleware } from 'redux';
import userReducer from './user/userReducer'
import editAlbumreducer from './editAlbum/editAlbumReducer';
import thunk from 'redux-thunk'

const rootReducer = combineReducers({
    user: userReducer,
    editAlbum: editAlbumreducer
});

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store