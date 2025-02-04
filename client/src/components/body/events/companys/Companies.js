import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

function Companies(props) {
    const auth = useSelector(state => state.auth)
    const isLogged = useSelector(state => state.auth.isLogged)

    const token = useSelector(state => state.token)
    const [search, setsearch] = useState("")

    const [companys, setcompanys] = useState([])

    useEffect(() => {
        axios.get(`/api/company`, {
            headers: {  Authorization: token }
          }).then(d => {
              console.log(d.data)
              if(d?.data?.success){
                setcompanys(d?.data?.companys)
              } 
          })
    }, [token])
    
    return (
        <div className="dashboard_page">
            <div className="dashboard_page-control">
                <Link className="black-btn" to="/events/companys/new">Create new company</Link>
                <input type="text" value={search} onChange={e=> setsearch(e.target.value)} />
            </div>
            <div className="comapny_map">
                {/* {projects.map((p, i) =>   (p.project?.name.indexOf(search) != -1 || p.project.description.indexOf(search) != -1) ?
                    <div key={i} className="dashboard_project-card">
                        <div className="dashboard_project-card-header">
                            <div className="dashboard_project-card-header-img">
                                <img src={p.project.logo}/>
                            </div>
                            <Link to={"/project/"+p.project.uniqueLink}>
                            {p.project.name.length > 25 ? 
                            p.project.name.substring(0,25)+"...":
                            p.project.name
                        }</Link> 
                        </div>
                        <div  className="dashboard_project-card-body">
                            {p.project.description.length > 135 ? 
                            p.project.description.substring(0,135)+"...":
                            p.project.description
                        }
                        </div>
                    </div> : null
                )} */}

                {
                    companys.map((p, i) =>   (p.company?.name.indexOf(search) != -1 || p.company.description.indexOf(search) != -1) ?
                    <div key={i} className="dashboard_project-card">
                        <div className="dashboard_project-card-header">
                            <div className="dashboard_project-card-header-img">
                                <img src={p.company.logo}/>
                            </div>
                            <Link to={"/events/companys/"+p.company.uniqueLink}>
                            {p.company.name.length > 25 ? 
                            p.company.name.substring(0,25)+"...":
                            p.company.name
                        }</Link> 
                        </div>
                        <div  className="dashboard_project-card-body">
                            {p?.company?.description?.length > 135 ? 
                            p?.company?.description?.substring(0,135)+"...":
                            p?.company?.description
                        }
                        </div>
                    </div> : null)
                }
            </div>
        </div>
    )
}

export default Companies

