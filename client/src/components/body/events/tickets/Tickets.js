import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { set } from 'mongoose'
import { Link } from 'react-router-dom'
import QRCode from "react-qr-code";


function Tickets(props) {
    const token = useSelector(state => state.token)
    const [tickets, settickets] = useState([])
    useEffect(() => {
        axios.get(`/api/event/tickets`, {
            headers: {  Authorization: token }
          }).then(d => {
            console.log(d.data)
              if(d?.data?.success){
                // console.log(d)
                settickets(d.data.tickets)
              } 
          })
    }, [props.match])
    return (
        <div className="tickets">
            {tickets.length ? 
                <div className="tickets-map">
                    {tickets.map((t, i) => 
                    <div>
                        <Link to={"/events/event/"+t.event._id}>
                            {t.event.title}
                        </Link>
                        <QRCode value={"ticket/"+t?._id}/>
                    </div>
                    )}
                </div>
                :
                <div>You didn't buy any event</div>
        }
        </div>
    )
}
export default Tickets