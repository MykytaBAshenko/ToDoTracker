import React, { useState, useEffect, useHistory } from 'react'
import { Switch, Route } from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import types_of_task from "../../../global_vars/types_of_task"
import how_task_is_needed from "../../../global_vars/how_task_is_needed"
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Editor } from 'react-draft-wysiwyg';
import Dropzone from 'react-dropzone';
import { FaPlus, FaArrowLeft  } from 'react-icons/fa'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import DateTimePicker from 'react-datetime-picker';

function Newtask(props) {
    const auth = useSelector(state => state.auth)
    const projectLink = props.match.params.projectLink;
    const [deadline, setdeadline] = useState(new Date());
    const [isdeadline, setisdeadline] = useState(false)
    const token = useSelector(state => state.token)
    const { isLogged, isAdmin } = auth
    const [title, settitle] = useState("")
    const [body, setbody] = useState("");
    const [photos, setphotos] = useState([])
    const [type, settype] = useState()
    const [priorityOption, setpriorityOption] = useState(how_task_is_needed[3])
    const [typesOption, settypesOption] = useState(types_of_task[1])

    const [typesoftask, settypesoftask] = useState({})
    

    const priorityChange = priorityOption => {
        setpriorityOption(priorityOption);
    };
    const typesChange = typeOption => {
        settypesOption(typeOption);
    };
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

            const res = await axios.post('/api/task/uploadphoto', formData, {
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

    useEffect(() => {

    }, [])

    const [AddUserInput, setAddUserInput] = useState("")

    const createTask = () => {
        let sendObj = {}
        sendObj.title = title
        sendObj.description = body
        sendObj.state = "progress"
        sendObj.priority = priorityOption.value
        sendObj.type = typesOption.value
        sendObj.images = photos
        if(isdeadline)
        sendObj.deadline = deadline.getTime()
        else
        sendObj.deadline = 0
        console.log(sendObj)
        axios.post(`/api/task/create/${projectLink}`, sendObj, {
            headers: { Authorization: token }
        }).then(d => {
            if(d.data.success) {
                props.history.push(`/project/${projectLink}`)
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
    const dropImage = (i) => {
        let new_photos = []
        for(let y = 0; y < photos.length; y++) {
            if(i != y)
                new_photos.push(photos[i])
        }
        setphotos(new_photos)
    }

    return (
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
                <div className="task-form-row-title">Task type</div>
                <Select
                    value={typesOption}
                    onChange={typesChange}
                    options={types_of_task}
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

            <div className="task-form-row">
                <div className="task-form-row-title">Task priority</div>

                <Select
                    value={priorityOption}
                    onChange={priorityChange}
                    options={how_task_is_needed}
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
            <div className="deadline-row">
                <div className="task-form-row-title">Deadline</div>
                {!isdeadline ? <button className="black-btn" onClick={() => setisdeadline(!isdeadline)}>Set deadline</button> : <div className="deadline_is_seted">
                <DateTimePicker
                    onChange={setdeadline}
                    value={deadline}
                    locale="en-EN"
                />
                <button className="black-btn" onClick={() => setisdeadline(!isdeadline)}>Remove deadline</button>
                </div>
                }
                {/* {console.log(deadline)} */}
            </div>

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

            <button className="task-btn black-btn" onClick={() => createTask()}>Create new task</button>
        </div>
    )
}

export default Newtask
