import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';

function AproveEvents(props) {
    const token = useSelector(state => state.token)

    useEffect(() => {
        axios.get(`/api/event/nonapproved`, {
            headers: {  Authorization: token }
        }).then(d => {
            console.log(d.data)
           
        })
    },[])
    return (
        <div>
            Aprove
        </div>
    )
}


function Admin(props) {
    const auth = useSelector(state => state.auth)

    useEffect(() => {
        if(!auth.user.isAdmin)
            props.history.push("/events/companys")

    }, [auth])
    const [whatShow, setwhatShow] = useState(0)
    return (
        <div className="dashboard_page">
            <div className="dashboard_page-control">
                <button className="black-btn" onClick={() => setwhatShow(0)}>Approve</button>
                <button className="black-btn" onClick={() => setwhatShow(1)}>Transactions</button>

            </div>
            <div className="comapny_events_show">

            {
                whatShow === 0 ? 
                    <AproveEvents/> : 
                    null
            }
            </div>
        </div>
    )
}

export default Admin
