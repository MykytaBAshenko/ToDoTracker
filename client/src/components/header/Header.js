import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BiMenu} from 'react-icons/bi';
import { RiMessage2Fill } from 'react-icons/ri';
import Chat from "../body/project/chat/Chat"

function Header(props) {
    const auth = useSelector(state => state.auth)
    const notifications = useSelector(state => state?.notifications?.notifications)
    const { user, isLogged } = auth
    const [showchat, setshowchat] = useState(false)
    const handleLogout = async () => {
        try {
            await axios.get('/api/auth/logout')
            localStorage.removeItem('firstLogin')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }

    const setOpenChat = () => {
        setshowchat(!showchat)
    }

    const Logged = () => {
        return (
            <div className="header-body-content">
                <div className="header-body-content-left">
                </div>
                <div className="header-body-content-right">
                    <Link className="acc-control" to="/settings" ><img src={user.avatar}></img></Link>
                    <Link to="/" onClick={handleLogout}>Sign out</Link>
                </div>
            </div>
        )
    }
    const notLogged = () => {
        return (
            <div className="header-body-content">
                <div className="header-body-content-left">
                </div>
                <div className="header-body-content-right">
                    <Link to="/login" >Login</Link>
                    <Link to="/register" >Register</Link>
                </div>
            </div>
        )
    }


    return (
        <div className="header-chat-container">
        <header className="header">
            {isLogged ? 
            <div>
                {
                    props?.showleftcontrol ? 
                <button className="header-menu-btn" onClick={() => props?.changeVisibilityMenu()}><BiMenu/></button>
                : <Link className="header-logo" to="/">ToDoTracker</Link>
                }
            </div>
            : <Link className="header-logo" to="/">ToDoTracker</Link>}
            {isLogged ? 
                Logged() : 
                notLogged()}
            { isLogged ?
                <button className="open-chat-btn" onClick={() => setOpenChat()}><RiMessage2Fill/></button > :null
            }
            </header>
            <Chat isshow={ isLogged && showchat} />
        </div>
    )
}

export default Header
