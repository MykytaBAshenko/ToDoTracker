import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import event_type from "../../../global_vars/event_type"
import {FaArrowLeft} from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import ReactMapGL, {Marker} from "react-map-gl"
import {FaMapMarkerAlt} from "react-icons/fa"
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
    useEffect(() => {
        axios.get(`/api/event/single/${props.match.params.eventid}`, {
            headers: {  Authorization: token }
          }).then(d => {
            console.log(d)
    
              if(d?.data?.success){
                // console.log(d)
                setevent(d.data.event)
              } else {
                  props.history.push("/events")
              }
          })
    }, [props.match])


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
