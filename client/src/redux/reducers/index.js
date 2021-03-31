import {combineReducers} from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import projects from './projectsReducer'
import chat_active from './chatReducer'
import unread from './unreadReducer'






export default combineReducers({
    auth,
    token,
    projects,
    chat_active,
    unread,
})