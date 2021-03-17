import ACTIONS from './index'
import axios from 'axios'

export const fetchAllProjects = async (token) => {
    const res = await axios.get('/api/project', {
        headers: {Authorization: token}
    })
    return res
}

export const dispatchGetAllProjects = (res) => {
    return {
        type: ACTIONS.GET_PROJECTS,
        payload: res.data
    }
}

export const dispatchSetLastUpdateInMsg = (res) => {
    console.log(res)
    return {
        type: ACTIONS.SET_LAST_MSG,
        payload: res
    }
}