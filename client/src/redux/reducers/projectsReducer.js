import ACTIONS from '../actions/'

const initialState = {
    projects:[]
}

const projectsReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.SET_LAST_MSG:
            return {
                ...state,
                projects: action.payload.sort((a,b) => (a.project.lastMsg > b.project.lastMsg) ? 1 : ((b.project.lastMsg > a.project.lastMsg) ? -1 : 0))
            }
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