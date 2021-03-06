import React, { useState, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import ProjectDashboard from './dashboard/ProjectDashboard'
import Users from './users/Users'
import Newtask from './newtask/Newtask'




function Project(props) {
    const projectId = props.match.params.projectId;
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const {isLogged, isAdmin} = auth
    useEffect(() => {
        console.log(projectId)
          axios.get(`/api/project/get/${projectId}`, {
        headers: {  Authorization: token }
      }).then(d => {
        console.log(d)

          if(d?.data?.success){
            console.log(d)
          } else {
              props.history.push("/dashboard")
          }
      })
    }, [projectId])


    return (
        <Switch>
            <Route path="/project/:projectLink" component={ProjectDashboard} exact/>
            <Route path="/project/:projectLink/users" component={Users} exact/>
            <Route path="/project/:projectLink/newtask" component={Newtask} exact/>


        </Switch>
    )
}

export default Project
