import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'


function Header() {
    const auth = useSelector(state => state.auth)
    const notifications = useSelector(state => state?.notifications?.notifications)
    const { user, isLogged } = auth
    const handleLogout = async () => {
        try {
            await axios.get('/api/auth/logout')
            localStorage.removeItem('firstLogin')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }



    return (
        <div>
            <img src="/images/defaultUser.jpg"/>
            <Link className="dropdown-item" to="/" onClick={handleLogout}>Logout</Link>
        </div>


    )
}

export default Header
