import React, { useState, useEffect } from 'react'
// import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-date-picker'




function Calendar(props) {
    const [datetime, setdatetime] = useState(new Date())
    const [showmounth, setshowmounth] = useState()
    const [showyear, setshowyear] = useState()
    const [how_many_days, sethow_many_days] = useState()
    const [first_day, setfirst_day] = useState()
    const [last_day, setlast_day] = useState()
    const current_day = new Date()


    useEffect(()=> {
        setshowmounth(datetime.getMonth())
        setshowyear(datetime.getFullYear())
    },[datetime])
    


    useEffect (()=> {
        let how_many_days_show = new Date(showyear, showmounth+1, 0).getDate()
        console.log(how_many_days_show)
        sethow_many_days(how_many_days_show)
        let first_day = new Date(showyear, showmounth, 1);
        let last_day = new Date(showyear, showmounth + 1, 0);
        setfirst_day(first_day)
        setlast_day(last_day)

    },[showmounth, showyear, datetime])


    useEffect(()=> {
        // (new Date(last_day?.getTime() + 24* 60*60*1000-1)))
        // first_day
        
    },[last_day, first_day])
    


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
                                    return <div className={"calendar-cell " + ((
                                        current_day.getFullYear() == output_date.getFullYear() &&
                                        current_day.getMonth() == output_date.getMonth() &&
                                        current_day.getDate() == output_date.getDate()
                                        ) ? " active" : "")} key={l}>
                                        <div className="calendar-cell-header">
                                        {output_date.getDate()+"."+(output_date.getMonth()+1)+"."+output_date.getFullYear()}
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
