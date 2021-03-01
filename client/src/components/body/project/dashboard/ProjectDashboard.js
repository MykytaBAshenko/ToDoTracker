import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


function ProjectDashboard() {

    useEffect(() => {
      
    }, [])


    return (
        <div className="dashboard_page">
            
            
            <Link to={window.location.pathname+"/users"}>Users</Link>
            ProjectDashboard
            
        </div>
    )
}

export default ProjectDashboard
