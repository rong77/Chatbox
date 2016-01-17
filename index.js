// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);



//set chat history log file
var fs = require('fs');
var filePath = __dirname+"/chat-log.txt";

//set timeout, default is 1 min
//io.set("heartbeat timeout", 3*60*1000);

//set which port this app runs on
var port = 4321;
var totalUsers = 0;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));




// Chatbox

// set username, avoid no name
function setName(name) {
  
    if (typeof name != 'undefined' && name!=='')
        return name;
    return "no name";
}



io.on('connection', function (socket) {

    console.log('New user connected');
    // set an initial name before receiving real name from client
    socket.username = setName('initName'); 


    // once the new user is connected, we ask him to tell us his name
    // tell him how many people online now
    socket.emit('login', {
        numUsers: totalUsers+1
    });



    // once a new client is connected, this is the first msg he send
    socket.on('login', function (data) {
        totalUsers++;
        socket.username = setName(data.username);
        console.log('There are '+ totalUsers + ' users now.');

        // echo to others that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: totalUsers
        });    

    });

    // when the user disconnects.. 
    socket.on('disconnect', function () {
        totalUsers--;
        // echo globally that this client has left
        socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: totalUsers
        });
        
    });


    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {

        // update username
        socket.username = setName(data.username);

        // if message starts with sudo, treat it as JavaScript to be run on client side
        // better authentication needed for this feature, use this feature with caucious. 
        if (data.msg.substring(0,4)==='sudo') {

            io.sockets.emit('script', {      
                script: data.msg.substring(4)
            });

        }else{

            // socket.broadcast.emit('new message', {//send to everybody but sender
            io.sockets.emit('new message', {//send to everybody including sender
                username: socket.username,
                message: data.msg
            });
        }

        // log the message in chat history file
        var chatMsg = socket.username+": "+data.msg+'\n';
        console.log(chatMsg);

        fs.appendFile(filePath, chatMsg, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The message is saved!");
        });

    });

    socket.on('base64 file', function (msg) {
        console.log('received base64 file from' + msg.username);
        socket.username = msg.username;
        // socket.broadcast.emit('base64 image', //exclude sender
        io.sockets.emit('base64 file', 

            {
              username: socket.username,
              file: msg.file,
              fileName: msg.fileName
            }

        );
    });


    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function (name) {
        socket.username = setName(name);
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function (name) {
        socket.username = setName(name);
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });





});
