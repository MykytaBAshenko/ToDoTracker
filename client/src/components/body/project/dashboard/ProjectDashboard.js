import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


function ProjectDashboard() {

    useEffect(() => {
      
    }, [])


    return (
        <div className="dashboard_page">
            
            
            <Link to={window.location.pathname+"/users"}>Users</Link>
            <Link to={window.location.pathname+"/newtask"}>New Task</Link>
            {/* <Link to={window.location.pathname+"/chat"}>New Task</Link> */}

               
        </div>
    )
}

export default ProjectDashboard
