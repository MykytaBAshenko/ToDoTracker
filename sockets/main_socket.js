const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";  
const Message = require('../models/messageModel')
const mongoose = require('mongoose')



const socket_body = (socket, io) => {

// console.log(`Client ${socket.id} connected`);

// Join a conversation
const { roomId, senderId } = socket.handshake.query;
socket.join(roomId);
// socket.on("connection", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
//   });
// Listen for new messages
socket.on(NEW_CHAT_MESSAGE_EVENT, async (data) => {
    const new_msg = new Message({
        user: mongoose.Types.ObjectId(data.senderId),
        body: data.body,
        project: mongoose.Types.ObjectId(data.projectId),
        whosee: [data.senderId]
    })
    let msg = await (await new_msg.save()).populate("user")
    // console.log(msg)
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, msg);
});

// Leave the room if the user closes the socket
socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
});
}

module.exports = socket_body