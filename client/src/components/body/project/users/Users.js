import React, { useState, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';




function Users(props) {
    const [usersIN, setusersIN] = useState([])
    const projectLink = props.match.params.projectLink;
    const [isAdminInPr, setisAdminInPr] = useState(false)
    const [usersearch, setusersearch] = useState("")
    const [usersShow, setusersShow] = useState([])
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    useEffect(() => {
        axios.get(`/api/project/${projectLink}/users`, {
            headers: {  Authorization: token }
        }).then(d => {
            if(d?.data?.success){
                setusersIN(d.data.UsersInProject)
                setusersShow(d.data.UsersInProject)
                let isAdmin = false
                for(let y = 0; y < d.data.UsersInProject.length; y++) {
                    if(d.data.UsersInProject[y].status == "Owner" && d.data.UsersInProject[y].user._id.toString() === auth.user._id)
                    isAdmin = true
                }
                setisAdminInPr(isAdmin)
            } else {
                props.history.push("/dashboard")
            }
        })
    }, [projectLink, auth])


    useEffect(() => {
        let users = []
        for (let y = 0; y < usersIN.length; y++) {
            if (usersIN[y]?.user?.email?.indexOf(usersearch) != -1 || usersIN[y]?.user?.nickname?.indexOf(usersearch) != -1)
            users.push(usersIN[y])
        }
        setusersShow(users)
    }, [usersearch, usersIN])

    const [AddUserInput,setAddUserInput] = useState("")

    const AddUserToProject = () => {
        axios.post(`/api/project/${projectLink}/adduser`,{adduser:AddUserInput}, {
            headers: {  Authorization: token }
        }).then(d => {
            if(d.data.success) {
                setusersIN(d.data.UsersInProject)
                let isAdmin = false
                toast.success(d.data?.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                for(let y = 0; y < d.data.UsersInProject.length; y++) {
                    if(d.data.UsersInProject[y].status == "Owner" && d.data.UsersInProject[y]?.user?._id?.toString() == auth?.user?._id)
                    isAdmin = true
                }
                setisAdminInPr(isAdmin)
            } else {
 
                toast.error(d.data?.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        })
    }

    const dropUser = (id) => {
        axios.delete(`/api/project/${projectLink}/user/${id}`, {
            headers: { Authorization: token }
          }).then(d => {
              if(d.data.success){
                toast.success(d.data?.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setusersIN(d.data?.UsersInProject)

              }
              else {
                 toast.error(d.data?.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
              }
          })
    }

    return (
        <div>
            <div className="dashboard_page-control">
            <input value={AddUserInput} placeholder="User email" onChange={e => setAddUserInput(e.target.value)}></input>
            <button className="black-btn" onClick={() => AddUserToProject()}>Add user in project</button>
            <input value={usersearch} placeholder="Search user" onChange={e => setusersearch(e.target.value)}></input>
            
            </div>
            <div className="users-map">
                {usersShow.map((u,i) => u.user?._id?.toString() != auth?.user?._id ? (
                (u?.user?.nickname?.indexOf(usersearch) != -1 || u?.user?.email?.indexOf(usersearch) != -1  ) &&
                <div key={i} className="user-card">
                    <div className="img-user-container">
                        <img src={u.user.avatar} />
                    </div>
                    <div className="user-card-content">
                        {/* <Link to={"/user/"+u?.user?._id?.toString()} className="user-card-content-row">
                            {u.user.email}
                        </Link> */}
                        <div className="user-card-content-row">
                            {u.user.email}
                        </div>
                        {u.nickname &&
                        <div className="user-card-content-row">
                            {u.user.nickname}
                        </div>}
                        {u.about &&
                            <div className="user-card-content-row">
                                {u.about}
                            </div>
                        }
                        {u.whatDo &&

                        <div className="user-card-content-row">
                            {u.whatDo}
                        </div>}
                        { isAdminInPr &&
                        <button className="user-card-drop-user" onClick={() => dropUser(u._id)}>Drop user</button>                        
                        }</div>
                    </div>) : null)}
            </div>
        </div>
    )
}

export default Users
