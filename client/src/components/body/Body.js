import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import ActivationEmail from './auth/ActivationEmail'


import ForgotPass from '../body/auth/ForgotPassword'
import ResetPass from '../body/auth/ResetPassword'

import Home from '../body/home/Home'
import Dashboard from '../body/dashboard/Dashboard'
import Newproject from '../body/newproject/Newproject'
import Project from '../body/project/Project'





import {useSelector} from 'react-redux'
const NotFound =() => <div>posoi</div>

function Body(props) {
    const auth = useSelector(state => state.auth)
    const {isLogged, isAdmin} = auth
    return (
        <section>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/dashboard" component={isLogged ? Dashboard : Login} exact />
                <Route path="/new" component={isLogged ? Newproject : Login} exact />
                <Route path="/project/:projectId" component={isLogged ? Project : Login}/>

                

                <Route path="/login" component={isLogged ? NotFound : Login} exact />
                <Route path="/register" component={isLogged ? NotFound : Register} exact />
                <Route path="/forgot_password" component={isLogged ? NotFound : ForgotPass} exact />
                <Route path="/user/reset/:token" component={isLogged ? NotFound : ResetPass} exact />
                <Route path="/user/activate/:activation_token" component={ActivationEmail} exact />
            </Switch>
        </section>
    )
}

export default Body
