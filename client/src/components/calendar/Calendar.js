import React, { useState, useEffect } from 'react'
// import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-date-picker'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select';
import task_state from "../global_vars/task_state"
import types_of_task from "../global_vars/types_of_task"
import { Link } from 'react-router-dom'
import calendar_type from '../global_vars/calendar_type'
import { MdClose } from 'react-icons/md'
import days from '../global_vars/days'

import { FaPlus, FaArrowLeft  } from 'react-icons/fa'
import how_task_is_needed from '../global_vars/how_task_is_needed'



function MeetingRender(props) {
    const [ShowPhoto, setShowPhoto] = useState(false)
    const auth = useSelector(state => state.auth)

    return  (!ShowPhoto ? 
            <div className="task-body">
                <div className="task-body-exact">
                    {console.log(props.WhatShow)}
                    <div className="task-body-title">
                        {props.WhatShow.calendars.title}
                    </div>
                    <div className="task-body-description">
                        {props.WhatShow.calendars.description}
                    </div>
                    {
                        props.WhatShow.users.length > 1 ? 
                        <div className="users_for_meeting_title">Users in meeting</div> : null
                    }
                    <div className="users_for_meeting">
                   
                    {props.WhatShow.users.map((u, i) => u.user._id != auth.user._id ? <div key={i} className="user_for_meeting-show">   
                        <img src={u.user.avatar}/>
                        <div className="user_for_meeting-show-info">
                            <div className="user_for_meeting-show-info-nickname">
                                {u.user.nickname}
                            </div>
                            <div className="user_for_meeting-show-info-email">
                                {u.user.email}
                            </div>
                        </div>
                    </div>:null)}
                </div>
                {props.WhatShow.calendars.images.length > 0 ?
                    <div className="new-task-photo-control">
                        {props.WhatShow.calendars.images.map((img, i) => <div onClick={() => {
                            setShowPhoto(img)
                        }} key={i} className="new-task-photo-control-shell select-photo"><img src={img} alt="" /></div>)}
                    </div>: null}
                    <div className="calendar-inner-info">
                        {calendar_type.map(state => {
                            if (state.value == props.WhatShow.calendars.type)
                                return <div className="icon-shell" key={Math.random()}>{state.label}</div>
                        })}
                        {
                        props.WhatShow.calendars.priority != 'blank' && props.WhatShow.calendars.priority != null  && how_task_is_needed.map(prior => {
                                if (prior.value == props.WhatShow.calendars.priority)
                                    return <div key={Math.random()}>{prior.label} </div>
                            })
                        }
                        <div >
                            Last update: {
                            ( (((new Date(props.WhatShow.calendars.updatedAt)).getUTCDate() < 10 ? '0' : '')+((new Date(props.WhatShow.calendars.updatedAt)).getUTCDate()))
                            +"."+
                            
                            ( (((new Date(props.WhatShow.calendars.updatedAt)).getUTCMonth()+1) < 10 ? '0' : '')+((new Date(props.WhatShow.calendars.updatedAt)).getUTCMonth()+1))

                            +"."+
                            (new Date(props.WhatShow.calendars.updatedAt)).getUTCFullYear())

                            }
                        </div>
                        <div >
                            On date: {
                            
                            ( (((new Date(props.WhatShow.calendars.date)).getUTCDate()< 10 ? '0' : '')+((new Date(props.WhatShow.calendars.date)).getUTCDate()))

                            +"."+
                            ( (((new Date(props.WhatShow.calendars.date)).getUTCMonth()+1< 10 ? '0' : '')+((new Date(props.WhatShow.calendars.date)).getUTCMonth()+1)))
                            +"."+
                            (new Date(props.WhatShow.calendars.date)).getUTCFullYear()
                            +" "+
                            ( (((new Date(props.WhatShow.calendars.date)).getUTCHours()< 10 ? '0' : '')+((new Date(props.WhatShow.calendars.date)).getUTCHours())))
                            +"."+
                            ( (((new Date(props.WhatShow.calendars.date)).getUTCMinutes()< 10 ? '0' : '')+((new Date(props.WhatShow.calendars.date)).getUTCMinutes()))))
                            }
                        </div> 

                    </div>
                    <Link to={`/calendar/${props.WhatShow.calendars._id}/edit`} className="black-btn">Update calendar event</Link>
                </div>
            </div>: 
            <div className="task-body-photo-container">
            <MdClose onClick={() => setShowPhoto(false)} />
            <img src={ShowPhoto} />
            </div>
            )
}



function CalendarRender(props) {
    const [isEdit, setisEdit] = useState(false)
    const [ShowPhoto, setShowPhoto] = useState(false)

    return  (!ShowPhoto ? 
            <div className="task-body">
                <div className="task-body-exact">
                    {console.log(props.WhatShow)}
                    <div className="task-body-title">
                        {props.WhatShow.title}
                    </div>
                    <div className="task-body-description">
                        {props.WhatShow.description}
                    </div>
                    <div className="new-task-photo-control">
                        {props.WhatShow.images.map((img, i) => <div onClick={() => {
                            setShowPhoto(img)
                        }} key={i} className="new-task-photo-control-shell select-photo"><img src={img} alt="" /></div>)}
                    </div>
                    <div className="calendar-inner-info">
                        {calendar_type.map(state => {
                            if (state.value == props.WhatShow.type)
                                return <div className="icon-shell" key={Math.random()}>{state.label}</div>
                        })}
                        {
                        props.WhatShow.priority != 'blank' && props.WhatShow.priority != null  && how_task_is_needed.map(prior => {
                                if (prior.value == props.WhatShow.priority)
                                    return <div key={Math.random()}>{prior.label} </div>
                            })
                        }
                        <div >
                            Last update: {
                            ( (((new Date(props.WhatShow.updatedAt)).getUTCDate() < 10 ? '0' : '')+((new Date(props.WhatShow.updatedAt)).getUTCDate()))
                            +"."+
                            
                            ( (((new Date(props.WhatShow.updatedAt)).getUTCMonth()+1) < 10 ? '0' : '')+((new Date(props.WhatShow.updatedAt)).getUTCMonth()+1))

                            +"."+
                            (new Date(props.WhatShow.updatedAt)).getUTCFullYear())

                            }
                        </div>
                        <div >
                            On date: {
                            
                            ( (((new Date(props.WhatShow.date)).getUTCDate()< 10 ? '0' : '')+((new Date(props.WhatShow.date)).getUTCDate()))

                            +"."+
                            ( (((new Date(props.WhatShow.date)).getUTCMonth()+1< 10 ? '0' : '')+((new Date(props.WhatShow.date)).getUTCMonth()+1)))
                            +"."+
                            (new Date(props.WhatShow.date)).getUTCFullYear()
                            +" "+
                            ( (((new Date(props.WhatShow.date)).getUTCHours()< 10 ? '0' : '')+((new Date(props.WhatShow.date)).getUTCHours())))
                            +"."+
                            ( (((new Date(props.WhatShow.date)).getUTCMinutes()< 10 ? '0' : '')+((new Date(props.WhatShow.date)).getUTCMinutes()))))
                            }
                        </div> 

                    </div>
                    <Link to={`/calendar/${props.WhatShow._id}/edit`} className="black-btn">Update calendar event</Link>
                </div>
            </div>: 
            <div className="task-body-photo-container">
            <MdClose onClick={() => setShowPhoto(false)} />
            <img src={ShowPhoto} />
            </div>
            )
}



function TaskRender(props) {
    const [ShowPhoto, setShowPhoto] = useState(false)

    return  (!ShowPhoto ? 
            <div className="task-body">
                <div className="task-body-exact">
                    {console.log(props.WhatShow)}
                    <div className="task-body-title">
                        {props.WhatShow.title}
                    </div>
                    <div className="task-body-description">
                        {props.WhatShow.description}
                    </div>
                    <div className="new-task-photo-control">
                        {props.WhatShow.images.map((img, i) => <div onClick={() => {
                            setShowPhoto(img)
                        }} key={i} className="new-task-photo-control-shell select-photo"><img src={img} alt="" /></div>)}
         </div>
                    <div className="calendar-inner-info">
                        {calendar_type.map(state => {
                            if (state.value == props.WhatShow.type)
                                return <div className="icon-shell" key={Math.random()}>{state.label}</div>
                        })}
                        {
                        props.WhatShow.priority != 'blank' && props.WhatShow.priority != null  && how_task_is_needed.map(prior => {
                                if (prior.value == props.WhatShow.priority)
                                    return <div key={Math.random()}>{prior.label} </div>
                            })
                        }
                        {
                        props.WhatShow.type != 'blank' && props.WhatShow.type != null  && types_of_task.map(type => {
                                if (type.value == props.WhatShow.type)
                                    return <div key={Math.random()}>{type.label} </div>
                            })
                        }
                        {
                        props.WhatShow.state != 'blank' && props.WhatShow.state != null  && task_state.map(s => {
                                if (s.value == props.WhatShow.state )
                                    return <div key={Math.random()}>{s.label} </div>
                            })
                        }
                        <div >
                            Last update: {
                            ( (((new Date(props.WhatShow.updatedAt)).getUTCDate() < 10 ? '0' : '')+((new Date(props.WhatShow.updatedAt)).getUTCDate()))
                            +"."+
                            
                            ( (((new Date(props.WhatShow.updatedAt)).getUTCMonth()+1) < 10 ? '0' : '')+((new Date(props.WhatShow.updatedAt)).getUTCMonth()+1))

                            +"."+
                            (new Date(props.WhatShow.updatedAt)).getUTCFullYear())

                            }
                        </div>
                        <div >
                            Deadline: {
                            
                            ( (((new Date(props.WhatShow.deadline)).getUTCDate()< 10 ? '0' : '')+((new Date(props.WhatShow.deadline)).getUTCDate()))

                            +"."+
                            ( (((new Date(props.WhatShow.deadline)).getUTCMonth()+1< 10 ? '0' : '')+((new Date(props.WhatShow.deadline)).getUTCMonth()+1)))
                            +"."+
                            (new Date(props.WhatShow.deadline)).getUTCFullYear()
                            +" "+
                            ( (((new Date(props.WhatShow.deadline)).getUTCHours()< 10 ? '0' : '')+((new Date(props.WhatShow.deadline)).getUTCHours())))
                            +"."+
                            ( (((new Date(props.WhatShow.deadline)).getUTCMinutes()< 10 ? '0' : '')+((new Date(props.WhatShow.deadline)).getUTCMinutes()))))
                            }
                        </div> 

                    </div>
                    <Link to={`project/${props.WhatShow.project.uniqueLink}/task/${props.WhatShow._id}/edit`} className="black-btn">Update task</Link>
                </div>
            </div>: 
            <div className="task-body-photo-container">
            <MdClose onClick={() => setShowPhoto(false)} />
            <img src={ShowPhoto} />
            </div>
            )
}




function WhatShowRender(props) {
    const [IsEdit, setIsEdit] = useState(false)
    useEffect(() => {

    },[props.WhatShow])
    return  <div >
        <div className="back-calendar-controll">
      <span className="task-form-link" onClick={() => {
        // props.setwhatIsActive("")
        props.setisShow (false)
            }} ><FaArrowLeft /> Back</span>
      </div>
        { props.ShowType == "calendar" ?  <CalendarRender WhatShow={props.WhatShow}/> : null }
        { props.ShowType == "meeting" ?  <MeetingRender WhatShow={props.WhatShow}/> : null }
        { props.ShowType == "task" ?  <TaskRender WhatShow={props.WhatShow} /> : null }
    </div>

    }


function InnerCell(props) {
    const [WhatShow, setWhatShow] = useState({})
    const [ShowType, setShowType] = useState()

    const [isShow, setisShow] = useState(false)
    useEffect(() => {
        console.log(props)
    },[])
    return (
        <div className="ShowInner">
            <div className={"ShowInnerSelector " + (isShow ? "mobile2-display-none" : "")}>
                <div className="ShowInnerSelectorHeader">
                    <span className="ShowInnerSelectorHeaderBack" onClick={() => {
                    props.setshow_inner(false)
                    }} ><FaArrowLeft /> <span>Back</span></span>    
                    <div className="ShowInnerSelectorHeaderDate">
                    {
                        (props.show_info.output_date.getDate() <10 ? '0' : '') + props.show_info.output_date.getDate()
                    }.
                    {
                        (props.show_info.output_date.getMonth()+1 <10 ? '0' : '') + (props.show_info.output_date.getMonth()+1)
                    }.
                    {props.show_info.output_date.getFullYear()}
                    </div>
                </div>
                <div className="link-container">
                    <Link className="black-btn light-btn" to={`/calendar/new/${props.show_info.output_date.getTime()}`}>Create something</Link>

                </div>
                <div className="ShowInnerSelectorBody">
                    { 
                    props.show_info.show_meetings.length ?
                    <div className="ShowInnerSelectorBody">
                        <div className="ShowInnerSelectorBodyTitle">Meetings</div>
                        <div className="ShowInnerSelectorBodyMap">
                            {
                            props.show_info.show_meetings.map((m, i) => <div onClick={() => {setWhatShow(m); setisShow(true); setShowType("meeting")}} key={i} className="ShowInnerSelectorBodySelect">
                                <div className="ShowInnerSelectorBodySelectTop">
                                    {calendar_type.map(state => {
                                        if (state.value == m.calendars.type)
                                            return <div className="icon-shell" key={Math.random()}>{state.icon}</div>
                                    })}
                                    
                                    <div className="ShowInnerSelectorBodySelectTitle">
                                        <div >
                                        {
                                    m.calendars.title.length > 30 ?
                                    m.calendars.title.substring(0, 30) + "..." :
                                    m.calendars.title
                                    }
                                    </div>
                                    <span>
                                {
                                ((new Date(m.calendars.date)).getHours() <10 ? '0' : '') + (new Date(m.calendars.date)).getHours() + "." + 
                                ((new Date(m.calendars.date)).getMinutes() <10 ? '0' : '') + (new Date(m.calendars.date)).getMinutes()
                                }
                                    </span>
                                    </div>
                                </div>
                            </div>)

                            }
                        </div>
                    </div> : null
                    }
                    { 
                    props.show_info.show_calendar.length ?
                    <div className="ShowInnerSelectorBody">
                        <div className="ShowInnerSelectorBodyTitle">My staff</div>
                        <div className="ShowInnerSelectorBodyMap">
                            {
                            props.show_info.show_calendar.map((c, i) => <div onClick={() => {setWhatShow(c); setisShow(true);setShowType("calendar")}} key={i} className="ShowInnerSelectorBodySelect">
                                <div className="ShowInnerSelectorBodySelectTop">
                                    {calendar_type.map(state => {
                                        if (state.value == c.type)
                                            return <div className="icon-shell" key={Math.random()}>{state.icon}</div>
                                    })}
                                    <div className="ShowInnerSelectorBodySelectTitle">
                                        <div>
                                        {
                                    c.title.length > 30 ?
                                    c.title.substring(0, 30) + "..." :
                                    c.title
                                    }
                                    </div>
                                    <div className="ShowInnerSelectorBodyBottom">
                                        <div className="ShowInnerSelectorBodyPrior">
                                        {
                                        c.priority != 'blank' && c.priority != null  && how_task_is_needed.map(prior => {
                                                if (prior.value == c.priority)
                                                    return <div key={Math.random()}>{prior.label} </div>
                                            })
                                        }
                                            </div>
                                        <span>
                                            { ((new Date(c.date)).getHours() <10 ? '0' : '') + (new Date(c.date)).getHours() + "." + 
                                            ((new Date(c.date)).getMinutes() <10 ? '0' : '') + (new Date(c.date)).getMinutes()}
                                        </span>
                                    </div>
                                    </div>
                                </div>
                            </div>)
                            }
                        </div>
                    </div> : null
                    }
                    { 
                    props.show_info.show_day_tasks.length ?
                    <div className="ShowInnerSelectorBody">
                        <div className="ShowInnerSelectorBodyTitle">Tasks from projects</div>
                        <div className="ShowInnerSelectorBodyMap">
                            {
                            props.show_info.show_day_tasks.map((c, i) => <div onClick={() => {setWhatShow(c); setisShow(true);setShowType("task")}} key={i} className="ShowInnerSelectorBodySelect">
                                <div className="ShowInnerSelectorBodySelectTop">
                                    {types_of_task .map(state => {
                                        if (state.value == c.type)
                                            return <div className="icon-shell" key={Math.random()}>{state.icon}</div>
                                    })}
                                    <div className="ShowInnerSelectorBodySelectTitle">
                                        <div>
                                        {
                                    c.title.length > 30 ?
                                    c.title.substring(0, 30) + "..." :
                                    c.title
                                    }
                                    </div>
                                    
                                    <div className="ShowInnerSelectorBodyBottom">
                                        <div className="ShowInnerSelectorBodyPrior">
                                        {
                                         c.priority != null  && how_task_is_needed.map(prior => {
                                                if (prior.value == c.priority)
                                                    return <div key={Math.random()}>{prior.label} </div>
                                            })
                                        }
                                            </div>
                                            <div className="ShowInnerSelectorBodyProjectName">
                                        {c.project.name}
                                    </div>
                                        <span>
                                            { ((new Date(c.deadline)).getHours() <10 ? '0' : '') + (new Date(c.deadline)).getHours() + "." + 
                                            ((new Date(c.deadline)).getMinutes() <10 ? '0' : '') + (new Date(c.deadline)).getMinutes()}
                                        </span>
                                    </div>
                                    </div>
                                </div>
                            </div>)
                            }
                        </div>
                    </div> : null
                    }
                </div>
            </div>
            {
            isShow 
            ? <WhatShowRender setWhatShow={setWhatShow} isShow={isShow } setisShow ={setisShow}  ShowType={ShowType} WhatShow={WhatShow}/>
            : null
            }
        </div>
    )
}

function Calendar(props) {
    const [datetime, setdatetime] = useState(new Date())
    const [showmounth, setshowmounth] = useState()
    const [tasks, settasks] = useState([])
    const [showyear, setshowyear] = useState()
    const [how_many_days, sethow_many_days] = useState()
    const [first_day, setfirst_day] = useState()
    const [last_day, setlast_day] = useState()
    const [calendar, setcalendar] = useState([])
    const current_day = new Date()
    const token = useSelector(state => state.token)
    const projects = useSelector(state => state.projects.projects)
    const [task_select, settask_select] = useState([{
        value: 'all',
        label: <div className="select-element">All tasks</div>
    }])
    const [select_project, setselect_project] = useState(task_select[0])
    const [meetings, setmeetings] = useState([])
    const [meetings_users, setmeetings_users] = useState([])
 

    const [show_info, setshow_info] = useState({})
    const [show_inner, setshow_inner] = useState(false)


    useEffect(() => {
        let arr = []
        arr.push({
            value: 'all',
            label: <div className="select-element">All tasks</div>
        })
        for (let y = 0; y < projects?.length; y++) {
            arr.push({
                value: projects[y].project._id,
                label: <div className="select-element">{projects[y].project.name}</div>
            })
        }

        settask_select(arr)
    }, [projects, token])

    useEffect(() => {
        setshowmounth(datetime.getMonth())
        setshowyear(datetime.getFullYear())
    }, [datetime])



    useEffect(() => {
        let how_many_days_show = new Date(showyear, showmounth + 1, 0).getDate()
        sethow_many_days(how_many_days_show)
        let first_day = new Date(showyear, showmounth, 1);
        let last_day = new Date(showyear, showmounth + 1, 0);
        setfirst_day(first_day)
        setlast_day(last_day)

    }, [showmounth, showyear, datetime])


    useEffect(() => {
        if (first_day?.getTime() && last_day?.getTime())
            axios.get(`/api/calendar?minTime=${first_day ? first_day?.getTime() : 0}&maxTime=${last_day ? (last_day?.getTime() + 24 * 60 * 60 * 1000) : 0}&selected=${select_project.value}`, {
                headers: { Authorization: token }
            }).then(d => {
                console.log(d)
                if (d.data.success) {
                    settasks(d.data.tasks)
                    setcalendar(d.data.calendar)
                    setmeetings(d.data.meetings)
                    setmeetings_users(d.data.array_of_users_for_meetings)
                }
            })

    }, [last_day, first_day, select_project])



    return (
        !show_inner ?
        <div>

            <div className="calendar-header">
                <DatePicker
                    className="date-picker"
                    locale="en-EN"
                    maxDetail="year"
                    onChange={setdatetime}
                    value={datetime}
                />
                <Select
                    value={select_project}
                    className="calendar-select"
                    onChange={e => setselect_project(e)}
                    options={task_select}
                    theme={theme => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            //   primary50: '#B2D4FF',
                            primary25: '#80B0FF',
                            primary: '#1B1E24',
                            primary75: '#0aa699',
                            primary50: '#0aa699',
                            primary25: '#0aa69981',
                            neutral0: 'white',
                            neutral5: 'white',
                            neutral10: 'white',
                            neutral20: 'white'
                        },
                    })}
                />
                <Link className="black-btn" to="/calendar/new">Create something</Link>
            </div>
            <div className="calendar-grid">
                {
                    function () {
                        let cells = []
                        let how_many = first_day?.getDay()
                        console.log(how_many)
                        for (let l = 0; l < how_many - 1; l++) {
                            cells.push(

                                function () {
                                    return <div className="calendar-empty-cell" key={l + "_" + l}>
                                    </div>
                                }())
                        }
                        return cells
                    }()
                }
                {
                    function () {
                        let cells = []
                        for (let l = 0; l < how_many_days; l++) {
                            cells.push(
                                function () {
                                    let output_date = new Date(first_day.getTime() + l * 86400000)
                                    let show_day_tasks = []
                                    for (let y = 0; y < tasks?.length; y++) {
                                        if (tasks[y].deadline >= output_date.getTime() && tasks[y].deadline < (output_date.getTime() + 86400000)) {
                                            show_day_tasks.push(tasks[y])
                                        }
                                    }
                                    let show_calendar = []
                                    for (let g = 0; g < calendar?.length; g++) {
                                        if (calendar[g].date >= output_date.getTime() && calendar[g].date < (output_date.getTime() + 86400000)) {
                                            show_calendar.push(calendar[g])
                                        }
                                    }
                                    let show_meetings = []
                                    for (let y = 0; y < meetings?.length; y++) {
                                        if (meetings[y].calendars.date >= output_date.getTime() && meetings[y].calendars.date < (output_date.getTime() + 86400000)) {
                                            for (let r = 0; r < meetings_users?.length; r++) {
                                                if (meetings_users[r].cal_id == meetings[y]._id)
                                                    meetings[y].users = meetings_users[r].users
                                            }
                                            show_meetings.push(meetings[y])

                                        }
                                    }
                                    show_meetings.sort(function (a, b) {
                                        return a.date - b.date
                                    })
                                    show_calendar.sort(function (a, b) {
                                        return a.date - b.date

                                    })
                                    show_day_tasks.sort(function (a, b) {
                                        return a.deadline - b.deadline;
                                    })
                                    return <div onClick={() => {
                                        setshow_inner(true)
                                        setshow_info({
                                            show_day_tasks,
                                            show_calendar,
                                            show_meetings,
                                            output_date
                                        })
                                    }} className={"calendar-cell " + ((
                                        current_day.getFullYear() == output_date.getFullYear() &&
                                        current_day.getMonth() == output_date.getMonth() &&
                                        current_day.getDate() == output_date.getDate()
                                    ) ? " active" : "")} key={l}>
                                        <div className="calendar-cell-header">
                                            {output_date.getDate() + "." + (output_date.getMonth() + 1) + "." + output_date.getFullYear() + " " + days[ output_date.getDay()]}
                                        </div>
                                        <div className="calendar-cell-tasks-map">
                                            {
                                                show_meetings.map((m, i) => <div className={`calendar-cell-task priority-${m.calendars.priority}`} key={i}>
                                                    {calendar_type.map(state => {
                                                        if (state.value == m.calendars.type)
                                                            return <div className="icon-shell" key={Math.random()}>{state.icon}</div>
                                                    })}
                                                    <div className="calendar-task-title">
                                                        {
                                                            m.calendars.title.length > 10 ?
                                                                m.calendars.title.substring(0, 10) + "..." :
                                                                m.calendars.title
                                                        }
                                                    </div>
                                                    <div className="calendar-cell-time">
                                                        { ((new Date(m.calendars.date)).getHours() <10 ? '0' : '') + (new Date(m.calendars.date)).getHours() + "." + 
                                                        ((new Date(m.calendars.date)).getMinutes() <10 ? '0' : '') + (new Date(m.calendars.date)).getMinutes()}
                                                    </div>
                                                </div>)
                                            }
                                            {
                                                show_calendar.map((c, i) => <div className={`calendar-cell-task priority-${c.priority}`} key={i}>
                                                    {calendar_type.map(state => {
                                                        if (state.value == c.type)
                                                            return <div className="icon-shell" key={Math.random()}>{state.icon}</div>
                                                    })}
                                                    <div className="calendar-task-title">
                                                        {
                                                            c.title.length > 10 ?
                                                                c.title.substring(0, 10) + "..." :
                                                                c.title
                                                        }
                                                    </div>
                                                    <div className="calendar-cell-time">
                                                        { ((new Date(c.date)).getHours() <10 ? '0' : '') + (new Date(c.date)).getHours() + "." + 
                                                        ((new Date(c.date)).getMinutes() <10 ? '0' : '') + (new Date(c.date)).getMinutes()}
                                                    </div>
                                                </div>)
                                            }
                                            {
                                                show_day_tasks.map((t, i) => <div className={`calendar-cell-task priority-${t.priority}`} key={i}>
                                                    {types_of_task.map(state => {
                                                        if (state.value == t.type)
                                                            return <div className="icon-shell" key={Math.random()}>{state.icon}</div>
                                                    })}
                                                    <div className="calendar-task-title">
                                                        {
                                                            t.title.length > 10 ?
                                                                t.title.substring(0, 10) + "..." :
                                                                t.title
                                                        }
                                                    </div>
                                                    <div className="calendar-cell-time">
                                                    { ((new Date(t.deadline)).getHours() <10 ? '0' : '') + (new Date(t.deadline)).getHours() + "." + 
                                                        ((new Date(t.deadline)).getMinutes() <10 ? '0' : '') + (new Date(t.deadline)).getMinutes()}
                                                    </div>
                                                </div>)
                                            }

                                        </div>
                                    </div>
                                }())
                        }
                        return cells
                    }()
                }
            </div>
        </div>
        :
        <InnerCell show_info={show_info} setshow_inner={setshow_inner} />
    )
}

export default Calendar
