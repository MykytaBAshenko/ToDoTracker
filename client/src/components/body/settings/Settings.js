import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import validatePassword from '../../../functions/validatePassword'
import { dispatchLogin, fetchUser, dispatchGetUser } from '../../../redux/actions/authAction'
import validateNickname from '../../../functions/validateNickname'
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';


function Settings(props) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
  const dispatch = useDispatch()

    const [isNickname, setisNickname] = useState(false)
    const [doSomething, setdoSomething] = useState(false)
    const [password, setpassword] = useState("")
    const [confpassword, setconfpassword] = useState("")
    const [isPass, setisPass] = useState(false)
    const [isConfPass, setisConfPass] = useState(false)
    const [avatar, setavatar] = useState(auth?.user?.avatar ? auth?.user?.avatar : "/images/defaultUser.jpg")
    const [nickname, setnickname] = useState(auth?.user?.nickname ? auth?.user?.nickname : "")
    useEffect(() => {
        setdoSomething(!doSomething)
        setnickname(auth?.user?.nickname ? auth?.user?.nickname : "")
        setavatar(auth?.user?.avatar ? auth?.user?.avatar : "/images/defaultUser.jpg")

    }, [auth,token])

    const handleSubmitPassword = async e => {
        e.preventDefault()
        if(confpassword !== password ||  isPass || isConfPass || !validatePassword(confpassword))
            return toast.error("Bad input.", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        const res = await axios.post('/api/auth/reset', {
            password
        },{
            headers: { Authorization: token }
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
    const handleSubmitInfo = async e => {
        e.preventDefault()
        if(isNickname && !nickname.length)
            return toast.error("Bad nickname input.", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        const res = await axios.patch('/api/auth/changeinfo', {
            nickname,  avatar
        },{
            headers: { Authorization: token }
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
                if (token) {
                    const getUser = () => {
                      dispatch(dispatchLogin())
                      return fetchUser(token).then(res => {
                        dispatch(dispatchGetUser(res))
                      })
                    }
                    getUser()
                  }
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
            console.log(1)
            if (!file) console.log({ err: "No files were uploaded.", success: '' })

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
            console.log(err)
            console.log({ err: err.response?.data?.msg, success: '' })
        }
    }

    return (
        <div className="form-container">
            <div className="form-body">
                <form onSubmit={(e) => handleSubmitInfo(e)}>
                    <div className="title text-center">Settings</div>
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
                    <div className="form-actions">
                        <button className="form-actions-btn" type="submit">Change account info</button>
                    </div>
                </form>
                    <form onSubmit={(e) => handleSubmitPassword(e)}>
                
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
                        <button className="form-actions-btn" type="submit">Change password</button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default Settings


