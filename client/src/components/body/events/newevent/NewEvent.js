import React, { useState, useEffect, Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import { FaPlus, FaArrowLeft  } from 'react-icons/fa'
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import event_type from "../../../global_vars/event_type"
import GoogleMapReact from 'google-map-react';
import ReactMapGL, {Marker} from "react-map-gl"
import {FaMapMarkerAlt} from "react-icons/fa"


function checkOnInput(v){
    let is_ok = false;
    if(v.length == 0 || isNaN(v))
        return false;
    for(let y = 0; y < v.length; y++){
        if(v[y] == "0"
            || v[y]  == "1"
            || v[y]  == "2"
            || v[y]  == "3"
            || v[y]  == "4"
            || v[y]  == "5"
            || v[y]  == "6"
            || v[y]  == "7"
            || v[y]  == "8"
            || v[y]  == "9"
            || v[y]  == "."
            || v[y]  == "-"
        ) 
        is_ok = true
        else{
        is_ok = false
            break
    }
    }
    return is_ok
}
function latCheck(v) {
    console.log(v)
    if (parseFloat(v) < 90 && parseFloat(v)> -90)
        return true
    return false
    }


    function lonCheck(v) {
        
        if (parseFloat(v) < 180 && parseFloat(v)> -180)
            return true
        return false
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



function NewEvent(props) {
    const uniqueLink = props.match.params.uniqueLink;
    const token = useSelector(state => state.token)
    const [title, settitle] = useState("")
    const [cost, setcost] = useState(0)
    const [body, setbody] = useState("")
    const [ondate, setondate] = useState(new Date());
    const [typesOption, settypesOption] = useState(event_type[0])
    const [longitude, setlongitude] = useState(0)
    const [latitude, setlatitude] = useState(0)
    const [photos, setphotos] = useState([])

    useEffect(() => {
        axios.get(`/api/company/get/${uniqueLink}`, {
        headers: {  Authorization: token }
    }).then(d => {
        console.log(d.data)

        if(d?.data?.success){
            if(d.data.UserInCompany.length) {
                return
            }
            toast.error("You are not a member of the company", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            props.history.push("/events/companys/"+uniqueLink)
        }
    })
    }, [uniqueLink])
    // useEffect(() => {
    //       axios.get(`/api/project/get/${uniqueLink}`, {
    //     headers: {  Authorization: token }
    //   }).then(d => {
    //     console.log(d)

    //       if(d?.data?.success){
    //         console.log(d)
    //       } else {
    //           props.history.push("/dashboard")
    //       }
    //   })
    // }, [uniqueLink])

    const typesChange = typeOption => {
        settypesOption(typeOption);
    };

    const dropImage = (i) => {
        let new_photos = []
        for(let y = 0; y < photos.length; y++) {
            if(i != y)
                new_photos.push(photos[y])
        }
        setphotos(new_photos)
    }

    const uploadPhoto = async (files) => {
        try {
            const file = files[0]

            if (!file)
                return toast.error("Bad file.", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            if (file.size > 8 * 1024 * 1024)
                return toast.error("Size too large.", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.mimetype !== 'image/jpg')
                return toast.error("File format is incorrect.", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            let formData = new FormData()
            formData.append('file', file)

            const res = await axios.post('/api/event/uploadphoto', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
            if (res.data.success)
                setphotos([...photos, "/" + res.data.url])
            else
                return toast.error(res.data.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
        } catch (err) {
            return toast.error("Something broke.", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }


    const createEvent = () => {
        console.log(title,
            body,
            typesOption.value,
            cost,
            photos,
            ondate,
            latitude,
            longitude
            
            )

        let sendObj = {}
        sendObj.title = title
        sendObj.description = body
        sendObj.type = typesOption.value
        sendObj.images = photos
        sendObj.cost = cost
        sendObj.date = ondate.getTime()
        sendObj.latitude = latitude
        sendObj.longitude = longitude
        // console.log(sendObj)
        axios.post(`/api/event/create/${uniqueLink}`, sendObj, {
            headers: { Authorization: token }
        }).then(d => {
            if(d.data.success) {
                props.history.push(`/events/companys/${uniqueLink}`)
                return toast.success(d.data.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
        
            }
            else 
                return toast.error(d.data.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
        })
    }

    return(
        <div className="dashboard_page">
        <div className="task-form">
            <span className="task-form-link" onClick={() => {
                props.history.goBack()
            }} ><FaArrowLeft /> Back</span>
            <div className="task-form-title">Create new task</div>
            <div className="task-form-row">
                <div className="task-form-row-title">Title</div>
                <input className="task-form-row-input" onChange={e => settitle(e.target.value)} value={title}></input>
            </div>
            <div className="task-form-row">
                <div className="task-form-row-title">Content</div>
                <textarea value={body} onChange={e => setbody(e.target.value)}/>
            </div>
            <div className="task-form-row">
                <div className="task-form-row-title">Event type</div>
                <Select
                    value={typesOption}
                    onChange={typesChange}
                    options={event_type}
                    theme={theme => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            //   primary50: '#B2D4FF',
                            primary25: '#80B0FF',
                            primary: '#1B1E24',
                            primary75: '#0aa699',
                            primary50: '#0aa699',
                            primary25: '#0aa69981',
                            neutral0: 'white',
                            neutral5: 'white',
                            neutral10: 'white',
                            neutral20: 'white'
                        },
                    })}
                />
            </div>
            <div className="deadline-row task-from-row-input">
                <div className="task-form-row-title">When will the event be</div>
                <div className="deadline_is_seted">
                    <DateTimePicker
                        onChange={setondate}
                        value={ondate}
                        format="dd-MM-y h:mm"
                        locale="en-EN"
                    />
                </div>
            </div>
            <div className="deadline-row task-form-row" >
                <div className="task-form-row-title">Cost</div>
                <div className="deadline_is_seted">
                    <input className="task-form-row-input" onChange={e => checkOnInput(e.target.value) ? setcost(e.target.value) : 0} value={cost} type="number"></input>
                </div>
            </div>
            <div className="task-form-row">
                <div className="task-form-row-title">Photos</div>
            <div className="new-task-photo-control">
                {photos.map((img, i) => <div key={i+Math.random()} onClick={() => dropImage(i)} className="new-task-photo-control-shell"><img src={img} /></div>)}

                <Dropzone
                    onDrop={(e) => uploadPhoto(e)}
                    multiple={false}
                    maxSize={8 * 1024 * 1024}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div className="dropzone"
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <FaPlus />

                        </div>
                    )}

                </Dropzone>
            </div>
            </div>
            <div className="map-row">
                <div className="map-row-title">Show your event on the map (latitude, longitude)</div>
                <div className="map-input">
                    <input className="task-form-row-input" max="90" min="-90" onChange={e => {if(checkOnInput(e.target.value) && latCheck(e.target.value))
                        setlatitude(e.target.value)
                        else 
                        setlatitude(0)}}   value={latitude} type="number"></input>
                    <input max="180" min="-180" className="task-form-row-input" onChange={e => {if(checkOnInput(e.target.value) && lonCheck(e.target.value))
                        setlongitude(e.target.value)
                        else 
                        setlongitude(0)}} value={longitude} type="number"></input>
                    
                </div>
                <Map latitude={latitude} longitude={longitude}/>

            </div>
            <button className="task-btn black-btn" onClick={() => createEvent()}>Create new event</button>
                   
        </div>

        </div>            
    )
}

export default NewEvent