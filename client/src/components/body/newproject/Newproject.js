import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Dropzone from 'react-dropzone';
// import './Newproject.css'
import { toast } from 'react-toastify';

function Newproject(props) {
    const [name, setname] = useState("")
    const [isname, setisname] = useState(false)

    const [description, setdescription] = useState("")
    const [logo, setlogo] = useState("/images/company-placeholder.png")
    const [imageinput, setimageinput] = useState("")
    const [uniqueLink, setuniqueLink] = useState("")
    const [isuniqueLink, setisuniqueLink] = useState(false)

    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const [onWhatLink1, setonWhatLink1] = useState("")
    const [Link1, setLink1] = useState("")
    const [onWhatLink2, setonWhatLink2] = useState("")
    const [Link2, setLink2] = useState("")
    const [onWhatLink3, setonWhatLink3] = useState("")
    const [Link3, setLink3] = useState("")



    const [howManyInputs, sethowManyInputs] = useState(1)


    const handleChangeName = (e) => {
        if (e.target.value.length > 8 && e.target.value.indexOf(" ") == -1) {
            setisname(false)
        }
        else {
            setisname("Must be at least 8 characters or bad input")
        }
        setname(e.target.value)
    }
    const handleChangeUniqueLink = (e) => {
        if (e.target.value.length > 8
            && e.target.value.indexOf(" ") == -1
            && e.target.value.indexOf("?") == -1
            && e.target.value.indexOf("&") == -1
            && e.target.value.indexOf("=") == -1
            && e.target.value.indexOf("_") == -1
            && e.target.value.indexOf("/") == -1
        ) {
            setisuniqueLink(false)
        }
        else {
            setisuniqueLink("Must be at least 8 characters or bad input")
        }
        setuniqueLink(e.target.value)

    }

    const removeField = () => {
        sethowManyInputs(howManyInputs - 1)
        if (howManyInputs == 1) {
            setonWhatLink1("")
            setLink1("")
        }
        if (howManyInputs == 2) {
            setonWhatLink2("")
            setLink2("")
        }
        if (howManyInputs == 3) {
            setonWhatLink3("")
            setLink3("")
        }

    }
    const uploadLogo = async (files) => {
        try {
            const file = files[0]

            if (!file)
                return toast.error("Bad file.", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            if (file.size > 8 * 1024 * 1024)
                return toast.error("Size too large.", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.mimetype !== 'image/jpg')
                return toast.error("File format is incorrect.", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            let formData = new FormData()
            formData.append('file', file)

            const res = await axios.post('/api/project/uploadlogo', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
            if (res.data.success)
                setlogo("/" + res.data.url)

            else
                return toast.error(res.data.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

        } catch (err) {
            return toast.error("Something broke.", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const createNewProject = async (e) => {
        e.preventDefault()
        const sendobj = {}
        sendobj.name = name
        sendobj.description = description
        sendobj.uniqueLink = uniqueLink
        sendobj.logo = logo
        sendobj.arrayOfLinks = []
        if (onWhatLink1 && Link1)
            sendobj.arrayOfLinks.push({
                onwhat: onWhatLink1,
                link: Link1
            })
        if (onWhatLink2 && Link2)
            sendobj.arrayOfLinks.push({
                onwhat: onWhatLink2,
                link: Link2
            })
        if (onWhatLink3 && Link3)
            sendobj.arrayOfLinks.push({
                onwhat: onWhatLink3,
                link: Link3
            })
        axios.post("/api/project/new", sendobj, {
            headers: { Authorization: token }
        }).then(d => {
            if (d.data.success)
                props.history.push(`/project/${d.data.createdProject.uniqueLink}`)
            else
                return toast.error(d.data.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
        })
    }

    return (
        <div className="form-container">
            <div className="form-body">
                <form onSubmit={(e) => createNewProject(e)}>
                    <div className="title text-center">Create new project</div>
                    <div className="image-form-conroler">

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
                                    <img src={logo} />
                                </div>
                            )}

                        </Dropzone>
                    </div>
                    <div className="form-input with-btn">
                        <input type="text" value={imageinput} onChange={e => setimageinput(e.target.value)} />
                        <button type="button" onClick={
                            () => {
                                setlogo(imageinput)
                                setimageinput("")
                            }
                        }>Set image link</button>
                    </div>
                    <div className="form-input">
                        <label className={isname ? "error-text" : ""} htmlFor="name">Project name</label>
                        <input type="text" autoComplete="off" className={isname ? "error-input" : ""} placeholder="Enter project name" id="name"
                            value={name} onChange={(e) => handleChangeName(e)} />
                        {isname ? <label className="error-text">{isname}</label > : null}
                    </div>
                    <div className="form-input">
                        <label htmlFor="desc">Project description</label>
                        <textarea type="text" autoComplete="off" placeholder="Enter project description" id="desc"
                            value={description} onChange={(e) => setdescription(e.target.value)} />
                    </div>
                    <div className="form-input">
                        <label className={isuniqueLink ? "error-text" : ""} htmlFor="link">Unique link</label>
                        <input type="text" autoComplete="off" className={isuniqueLink ? "error-input" : ""} placeholder="Enter a unique project link" id="link"
                            value={uniqueLink} onChange={(e) => handleChangeUniqueLink(e)} />
                        {isuniqueLink ? <label className="error-text">{isuniqueLink}</label > : null}
                    </div>
                    <div className="form-input">
                        {
                            howManyInputs > 0 ? <label>Links for project</label> : null}

                        {
                            howManyInputs > 0 ?
                                <div className="links-input">
                                    <input value={onWhatLink1} onChange={e => setonWhatLink1(e.target.value)} />
                                    <input value={Link1} onChange={e => setLink1(e.target.value)} />
                                </div> : null
                        }
                        {
                            howManyInputs > 1 ?
                                <div className="links-input">
                                    <input value={onWhatLink2} onChange={e => setonWhatLink2(e.target.value)} />
                                    <input value={Link2} onChange={e => setLink2(e.target.value)} />
                                </div> : null
                        }
                        {
                            howManyInputs > 2 ?
                                <div className="links-input">
                                    <input value={onWhatLink3} onChange={e => setonWhatLink3(e.target.value)} />
                                    <input value={Link3} onChange={e => setLink3(e.target.value)} />
                                </div> : null
                        }
                        <div className="links-input-control">
                            {
                                howManyInputs == 0 &&
                                <button type="button" onClick={() => sethowManyInputs(1)}>Add field</button>

                            }

                            {
                                howManyInputs > 0 && howManyInputs < 3 && <>
                                    <button type="button" onClick={() => sethowManyInputs(howManyInputs + 1)}>Add field</button>
                                    <button type="button" onClick={() => removeField()}>Remove field</button>
                                </>
                            }
                            {
                                howManyInputs == 3 && <>
                                    <button type="button" onClick={() => removeField()}>Remove field</button>
                                </>
                            }
                        </div>
                    </div>


                    <button className="black-btn" onClick={(e) => createNewProject(e)}>Create new project</button>
                </form>
            </div>
        </div>

    )
}

export default Newproject