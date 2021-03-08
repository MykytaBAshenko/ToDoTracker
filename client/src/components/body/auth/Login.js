import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { dispatchLogin } from '../../../redux/actions/authAction'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import validateEmail  from '../../../functions/validateEmail'
import validatePassword  from '../../../functions/validatePassword'


const initialState = {
    email: '',
    password: ''
}

function Login() {
    const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()
    const [isEmail, setisEmail] = useState(false)
    const [isPassword, setisPassword] = useState(false)

    
    const { email, password} = user

    const handleChangeInput = e => {
        const { name, value } = e.target
        if(e.target.name == "email") {
            if(validateEmail(value)) {
                setisEmail(false)
            }
            else {
                setisEmail("Bad email")
            }
        }
        if(e.target.name == "password") {
            if(validatePassword(value)) {
                setisPassword(false)
            }
            else {
                setisPassword("Bad password")
            }
        }
        setUser({ ...user, [name]: value })
    }


    const handleSubmit = async e => {
        e.preventDefault()
            const res = await axios.post('/api/auth/login', { email, password })
            alert(res?.data?.msg)
            if(res?.data?.success) {
                localStorage.setItem('firstLogin', true)
                dispatch(dispatchLogin())
                history.push("/")
            }
        
    }

    const responseGoogle = async (response) => {
            const res = await axios.post('/api/auth/googlelogin', { tokenId: response.tokenId })
            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push('/')
       
    }


    return (
        <div className="form-container">
            <div className="form-body">
                <form onSubmit={handleSubmit}>
                    <div className="title">Login</div>
                    <div className="form-input">
                        <label className={ isEmail ?  "error-text" : "" } htmlFor="email">Email Address</label>
                        <input type="text"  className={ isEmail ?  "error-input" : "" } placeholder="Enter email address" id="email"
                            value={email} name="email" onChange={handleChangeInput} />
                        {isEmail ? <label className="error-text">{isEmail}</label > : null}
                    </div>

                    {/* <div className="form-input">    
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="Enter password" id="password"
                            value={password} name="password" onChange={handleChangeInput} />
                    </div> */}
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

                {/* <div className="social">
                    
                    <FacebookLogin
                        appId="461819241896094"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={responseFacebook}
                    /> 

                </div> */}

            </div>
        </div>
    )
}

export default Login
