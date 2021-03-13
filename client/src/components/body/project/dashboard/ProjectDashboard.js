import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


function ProjectDashboard(props) {

    useEffect(() => {
      
    }, [])


    return (
        <div className="dashboard_page">
            {console.log(  props.match.params.projectLink)}
            
            <Link to={"/project/"+props.match.params.projectLink+"/newtask"}>New Task</Link>
            {/* <Link to={window.location.pathname+"/chat"}>New Task</Link> */}

                
        </div>
    )
}

export default ProjectDashboard
