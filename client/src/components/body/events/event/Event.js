import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import event_type from "../../../global_vars/event_type"
import {FaArrowLeft} from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import ReactMapGL, {Marker} from "react-map-gl"
import {FaMapMarkerAlt} from "react-icons/fa"
import PaypalExpressBtn from 'react-paypal-express-checkout';
import { toast } from 'react-toastify';
import QRCode from "react-qr-code";



class Paypal extends React.Component {
    render() {
        const onSuccess = (payment) => {
            
            axios.post(`/api/event/buy/${this?.props?.eventId}`, payment, {
                headers: {  Authorization: this?.props?.token }, 
              }).then(d => {
                console.log(d)

                  if(d?.data?.success){
                    this?.props?.onSuccess()
                  } else {
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
        const transactionError = () => {
            console.log('Paypal error')
          }
          
          const transactionCanceled = () => {
            console.log('Transaction canceled')
          }
        const onCancel = (data) => {
            console.log('The payment was cancelled!', data);
        }
  
        const onError = (err) => {
            console.log("Error!", err);
        }
  
        let env = 'sandbox'; 
        let currency = 'USD'; 
        let total = this.props.toPay; 
  
        const client = {
            sandbox: 'AfyGTdb67AGvKUAa1kpLTn-s2ycDsk0t2oosnETXZzlBW22-Rzhhgntk7bj-0zDgZvMY3GkkLmwqLaYm',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
       return (
            <PaypalExpressBtn
                env={env}
                client={client}
                currency={currency}
                total={total}
                onError={onError}
                onSuccess={onSuccess}
                onCancel={onCancel}
                style={{ 
                    size:'large',
                    color:'blue',
                    shape: 'rect',
                    label: 'checkout'
                }}
                 />
        );
    }
  }
  

function Map(props){
    let [viewport, setviewport] = useState({
        latitude: Number.parseFloat(props.latitude), 
        longitude: Number.parseFloat(props.longitude),
        zoom: 14,
        width: "100%",
        height: "300px",
    })
    useEffect(() => {
        setviewport({
            latitude: Number.parseFloat(props.latitude), 
            longitude: Number.parseFloat(props.longitude),
            zoom: 14,
            width: "100%",
            height: "300px",
        })
    },[props.latitude, props.longitude])
    return(
        <ReactMapGL
            mapboxApiAccessToken={
                "pk.eyJ1IjoiZHVtYWdlbm9uIiwiYSI6ImNrZmlkcjY1OTE3YWcycm8zYXFpdGhzaDYifQ.jvKHR9uQpnj_Rq5vQakVtg"
            }
            {...viewport}
            onViewportChange={(newView) =>  setviewport(newView)}>
                <Marker  latitude={Number.parseFloat(props.latitude)} 
        longitude={Number.parseFloat(props.longitude)}>
<FaMapMarkerAlt fill="red"/>
                </Marker>
            </ReactMapGL>
    )

}

function Event(props) {
    const [ShowPhoto, setShowPhoto] = useState(false)

    const token = useSelector(state => state.token)
    const [event, setevent] = useState({})
    const [ticket, setticket] = useState({})
    const [act, setact] = useState(false)
    useEffect(() => {
        axios.get(`/api/event/single/${props.match.params.eventid}`, {
            headers: {  Authorization: token }
          }).then(d => {
            console.log(d.data)
    
              if(d?.data?.success){
                // console.log(d)
                setevent(d.data.event)
                setticket(d.data.ticket)
              } else {
                  props.history.push("/events")
              }
          })
    }, [props.match, act])
    const onSuccess = (data) => {
        setact(!act)

    }

    useEffect(() => {
    }, [ticket])

    return (
        <>{
            !ShowPhoto ?
                <>
                <div className="task-body">
                <span className="task-form-link" onClick={() => {
                    props.history.goBack()
                }} ><FaArrowLeft /> Back</span>
                    {console.log(event)}
                    <div className="task-body-exact">
                        <div className="task-body-title">
                            {event?.title}
                        </div>
                        <div className="task-body-description">
                            {event?.description}
                        </div>
                        <div className="new-task-photo-control">
                            {event?.images?.map((img, i) => <div onClick={() => {
                                setShowPhoto(img)
                            }} key={i} className="new-task-photo-control-shell select-photo"><img src={img} alt="" /></div>)}
                        </div>
                        <div className="task-body-meta-body">
                            <div className="task-body-meta-body-left">
                                <div className="task-body-meta">
                                <div className="task-body-meta-cost">
                                   {event?.cost ? event?.cost + " $": "FREE"}
                                   </div>
                                    {event?.type != 'blank' && event_type.map(t => {
                                        if (t.value == event?.type)
                                            return <div key={Math.random()}>{t.label}</div>
                                    })}
                                                            <div className="eventCardDate">
                        {(new Date(event?.date)).getDate()}.
                        {(new Date(event?.date)).getMonth()+1}.
                        {(new Date(event?.date)).getUTCFullYear()}
                        {" / "}
                        {(new Date(event?.date)).getHours()}.
                        {(new Date(event?.date)).getMinutes()}

                        </div>
                                </div>
                         
                                <div className="task-body-update-info">

                                </div>

                            </div>
                        </div>
                        {
                            ticket?._id ?<>
                            <QRCode value={"ticket/"+ticket?._id}  />
                            <div className="event-exist">
                            </div>
                            </> :
                            event?.cost ?
                            <Paypal
                            toPay={event?.cost ?? 0}
                            onSuccess = {onSuccess}   
                            eventId={event?._id}      
                            token={token}  
                        /> : <button onClick={() => {
                            axios.post(`/api/event/buy/${event?._id}`, {paymentToken: "FREE",paymentID:"FREE"}, {
                                headers: {  Authorization: token }, 
                              }).then(d => {
                                  if(d?.data?.success){
                                    console.log(d)
                                    setact(!act)
                                  } else {
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
                        }} className="danger-btn">
                            Get Ticket for free
                        </button>
                
                        }
                        
                        <div className="event-map">
                            <div>
                                Latitude: {event?.latitude}
                            </div>
                            <div>
                                Longitude: {event?.longitude}
                            </div>
                                {event?.latitude && event?.longitude ?
                <Map latitude={event?.latitude} longitude={event?.longitude}/> : null
                        }     </div>
                    </div>
    

                    
                </div> 
                {/* <Comments taskId={taskId}/> */}
                </>
                :
                <div className="task-body-photo-container">
                    <MdClose onClick={() => setShowPhoto(false)} />
                    <img src={ShowPhoto} />
                </div>}
        </>
    )
}

export default Event
