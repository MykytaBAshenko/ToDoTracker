import {combineReducers} from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import projects from './projectsReducer'



export default combineReducers({
    auth,
    token,
    projects
})