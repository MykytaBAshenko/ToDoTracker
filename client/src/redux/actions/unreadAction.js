import ACTIONS from './index'


export const dispatchSetUnreadAction = (res) => {
    return {
        type: ACTIONS.SET_UNREAD_ROOM,
        payload: res
    }
}