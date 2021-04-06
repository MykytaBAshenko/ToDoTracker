import React, { useState, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import ProjectDashboard from './dashboard/ProjectDashboard'
import Users from './users/Users'
import Newtask from './newtask/Newtask'
import Settings from './settings/Settings'
import Task from './task/Task'
import EditTask from './task/EditTask'




import Header from '../../header/Header'

import { RiTaskFill } from 'react-icons/ri';
import {AiFillProject} from 'react-icons/ai';
import { MdDashboard } from 'react-icons/md';
import {FaUsers} from 'react-icons/fa'

function Project(props) {
    const projectLink = props.match.params.projectLink;
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const {isLogged, isAdmin} = auth
    const [showleft, setshowleft] = useState(false)
    const chat_active = useSelector(state => state.chat_active.chat_active)
    
    const changeVisibilityMenu =  () => {
      setshowleft(!showleft)
    }
    useEffect(() => {
        console.log(projectLink)
          axios.get(`/api/project/get/${projectLink}`, {
        headers: {  Authorization: token }
      }).then(d => {
        console.log(d)

          if(d?.data?.success){
            console.log(d)
          } else {
              props.history.push("/dashboard")
          }
      })
    }, [projectLink])

    useEffect(() => {
      console.log(projectLink)
    
  }, [projectLink])

    return (
      <div className="dashboard-body">
         {!chat_active  ? <div className={"left-control " + (showleft ? "" : "mobile-display-none")}>
         <div>
            <Link to={"/project/"+projectLink+"/tasks"} className="left-control-link"> <RiTaskFill /> { showleft ? <div className="left-control-link-text">Tasks</div>:null}</Link>
            <Link to={"/project/"+projectLink+"/users"} className="left-control-link"> <FaUsers/> { showleft ? <div className="left-control-link-text">Users</div>:null}</Link>
            {/* <Link to={"/project/"+projectLink+"/updates"} className="left-control-link"> <MdUpdate/> { showleft ? <div className="left-control-link-text">Updates</div>:null}</Link> */}
            <Link to={"/project/"+projectLink+"/settings"} className="left-control-link"> <AiFillProject /> { showleft ? <div className="left-control-link-text">Settings</div>:null}</Link>
            <Link to={"/projects"} className="left-control-link"> <MdDashboard/> { showleft ? <div className="left-control-link-text">Main</div>:null}</Link>

          </div> 
        </div>
        : <div/>}
        <div className="right-content">
          <Header showleftcontrol={true} changeVisibilityMenu={changeVisibilityMenu}></Header>
          <div className="right-content-exact">
            <Switch>
                <Route path="/project/:projectLink" component={ProjectDashboard} exact/>
                <Route path="/project/:projectLink/tasks" component={ProjectDashboard} exact/>
                <Route path="/project/:projectLink/users" component={Users} exact/>
                <Route path="/project/:projectLink/newtask" component={Newtask} exact/>
                <Route path="/project/:projectLink/news" component={ProjectDashboard} exact/>
                <Route path="/project/:projectLink/settings" component={Settings} exact/>
                <Route path="/project/:projectLink/task/:taskId" component={Task} exact/>
                <Route path="/project/:projectLink/task/:taskId/edit" component={EditTask} exact/>

            </Switch>
          </div>
        </div>

      </div>
    )
}

export default Project
