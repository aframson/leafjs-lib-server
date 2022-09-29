const express = require('express')
const leaf = express()
const http = require('http')
const { Server } = require('socket.io')
const Leaf = {
    init: (port, obj, callback) => {
        const PORT = process.env.PORT || port // you can change the port here 
        const NODE_ENV = process.env.NODE_ENV || 'development'
        leaf.set('port', PORT); // set port 
        leaf.set('env', NODE_ENV); // set environment
        const server = http.createServer(leaf)
        const io = new Server(server, {
            cors: {
                origin: obj.origin, // accept any origin you can change it to your specific url for security
                method: obj.methods // you can add more methods eg. DELETE , UPDATE etc...
            }
        })
        callback(io, leaf);
        // introduction page begins with '/'
        leaf.get('/', (req, res) => {
            res.render('public')
        })
        // error handling 
        obj.errorHandler(leaf)
        // export the server 
        module.exports = server;
        // listern to the server
        server.listen(PORT, () => {
            console.log(
                `
    ============================================================

    ✅ Leaf Server started @  http://localhost:${leaf.get('port')}.

    ✅ Environment : ${leaf.get('env')}

    ============================================================
            `
            );
        });
    }
}


module.exports = Leaf