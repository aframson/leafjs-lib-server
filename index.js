const express = require('express')
const leaf = express()
const http = require('http')
const { Server } = require('socket.io')


const log = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const upload = multer()

const Leaf = {
    config: (app, obj) => {

        if (obj.cors === true) {
            // to prevent cors errors
            app.use(cors());
        }
        if (obj.log === true) {
            // log requests to the console 
            app.use(log('tiny'));
        }
        if (obj.json === true) {
            // parse application/json
            app.use(express.json());
        }
        if (obj.text === true) {
            // parse raw text
            app.use(express.text());
        }
        if (obj.urlEncodeExtented) {
            // parse application/x-www-form-urlencoded
            app.use(express.urlencoded({ extended: obj.urlEncodeExtented }));
        }
        if (obj.cookieParser === true) {
            // parse cookie parse
            app.use(cookieParser());
        }
        if (obj.useUploadArray === true) {
            // parse multipart/form-data
            app.use(upload.array());
        }
        if (obj.useStaticFiles === true) {
            // allow static files 
            app.use(express.static('public'));
        }
        if (obj.StaticName) {
            // allow static files 
            app.use(express.static(obj.StaticName));
        }

    },
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