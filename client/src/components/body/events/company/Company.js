import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';

function CompanyAbout(props) {
    return (
        <div className="comapny-about"> 
            <div className="comapny-about-head">
                <div className="comapny-about-head-img">
                    <img src={props.Company.logo}></img>
                </div>
                <div className="company-about-head-title">{props.Company.name}</div>
            </div>
            <div className="comapny-about-body">
                {props.Company.description}
            </div>
        </div>
    )
}

function CompanyUsers(props) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const [usersIN, setusersIN] = useState([])

    const [isAdminInPr, setisAdminInPr] = useState(false)
    const [usersearch, setusersearch] = useState("")
    const [usersShow, setusersShow] = useState([])
    useEffect(() => {
        axios.get(`/api/company/${props.uniqueLink}/users`, {
            headers: {  Authorization: token }
        }).then(d => {
            console.log(d.data)
            if(d?.data?.success){
                setusersIN(d.data.UsersInCompany)
                setusersShow(d.data.UsersInCompany)
                let isAdmin = false
                for(let y = 0; y < d.data.UsersInCompany.length; y++) {
                    if(d.data?.UsersInCompany[y]?.status == "Owner" && d.data?.UsersInCompany[y]?.user?._id.toString() === auth.user._id)
                    isAdmin = true
                }
                setisAdminInPr(isAdmin)
            } 
        })
    }, [props.uniqueLink])
    useEffect(() => {
        let users = []
        for (let y = 0; y < usersIN.length; y++) {
            if (usersIN[y]?.user?.email?.indexOf(usersearch) != -1)
            users.push(usersIN[y])
        }
        setusersShow(users)
    }, [usersearch, usersIN])

    const [AddUserInput,setAddUserInput] = useState("")

    const AddUserToProject = () => {
        axios.post(`/api/company/${props.uniqueLink}/adduser`,{adduser:AddUserInput}, {
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
        axios.delete(`/api/company/${props.uniqueLink}/user/${id}`, {
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


function CompanyEvents(props) {
    // const [SearchEvent, setSearchEvent] = useState("")
    // const [SearchEvent, setSearchEvent] = useState("")


    return (
        <div>
            <div className="dashboard_page-control">
                {props.UserIn &&
                <Link className="green-btn" to={`/events/companys/${props.uniqueLink}/new`}>Add new event</Link>
                }
                {/* <input value={AddUserInput} placeholder="User email" onChange={e => setAddUserInput(e.target.value)}></input>
                <button className="black-btn" onClick={() => AddUserToProject()}>Add user in project</button>
                <input value={usersearch} placeholder="Search user" onChange={e => setusersearch(e.target.value)}></input> */}
            
            </div>
            
        </div>
    )
}


function Company(props) {
    const uniqueLink = props.match.params.uniqueLink;
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const { isLogged, isAdmin } = auth
    const [whatShow, setwhatShow] = useState(0)
    const [Company, setCompany] = useState({})
    const [UserIn, setUserIn] = useState(false)
    useEffect(() => {
        axios.get(`/api/company/get/${uniqueLink}`, {
        headers: {  Authorization: token }
    }).then(d => {
        console.log(d.data)

        if(d?.data?.success){
            if(d.data.UserInCompany.length) {
                setUserIn(d.data.UserInCompany[0])
            }
            setCompany(d.data.Company)
        } else {
            props.history.push("/events/companys")
        }
    })
    }, [uniqueLink])


    return (
        <div className="dashboard_page">
            <div className="dashboard_page-control">
                {/* <Link className="black-btn" to={`/events/companys/${uniqueLink}/events`}>Events</Link>
                <Link className="black-btn" to={`/events/companys/${uniqueLink}/events`}>About</Link>
                <Link className="black-btn" to={`/events/companys/${uniqueLink}/events`}>Users</Link>
                <Link className="black-btn" to={`/events/companys/${uniqueLink}/events`}>Settings</Link> */}
                <button className="black-btn" onClick={() => setwhatShow(0)}>Events</button>
                <button className="black-btn" onClick={() => setwhatShow(1)}>About</button>
                { UserIn ?                
                    <>
                        <button className="black-btn" onClick={() => setwhatShow(2)}>Users</button>
                        <button className="black-btn" onClick={() => setwhatShow(3)}>Settings</button> 
                    </> :
                    null
                }
                
            </div>
            <div className="comapny_events_show">

                {
                    whatShow === 0 ? 
                        <CompanyEvents uniqueLink={uniqueLink} Company={Company} UserIn={UserIn} /> : 
                        null
                }
                {
                    whatShow === 1 ? 
                        <CompanyAbout Company={Company}/> : 
                        null
                }
                {
                    whatShow === 2 ? 
                        <CompanyUsers uniqueLink={uniqueLink} Company={Company}/> : 
                        null
                }
            </div>
        </div>
    )
}

export default Company
