import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import {IoSendSharp} from 'react-icons/io5'
import {GrFormClose} from 'react-icons/gr'
import { FaTrash, FaEdit } from 'react-icons/fa'
import { toast } from 'react-toastify';

function Comments(props) {
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    const [changecommentid, setchangecommentid] = useState("")
    const [changecommentvalue, setchangecommentvalue] = useState("")
    const [comments, setcomments] = useState([])
    const [changeinput, setchangeinput] = useState("")
    useEffect(() => {
        axios.get(`/api/comments/task/${props.taskId}`, {
            headers: { Authorization: token }
        }).then(d => {
            setcomments(d.data.comments)
        })
    }, [props.taskId])

    const handleSendComment = (e) => {
        e.preventDefault();
        if (changeinput){
            if (changecommentid) {
                axios.put(`/api/comments/${props.taskId}/comment/${changecommentid}`,{
                    changeinput
                },{
                    headers: {  Authorization: token }
                }).then(d => {
                    console.log(d)
                    if (d.data.success) {
                        setcomments(d.data.comments)
                        setchangeinput("") 
                        setchangecommentid("")
                        setchangecommentvalue("")
                    }
                    else  {
                        setchangeinput("") 
                        setchangecommentid("")
                        setchangecommentvalue("")
                        return toast.error(d.data.msg, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                })
            }else {
                axios.post(`/api/comments/task/${props.taskId}`, {
                    changeinput
                }, {
                    headers: {  Authorization: token }
                }).then(d => {
                    if (d.data.success) {
                        setcomments(d.data.comments)
                        setchangeinput("") 
                    }
                    else  {
                        setchangeinput("") 
                        return toast.error(d.data.msg, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }

                })
            }
        }
        
        // if(newMessage) {
        //   if(!props.editingId)
        //     props.WhereSend(newMessage);
        //   else{
        //     props.WhereEdit(newMessage, props.editingId)
        //     props.seteditingId("")
        //     props.seteditingInput("")
        //   }
        //   setNewMessage("");
        // }
      };
      const setCommentEdit = (id, edittext) => {
        setchangecommentid(id)
        setchangecommentvalue(edittext)
        setchangeinput(edittext)
      }
      const dropComment = (id) => {
        dropEditing()
        axios.delete(`/api/comments/${props.taskId}/comment/${id}`, {
            headers: {  Authorization: token }
        }).then(d => {
            if(d.data.success) {
                return setcomments(d.data.comments)
            }
            else {
                return toast.error(d.data.msg, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        })
      }

    const dropEditing = () => {
        setchangecommentid("")
        setchangecommentvalue("")
      }
    return(
        <div className="comments-section">
            <div className="comments-section-title">Comments</div>
            <form onSubmit={(e) => handleSendComment(e)} className="chat-msg-control">
                <div className="chat-msg-control-input">
                {changecommentid &&
                    <div className="editing-msg">
                    <div className="editing-msg-body">
                        {changecommentvalue}
                    </div>
                    <GrFormClose onClick={ () => dropEditing()}/>
                    </div>
                }
                <textarea
                    value={changeinput}
                    onChange={(event) => setchangeinput(event.target.value)}
                    placeholder="Write message..."
                    className="new-message-input-field"
                />
                </div>
                <button className="send-message-button">
                <IoSendSharp/>
                </button>
            </form>
            <div className="comments-list">
                {comments.map((c, i ) => <div className="comment-body" key={i}>
                    <div className="comments-image">
                        <img src={c.user.avatar} alt=""/>
                    </div>
                    <div className="comment-body-exact">
                        <div className="comment-body-nickname">
                            {c.user.email}
                        </div>
                        <div className="comment-body-description">
                            {c.description}
                        </div>
                    </div>
                    <div className="comment-control">
                    <button className="edit" onClick={() => setCommentEdit(c._id, c.description)}><FaEdit /></button>
                    <button className="drop" onClick={() => dropComment(c._id)}><FaTrash /></button>

                    </div>
                </div>)}
            </div>
        </div>
    )
}
export default Comments