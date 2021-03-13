import React, { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import validatePassword  from '../../../functions/validatePassword'
import { toast } from 'react-toastify';



function ResetPassword(props) {
    const [password, setpassword] = useState("")
    const [confpassword, setconfpassword] = useState("")
    const [isPass, setisPass] = useState(false)
    const [isConfPass, setisConfPass] = useState(false)


    const { token } = useParams()


    const handleChangePass = e => {
        if(validatePassword(e.target.value)) {
            setisPass(false)
        }
        else {
            setisPass("Bad password")
        }
        if(e.target.value !== confpassword) {
            setisConfPass("Password mismatch")
        } else {
            setisConfPass(false)
        }
        setpassword(e.target.value)
    }

    const handleChangeConfPass = e => {
        if(password !== e.target.value) {
            setisConfPass("Password mismatch")
        }
        else {
            setisConfPass(false)
        }
        setconfpassword(e.target.value)
    }



    const handleResetPass = async (e) => {
            e.preventDefault()
            const res = await axios.post('/api/auth/reset', { password }, {
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
                return props.history.push("/login")
            }
            toast.error(res.data.msg, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            props.history.push("/login")
            
        }


    return (
         <div className="form-container">
                  <div className="form-body">
                      <form onSubmit={(e) => handleResetPass(e)}>
                          <div className="title">Reset Your Password</div>
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
                              <button className="form-actions-btn" type="submit">Reset password</button>
                          </div>
                      </form>
                  </div>
              </div>
    )
}

export default ResetPassword

