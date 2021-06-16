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


    const dropEvent = id => {
        axios.post("/api/event/remove", {id}, {
            headers: { Authorization: token }
        }).then(d => {
            if(d.data.success) {
                setNonApproved(d.data.NonApproved)
                toast.success(d.data.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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
    }

    const approveEvent = id => {
        axios.post("/api/event/approve", {id}, {
            headers: { Authorization: token }
        }).then(d => {
            if(d.data.success) {
                setNonApproved(d.data.NonApproved)
                toast.success(d.data.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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
    }


    return (
        <div className="approveMap">
            {NonApproved.length == 0 ? <div className="nothingToApprove">Nothing to approve!</div> : null}
            {NonApproved.map((na, i) => <div key={i} className="approve-block">
                <div className="approve-block-title">{na.title}</div>
                <div className="approve-block-description">{na.description}</div>
                <div className="approve-block-images">{na.images.map((img, i) => <img key={i} src={img}/>)}</div>
                <div className="approve-block-meta">
                {na.type != 'blank' && event_type.map(t => {
                        if (t.value == na.type)
                            return <div key={Math.random()}>{t.label}</div>
                    })}
                <div>{na.cost} $</div>
                <div>{(new Date(na.date)).getUTCDate()+"."+((new Date(na.date)).getUTCMonth()+1)+"."+(new Date(na.date)).getUTCFullYear()+" "+(new Date(na.date)).getHours()+"."+(new Date(na.date)).getMinutes()}</div>
                    <a className="approve-block-link" href={"/events/companys/"+na.company.uniqueLink} target="_blank">{na.company.name}</a>
                </div>
                <div className="approve-block-control">
                    <button onClick={() => approveEvent(na._id)} className="green-btn">
                    Approve event
                    </button>
                    <button onClick={() => dropEvent(na._id)} className="danger-btn">
                        Drop event
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
                <button className="black-btn" onClick={() => setwhatShow(2)}>Payment</button>


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
