import React, { useState, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import ProjectDashboard from './dashboard/ProjectDashboard'
import Users from './users/Users'



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
          if(d?.data?.success){
            console.log(d)
          } else {
              props.history.push("/dashboard")
          }
      })
    }, [projectId])


    return (
        <Switch>
            <Route path="/project/:projectId" component={ProjectDashboard} exact/>
            <Route path="/project/:projectId/users" component={Users} exact/>


        </Switch>
    )
}

export default Project
