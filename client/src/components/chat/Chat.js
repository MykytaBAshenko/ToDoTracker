import React, { useState, useRef, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'
import socketIOClient from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux'
import {dispatchSetUnreadAction} from '../../redux/actions/unreadAction'
import {dispatchSetLastUpdateInMsg} from '../../redux/actions/projectAction'



import { Link } from 'react-router-dom'
import axios from 'axios'
require('dotenv').config()

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;

const check_if_exist_unread = (data,id) => {
  if(!id || !data)
    return false
    console.log(data, id)
  for(let y = 0; y < data.length; y++){
    if(data[y].whosee.indexOf(id) == -1)
      return true
  }
  return false
}


const useChat = (roomId, projectInfo) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)
  const unread = useSelector(state => state.unread)
  const chats = useSelector(state => state.projects.projects)

  const senderId = auth.user._id
  const dispatch = useDispatch()

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId, senderId },
    });

    
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        // ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      if(unread?.unread?.indexOf(roomId) != -1)
        unread?.unread?.splice(unread?.unread?.indexOf(roomId),1)
      if(check_if_exist_unread(incomingMessage, auth?.user?._id))
        unread?.unread?.push(roomId)
      chats.find((o, i) => {
          if (o.project.uniqueLink == roomId && !chats[i].project.lastMsg && incomingMessage.createdAt != chats[i].project.lastMsg) {
            chats[i].project.lastMsg = incomingMessage.createdAt
            dispatch(dispatchSetLastUpdateInMsg(chats))

          }
      });
      dispatch(dispatchSetUnreadAction({unread:unread.unread}))

      setMessages((messages) => [...messages, incomingMessage]);
    });
    socketRef.current.on("conn", (d) => {
      // console.log(1)
      setMessages(d)
      if(unread?.unread?.indexOf(roomId) != -1)
        unread?.unread?.splice(unread?.unread?.indexOf(roomId),1)
      if(check_if_exist_unread(d, auth?.user?._id))
        unread?.unread?.push(roomId)
      chats.find((o, i) => {
          if (o.project.uniqueLink == roomId && !chats[i].project.lastMsg && d[d.length-1]?.createdAt != chats[i].project.lastMsg) {
            chats[i].project.lastMsg = d[d.length-1].createdAt
            dispatch(dispatchSetLastUpdateInMsg(chats))

          }
      });
      dispatch(dispatchSetUnreadAction({unread:unread.unread}))
    });
  }, []);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      projectId: projectInfo._id,
      senderId: auth.user._id
    });
  };

  return { messages, sendMessage };
};






function Chat(props) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const chats = useSelector(state => state.projects.projects)

  const [WhatMesShow, setWhatMesShow] = useState([])
  const [WhereSend, setWhereSend] = useState()

  useEffect(() => {
  
}, [WhereSend,chats])


    return (
        <div className={"chat-window "+(props.isshow ? "" : "display-none")}>
          <div className="chat-window-chooser">
            {chats?.map((c, i) => <ChatChooser key={i} setWhereSend={setWhereSend} WhereSend={WhereSend} WhatMesShow={WhatMesShow}  setWhatMesShow={setWhatMesShow} roomId={c.project.uniqueLink} projectInfo={c.project}/>)}
          </div>
          <ChatOutput WhatMesShow={WhatMesShow} WhereSend={WhereSend} />
        </div>
    )
}

// function one_msg_render(props) {
//   useEffect(() => {
//     // console.log(WhereSend)
  
// }, [])
// return(

// )
// }


function ChatOutput(props) {
  const [newMessage, setNewMessage] = React.useState("");
  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    console.log(props.WhatMesShow)
    props.WhereSend(newMessage);
    setNewMessage("");
  };
  useEffect(() => {
    
  }, [props.WhatMesShow])

  return(
    <div className="msgsforrender" id="msgs_body">
      <div className="msgsrenderexact">
        {props.WhatMesShow.map((m,i) => <div key={i}>{m.body}</div>)}
      </div>
      <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Write message..."
        className="new-message-input-field"
      />
       <button onClick={handleSendMessage} className="send-message-button">
        Send
      </button>
    </div>
  )
}

function ChatChooser(props) {
  
  const { messages, sendMessage } = useChat(props.roomId, props.projectInfo);
  useEffect(() => {
    if(props.WhereSend)
    props.setWhatMesShow(messages)
  }, [ messages.length])
  return(
    <div className="chat-chooser" onClick={() => {props.setWhatMesShow(messages);props.setWhereSend(()=>sendMessage)}}>
      <img src={props.projectInfo.logo} onError={(e)=>{e.target.onerror = null; e.target.src="/images/company-placeholder.png"}}/>
      <div className="chat-chooser-body">
        <div className="chat-chooser-title">
          {
            props.projectInfo.name.length > 20 ? 
            props.projectInfo.name.substring(0,20)+"...":
            props.projectInfo.name
          }
        </div>
        <div className="chat-chooser-last-msg">
          {messages[messages.length-1]?.body}
        </div>
      </div>
    </div>
  )
}



export default Chat
