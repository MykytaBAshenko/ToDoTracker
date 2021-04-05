import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import DateTimePicker from 'react-datetime-picker'
import Select from 'react-select'
import { FaPlus, FaArrowLeft  } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Dropzone from 'react-dropzone'
import { MdClose } from 'react-icons/md'
import calendar_type from '../global_vars/calendar_type'
import how_task_is_nedded from '../global_vars/how_task_is_needed'
function NewToCalendar(props) {
    const auth = useSelector(state => state.auth)
    const [title, settitle] = useState("")
    const [description, setdescription] = useState("")
    const token = useSelector(state => state.token)
    const [photos, setphotos] = useState([])
    const [priorityOption, setpriorityOption] = useState(how_task_is_nedded[3])
    // const [typesOption, settypesOption] = useState(types_of_task[1])
    const [date, setdate] = useState(new Date())
    const [type, settype] = useState(calendar_type[0])
    const [list_of_users_for_meeting, setlist_of_users_for_meeting] = useState([auth?.user?._id])
    const [list_of_users_for_meeting_show, setlist_of_users_for_meeting_show] = useState([])

    const [adduserinput, setadduserinput] = useState("")



    const addUserIfExist = () => {
        axios.post('/api/calendar/checkemail', {
            email: adduserinput
        }, {
            headers: { Authorization: token }
        }).then(d => {
        
            if(d.data.success) {
                setlist_of_users_for_meeting([...list_of_users_for_meeting, d.data.user._id])
                setlist_of_users_for_meeting_show([...list_of_users_for_meeting_show, d.data.user])
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

    useEffect(()=> {
        setlist_of_users_for_meeting([auth?.user?._id])
        setlist_of_users_for_meeting_show([])
    },[token,auth])
    useEffect(()=> {

    },[list_of_users_for_meeting])
    const drop_from_users_list = (id) => {
        let show_array =  list_of_users_for_meeting_show.filter(function(u) {
            return u._id != id
        });

        let send_array =  list_of_users_for_meeting.filter(function(u) {
            return u != id
        });
        setlist_of_users_for_meeting_show(show_array)
        setlist_of_users_for_meeting(send_array)
    }

    const createSomething = () => {
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

        console.log(sendObj)

        axios.post(`/api/calendar/new`,sendObj, {
            headers: { Authorization: token }
        }).then(d => {
            // console.log(d)

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
        // axios.post('/api/calendar/checkemail', {
        //     email: adduserinput
        // }, {
        //     headers: { Authorization: token }
        // }).then(d => {
        
        //     if(d.data.success) {
        //         setlist_of_users_for_meeting([...list_of_users_for_meeting, d.data.user._id])
        //         setlist_of_users_for_meeting_show([...list_of_users_for_meeting_show, d.data.user])
        //     }
        //     else {
        //         return toast.error(d.data.msg, {
        //             position: "bottom-center",
        //             autoClose: 5000,
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             draggable: true,
        //             progress: undefined,
        //         });
        //     }
        // })
    }
    return(
        <div className="task-form">
            {
                
                    console.log(list_of_users_for_meeting)
            }
            {
                console.log(list_of_users_for_meeting_show)

            }
            <span className="task-form-link" onClick={() => {
                props.history.goBack()
            }} ><FaArrowLeft /> Back</span>
            <div className="task-form-title">Сreate a something new in the calendar</div>
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
                    format="dd-MM-y h:mm"
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
                <div className="users_for_meeting">
                    {list_of_users_for_meeting_show.map((u, i) => <div key={i} className="user_for_meeting-show">   
                        <img src={u.avatar}/>
                        <div className="user_for_meeting-show-info">
                            <div className="user_for_meeting-show-info-nickname">
                                {u.nickname}
                            </div>
                            <div className="user_for_meeting-show-info-email">
                                {u.email}
                            </div>
                        </div>
                        <MdClose onClick={() => drop_from_users_list(u._id)} />
                    </div>)}
                </div>
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
            <button className="black-btn"  onClick={() => createSomething()}>Create</button>
        </div>
    )
}

export default NewToCalendar
// 4754408@stud.nau.edu.ua