import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {dispatchSetChatAction} from '../../redux/actions/chatAction'

import axios from 'axios'
import { RiMessage2Fill, RiCalendar2Fill } from 'react-icons/ri';
import {FaMapMarkedAlt} from "react-icons/fa"
// import Chat from "../body/project/chat/Chat"
import {AiFillProject} from 'react-icons/ai';
import {GiHamburgerMenu} from 'react-icons/gi'
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
    
    const [showMobile, setshowMobile] = useState(false)


    const Logged = () => {
        return (
            <div className="header-body-content">
                <div className="header-body-content-left">
                </div>
                <div className="header-body-content-right">
                    <Link onClick={() => {chat_active && setOpenChat()}} className="acc-control" to="/settings" ><img src={user?.avatar}></img></Link>
                    <button  className={"open-chat-btn "+ (unread.unread.length ? "unread-animation-btn" : "")} onClick={() => setOpenChat()}><RiMessage2Fill/></button >

                    <Link  onClick={() => {chat_active && setOpenChat()}} to="/calendar" className="open-chat-btn" ><RiCalendar2Fill/></Link>
                    <Link  onClick={() => {chat_active && setOpenChat()}} to="/projects" className="open-chat-btn"><AiFillProject/></Link>
                    <Link onClick={() => {chat_active && setOpenChat()}} to="/events" className="open-chat-btn"><FaMapMarkedAlt/></Link>
                    <Link  className="link" to="/" onClick={handleLogout}>Sign out</Link>

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
            <div  onClick={() => {chat_active && setOpenChat()}}>
                {
                    props?.showleftcontrol && !chat_active ? 
                <button className="header-menu-btn" onClick={() => props?.changeVisibilityMenu()}><GiHamburgerMenu onClick={() => props?.changeVisibilityMenu()}/></button>
                : <Link className="header-logo" to="/">ToDoTracker</Link>
                }
            </div>
            : <Link className="header-logo" to="/">ToDoTracker</Link>}
            <button className="mobile_menu_btn" onClick={() => setshowMobile(!showMobile)}><GiHamburgerMenu onClick={() => setshowMobile(!showMobile)}/></button>
            <div className={showMobile ? "links-shell mobile" : "links-shell"}>
                {isLogged ? 
                    Logged(showMobile) : 
                    notLogged(showMobile)}
            </div>
            </header>
            {/* <Chat isshow={ isLogged && showchat} /> */}
        </div>
    )
}

export default Header
