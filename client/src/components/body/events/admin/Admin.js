import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import event_type from "../../../global_vars/event_type"

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';

function AproveEvents(props) {
    const token = useSelector(state => state.token)
    const [NonApproved, setNonApproved] = useState([])
    useEffect(() => {
        axios.get(`/api/event/nonapproved`, {
            headers: {  Authorization: token }
        }).then(d => {
            console.log(d.data)
            if(d.data.success) {
                setNonApproved(d.data.NonApproved)
            }
            else {
                toast.error(d.data.msg, {
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
    },[])
    return (
        <div className="approveMap">

            {NonApproved.map((na, i) => <div key={i} className="approve-block">
                <div>{na.title}</div>
                <div>{na.description}</div>
                <div>{na.cost} $</div>
                <div>{(new Date(na.date)).getUTCDate()+"."+((new Date(na.date)).getUTCMonth()+1)+"."+(new Date(na.date)).getUTCFullYear()+" "+(new Date(na.date)).getHours()+"."+(new Date(na.date)).getMinutes()}</div>
                <div>{na.images.map((img, i) => <div><img key={i} src={img}/></div>)}</div>
                {na.type != 'blank' && event_type.map(t => {
                        if (t.value == na.type)
                            return <div key={Math.random()}>{t.label}</div>
                    })}
                <div>
                    <button>
                        
                    </button>
                </div>
            </div>)}
        </div>
    )
}


function Admin(props) {
    const auth = useSelector(state => state.auth)

    useEffect(() => {
        if(auth.user.isLogged)
        if(!auth.user.isAdmin)
            props.history.push("/events/companys")

    }, [auth.user.isLogged])
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
