import React, { useState, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'


import Companies from './companys/Companies'
import NewCompany from './newcompany/NewCompany'

import NewEvent from './newevent/NewEvent'

import Company from './company/Company'

import Admin from "./admin/Admin"
import Header from '../../header/Header'

import { IoListSharp } from 'react-icons/io5';
import {AiOutlineFileDone} from "react-icons/ai"
import {ImTicket} from "react-icons/im"
import {GrUserSettings} from 'react-icons/gr'
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
  //   useEffect(() => {
  //       console.log(projectLink)
  //         axios.get(`/api/project/get/${projectLink}`, {
  //       headers: {  Authorization: token }
  //     }).then(d => {
  //       console.log(d)

  //         if(d?.data?.success){
  //           console.log(d)
  //         } else {
  //             props.history.push("/dashboard")
  //         }
  //     })
  //   }, [projectLink])

  //   useEffect(() => {
  //     console.log(projectLink)
    
  // }, [projectLink])

    return (
      <div className="dashboard-body">
         {!chat_active  ? <div className={"left-control " + (showleft ? "" : "mobile-display-none")}>
         <div>
             <Link to={"/events/"} className="left-control-link"> <IoListSharp/> { showleft ? <div className="left-control-link-text">Events</div>:null}</Link>
            <Link to={"/events/companys"} className="left-control-link"><AiOutlineFileDone/>{ showleft ? <div className="left-control-link-text">Сompanys</div>:null}</Link>
            <Link to={"/events/tickets"} className="left-control-link"><ImTicket/>{ showleft ? <div className="left-control-link-text">Tickets</div>:null}</Link>
            {auth.user.isAdmin ? <Link to={"/events/admin"} className="left-control-link"><GrUserSettings/>{ showleft ? <div className="left-control-link-text">Tickets</div>:null}</Link> : null }
            {/*<Link to={"/project/"+projectLink+"/users"} className="left-control-link"> <FaUsers/> { showleft ? <div className="left-control-link-text">Users</div>:null}</Link>
            <Link to={"/project/"+projectLink+"/updates"} className="left-control-link"> <MdUpdate/> { showleft ? <div className="left-control-link-text">Updates</div>:null}</Link>
            <Link to={"/project/"+projectLink+"/settings"} className="left-control-link"> <AiFillProject /> { showleft ? <div className="left-control-link-text">Settings</div>:null}</Link>
            <Link to={"/projects"} className="left-control-link"> <MdDashboard/> { showleft ? <div className="left-control-link-text">Main</div>:null}</Link> */}

          </div> 
        </div>
        : <div/>}
        <div className="right-content">
          <Header showleftcontrol={true} changeVisibilityMenu={changeVisibilityMenu}></Header>
          <div className="right-content-exact">
            <Switch>
              <Route path="/events/" component={Companies} exact/>
              <Route path="/events/companys" component={Companies} exact/>
              <Route path="/events/companys/new" component={NewCompany} exact/>
              <Route path="/events/companys/:uniqueLink" component={Company} exact/>
              <Route path="/events/companys/:uniqueLink/new" component={NewEvent} exact/>
              <Route path="/events/admin" component={Admin } exact/>


            </Switch>
          </div>
        </div>

      </div>
    )
}

export default Project
