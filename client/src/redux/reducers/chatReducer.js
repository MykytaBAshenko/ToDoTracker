import ACTIONS from '../actions/'

const initialState = {
    chat_active: false
}

const chatReducer = (state = initialState, action) => {
    switch(action.type){

        case ACTIONS.SET_ISCHATOPEN:
            return {
                ...state,
                chat_active: action.payload

            }
        default:
            return state
    }
}

export default chatReducer