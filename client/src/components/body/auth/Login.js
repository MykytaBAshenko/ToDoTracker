import React, { useState,useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { dispatchLogin } from '../../../redux/actions/authAction'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import validateEmail  from '../../../functions/validateEmail'
import validatePassword  from '../../../functions/validatePassword'
import { toast } from 'react-toastify';


const initialState = {
    email: '',
    password: ''
}
const GOOGLE_CLIENT = process.env.REACT_APP_GOOGLE_CLIENT

function Login(props) {
    const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()
    const [isEmail, setisEmail] = useState(false)
    const [isPassword, setisPassword] = useState(false)
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    
    const { email, password} = user
    useEffect(() => {
        if(auth.isLogged)
            props.history.push("/")
    }, [auth.isLogged])

    const handleChangeEmail = e => {
        if(validateEmail(e.target.value)) {
            setisEmail(false)
        }
        else {
            setisEmail("Bad email")
        }
        setUser({ ...user, email: e.target.value })
    }

    const handleChangePassword = e => {
            if(validatePassword(e.target.value)) {
                setisPassword(false)
            }
            else {
                setisPassword("Bad password")
            }
        setUser({ ...user, password: e.target.value })
    }

    
    const handleSubmit = async e => {
        e.preventDefault()
        if(isEmail || isPassword){
           return toast.error("Bad input!", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        }
            const res = await axios.post('/api/auth/login', { email, password })

            if(res?.data?.success) {
                localStorage.setItem('firstLogin', true)
                dispatch(dispatchLogin())
                history.push("/")
            } else {
                return toast.error(res?.data?.msg, {
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
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="title">Login</div>
                    <div className="form-input">
                        <label className={ isEmail ?  "error-text" : "" } htmlFor="mail">Email Address</label>
                        <input type="text" autoComplete="off"   className={ isEmail ?  "error-input" : "" } placeholder="Enter email address" id="mail"
                            value={email} onChange={(e) => handleChangeEmail(e)} />
                        {isEmail ? <label className="error-text">{isEmail}</label > : null}
                    </div>

                    {/* <div className="form-input">    
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="Enter password" id="password"
                            value={password} name="password" onChange={handleChangeInput} />
                    </div> */}
                    <div className="form-input">
                        <label className={ isPassword ?  "error-text" : "" } htmlFor="pass">Password</label>
                        <input type="password" autoComplete="new-password"  className={ isPassword ?  "error-input" : "" } placeholder="Enter password" id="pass"
                            value={password} onChange={(e) => handleChangePassword(e)} />
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
                        clientId={GOOGLE_CLIENT}
                        buttonText="Login with google"
                        onSuccess={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </form>

            </div>
        </div>
    )
}

export default Login
