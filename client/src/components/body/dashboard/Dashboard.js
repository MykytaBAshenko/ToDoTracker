import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import './Dashboard.css'

function Dashboard() {

    useEffect(() => {
      
    }, [])


    return (
        <div className="dashboard_page">
            dashboard
            <Link to="new">Create new project</Link>
        </div>
    )
}

export default Dashboard
