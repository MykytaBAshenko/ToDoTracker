import React, { useState, useEffect } from 'react'
// import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-date-picker'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select';
import task_state from "../global_vars/task_state"
import types_of_task from "../global_vars/types_of_task"




function Calendar(props) {
    const [datetime, setdatetime] = useState(new Date())
    const [showmounth, setshowmounth] = useState()
    const [tasks, settasks] = useState([])
    const [showyear, setshowyear] = useState()
    const [how_many_days, sethow_many_days] = useState()
    const [first_day, setfirst_day] = useState()
    const [last_day, setlast_day] = useState()
    const current_day = new Date()
    const token = useSelector(state => state.token)
    const projects = useSelector(state => state.projects.projects)
    const [task_select, settask_select] = useState([{
        value: 'all',
        label: <div className="select-element">All tasks</div>
    }])
    const [select_project, setselect_project] = useState(task_select[0])

//     _id(pin):"606231ca100c1a3e1ec25458"
// user(pin):"606231ba100c1a3e1ec25456"
// arrayOfLinks(pin):
// logo(pin):"/images/company-placeholder.png"
// _id(pin):"606231ca100c1a3e1ec25457"
// name(pin):"project12"
// description(pin):"project12"
// uniqueLink(pin):"project12"
// createdAt(pin):"2021-03-29T20:00:10.412Z"
// updatedAt(pin):"2021-03-29T20:00:10.412Z"
// __v(pin):0
// status(pin):"Owner"
// whatDo(pin):"Project owner"
// about(pin):"asdasdasdasd"
// createdAt(pin):"2021-03-29T20:00:10.500Z"
// updatedAt(pin):"2021-03-31T00:52:21.762Z"
// __v(pin):0
    useEffect(() => {
        let arr = []
        arr.push({
            value: 'all',
            label: <div className="select-element">All tasks</div>
        })
        for(let y = 0; y < projects.length; y++) {
            arr.push({
                value: projects[y].project._id,
                label: <div className="select-element">{projects[y].project.name}</div>
            })
        }

        settask_select(arr)
    }, [projects, token])

    useEffect(()=> {
        setshowmounth(datetime.getMonth())
        setshowyear(datetime.getFullYear())
    },[datetime])
    


    useEffect (()=> {
        let how_many_days_show = new Date(showyear, showmounth+1, 0).getDate()
        sethow_many_days(how_many_days_show)
        let first_day = new Date(showyear, showmounth, 1);
        let last_day = new Date(showyear, showmounth + 1, 0);
        setfirst_day(first_day)
        setlast_day(last_day)

    },[showmounth, showyear, datetime])


    useEffect(()=> {
        // (new Date(last_day?.getTime() + 24* 60*60*1000-1)))
        if(first_day?.getTime() && last_day?.getTime())
        axios.get(`/api/calendar?minTime=${first_day ? first_day?.getTime() : 0}&maxTime=${last_day ? (last_day?.getTime() + 24* 60*60*1000) : 0}&selected=${select_project.value}`, {
            headers: { Authorization: token }
        }).then(d => {
            console.log(d)
            if(d.data.success)
            settasks(d.data.tasks)
        })
        
    },[last_day, first_day, select_project])
    


    return (
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
                                    return <div className="calendar-empty-cell" key={l+"_"+l}>
                                    </div>
                                } ())
                        }
                        return cells
                    }()
                }
                {
                    function () {
                        let cells = []
                        for (let l = 0; l < how_many_days ; l++) {
                            cells.push(
                                function () {
                                    let output_date = new Date(first_day.getTime() + l*86400000)
                                    let show_day_tasks = []
                                    for(let y = 0; y < tasks.length; y++) {
                                        if(tasks[y].deadline >= output_date.getTime() && tasks[y].deadline < (output_date.getTime() + 86400000)) {
                                            show_day_tasks.push(tasks[y])
                                        }
                                    }
                                    show_day_tasks.sort(function (a, b) {
                                        return a.deadline - b.deadline;
                                      })
                                    return <div className={"calendar-cell " + ((
                                        current_day.getFullYear() == output_date.getFullYear() &&
                                        current_day.getMonth() == output_date.getMonth() &&
                                        current_day.getDate() == output_date.getDate()
                                        ) ? " active" : "")} key={l}>
                                        <div className="calendar-cell-header">
                                        {output_date.getDate()+"."+(output_date.getMonth()+1)+"."+output_date.getFullYear()}
                                        </div>
                                        <div className="calendar-cell-tasks-map">
                                        {
                                            show_day_tasks.map((t, i) => <div className={`calendar-cell-task priority-${t.priority}`} key={i}>
                                                    <div className="icon-shell">
                                                        {types_of_task.map(state => {
                                                            if (state.value == t.type)
                                                                return state.icon
                                                        })}
                                                    </div>
                                                    <div className="calendar-task-title">
                                                        {
                                                            t.title.length > 10 ? 
                                                            t.title.substring(0,10)+"...":
                                                            t.title
                                                        }
                                                    </div>
                                                    <div className="calendar-cell-time">
                                                        {((new Date(t.deadline)).getHours())+"."+(new Date(t.deadline)).getMinutes()}
                                                    </div>
                                                </div>)
                                        }
                                        </div>
                                    </div>
                                } ())
                        }
                        return cells
                    }()
                }
            </div>
            {
                // var m = +document.getElementById('m').value
                // var y = +document.getElementById('y').value
                
                // var days = new Date(y, m, 0).getDate()
                // document.querySelector('output').textContent = days + " in " + m + "." + y
            }
        </div>
    )
} 

export default Calendar
