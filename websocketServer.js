const ws = require("ws")
const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection",(socket)=>{
    console.log("Client connected")
    socket.on("message",(message)=>{
        console.log("Message : "+message)
    })
})

exports.default = wsServer