import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router,Switch, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { dispatchLogin, fetchUser, dispatchGetUser } from './redux/actions/authAction'
import {fetchAllProjects, dispatchGetAllProjects} from './redux/actions/projectAction'

import Header from './components/header/Header'
import Body from './components/body/Body'
import Chat from './components/chat/Chat'
 
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)

  const chat_active = useSelector(state => state.chat_active.chat_active)
  const [callback, setCallback] = useState(false)
   
  const { user, isLogged } = auth

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post('/api/auth/refresh_token', null)
        dispatch({ type: 'GET_TOKEN', payload: (res.data.access_token ?? null) })
      }
      getToken()
    }
  }, [auth, dispatch])
  useEffect(() => {
    if(isLogged){
        fetchAllProjects(token).then(res =>{
            dispatch(dispatchGetAllProjects(res))
        })
    }
},[token, isLogged])
  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin())
        return fetchUser(token).then(res => {
          dispatch(dispatchGetUser(res))
        })
      }
      getUser()
    }
  }, [token])

  // circle farthest-corner at 10% 30%, rgba(70, 168, 255, 0.8) 0, #e88eff 90%
  return (
      <Router> 
        <div id="App" className="App">
          <Switch>
              <Route path="/" component={ Body }/>
          </Switch>
          <ToastContainer />
          <Chat isshow={ isLogged && chat_active} />
        </div>
      </Router>
  );
}

export default App;