import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import event_type from "../../../global_vars/event_type"
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';

function checkOnInput(v){
    let is_ok = false;
    if(v.length == 0 || isNaN(v))
        return false;
    for(let y = 0; y < v.length; y++){
        if(v[y] == "0"
            || v[y]  == "1"
            || v[y]  == "2"
            || v[y]  == "3"
            || v[y]  == "4"
            || v[y]  == "5"
            || v[y]  == "6"
            || v[y]  == "7"
            || v[y]  == "8"
            || v[y]  == "9"
        ) 
        is_ok = true
        else{
        is_ok = false
            break
    }
    }
    return is_ok
}

function Events(props) {
    const [fromdate, setfromdate] = useState(new Date());
    const [tilldate, settilldate] = useState(new Date(fromdate.getTime() + 7 * 24 * 60 * 60 * 1000));

    const auth = useSelector(state => state.auth)
    const isLogged = useSelector(state => state.auth.isLogged)
    const [typesOption, settypesOption] = useState(event_type[0])
    const token = useSelector(state => state.token)
    const [search, setsearch] = useState("")
    const [mincost, setmincost] = useState("");
    const [maxcost, setmaxcost] = useState("");
    const [events, setevents] = useState([])
    useEffect(() => {
        axios.get(`/api/event?search=${search}&mincost=${mincost}&maxcost=${maxcost}&type=${typesOption.value != 'blank' ? typesOption.value : ""}&fromdate=${fromdate.getTime()}&tilldate=${tilldate.getTime()}`, {
            headers: {  Authorization: token }
          }).then(d => {
              console.log(d.data)
              if(d?.data?.success){
                // setcompanys(d?.data?.companys)
                setevents(d.data.events)

              } 
          })
    }, [token, search, mincost, maxcost, typesOption, fromdate, tilldate])
    const typesChange = typeOption => {
        settypesOption(typeOption);
    };
    return (
        <div className="dashboard_page">
            <div className="dashboard_page-control">
                {/* <Link className="black-btn" to="/events/companys/new">Create new company</Link> */}
                <input type="text" placeholder="Search" value={search} onChange={e=> setsearch(e.target.value)} />
                <input value={mincost} type="number"  placeholder="Min cost" onChange={e => {if(checkOnInput(e.target.value) && parseInt(e.target.value) ) setmincost(parseInt(e.target.value));
                    if(e.target.value.length == 0) setmincost("")
                }}></input>
                <input value={maxcost} type="number" placeholder="Max cost" onChange={e => {if(checkOnInput(e.target.value) && parseInt(e.target.value) ) setmaxcost(parseInt(e.target.value)) 
                    if(e.target.value.length == 0) setmaxcost("")
                }}></input>
                <Select
                    value={typesOption}
                    onChange={typesChange}
                    options={event_type}
                    className="select-fromdashboard"
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
                <DateTimePicker
                        onChange={setfromdate}
                        value={fromdate}
                        format="dd-MM-y h:mm"
                        locale="en-EN"
                    />
                    <DateTimePicker
                        onChange={settilldate}
                        value={tilldate}
                        format="dd-MM-y h:mm"
                        locale="en-EN"
                    />
            </div>
            <div className="events_map">
                    {events.map((e,i) => <div key={i}>{e.title}</div>)}
            </div>
        </div>
    )
}

export default Events

