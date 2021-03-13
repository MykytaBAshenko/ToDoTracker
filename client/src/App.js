import React, { useEffect } from 'react';
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
  
  const { user, isLogged } = auth

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post('/api/auth/refresh_token', null)
        dispatch({ type: 'GET_TOKEN', payload: res.data.access_token })
      }
      getToken()
    }
  }, [auth, dispatch])

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
      if(auth?.isLogged){
          fetchAllProjects(token).then(res =>{
              dispatch(dispatchGetAllProjects(res))
          })
      }
  }, [token, dispatch])


  return (
      <Router>
        <div className="App">
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