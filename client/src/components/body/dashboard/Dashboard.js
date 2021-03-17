import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import {fetchAllProjects, dispatchGetAllProjects} from '../../../redux/actions/projectAction'

import './Dashboard.css'

function Dashboard(props) {
    const auth = useSelector(state => state.auth)
    const isLogged = useSelector(state => state.auth.isLogged)

    const token = useSelector(state => state.token)
    const [search, setsearch] = useState("")

    const [projects, setprojects] = useState([])
    useEffect(() => {
        axios.get(`/api/project`, {
            headers: {  Authorization: token }
          }).then(d => {
              if(d?.data?.success){
                setprojects(d?.data?.projects)
              } 
          })
    }, [token])



    
    return (
        <div className="dashboard_page">
            <div className="dashboard_page-control">
                <Link className="black-btn" to="/new">Create new project</Link>
                <input type="text" value={search} onChange={e=> setsearch(e.target.value)} />
            </div>
            <div className="dashboard_projects">
            {projects.map((p, i) =>   (p.project?.name.indexOf(search) != -1 || p.project.description.indexOf(search) != -1) ?
                <div key={i} className="dashboard_project-card">
                    <div className="dashboard_project-card-header">
                        <div className="dashboard_project-card-header-img">
                            <img src={p.project.logo}/>
                        </div>
                        <Link to={"/project/"+p.project.uniqueLink}>
                        {p.project.name.length > 25 ? 
                        p.project.name.substring(0,25)+"...":
                        p.project.name
                       }</Link> 
                    </div>
                    <div  className="dashboard_project-card-body">
                        {p.project.description.length > 135 ? 
                        p.project.description.substring(0,135)+"...":
                        p.project.description
                       }
                    </div>
                </div> : null
      )}
            </div>
        </div>
    )
}

export default Dashboard
