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
                {events.map((e,i) => <div className="eventCard" key={i}>
                        {/* {console.log(e)} */}
                        <div className="eventCardImg">
                            <img src={e.images[0]}/>
                        </div>
                        <Link to={"/events/event/"+e._id}>{e.title}</Link>
                        <div className="eventCardAll">
                        <div key={Math.random()}> {e.cost ? e.cost+" $" : "Free"}</div>

                        {e.type != 'blank' && event_type.map(t => {
                            if (t.value == e.type)
                                return <div key={Math.random()}>{t.label}</div>
                        })}
                        </div>

                        <div className="eventCardDate">
                        {(new Date(e.date)).getDate()}.
                        {(new Date(e.date)).getMonth()+1}.
                        {(new Date(e.date)).getUTCFullYear()}
                        {" / "}
                        {(new Date(e.date)).getHours()}.
                        {(new Date(e.date)).getMinutes()}

                        </div>
                        <Link className="companyLink" to={"/events/companys/"+e.company.uniqueLink}>{e.company.name}</Link>
                </div>)}
            </div>
        </div>
    )
}
// active: false
// approved: true
// company:
// createdAt: "2021-06-11T13:44:56.700Z"
// description: "asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v↵asdfgfxc;v"
// logo: "/images/company-placeholder.png"
// name: "asdfgfxc;v"
// uniqueLink: "asdfgfxc;v"
// updatedAt: "2021-06-11T13:44:56.700Z"
// __v: 0
// _id: "60c368d89e15f5047c68fcbe"
// __proto__: Object
// cost: 123
// createdAt: "2021-06-16T15:15:01.164Z"
// date: 1624708076459
// description: "1231231231"
// images: Array(2)
// 0: "/uploads/tasks/1623844374576_4.png"
// 1: "/uploads/tasks/1623844380446_9.png"
// length: 2
// __proto__: Array(0)
// latitude: 12
// longitude: 12
// title: "12312312"
// type: "meeting"
// updatedAt: "2021-06-17T19:53:40.940Z"
// __v: 0
// _id: "60ca1575df6b5c1cd499722f"
export default Events

