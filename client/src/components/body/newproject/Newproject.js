import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Dropzone from 'react-dropzone';
import './Newproject.css'

function Home(props) {
    const [name, setname] = useState("")
    const [description, setdescription] = useState("")
    const [logo, setlogo] = useState("/images/company-placeholder.png")
    const [imageinput, setimageinput] = useState("")
    const [uniqueLink, setuniqueLink] = useState("")
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
    const uploadLogo = async (files) => {
        try {
          const file = files[0]
    
          if (!file) console.log({ err: "No files were uploaded.", success: '' })
    
          if (file.size > 1024 * 1024)
            alert("Size too large.")
    
          if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.mimetype !== 'image/jpg')
            alert("File format is incorrect.")
    
          let formData = new FormData()
          formData.append('file', file)
    
          const res = await axios.post('/api/project/uploadlogo', formData, {
            headers: { 'content-type': 'multipart/form-data', Authorization: token }
          })
    
          setlogo( "/" + res.data.url)
    
        } catch (err) {
            console.log(err)
          console.log({ err: err.response?.data?.msg, success: '' })
        }
      }

    const createNewProject = async (e) =>{
        e.preventDefault()
        const sendobj = {}
        sendobj.name  = name
        sendobj.description = description
        sendobj.uniqueLink = uniqueLink
        sendobj.logo = logo
        sendobj.arrayOfLinks = []
        if(onWhatLink1 && Link1) 
            sendobj.arrayOfLinks.push({
                onwhat: onWhatLink1,
                link: Link1
            })
        if(onWhatLink2 && Link2) 
            sendobj.arrayOfLinks.push({
                onwhat: onWhatLink2,
                link: Link2
            })
        if(onWhatLink3 && Link3) 
            sendobj.arrayOfLinks.push({
                onwhat: onWhatLink3,
                link: Link3
            })
        if(onWhatLink4 && Link4) 
            sendobj.arrayOfLinks.push({
                onwhat: onWhatLink4,
                link: Link4
            })
        if(onWhatLink5 && Link5) 
            sendobj.arrayOfLinks.push({
                onwhat: onWhatLink5,
                link: Link5
            })
            // console.log(sendobj)
        axios.post("/api/project/new", sendobj, {
        headers: {  Authorization: token }
      }).then(d => {
          props.history.push(`/project/${d.data.createdProject.uniqueLink}`)
      })
    }

    return (
        <div className="form-container">
            <div className="form-body">
                <form onSubmit={(e) => createNewProject(e)}>
           <Dropzone
                onDrop={uploadLogo}
                multiple={false}
                maxSize={800000000}
            >
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone"
                      {...getRootProps()}
                  >
                      <input {...getInputProps()} />
                      <img src={logo}/>


                  </div>
              )}

            </Dropzone>
            <input  type="text" value={imageinput} onChange={e => setimageinput(e.target.value)}/>
            <button onClick={
                () => {
                    setlogo(imageinput)
                    setimageinput("")
                }
            }>setimage</button>
            <input value={name} onChange={e => setname(e.target.value)}/>
            <textarea value={description} onChange={e => setdescription(e.target.value)}/>
            <input placeholder={"uniqueLink"} value={uniqueLink} onChange={e => setuniqueLink(e.target.value)}/>
            
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

            <button onClick={(e) => createNewProject()}>Create new project</button>
            </form>
            </div>
            </div>

    )
}

export default Home
{/* <div className="form-container">
<div className="form-body">
    <form onSubmit={handleSubmit}>
        <div className="title">Login</div>
        <div className="form-input">
            <label className={ isEmail ?  "error-text" : "" } htmlFor="email">Email Address</label>
            <input type="text"  className={ isEmail ?  "error-input" : "" } placeholder="Enter email address" id="email"
                value={email} name="email" onChange={handleChangeInput} />
            {isEmail ? <label className="error-text">{isEmail}</label > : null}
        </div>
    
        <div className="form-input">
            <label className={ isPassword ?  "error-text" : "" } htmlFor="password">Password</label>
            <input type="password"  className={ isPassword ?  "error-input" : "" } placeholder="Enter password" id="password"
                value={password} name="password" onChange={handleChangeInput} />
            {isPassword ? <label className="error-text">{isPassword}</label > : null}
        </div>

        <div className="form-actions">
            <button className="form-actions-btn" type="submit">Login</button>
            <div className="form-actions-links">
            <Link to="/register">Register</Link>

                <Link to="/forgot_password">Forgot your password?</Link>
            </div>
        </div>
        <GoogleLogin
            className="google-btn"
            clientId="762813067815-bqjtm7cqg2m3h831oclbef4kgqmau2b6.apps.googleusercontent.com"
            buttonText="Login with google"
            onSuccess={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />
    </form>

</div>
</div> */}