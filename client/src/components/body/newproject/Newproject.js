import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

import './Newproject.css'

function Home() {
    const [name, setname] = useState("")
    const [description, setdescription] = useState("")
    const [logoLink, setlogoLink] = useState("/images/company-placeholder.png")
    const [arrayOfLinks, setarrayOfLinks] = useState([])
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const [onWhatLink1, setonWhatLink1] = useState("")
    const [Link1, setLink1] = useState("")
    const [onWhatLink2, setonWhatLink2] = useState("")
    const [Link2, setLink2] = useState("")
    const [onWhatLink3, setonWhatLink3] = useState("")
    const [Link3, setLink3] = useState("")
    const [onWhatLink4, setonWhatLink4] = useState("")
    const [Link4, setLink4] = useState("")
    const [onWhatLink5, setonWhatLink5] = useState("")
    const [Link5, setLink5] = useState("")

    const [howManyInputs,sethowManyInputs] = useState(1)

    useEffect(() => {
      
    }, [])



    const removeField = () => {
        sethowManyInputs(howManyInputs - 1)
        if(howManyInputs == 1) {
            setonWhatLink1("")
            setLink1("")
        }
        if(howManyInputs == 2) {
            setonWhatLink2("")
            setLink2("")
        }
        if(howManyInputs == 3) {
            setonWhatLink3("")
            setLink3("")
        }
        if(howManyInputs == 4) {
            setonWhatLink4("")
            setLink4("")
        }
        if(howManyInputs == 5) {
            setonWhatLink5("")
            setLink5("")
        }
    }
    const uploadLogo = async (e) => {
        e.preventDefault()
        try {
          const file = e.target.files[0]
    
          if (!file) console.log({ err: "No files were uploaded.", success: '' })
    
          if (file.size > 1024 * 1024)
            alert("Size too large.")
    
          if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.mimetype !== 'image/jpg')
            alert("File format is incorrect.")
    
          let formData = new FormData()
          formData.append('file', file)
    
          const res = await axios.post('/api/question/uploadimage', formData, {
            headers: { 'content-type': 'multipart/form-data', Authorization: token }
          })
    
          logoLink( "/" + res.data.url)
    
        } catch (err) {
          console.log({ err: err.response.data.msg, success: '' })
        }
      }
    return (
        <div className="dashboard_page">
            {/* dashboard
            <Link to="new">Create new project</Link> */}
            <img src={logoLink}/>
            <input type="file" name="file" id="file_up" onChange={uploadLogo} />
            <input value={name} onChange={e => setname(e.target.value)}/>
            <textarea value={description} onChange={e => setdescription(e.target.value)}/>
            {
                howManyInputs > 0 ? 
                <div>
                    <input value={onWhatLink1} onChange={e => setonWhatLink1(e.target.value)}/>
                    <input value={Link1} onChange={e => setLink1(e.target.value)}/>
                </div> : null
            }
            {
                howManyInputs > 1 ? 
                <div>
                    <input value={onWhatLink2} onChange={e => setonWhatLink2(e.target.value)}/>
                    <input value={Link2} onChange={e => setLink2(e.target.value)}/>
                </div> : null
            }
            {
                howManyInputs > 2 ? 
                <div>
                    <input value={onWhatLink3} onChange={e => setonWhatLink3(e.target.value)}/>
                    <input value={Link3} onChange={e => setLink3(e.target.value)}/>
                </div> : null
            }
            {
                howManyInputs > 3 ? 
                <div>
                    <input value={onWhatLink4} onChange={e => setonWhatLink4(e.target.value)}/>
                    <input value={Link4} onChange={e => setLink4(e.target.value)}/>
                </div> : null
            }
            {
                howManyInputs > 4 ? 
                <div>
                    <input value={onWhatLink5} onChange={e => setonWhatLink5(e.target.value)}/>
                    <input value={Link5} onChange={e => setLink5(e.target.value)}/>
                </div> : null
            }
            {
                howManyInputs == 0 && 
                <button onClick={() => sethowManyInputs(1) }>Add</button>

            }

            {
                howManyInputs > 0 && howManyInputs < 5 && <div>
                    <button onClick={() => sethowManyInputs(howManyInputs + 1) }>Add</button>
                    <button onClick={() => removeField() }>Remove</button>
                </div>
            }
            {
                howManyInputs == 5 && <div>
                    <button onClick={() => removeField() }>Remove</button>
                </div>
            }

            
            </div>
    )
}

export default Home
