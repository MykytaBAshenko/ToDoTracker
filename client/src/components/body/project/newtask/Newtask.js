import React, { useState, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import types_of_task from "../../../global_vars/types_of_task"
import how_task_is_needed from "../../../global_vars/how_task_is_needed"
import { toast } from 'react-toastify';



function Newtask(props) {
    const projectId = props.match.params.projectId;
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const {isLogged, isAdmin} = auth
    const [title, settitle] = useState("") 
    const [body, setbody] = useState("") 
    const [photos, setphotos] = useState([])
    const [type, settype] = useState() 
    const [typesoftask, settypesoftask] = useState(types_of_task[0]) 
    const [howtaskisneeded, sethowtaskisneeded] = useState(how_task_is_needed[0].text) 
    const notify = () => toast("Wow so easy!");
    const uploadPhoto = async (e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]
        
            if (!file) console.log({ err: "No files were uploaded.", success: '' })
        
            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.mimetype !== 'image/jpg')
            toast.error('File isn`t image', {
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
        
            const res = await axios.post('/api/project/uploadlogo', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
        
            setphotos([...photos, "/" + res.data.url])

    
        } catch (err) {
          console.log({ err: err.response.data.msg, success: '' })
        }
      }

    useEffect(() => {
        console.log(projectId)

    }, [])

    const [AddUserInput,setAddUserInput] = useState("")

    const AddUserToProject = () => {
        axios.post(``)
    }


    return (
        <div>
            <input onChange={e=>settitle(e.target.value)} value={title}></input>
            <textarea onChange={e=>settitle(e.target.value)} value={title}></textarea>
            <select value={typesoftask} onChange={e => settypesoftask(e.target.value)}>
                {
                    types_of_task.map((task, i) => 
                        <option key={i} value={task}>{task}</option>
                    )
                }
            </select>
            <select value={howtaskisneeded} onChange={e => sethowtaskisneeded(e.target.value)}>
                {
                    how_task_is_needed.map((task, i) => 
                        <option key={i} value={task.text}>{task.text}</option>
                    )
                }
            </select>
        <input type="file" name="file" id="file_up" onChange={uploadPhoto} />

            newtask
        </div>
    )
}

export default Newtask
