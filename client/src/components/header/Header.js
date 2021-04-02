import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {dispatchSetChatAction} from '../../redux/actions/chatAction'

import axios from 'axios'
import { BiMenu} from 'react-icons/bi';
import { RiMessage2Fill, RiCalendar2Fill } from 'react-icons/ri';
// import Chat from "../body/project/chat/Chat"
import {AiFillProject} from 'react-icons/ai';

function Header(props) {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const unread = useSelector(state => state.unread)

    const notifications = useSelector(state => state?.notifications?.notifications)
    const { user, isLogged } = auth
        const chat_active = useSelector(state => state.chat_active.chat_active)

    const handleLogout = async () => {
        try {
            await axios.get('/api/auth/logout')
            localStorage.removeItem('firstLogin')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }
    useEffect(() => {
      }, [chat_active,unread.unread.length]);
    const setOpenChat = () => {
        dispatch(dispatchSetChatAction(!chat_active))
    }

    const Logged = () => {
        return (
            <div className="header-body-content">
                <div className="header-body-content-left">
                </div>
                <div className="header-body-content-right">
                    <Link className="acc-control" to="/settings" ><img src={user.avatar}></img></Link>
                    <Link  className="link" to="/" onClick={handleLogout}>Sign out</Link>
                    <button className={"open-chat-btn "+ (unread.unread.length ? "unread-animation-btn" : "")} onClick={() => setOpenChat()}><RiMessage2Fill/></button >
                    <Link to="/calendar" className="open-chat-btn" ><RiCalendar2Fill/></Link>
                    <Link to="/projects" className="open-chat-btn"><AiFillProject/></Link>
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
                    <Link className="link" to="/login" >Login</Link>
                    <Link  className="link" to="/register" >Register</Link>
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
                    props?.showleftcontrol && !chat_active ? 
                <button className="header-menu-btn" onClick={() => props?.changeVisibilityMenu()}><BiMenu/></button>
                : <Link className="header-logo" to="/">ToDoTracker</Link>
                }
            </div>
            : <Link className="header-logo" to="/">ToDoTracker</Link>}
            {isLogged ? 
                Logged() : 
                notLogged()}
            </header>
            {/* <Chat isshow={ isLogged && showchat} /> */}
        </div>
    )
}

export default Header
