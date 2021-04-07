import React, { useState, useEffect } from 'react'
import {useSelector} from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify';
import { FaPlus, FaArrowLeft  } from 'react-icons/fa'
import calendar_type from '../global_vars/calendar_type'
import Select from 'react-select'
import { MdClose } from 'react-icons/md'
import how_task_is_nedded from '../global_vars/how_task_is_needed'
import DateTimePicker from 'react-datetime-picker'
import Dropzone from 'react-dropzone'

function EditCalendar(props) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const calendarId = props.match.params.calendarId
    const [title, settitle] = useState("")
    const [someId, setsomeId] = useState("")
    const [drop, setdrop] = useState(false)

    const [description, setdescription] = useState("")
    const [adduserinput, setadduserinput] = useState("")
    const [list_of_users_for_meeting, setlist_of_users_for_meeting] = useState([auth?.user?._id])
    const [list_of_users_for_meeting_show, setlist_of_users_for_meeting_show] = useState([])
    const [type, settype] = useState(calendar_type[0])
    const [priorityOption, setpriorityOption] = useState(how_task_is_nedded[3])
    const [date, setdate] = useState(new Date())
    const [photos, setphotos] = useState([])

    const addUserIfExist = () => {
        let ok = true
        for(let y = 0; y < list_of_users_for_meeting_show.length; y++) {
            if(list_of_users_for_meeting_show[y].user.email == adduserinput)
                ok = !ok
        }
        if(ok)
        axios.post('/api/calendar/checkemail', {
            email: adduserinput
        }, {
            headers: { Authorization: token }
        }).then(d => {
        
            if(d.data.success) {
                setadduserinput("")
                setlist_of_users_for_meeting([...list_of_users_for_meeting, d.data.user._id])
                setlist_of_users_for_meeting_show([...list_of_users_for_meeting_show, d.data])
            }
            else {
                return toast.error(d.data.msg, {
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

            const res = await axios.post('/api/calendar/uploadphoto', formData, {
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
    const dropImage = (i) => {
        let new_photos = []
        for(let y = 0; y < photos.length; y++) {
            if(i != y)
                new_photos.push(photos[i])
        }
        setphotos(new_photos)
    }

    useEffect(() => {
        axios.get(`/api/calendar/one/${calendarId}`, {
            headers: { Authorization: token }
        }).then(d => {
            if (d.data.success) {
                // set_vals(d.data.task)
                let calendar = d.data.calendar[0]
                settitle(calendar.title)
                setdescription(calendar.description)
                setdate(new Date(calendar.date))
                setphotos(calendar.images)
                setsomeId(calendar._id)
                for(let o = 0;o<calendar_type.length;o++) {
                    if(calendar_type[o].value == calendar.type)
                    settype(calendar_type[o])
                }
                for(let o = 0;o<how_task_is_nedded.length;o++) {
                    if(how_task_is_nedded[o].value == calendar.priority)
                    setpriorityOption(how_task_is_nedded[o])
                }
                if(d.data.users) {
                    let gg = d.data.users.filter(function(u) {
                        return u.user._id != auth.user._id;
                    })

                    setlist_of_users_for_meeting_show(gg)
                    let push_arr = []
                    for(let u = 0; u < d.data.users.length; u++) {
                        push_arr.push(d.data.users[u].user._id)
                    }
                    setlist_of_users_for_meeting(push_arr)
                }
            }
            else {
                props.history.push(`/calendar`)
                return toast.error(d.data.msg, {
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
    }, [calendarId,auth])
    const drop_from_users_list = (id) => {
        let show_array =  list_of_users_for_meeting_show.filter(function(u) {
            return u.user._id != id
        });

        // let send_array =  list_of_users_for_meeting.filter(function(u) {
        //     return u != id
        // });
        let send_array = []
        for( let i = 0; i < list_of_users_for_meeting.length; i++) {
            if(list_of_users_for_meeting[i] != id)
                send_array.push(list_of_users_for_meeting[i])
            }
        
        setlist_of_users_for_meeting_show(show_array)
        setlist_of_users_for_meeting(send_array)
    }
    const updateSomething = () => {
        if(!title || !description)
        return toast.error("Title or description is empty.", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    let sendObj = {}
    sendObj.title = title
    sendObj.description = description
    sendObj.images = photos
    sendObj.date = date.getTime()
    if (type.value == 'reminder' || type.value == 'blank') {
        sendObj.type = type.value
    }
    if (type.value == 'meeting') {
        sendObj.type = 'meeting'
        sendObj.users = list_of_users_for_meeting
    }
    if (type.value == 'todo') {
        sendObj.type = 'todo'
        sendObj.priority = priorityOption.value
    }


    axios.put(`/api/calendar/${someId}`,sendObj, {
        headers: { Authorization: token }
    }).then(d => {

        if (d.data.success) {
            props.history.push(`/calendar`)
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
const dropTask = () => {
    axios.delete(`/api/calendar/${someId}`,{
        headers: { Authorization: token }
    }).then(d => {
        if (d.data.success) {
            props.history.push(`/calendar`)
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
    return(<div className="task-form">
<span className="task-form-link" onClick={() => {
                props.history.goBack()
            }} ><FaArrowLeft /> Back</span>
            <div className="task-form-title">Edit calendar event</div>
            <div className="task-form-row">
                <div className="task-form-row-title">Title</div>
                <input className="task-form-row-input" onChange={e => settitle(e.target.value)} value={title}></input>
            </div>
            <div className="task-form-row">
                <div className="task-form-row-title">Content</div>
                <textarea value={description} onChange={e => setdescription(e.target.value)}/>
            </div>
            <div className="deadline-row">
                <div className="task-form-row-title">On date</div>
                <DateTimePicker
                    onChange={setdate}
                    value={date}
                    format="dd-mm-y H:MM"
                    locale="en-EN"
                />
            </div>
            <div className="task-form-row">
                <div className="task-form-row-title">Type</div>
                <Select
                    value={type}
                    onChange={settype}
                    options={calendar_type}
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
            {
                type.value == 'todo' ?
                <div className="task-form-row">
                    <div className="task-form-row-title">Task priority</div>
                    <Select
                        value={priorityOption}
                        onChange={setpriorityOption}
                        options={how_task_is_nedded}
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
                </div> : null
            }
             {
                type.value == 'meeting' ?
                <>
                <div className="task-form-row">
                    <div className="task-form-row-title">Add other people to the meeting</div>
                    <div className="task-form-row-add-users">
                        <input value={adduserinput} onChange={(e) => setadduserinput(e.target.value)} />
                        <button className="black-btn" onClick={() => addUserIfExist()}>Add user to meeting</button>
                    </div>
                </div>
                {list_of_users_for_meeting_show.length ? 
                <div className="users_for_meeting">
                    {list_of_users_for_meeting_show.map((u, i) =>  <div key={i} className="user_for_meeting-show">   
                        <img src={u.user.avatar}/>
                        <div className="user_for_meeting-show-info">
                            <div className="user_for_meeting-show-info-nickname">
                                {u.user.nickname}
                            </div>
                            <div className="user_for_meeting-show-info-email">
                                {u.user.email}
                            </div>
                        </div>
                        <MdClose onClick={() => drop_from_users_list(u.user._id)} />
                    </div> )}
                </div> : null}
                </> : null
            }
            
                    <div className="task-form-row">
                <div className="task-form-row-title">Photos</div>
            <div className="new-task-photo-control">
                {photos.map((img, i) => <div key={i} onClick={() => dropImage(i)} className="new-task-photo-control-shell"><img src={img} /></div>)}

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
            <button className="black-btn"  onClick={() => updateSomething()}>Update</button>
            {
                !drop ?
            <button className="black-btn"  onClick={() => setdrop(!drop)}>Drop</button> :
                <div className="drop-ctrl">
                    <button className="black-btn" onClick={() => setdrop(!drop)}>Cancel</button>
                    <button className="danger-btn" onClick={() => dropTask()}>Are you sure?</button>

                </div>

            }
                
    </div>)
}
export default EditCalendar 
