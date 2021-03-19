const NEW_CHAT_MESSAGE_EVENT = "NEW_CHAT_MESSAGE_EVENT";
const MESSAGE_WAS_READ = "MESSAGE_WAS_READ";
const DROP_MSG = "DROP_MSG";
const FIRST_CONN = "FIRST_CONN";
const REMOVE_FROM_FE = "REMOVE_FROM_FE"
const Messages = require('../models/messageModel')
const UsersInProject = require('../models/userInProjectModel')
const Project = require('../models/projectModel')

const mongoose = require('mongoose')


const get100msg = async(senderId,roomId) => {
    const project = await Project.find({ uniqueLink: roomId })
    return await Messages.find({project: mongoose.Types.ObjectId(project[0]._id)}).sort({createdAt: 1}).limit(100).populate("user")
}



const socket_body = async (socket, io) => {

// console.log(`Client ${socket.id} connected`);

// Join a conversation
const { roomId, senderId } = socket.handshake.query;
let send_messages = await get100msg(senderId,roomId);
io.to(socket.id).emit(FIRST_CONN, send_messages )
socket.join(roomId);
// socket.on("connection", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
//   });
// Listen for new messages
socket.on(NEW_CHAT_MESSAGE_EVENT, async (data) => {
    const new_msg = new Messages({
        user: mongoose.Types.ObjectId(data.senderId),
        body: data.body,
        project: mongoose.Types.ObjectId(data.projectId),
        whosee: [data.senderId]
    })
    let msg = await new_msg.save()
    msg = await Messages.find({_id: msg._id}).populate("user")
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, msg[0]);
});

socket.on(MESSAGE_WAS_READ, async (data) => {
    let mess = await Messages.find({_id: mongoose.Types.ObjectId(data.messageId)})
    mess[0].whosee.push(data.senderId)
    await mess[0].save()
});

socket.on(DROP_MSG, async (data) => {
    let mess = await Messages.find({_id: mongoose.Types.ObjectId(data.messageId)})
    await mess[0]?.remove()
    io.in(roomId).emit(REMOVE_FROM_FE, {messageId: data.messageId});
});

// Leave the room if the user closes the socket
socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);

});
}

module.exports = socket_body