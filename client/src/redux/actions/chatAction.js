import ACTIONS from './index'


export const dispatchSetChatAction = (res) => {
    return {
        type: ACTIONS.SET_ISCHATOPEN,
        payload: res
    }
}