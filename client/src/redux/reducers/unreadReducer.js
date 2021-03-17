import ACTIONS from '../actions/'

const initialState = {
    unread:[]
}

const unreadReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.SET_UNREAD_ROOM:
            return {
                ...state,
                unread: action.payload.unread
            }
        default:
            return state
    }
}

export default unreadReducer