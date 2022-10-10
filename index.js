const express = require('express')
const app = express()
const port = 3000

//http server

app.use(express.static("chatapp-ui"))

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//websocket

const ws = require("ws")
const wsServer = new ws.Server({ server: server });
const { uuid } = require('uuidv4');

let clients = {}

function sendMessage(from,msg){
    let keys = Object.keys(clients)
    const data = JSON.stringify({
        command:"message",
        value:msg
    })

    keys.forEach((id)=>{
        if(id==from.clientId){
            return;
        }
        clients[id].send(data)
    })

}

wsServer.on("connection",(socket)=>{
    socket.clientId = uuid()
    clients[socket.clientId] = socket
    socket.on("message",(message)=>{
        try{
            message = JSON.parse(""+message)

            if(!message.command || !message.value){
                throw "missing paramater"
            }

            switch(message.command){
                case "username":
                    console.log(`${socket.clientId} username = ${message.value}`)
                    socket.username = message.value
                    break;
                case "message":
                    console.log(`${socket.clientId} message = ${message.value}`)
                    sendMessage(socket,message.value)
                    break;
                default:
                    throw "undefined command"
            }

        }catch(e){
            console.log(e)
        }
    })
})