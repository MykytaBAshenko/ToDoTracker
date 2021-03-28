import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select';
import types_of_task from "../../../global_vars/types_of_task"
import how_task_is_needed from "../../../global_vars/how_task_is_needed"

function ProjectDashboard(props) {
    const [search, setsearch] = useState("")
    const token = useSelector(state => state.token)
    const projectLink = props.match.params.projectLink;
    const [tasks, settasks] = useState([])

    useEffect(() => {
        axios.get(`/api/task/${projectLink}`, {
            headers: {  Authorization: token }
        }).then(d => {
            settasks(d.data.tasks_in_project)
        })
    }, [])



    return (
        <div className="dashboard_page">
            <div className="dashboard_page-control">
                <Link className="black-btn" to={"/project/"+props.match.params.projectLink+"/newtask"}>New Task</Link>
                <input type="text" value={search} onChange={e => setsearch(e.target.value)} />
            </div>            
            {tasks?.map((t, i ) => <div className="dashboard_page"> 
                <Link to={`/project/${projectLink}/task/${t._id}`} >{t._id}</Link>
                {t.title}
                </div>)}
        </div>
    )
}

export default ProjectDashboard
