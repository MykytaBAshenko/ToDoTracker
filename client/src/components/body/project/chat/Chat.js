import React, { useState, useRef, useEffect } from 'react'
import {Switch, Route} from 'react-router-dom'
import socketIOClient from "socket.io-client";

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
require('dotenv').config()

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};






function Chat(props) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const chats = useSelector(state => state.projects.projects)

  //   const roomId = "dasdasdasdasd" ;
  // const { messages, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = React.useState("");
  // const [WhichRoomShow, setWhichRoomShow] = useState(false)
  const [WhatMesShow, setWhatMesShow] = useState([])
  const [WhereSend, setWhereSend] = useState()

  // const handleNewMessageChange = (event) => {
  //   setNewMessage(event.target.value);
  // };

  // const handleSendMessage = () => {
  //   sendMessage(newMessage);
  //   setNewMessage("");
  // };
  useEffect(() => {
    console.log(WhereSend)
  
}, [WhereSend])


    return (
        <div className={"chat-window "+(props.isshow ? "" : "display-none")}>
          <div className="chat-window-chooser">
            {chats.map((c, i) => <ChatChooser key={i} setWhereSend={setWhereSend}  setWhatMesShow={setWhatMesShow} roomId={c.project.uniqueLink} projectInfo={c.project}/>)}
          </div>
          <ChatOutput WhatMesShow={WhatMesShow} WhereSend={WhereSend} />
        </div>
    )
}

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


  return(
    <div>
      {props.WhatMesShow.map((m,i) => <div key={i}>{m.body}</div>)}
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
  
  const { messages, sendMessage } = useChat(props.roomId);
  useEffect(() => {
    props.setWhatMesShow(messages)
  }, [ messages.length])
  return(
    <div className="chat-chooser" onClick={() => {props.setWhatMesShow(messages);props.setWhereSend(()=>sendMessage)}}>
      <img src={props.projectInfo.logo}/>
      <div className="chat-chooser-body">
        <div className="chat-chooser-title">
          {props.projectInfo.name}
        </div>
        <div className="chat-chooser-last-msg">
          {/* {props.projectInfo.name} */}
          {messages[messages.length-1]?.body}
        </div>
      </div>
    </div>
  )
}


export default Chat
