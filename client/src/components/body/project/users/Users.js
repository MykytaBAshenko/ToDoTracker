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
    }, [usersearch])

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
                        <div className="user-card-content-row">
                            {u.user.nickname}
                        </div>
                        {u.about &&
                            <div className="user-card-content-row">
                                {u.about}
                            </div>
                        }
                        <div className="user-card-content-row">
                            {u.whatDo}
                        </div>
                        { isAdminInPr &&
                        <button className="user-card-drop-user" onClick={() => dropUser(u._id)}>Drop user</button>                        
                        }</div>
                    </div>) : null)}
            </div>
        </div>
    )
}

export default Users
// about: ""
// createdAt: "2021-03-06T21:03:37.064Z"
// nickname: "Mykyta Bashenko"
// project: "6043ee282fc6cd429b1cab89"
// status: "Owner"
// updatedAt: "2021-03-06T21:03:37.064Z"
// user:
// avatar: "https://lh3.googleusercontent.com/a-/AOh14GgMk4J-NbmZMKpv8PssGqX_0li9h-GK5YvH0kej6g=s96-c"
// createdAt: "2021-03-06T00:51:53.721Z"
// email: "nikita.bashenko2001@gmail.com"
// nickname: "Mykyta Bashenko"
// password: "$2b$12$g2PpH9B8eTN..LlZ3xD1AuTQlVKCxHxxxN/PwgNhM3iegP3ypWwkS"
// updatedAt: "2021-03-12T13:12:48.838Z"
// __v: 0
// _id: "6042d22966ced24a3971d80f"
// __proto__: Object
// whatDo: "Project owner"