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