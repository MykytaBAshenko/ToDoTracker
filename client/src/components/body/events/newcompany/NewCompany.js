import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Dropzone from 'react-dropzone';
// import './Newproject.css'
import { toast } from 'react-toastify';

function NewCompany(props) {
    const [name, setname] = useState("")
    const [isname, setisname] = useState(false)

    const [description, setdescription] = useState("")
    const [logo, setlogo] = useState("/images/company-placeholder.png")
    const [imageinput, setimageinput] = useState("")
    const [uniqueLink, setuniqueLink] = useState("")
    const [isuniqueLink, setisuniqueLink] = useState(false)

    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

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

            const res = await axios.post('/api/company/uploadlogo', formData, {
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
        axios.post("/api/company/new", sendobj, {
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
                    <div className="title text-center">Create new company</div>
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
                        <label className={isname ? "error-text" : ""} htmlFor="name">Company name</label>
                        <input type="text" autoComplete="off" className={isname ? "error-input" : ""} placeholder="Enter project name" id="name"
                            value={name} onChange={(e) => handleChangeName(e)} />
                        {isname ? <label className="error-text">{isname}</label > : null}
                    </div>
                    <div className="form-input">
                        <label htmlFor="desc">Company description</label>
                        <textarea type="text" autoComplete="off" placeholder="Enter project description" id="desc"
                            value={description} onChange={(e) => setdescription(e.target.value)} />
                    </div>
                    <div className="form-input">
                        <label className={isuniqueLink ? "error-text" : ""} htmlFor="link">Unique link</label>
                        <input type="text" autoComplete="off" className={isuniqueLink ? "error-input" : ""} placeholder="Enter a unique project link" id="link"
                            value={uniqueLink} onChange={(e) => handleChangeUniqueLink(e)} />
                        {isuniqueLink ? <label className="error-text">{isuniqueLink}</label > : null}
                    </div>
                    <button className="black-btn" onClick={(e) => createNewProject(e)}>Create new company</button>
                </form>
            </div>
        </div>

    )
}

export default NewCompany