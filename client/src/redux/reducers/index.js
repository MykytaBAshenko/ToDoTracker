import {combineReducers} from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import projects from './projectsReducer'
import chat_active from './chatReducer'




export default combineReducers({
    auth,
    token,
    projects,
    chat_active
})