import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

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
        if(d?.data?.success){
            console.log(d.data)
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
                    whatShow === 1 ? 
                        <CompanyAbout Company={Company}/> : 
                        null
                }
                {
                    whatShow === 2 ? 
                        <CompanyAbout Company={Company}/> : 
                        null
                }
            </div>
        </div>
    )
}

export default Company
