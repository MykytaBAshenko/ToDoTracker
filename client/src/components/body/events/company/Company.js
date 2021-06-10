import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

function Company(props) {
    const uniqueLink = props.match.params.uniqueLink;
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const { isLogged, isAdmin } = auth
    const [whatShow, setwhatShow] = useState(0)
   
    useEffect(() => {
        axios.get(`/api/comapny/get/${uniqueLink}`, {
        headers: {  Authorization: token }
    }).then(d => {
        console.log(d)

        if(d?.data?.success){
            console.log(d)
        } else {
            props.history.push("/dashboard")
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
                <button className="black-btn" onClick={() => setwhatShow(2)}>Users</button>
                <button className="black-btn" onClick={() => setwhatShow(3)}>Settings</button>

                
            </div>
            <div className="dashboard_projects">

            </div>
        </div>
    )
}

export default Company
