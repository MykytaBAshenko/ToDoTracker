require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const main_socket = require("./sockets/main_socket")

const app = express()
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    }, 
  });
 

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
})) 
 
app.use('/api/auth', require('./routes/authRouter'))
app.use('/api/task', require('./routes/taskRouter'))
app.use('/api/project', require('./routes/projectRouter'))
app.use('/api/comments', require('./routes/commentsRouter'))
app.use('/api/calendar', require('./routes/calendarRouter'))



app.use('/uploads', express.static('uploads'));





io.on("connection", (socket) => main_socket(socket, io)); 


// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log("Connected to mongodb")
}) 

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})
