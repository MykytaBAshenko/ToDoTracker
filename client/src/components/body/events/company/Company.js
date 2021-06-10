import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

function Company(props) {
    const projectLink = props.match.params.projectLink;
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const { isLogged, isAdmin } = auth
    const [showleft, setshowleft] = useState(false)
    const chat_active = useSelector(state => state.chat_active.chat_active)

    const changeVisibilityMenu = () => {
        setshowleft(!showleft)
    }
    //   useEffect(() => {
    //       console.log(projectLink)
    //         axios.get(`/api/project/get/${projectLink}`, {
    //       headers: {  Authorization: token }
    //     }).then(d => {
    //       console.log(d)

    //         if(d?.data?.success){
    //           console.log(d)
    //         } else {
    //             props.history.push("/dashboard")
    //         }
    //     })
    //   }, [projectLink])

    //   useEffect(() => {
    //     console.log(projectLink)

    // }, [projectLink])

    return (
        <div className="dashboard_page">
            <div className="dashboard_page-control">
                <Link className="black-btn" to="/events/companys/new">Create new company</Link>
                <input type="text" value={search} onChange={e => setsearch(e.target.value)} />
            </div>
            <div className="dashboard_projects">

            </div>
        </div>
    )
}

export default Company
