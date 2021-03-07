import React, { useState, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import types_of_task from "../../../global_vars/types_of_task"
import how_task_is_needed from "../../../global_vars/how_task_is_needed"
import { toast } from 'react-toastify';
import Select from 'react-select';




function Newtask(props) {
    const auth = useSelector(state => state.auth)
    const projectLink = props.match.params.projectLink;
    const token = useSelector(state => state.token)
    const {isLogged, isAdmin} = auth
    const [title, settitle] = useState("") 
    const [body, setbody] = useState("") 
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
        
            const res = await axios.post('/api/task/uploadphoto', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
        
            setphotos([...photos, "/" + res.data.url])

    
        } catch (err) {
          console.log({ err: err.response.data.msg, success: '' })
        }
      }

    useEffect(() => {

    }, [])

    const [AddUserInput,setAddUserInput] = useState("")

    const createTask = () => {
        let sendObj = {}
        sendObj.title = title
        sendObj.description = body
        sendObj.state = "progress"
        sendObj.priority = priorityOption.value
        sendObj.type = typesOption.value
        sendObj.images = photos

        axios.post(`/api/task/create/${projectLink}`, sendObj, {
            headers: { Authorization: token }
        }).then(d => console.log(d))
    }


    return (
        <div>
            <input onChange={e=>settitle(e.target.value)} value={title}></input>
            <textarea onChange={e=>setbody(e.target.value)} value={body}></textarea>
            {/* <select value={typesoftask} onChange={e => settypesoftask(e.target.value)}>
                {
                    types_of_task.map((task, i) => 
                        <option key={i} value={task}>{task}</option>
                    )
                }
            </select> */}
            <Select
                value={typesOption}
                onChange={typesChange}
                options={types_of_task}
            />
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
                      primary: 'black',
                      neutral0: 'white'
                    },
                  })}
            />
        <input type="file" name="file" id="file_up" onChange={uploadPhoto} />
        <div>
            {photos.map( (img, i) => <img key={i} src={img}/>)}
        </div>
            <button onClick={() => createTask()}>adawdawdawdawd</button>
        </div>
    )
}

export default Newtask
