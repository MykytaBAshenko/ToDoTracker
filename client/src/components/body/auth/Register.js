import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector} from 'react-redux'
import validatePassword from '../../../functions/validatePassword'
import validateEmail from '../../../functions/validateEmail'
import validateNickname from '../../../functions/validateNickname'
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';


function Register(props) {
    const auth = useSelector(state => state.auth)

    const [nickname, setnickname] = useState("")
    const [isNickname, setisNickname] = useState(false)
    const [email, setemail] = useState("")
    const [isEmail, setisEmail] = useState(false)
    const [password, setpassword] = useState("")
    const [confpassword, setconfpassword] = useState("")
    const [isPass, setisPass] = useState(false)
    const [isConfPass, setisConfPass] = useState(false)
    const [avatar, setavatar] = useState("/images/defaultUser.jpg")

    useEffect(() => {
        if(auth.isLogged)
            props.history.push("/")
    }, [auth.isLogged])

    const handleSubmit = async e => {
        e.preventDefault()
        if(confpassword !== password || isEmail || isNickname || isPass || isConfPass || !confpassword.length)
            return toast.error("Bad input.", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        const res = await axios.post('/api/auth/register', {
            nickname, password, email, avatar
        })
        if(res.data.success){
            toast.success(res.data.msg, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            props.history.push("/login")
        } else {
            return toast.error(res.data.msg, {
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

    const handleNickname = e => {
        if (validateNickname(e.target.value)) {
            setisNickname(false)
        }
        else {
            setisNickname("Bad nickname")
        }
        setnickname(e.target.value)
    }

    const handleChangeEmail = e => {
        if (validateEmail(e.target.value)) {
            setisEmail(false)
        }
        else {
            setisEmail("Bad email")
        }
        setemail(e.target.value)
    }

    const handleChangePass = e => {
        if (validatePassword(e.target.value)) {
            setisPass(false)
        }
        else {
            setisPass("Bad password")
        }
        if (e.target.value !== confpassword || !confpassword) {
            setisConfPass("Password mismatch")
        } else {
            setisConfPass(false)
        }
        setpassword(e.target.value)
    }

    const handleChangeConfPass = e => {
        if (password !== e.target.value || !e.target.value) {
            setisConfPass("Password mismatch")
        }
        else {
            setisConfPass(false)
        }
        setconfpassword(e.target.value)
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
            
            const res = await axios.post('/api/auth/uploadimage', formData, {
                headers: { 'content-type': 'multipart/form-data' }
            })
            if(res.data.success)
            setavatar("/" + res.data.url)
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

    return (
        <div className="form-container">
            <div className="form-body">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="title text-center">Register</div>
                    <div className="image-form-conroler">
                        <Dropzone
                            onDrop={uploadLogo}
                            multiple={false}
                            maxSize={8 * 1024 * 1024}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div className="dropzone"
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps()} />
                                    <img src={avatar} />


                                </div>
                            )}

                        </Dropzone>
                    </div>
                    <div className="form-input">
                        <label className={isNickname ? "error-text" : ""} htmlFor="nickname">Nickname</label>
                        <input type="text" autoComplete="off" className={isNickname ? "error-input" : ""} placeholder="Enter your nickname" id="nickname"
                            value={nickname} onChange={(e) => handleNickname(e)} />
                        {isNickname ? <label className="error-text">{isNickname}</label > : null}
                    </div>
                    <div className="form-input">
                        <label className={isEmail ? "error-text" : ""} htmlFor="mail">Email Address</label>
                        <input type="text" autoComplete="off" className={isEmail ? "error-input" : ""} placeholder="Enter email address" id="mail"
                            value={email} onChange={(e) => handleChangeEmail(e)} />
                        {isEmail ? <label className="error-text">{isEmail}</label > : null}
                    </div>
                    <div className="form-input">
                        <label className={isPass ? "error-text" : ""} htmlFor="pass">New Password</label>
                        <input type="password" className={isPass ? "error-input" : ""} placeholder="Enter new password" id="pass"
                            value={password} name="pass" onChange={e => handleChangePass(e)} />
                        {isPass ? <label className="error-text">{isPass}</label > : null}
                    </div>
                    <div className="form-input">
                        <label className={isConfPass ? "error-text" : ""} htmlFor="pass">Submit Password</label>
                        <input type="password" className={isConfPass ? "error-input" : ""} placeholder="Submit new password" id="pass"
                            value={confpassword} name="pass" onChange={e => handleChangeConfPass(e)} />
                        {isConfPass ? <label className="error-text">{isConfPass}</label > : null}
                    </div>
                    <div className="form-actions">
                        <button className="form-actions-btn" type="submit">Register</button>
                        <div className="form-actions-links">
                            <span className="span">Already have an account? <Link to="/login">Login</Link></span>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default Register


