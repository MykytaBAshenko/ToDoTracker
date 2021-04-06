import React, { useState, useRef, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import socketIOClient from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux'
import { dispatchSetUnreadAction } from '../../redux/actions/unreadAction'
import { dispatchSetLastUpdateInMsg } from '../../redux/actions/projectAction'
import { FaTrash, FaEdit } from 'react-icons/fa'
import {IoSendSharp} from 'react-icons/io5'
import {GrFormClose} from 'react-icons/gr'
import { FaPlus, FaArrowLeft  } from 'react-icons/fa'

import { Link } from 'react-router-dom'
import axios from 'axios'
require('dotenv').config()

const NEW_CHAT_MESSAGE_EVENT = "NEW_CHAT_MESSAGE_EVENT";
const MESSAGE_WAS_READ = "MESSAGE_WAS_READ";
const DROP_MSG = "DROP_MSG";
const FIRST_CONN = "FIRST_CONN";
const REMOVE_FROM_FE = "REMOVE_FROM_FE"
const EDIT_CHAT_MESSAGE_EVENT = "EDIT_CHAT_MESSAGE_EVENT";



const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;

const check_if_exist_unread = (data, id) => {
  if (!id || !data)
    return false
  for (let y = 0; y < data.length; y++) {
    if (data[y]?.whosee?.indexOf(id) == -1)
      return true
  }
  return false
}


const useChat = (roomId, projectInfo) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const auth = useSelector(state => state.auth)


  const senderId = auth.user._id

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId, senderId },
    });


    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {

      setMessages((messages) => [...messages, message]);
    });

    socketRef.current.on(FIRST_CONN, (d) => {
      if(d)
        setMessages(d)
      else
        setMessages([])

    });

    socketRef.current.on(REMOVE_FROM_FE, (d) => {
        setMessages((messages) => messages.filter(function(mes) {
        return mes._id != d.messageId
      }));
    });


    
    socketRef.current.on(EDIT_CHAT_MESSAGE_EVENT, (d) => {
        setMessages((messages) => {
          let new_array = []
          for (let y = 0 ; y < messages.length; y++) {
            if (messages[y]._id != d._id) {
              new_array.push(messages[y])
            }
            else {
              new_array.push(d)
            }
          }
          return new_array
        });
    });
  }, []);

  const sendMessage = (messageBody) => {
    if (messageBody)
      socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
        body: messageBody,
        projectId: projectInfo._id,
        senderId: auth.user._id
      });
  };

  const sendMessageWasRead = (id, last_msg) => {
    if (id && auth.user._id) {
      socketRef.current.emit(MESSAGE_WAS_READ, {
        messageId: id,
        senderId: auth.user._id
      })
    setMessages((messages) => {
      let new_messages = []
      for (let i = 0; i < messages.length; i++) {
        let push_obj = messages[i]
        if (push_obj._id == id)
          push_obj.whosee.push(auth.user._id)
        new_messages.push(push_obj)
      }
      return new_messages
    })
  }
  };

  const dropMsg = (id) => {
    if (id) 
      socketRef.current.emit(DROP_MSG, {
        messageId: id,
      })
  };

  const editMessage = (editBody, edit_id) => {
    if (editBody && edit_id)
      socketRef.current.emit(EDIT_CHAT_MESSAGE_EVENT, {
          editBody,
          edit_id
      });
  };



  return { messages, sendMessage, sendMessageWasRead, dropMsg, editMessage };
};






function Chat(props) {
  const auth = useSelector(state => state.auth)
  const chats = useSelector(state => state.projects.projects)

  const [WhatMesShow, setWhatMesShow] = useState([])
  const [WhereSend, setWhereSend] = useState()
  const [WhatMessageWasRead, setWhatMessageWasRead] = useState()
  const [DeleteMsg, setDeleteMsg] = useState()
  const [whatIsActive, setwhatIsActive] = useState("")
  const [chatname, setchatname] = useState("")
  const [WhereEdit,setWhereEdit] = useState()
  useEffect(() => {

  }, [WhereSend, chats])


  return (
    <div className={"chat-window " + (props.isshow ? "" : "display-none")}>
      <div className={"chat-window-chooser "
        + (whatIsActive ? " mobile-display-none" : "")

    }>
        <input className="chat-window-input" value={chatname} onChange={e => setchatname(e.target.value)}/>
        {chats?.map((c, i) => <ChatChooser
          key={i}
          chatname={chatname}
          whatIsActive={whatIsActive}
          setwhatIsActive={setwhatIsActive}
          setWhereSend={setWhereSend}
          setWhatMessageWasRead={setWhatMessageWasRead}
          WhereSend={WhereSend} WhatMesShow={WhatMesShow}
          setWhatMesShow={setWhatMesShow}
          roomId={c.project.uniqueLink}
          projectInfo={c.project}
          setDeleteMsg={setDeleteMsg}
          setWhereEdit={setWhereEdit}
        />)}
      </div>
      {props.isshow && WhereSend ?
        <ChatOutput
          whatIsActive={whatIsActive}
          setwhatIsActive={setwhatIsActive}
          auth={auth}
          DeleteMsg={DeleteMsg}
          WhatMessageWasRead={WhatMessageWasRead}
          WhatMesShow={WhatMesShow}
          WhereSend={WhereSend}
          WhereEdit={WhereEdit}
        /> : 
        <div id="msgs_body" className="choose-chat-room mobile-display-none">
          Select a room
        </div>
      }</div>
  )
}


function RenderMyMsgDate(props) {
  const m = new Date(props.was)
  return(
      <div className="my-msg-date">
          {
                 m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds() + " " +  m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() 
          }
      </div>
  )
}

function RenderMsgDate(props) {
  const m = new Date(props.was)
  return(
      <div className="msg-date">
          {
                 m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds() + " " +  m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() 
          }
      </div>
  )
}


function RenderMsg(props) {
  const divRef = useRef(null);

  useEffect(() => {
    if (props.WhatMesShow?.whosee?.indexOf(props?.auth?.user?._id) == -1)
      props.WhatMessageWasRead(props.WhatMesShow._id, props.WhatMesShow)
      divRef.current.scrollIntoView()
    }, [props.WhatMesShow._id])

  return (
    <div ref={divRef}  className={"RenderMsg"}>
      {
        props.auth?.user?._id !== props.WhatMesShow?.user?._id ?
          <div className="msg">
            <Link to={"/user/" + props.WhatMesShow?.user?._id}>
              <img src={props.WhatMesShow?.user?.avatar} />
            </Link>
            <div className="msg-body">
              <Link to={"/user/" + props.WhatMesShow?.user?._id}>
                {props.WhatMesShow?.user?.nickname ? props.WhatMesShow?.user?.nickname : props.WhatMesShow?.user?.email}
              </Link>
              <div className="msg-body-text">
                <div>{props.WhatMesShow.body}</div>
                <RenderMsgDate was={props.WhatMesShow.wascreated}/>

              </div>
            </div>
          </div> :
          <div className="my-msg">
            <div className="my-msg-text">
              <div>{props.WhatMesShow.body}</div>
              <RenderMyMsgDate was={props.WhatMesShow.wascreated}/>
            </div>
            <div className="my-msg-control">
              <button className="edit" onClick={() => {props.seteditingId(props.WhatMesShow._id); props.seteditingInput(props.WhatMesShow.body)}}><FaEdit /></button>
              <button className="drop" onClick={() => {props.DeleteMsg(props.WhatMesShow._id); props.setrmediting(!props.rmediting)}}><FaTrash /></button>
            </div>
          </div>
      }
    </div>
  )
}

function ChatInput(props) {
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    setNewMessage("");
  }, [props.whatIsActive])
  const handleSendMessage = (e) => {
    e.preventDefault();
    if(newMessage) {
      if(!props.editingId)
        props.WhereSend(newMessage);
      else{
        props.WhereEdit(newMessage, props.editingId)
        props.seteditingId("")
        props.seteditingInput("")
      }
      setNewMessage("");
    }
  };
  useEffect(()=> {
    dropEditing()
  },[props.rmediting])
  const dropEditing = () => {
    props.seteditingId("")
    props.seteditingInput("")
  }
  useEffect(() => {
    setNewMessage(props.editingInput)
  }, [props.editingId, props.editingInput])
  return (
    <form onSubmit={(e) => handleSendMessage(e)} className="chat-msg-control">
        <div className="chat-msg-control-input">
          {props.editingId &&
            <div className="editing-msg">
              <div className="editing-msg-body">
                {props.editingInput}
              </div>
              <GrFormClose onClick={ () => dropEditing()}/>
            </div>
          }
          <textarea
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            placeholder="Write message..."
            className="new-message-input-field"
          />
        </div>
        <button className="send-message-button">
          <IoSendSharp/>
        </button>
      </form>
  )
}


function ChatOutput(props) {
  const [editingInput, seteditingInput] = useState("");
  const [editingId, seteditingId] = useState("");
  const [rmediting, setrmediting] = useState(false)
  useEffect(() => {
    setrmediting(!rmediting)
  }, [props.WhatMesShow])

  return (
    <div className="chat-output-shell">
      <div className="back-controll">
      <span className="task-form-link" onClick={() => {
        props.setwhatIsActive("")
            }} ><FaArrowLeft /> Back</span>
      </div>
    <div className={"msgsforrender" + (props.whatIsActive ? "" : " mobile-display-none")} id="msgs_body">
      
      <div className="msgsrenderexact">
        {props.WhatMesShow.map((m, i) => <RenderMsg 
                                          setrmediting={setrmediting}
                                          rmediting={rmediting}
                                          WhatMessageWasRead={props.WhatMessageWasRead} 
                                          auth={props.auth} 
                                          WhatMesShow={m} 
                                          key={i+Math.random()}
                                          how_meny_msg={props.WhatMesShow}
                                          DeleteMsg={props.DeleteMsg} 
                                          seteditingId={seteditingId}
                                          seteditingInput={seteditingInput}
                                          />)}
      </div>
      <ChatInput
      rmediting={rmediting}
      WhereSend={props.WhereSend}
      WhereEdit={props.WhereEdit}
      whatIsActive={props.whatIsActive}
      seteditingId={seteditingId}
      seteditingInput={seteditingInput}
      editingId={editingId}
      editingInput={editingInput}
 />
    </div>
    </div>

  )
}

function ChatChooser(props) {
  const { messages, sendMessage, sendMessageWasRead, dropMsg, editMessage } = useChat(props.roomId, props.projectInfo);
  const unread = useSelector(state => state.unread)
  const auth = useSelector(state => state.auth)
  const chats = useSelector(state => state.projects.projects)

  const dispatch = useDispatch()
  useEffect(() => {
    if (props.WhereSend &&  props.roomId == props.whatIsActive)
      props.setWhatMesShow(messages)
    if (unread?.unread?.indexOf(props.projectInfo.uniqueLink) != -1)
      unread?.unread?.splice(unread?.unread?.indexOf(props.projectInfo.uniqueLink), 1)
    if (check_if_exist_unread(messages, auth?.user?._id))
      unread?.unread?.push(props.projectInfo.uniqueLink)
    dispatch(dispatchSetUnreadAction({ unread: unread.unread }))
  }, [messages, messages.length, props.whatIsActive])

  return (
    <div
      className={"chat-chooser " 
        + (unread.unread.indexOf(props.projectInfo.uniqueLink) != -1 ? "chat-unread-animation " : "")
        + (props.whatIsActive == props.projectInfo.uniqueLink ? "active-chat " : "" )
        + (props.projectInfo.name.indexOf(props.chatname) == -1 ? "display-none " : "") 
      }
      onClick={() => {
        props.setWhatMesShow(messages);
        props.setWhereSend(() => sendMessage);
        props.setWhereEdit(() => editMessage);
        props.setWhatMessageWasRead(() => sendMessageWasRead);
        props.setDeleteMsg(() => dropMsg);
        props.setwhatIsActive(props.projectInfo.uniqueLink)
      }}>
      <img src={props.projectInfo.logo} onError={(e) => { e.target.onerror = null; e.target.src = "/images/company-placeholder.png" }} />
      <div className="chat-chooser-body">
        <div className="chat-chooser-title">
          {
            props.projectInfo.name.length > 20 ?
              props.projectInfo.name.substring(0, 20) + "..." :
              props.projectInfo.name
          } 
        </div>
        <div className="chat-chooser-last-msg">
          {messages[messages.length - 1]?.body}
        </div>
      </div>
    </div>
  )
}



export default Chat
