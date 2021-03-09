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
    const [projects, setprojects] = useState([])
    useEffect(() => {
        axios.get(`/api/project`, {
            headers: {  Authorization: token }
          }).then(d => {
              if(d?.data?.success){
                console.log(d)
                setprojects(d?.data?.projects)
              } else {
                  props.history.push("/dashboard")
              }
          })
    }, [token])

    const [callback, setCallback] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if(isLogged){
            fetchAllProjects(token).then(res =>{
                dispatch(dispatchGetAllProjects(res))
            })
        }
    },[token, isLogged, dispatch, callback])
    return (
        <div className="dashboard_page">
            dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )}
            dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )}
            dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )}
            dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )}
            dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )} dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )} dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )} dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )} dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )} dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )} dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )} dashboard
            <Link to="new">Create new project</Link>
            {projects.map((p, i) => <Link to={"/project/"+p.project.uniqueLink}>{p.project.name}</Link> )}
        </div>
    )
}

export default Dashboard
