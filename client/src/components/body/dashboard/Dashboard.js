import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import './Dashboard.css'

function Home() {

    useEffect(() => {
      
    }, [])


    return (
        <div className="dashboard_page">
            dashboard
            <Link>Create new project</Link>
        </div>
    )
}

export default Home
