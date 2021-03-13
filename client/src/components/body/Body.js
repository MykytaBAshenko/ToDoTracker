import React, { useState, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import ActivationEmail from './auth/ActivationEmail'


import ForgotPass from '../body/auth/ForgotPassword'
import ResetPass from '../body/auth/ResetPassword'

import Home from '../body/home/Home'
import Dashboard from '../body/dashboard/Dashboard'
import Settings from '../body/settings/Settings'

import Newproject from '../body/newproject/Newproject'
import Project from '../body/project/Project'
import Header from '../../components/header/Header'
// import EditorConvertToHTML from './EditorConvertToHTML'
import {useSelector} from 'react-redux'
const NotFound =() => <div>posoi</div>

function Body(props) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const chat_active = useSelector(state => state.chat_active.chat_active)

    const {isLogged, isAdmin} = auth
    
    useEffect(() => {
        
    }, [token, auth])
    
    return (<>

                <Switch>
                    
                    <Route path="/project/:uniqueLink" component={isLogged ? null : Header}/>
                    <Route path="*" component={Header} />
                </Switch>
                <div className={(props.history.location.pathname.indexOf("/project/") == -1 ?  (chat_active ? "overflow-hidden" : "overflow-auto") : "")}>
                    <Switch>
                        <Route path="/" component={isLogged ? Dashboard : Login} exact />
                        <Route path="/dashboard" component={isLogged ? Dashboard : Login} exact />
                        <Route path="/new" component={isLogged ? Newproject : Login} exact />
                        <Route path="/project/:uniqueLink" component={isLogged ? Project : Login}/>
                        <Route path="/login" component={ Login} exact />
                        <Route path="/register" component={Register} exact />
                        <Route path="/settings" component={Settings} exact />
                        <Route path="/forgot_password" component={ForgotPass} exact />
                        <Route path="/user/reset/:token" component={ResetPass} exact />
                        <Route path="/user/activate/:activation_token" component={ActivationEmail} exact />
                    </Switch>
                </div>
                {/* <EditorConvertToHTML/>  */}
            </>
    )
} 

export default Body
