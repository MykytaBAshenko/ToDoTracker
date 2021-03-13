import React, { useState } from 'react'
import axios from 'axios'
import validateEmail  from '../../../functions/validateEmail'
import { toast } from 'react-toastify';
import { Link, useHistory } from 'react-router-dom'

function ForgotPassword() {
    const [email, setemail] = useState("")
    const [isEmail, setisEmail] = useState(false)


    
    const handleChangeInput = e => {
        const { name, value } = e.target
        if(name == "email") {
            if(validateEmail(value)) {
                setisEmail(false)
            }
            else {
                setisEmail("Bad email")
            }
        }
        setemail(value)
    }

    const forgotPassword = async (e) => {
        e.preventDefault()
            const res = await axios.post('/api/auth/forgot', { email })
            // alert(res.data.msg)
            if(res.data.success)
            toast.success(res.data.msg, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });

            else if(!res.data.success)
            toast.error(res.data.msg, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        
    }

    return (

        <div className="form-container">
        <div className="form-body">
            <form onSubmit={(e) => forgotPassword(e)}>
                <div className="title">Forgot Your Password?</div>
                <div className="form-input">
                    <label className={ isEmail ?  "error-text" : "" } htmlFor="email">Email Address</label>
                    <input type="text"  className={ isEmail ?  "error-input" : "" } placeholder="Enter email address" id="email"
                        value={email} name="email" onChange={handleChangeInput} />
                    {isEmail ? <label className="error-text">{isEmail}</label > : null}
                </div>
                <div className="form-actions">
                    <button className="form-actions-btn" type="submit">Reset password</button>
                    <div className="form-actions-links">
                        <Link to="/register">Register</Link>

                            <Link to="/login">Login</Link>
                        </div>
                </div>
            </form>
        </div>
    </div>
    )
}

export default ForgotPassword
