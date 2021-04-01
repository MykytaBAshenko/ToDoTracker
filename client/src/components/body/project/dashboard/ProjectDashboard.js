import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select';
import types_of_task from "../../../global_vars/types_of_task"
import how_task_is_needed from "../../../global_vars/how_task_is_needed"
import task_state from "../../../global_vars/task_state"


function RenderDeadLine(props) {
    const m = new Date(props.dead)
    return(
        <div className="update-info">
            Deadline: {
                   m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds()
            }
        </div>
    )
}


function ProjectDashboard(props) {
    const [search, setsearch] = useState("")
    const token = useSelector(state => state.token)
    const projectLink = props.match.params.projectLink;
    const [tasks, settasks] = useState([])
    const [priorityOption, setpriorityOption] = useState(how_task_is_needed[3])
    const [typesOption, settypesOption] = useState(types_of_task[4])
    const [stateOption, setstateOption] = useState(task_state[0])
    const [whichShow, setwhichShow] = useState(0)
    useEffect(() => {
        axios.get(`/api/task/${projectLink}?type=${typesOption.value}&state=${stateOption.value}&priority=${priorityOption.value}&search=${search}&whichShow=${whichShow}`, {
            headers: { Authorization: token }
        }).then(d => {
            if(d?.data?.success){
                let tasks_withot_deadline = []
                for(let y = 0;y < d?.data?.tasks_in_project.length; y++){
                    if(d?.data?.tasks_in_project[y].deadline == 0) {
                        tasks_withot_deadline.push(d?.data?.tasks_in_project[y])
                        d?.data?.tasks_in_project.splice(y, 1);
                    }
                        
                }
                d?.data?.tasks_in_project.sort((a, b) => b.deadline - a.deadline)
                settasks([...d?.data?.tasks_in_project, ...tasks_withot_deadline])
              } 
            // settasks(d.data.tasks_in_project)
        })
    }, [priorityOption, typesOption, stateOption, search, whichShow])
    const priorityChange = priorityOption => {
        setpriorityOption(priorityOption);
    };
    const typesChange = typeOption => {
        settypesOption(typeOption);
    };
    const stateChange = typeOption => {
        setstateOption(typeOption);
    };


    return (
        <div className="dashboard_page">
            <div className="dashboard_page-control">
                <Link className="black-btn" to={"/project/" + props.match.params.projectLink + "/newtask"}>New Task</Link>
                <input type="text" value={search} onChange={e => setsearch(e.target.value)} />
                <Select
                    className="select-fromdashboard"
                    value={priorityOption}
                    onChange={priorityChange}
                    options={how_task_is_needed}
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
                <Select
                    className="select-fromdashboard"
                    value={typesOption}
                    onChange={typesChange}
                    options={types_of_task}
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
                <Select
                    className="select-fromdashboard"
                    value={stateOption}
                    onChange={stateChange}
                    options={task_state}
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
                {
                    // !showMine ?
                    //     <button onClick={() => whichShow(true)} className="green-btn">
                    //         Show all
                    //     </button> :
                    //     <button onClick={() => setshowMine(false)} className="green-btn">
                    //         Show my tasks

                    //     </button>
                    whichShow == 0 ? 
                    <button onClick={() => setwhichShow(1)} className="green-btn">
                             Show my tasks
                    </button> :
                    whichShow == 1 ? 
                    <button onClick={() => setwhichShow(2)} className="green-btn">
                             Show tasks without worker
                    </button> :
                    <button onClick={() => setwhichShow(0)} className="green-btn">
                    Show all
                    </button>
                }
            </div>
            <div className="tasks-list">
                {tasks?.map((t, i) => <div key={i} className="task_cell">
                    <Link className="task_cell-title" to={`/project/${projectLink}/task/${t._id}`} >
                        {t.title.length > 15 ?
                            t.title.substring(0, 15) + "..." :
                            t.title
                        }
                        {console.log(t.title.length)}
                    </Link>
                    <div className="task_cell-description">{t.description.length > 125 ?
                        t.description.substring(0, 125) + "..." :
                        t.description
                    }</div>
                    {/* {console.log(t)} */}
                    <div className="task_cell-meta">
                        {t.priority != 'blank' && how_task_is_needed.map(prior => {
                            if (prior.value == t.priority)
                                return <div key={i + Math.random()}>{prior.label} </div>
                        })}
                        {t.type != 'blank' && types_of_task.map(type => {
                            if (type.value == t.type)
                                return <div key={i + Math.random()}>{type.label}</div>
                        })}
                        {task_state.map(state => {
                            if (state.value == t.state)
                                return <div key={i + Math.random()}>{state.label}</div>
                        })}
                        { t.deadline ?
                        <RenderDeadLine dead={t.deadline}/> : null
                        }
                        <div className="update-info">
                            Last update: {
                                t.updatedAt.replace('-', '/').replace('-', '/').substring(0, 10)
                            }
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default ProjectDashboard
