import ACTIONS from './index'


export const dispatchSetChatAction = (res) => {
    return {
        type: ACTIONS.SET_ISCHATOPEN,
        payload: res
    }
}

export const dispatchSetWhatChatActiveAction = (res) => {
    return {
        type: ACTIONS.SET_ACTIVE_CHAT,
        payload: res
    }
}