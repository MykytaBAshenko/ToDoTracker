import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import types_of_task from "../../../global_vars/types_of_task"
import how_task_is_needed from "../../../global_vars/how_task_is_needed"
import task_state from "../../../global_vars/task_state"
import { MdClose } from 'react-icons/md'
import {FaArrowLeft} from 'react-icons/fa'
import Comments from './Comments'
function Task(props) {
    const projectLink = props.match.params.projectLink
    const taskId = props.match.params.taskId
    const token = useSelector(state => state.token)
    const [title, settitle] = useState("")
    const [description, setdescription] = useState("")
    const [state, setstate] = useState("")
    const [type, settype] = useState("")
    const [priority, setpriority] = useState("")
    const [updatedAt, setupdatedAt] = useState("")
    const [user, setuser] = useState({})
    const [images, setimages] = useState([])
    const [ShowPhoto, setShowPhoto] = useState(false)
    const [deletebtn, setdeletebtn] = useState(false)
    const auth = useSelector(state => state.auth)
    const [deadline, setdeadline] = useState(0)

    const set_vals = (task) => {
        settitle(task.title)
        setdescription(task.description)
        setstate(task.state)
        settype(task.type)
        setpriority(task.priority)
        setupdatedAt(task.updatedAt)
        setimages(task.images)
        setuser(task.user)
        setdeadline(task.deadline)
    }
    useEffect(() => {
        axios.get(`/api/task/one/${taskId}`, {
            headers: { Authorization: token }
        }).then(d => {
            if (d.data.success) {
                set_vals(d.data.task)
            }
            else {
                props.history.push(`/project/${projectLink}`)
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
    }, [taskId])

    const deleteTask = () => {
        axios.delete(`/api/task/${taskId}`, {
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

    const setWorker = (v) => {
        axios.patch(`/api/task/${taskId}`, { setworker: v }, {
            headers: { Authorization: token }
        }).then(d => {
            if (d.data.success)
                set_vals(d.data.task)
            else {
                props.history.push(`/project/${projectLink}`)
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

    return (<>{
        !ShowPhoto ?
            <>
            <div className="task-body">
            <span className="task-form-link" onClick={() => {
                props.history.goBack()
            }} ><FaArrowLeft /> Back</span>
                
                <div className="task-body-exact">
                    <div className="task-body-title">
                        {title}
                    </div>
                    <div className="task-body-description">
                        {description}
                    </div>
                    <div className="new-task-photo-control">
                        {images.map((img, i) => <div onClick={() => {
                            setShowPhoto(img)
                        }} key={i} className="new-task-photo-control-shell select-photo"><img src={img} alt="" /></div>)}
                    </div>
                    <div className="task-body-meta-body">
                        <div className="task-body-meta-body-left">
                            <div className="task-body-meta">
                                {priority != 'blank' && how_task_is_needed.map(prior => {
                                    if (prior.value == priority)
                                        return <div key={Math.random()}>{prior.label} </div>
                                })}
                                {type != 'blank' && types_of_task.map(t => {
                                    if (t.value == type)
                                        return <div key={Math.random()}>{t.label}</div>
                                })}
                                {task_state.map(s => {
                                    if (s.value == state)
                                        return <div key={Math.random()}>{s.label}</div>
                                })}

                            </div>
                            <div className="task-body-update-info">
                                Last update: {
                                ((new Date(updatedAt)).getUTCDate()+"."+((new Date(updatedAt)).getUTCMonth()+1)+"."+(new Date(updatedAt)).getUTCFullYear())

                                }
                            </div>
                            {deadline ?
                            <div className="task-body-update-info">
                                Deadline: {
                                // ((new Date(updatedAt)).getUTCDate()+"."+((new Date(updatedAt)).getUTCMonth()+1)+"."+(new Date(updatedAt)).getUTCFullYear())
                                ((new Date(deadline)).getUTCDate()+"."+((new Date(deadline)).getUTCMonth()+1)+"."+(new Date(deadline)).getUTCFullYear()+" "+(new Date(deadline)).getUTCHours()+"."+(new Date(deadline)).getUTCMinutes())

                                }
                            </div> : null
                            }
                        </div>
                        {user ?
                        <div className="worker-field">
                            <div className="worker-field-title">
                                Who is working on task?
                            </div>
                            <div className="task-body-worker">
                                
                                <div className="task-body-worker-img-body">
                                    <img src={user.avatar}></img>
                                </div>
                                
                                <div>{user.email}</div>

                            </div>
                        </div> : null
                        }
                    </div>
                </div>

                <div className="task-body-control">
                    {!deletebtn ?
                        <button className="danger-btn" onClick={() => setdeletebtn(true)}>Delete</button>
                        :
                        <>
                            <button className="black-btn" onClick={() => setdeletebtn(false)}>Cancel</button>
                            <button className="danger-btn" onClick={() => deleteTask()}>Are you sure?</button>

                        </>
                    }
                    <Link className="black-btn" to={`/project/${projectLink}/task/${taskId}/edit`} >Edit</Link>
                    {auth?.user._id == user?._id ?
                        <button className="green-btn" onClick={() => setWorker(false)}>Abandon the task</button>
                        :
                        <button className="green-btn" onClick={() => setWorker(true)}>Take task</button>
                    }

                </div>
                
            </div> 
            <Comments taskId={taskId}/>
            </>
            :
            <div className="task-body-photo-container">
                <MdClose onClick={() => setShowPhoto(false)} />
                <img src={ShowPhoto} />
            </div>}
    </>
    )
}

export default Task