import ACTIONS from '../actions/'

const initialState = {
    projects:[]
}

const projectsReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.GET_PROJECTS:
            return {
                ...state,
                projects: action.payload.projects
            }
        default:
            return state
    }
}

export default projectsReducer