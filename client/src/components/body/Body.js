import React, { useState, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import ActivationEmail from './auth/ActivationEmail'


import ForgotPass from '../body/auth/ForgotPassword'
import ResetPass from '../body/auth/ResetPassword'
import Calendar from '../calendar/Calendar'
import NewToCalendar from '../calendar/NewToCalendar'

import Home from '../body/home/Home'
import Dashboard from '../body/dashboard/Dashboard'
import Settings from '../body/settings/Settings'

import Newproject from '../body/newproject/Newproject'
import Project from '../body/project/Project'
import Header from '../../components/header/Header'
import {useSelector} from 'react-redux'

function Body(props) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const chat_active = useSelector(state => state.chat_active.chat_active)

    const {isLogged, isAdmin} = auth
    
    useEffect(() => {
        
    }, [token, auth])
    
    return (<>

                <Switch>
                    
                    <Route path="/project/:projectLink" component={isLogged ? null : Header}/>
                    <Route path="*" component={Header} />
                </Switch>
                <div className={(props.history.location.pathname.indexOf("/project/") == -1 ?  (chat_active ? "display-none" : "overflow-auto") : "")}>
                    <Switch>
                        <Route path="/" component={isLogged ? Calendar : Login} exact />
                        <Route path="/projects" component={isLogged ? Dashboard : Login} exact />
                        <Route path="/projects/new" component={isLogged ? Newproject : Login} exact />
                        <Route path="/project/:projectLink" component={isLogged ? Project : Login}/>
                        <Route path="/login" component={!isLogged ? Login : Calendar} exact />
                        <Route path="/register" component={!isLogged ? Register : Calendar} exact />
                        <Route path="/calendar" component={isLogged ? Calendar : Login} exact />
                        <Route path="/calendar/new" component={isLogged ? NewToCalendar : Login} exact />
                        <Route path="/settings" component={isLogged ? Settings : Login} exact />
                        <Route path="/forgot_password" component={!isLogged ? ForgotPass : Calendar} exact />
                        <Route path="/user/reset/:token" component={!isLogged ?  ResetPass : Calendar} exact />
                        <Route path="/user/activate/:activation_token" component={!isLogged ?  ActivationEmail : Calendar} exact />
                    </Switch>
                </div>
                {/* <EditorConvertToHTML/>  */}
            </>
    )
} 

export default Body
