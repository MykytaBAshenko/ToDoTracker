import React, { useState, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'




function Users(props) {
    const projectLink = props.match.params.projectLink;
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const {isLogged, isAdmin} = auth
    useEffect(() => {
    //       axios.post(`/api/project/${projectLink}/adduser`, {
    //     headers: {  Authorization: token }
    //   }).then(d => {
    //       if(d?.data?.success){
    //             console.log(d)
    //       } else {
    //           props.history.push("/dashboard")
    //       }
    //   })
    }, [])

    const [AddUserInput,setAddUserInput] = useState("")

    const AddUserToProject = () => {
        axios.post(`/api/project/${projectLink}/adduser`,{adduser:AddUserInput}, {
            headers: {  Authorization: token }
        }).then(d => console.log(d))
    }


    return (
        <div>
            <input value={AddUserInput} onChange={e => setAddUserInput(e.target.value)}></input>
            <button onClick={() => AddUserToProject()}>ssss</button>
            users
        </div>
    )
}

export default Users
