import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import validatePassword  from '../../../functions/validatePassword'
import validateEmail  from '../../../functions/validateEmail'
import validateNickname  from '../../../functions/validateNickname'


const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password: '',
    fullname: '',
    err: '',
    success: ''
} 

function Register(props) {
    // const [user, setUser] = useState(initialState)

    // const { name, email, fullname, password, cf_password, err, success } = user
    const [nickname,setnickname]=useState("")
    const [isNickname,setisNickname]=useState(false)
    const [email,setemail]=useState("")
    const [isEmail,setisEmail]=useState(false)
    const [password, setpassword] = useState("")
    const [confpassword, setconfpassword] = useState("")
    const [isPass, setisPass] = useState(false)
    const [isConfPass, setisConfPass] = useState(false)

    // const handleChangeInput = e => {
    //     const { name, value } = e.target
    //     setUser({ ...user, [name]: value, err: '', success: '' })
    // }


    const handleSubmit = async e => {
        e.preventDefault()
            const res = await axios.post('/api/auth/register', {
                nickname, password, email
            })
            console.log(res.data.msg)
            // alert("Submit email!")
            props.history.push("/login")
            
    }

    const handleNickname = e => {
        if(validateNickname(e.target.value)) {
            setisNickname(false)
        }
        else {
            setisNickname("Bad nickname")
        }
        setnickname(e.target.value )
    }

    const handleChangeEmail = e => {
        if(validateEmail(e.target.value)) {
            setisEmail(false)
        }
        else {
            setisEmail("Bad email")
        }
        setemail(e.target.value )
    }

    const handleChangePass = e => {
        if(validatePassword(e.target.value)) {
            setisPass(false)
        }
        else {
            setisPass("Bad password")
        }
        if(e.target.value !== confpassword || !confpassword) {
            setisConfPass("Password mismatch")
        } else {
            setisConfPass(false)
        }
        setpassword(e.target.value)
    }

    const handleChangeConfPass = e => {
        if(password !== e.target.value || !e.target.value) {
            setisConfPass("Password mismatch")
        }
        else {
            setisConfPass(false)
        }
        setconfpassword(e.target.value)
    }


    return (
        <div className="form-container">
            <div className="form-body">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="title">Register</div>
                    
                    <div className="form-input">
                        <label className={ isNickname ?  "error-text" : "" } htmlFor="nickname">Nickname</label>
                        <input type="text" autoComplete="off"   className={ isNickname ?  "error-input" : "" } placeholder="Enter your nickname" id="nickname"
                            value={nickname} onChange={(e) => handleNickname(e)} />
                        {isNickname ? <label className="error-text">{isNickname}</label > : null}
                    </div>
                    <div className="form-input">
                        <label className={ isEmail ?  "error-text" : "" } htmlFor="mail">Email Address</label>
                        <input type="text" autoComplete="off"   className={ isEmail ?  "error-input" : "" } placeholder="Enter email address" id="mail"
                            value={email} onChange={(e) => handleChangeEmail(e)} />
                        {isEmail ? <label className="error-text">{isEmail}</label > : null}
                    </div>
                    <div className="form-input">
                        <label className={ isPass ?  "error-text" : "" } htmlFor="pass">New Password</label>
                        <input type="password"  className={ isPass ?  "error-input" : "" } placeholder="Enter new password" id="pass"
                            value={password} name="pass" onChange={e => handleChangePass(e)} />
                        {isPass ? <label className="error-text">{isPass}</label > : null}
                    </div>
                    <div className="form-input">
                        <label className={ isConfPass ?  "error-text" : "" } htmlFor="pass">Submit Password</label>
                        <input type="password"  className={ isConfPass ?  "error-input" : "" } placeholder="Submit new password" id="pass"
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


