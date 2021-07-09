const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

app.use(express.static("public"));

let connctions = [];
io.on("connect", (socket)=>
{
    connctions.push(socket);
    console.log(`${socket.id} has Connected!`);

    socket.on("draw" , (data)=>
    {
        connctions.forEach((con)=>
        {
            if(con.id !== socket.id)
            {
                con.emit("ondraw", {x : data.x , y:data.y});
            }
        })
    })
    socket.on("down" , (data)=>
    {
        connctions.forEach((con)=>
        {
            if(con.id !== socket.id)
            {
                con.emit("ondown", {x : data.x , y:data.y});
            }
        })
    })

    socket.on("disconnect" , (reason)=>
    {
        console.log(`${socket.id} has Disconnected!`);
        connctions  = connctions.filter((con)=> con.id  !==socket.id);

    })

})

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT , ()=>
{
    console.log(`server listening on http://localhost:${PORT}`);
})