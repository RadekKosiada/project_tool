const express = require('express');
const app = express();
const compression = require('compression');
const csurf = require('csurf');
// const bodyParser = require('body-parser');
const database = require('./database.js');
const s3 = require('./s3');
const { s3Url }  = require('./config');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });
// const io = require('socket.io')(server, { origins: 'localhost:8080' https://my-app.herokuapp.com});

app.use(compression());
// app.use(bodyParser.json());
app.use(express.static('public'));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        //24 bytes
        uidSafe(24).then(function(uid) {
            //passing original name of the file, but just the extension
            //null is instead of error;
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        //we need to limit, security reasons;
        fileSize: 2097152
    }
});

//BODY PARSER
app.use(require('body-parser').json());

//COOKIE SESSION
const cookieSession = require('cookie-session');
const cookieSessionMiddleware = cookieSession({
    secret:  `Coding is a cool thing.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

//socket part to cookie session
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});


//CSURF AFTER COOKIE SESSION & BODY PARSER!!!
app.use(csurf());
app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

if (process.env.NODE_ENV != 'production') {
    //for our localhost
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    //for heroku
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}



//single as we upload a signle file;
//'file' the same string as in the formData.append
app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    const imgUrl = s3Url + req.file.filename;
    database.uploadImage(imgUrl, req.session.user.id)
        .then(results=>{
            // console.log('RESULTS OF UPLOAD IMG', results.rows);
            res.json(results.rows[0]);
        }).catch(err => {
            console.log(err.message);
        });
});

app.post('/deleteProfile', (req, res) => {
    // database.getUsersProfile(req.session.user.id)
    database.deleteProfile(req.session.user.id).then((results)=> {
        req.session = null;
        res.json(null);
    })
        .catch(err=> {
            console.log('ERR IN DEL PROFILE: ', err.message);
        });
});

app.get('/allImages', (req, res) => {
    database.getAllImages(req.session.user.id)
        .then(images => {
            console.log('RESULTS OF getAllImages: ', images.rows);
            res.json(images.rows);
        })
        .catch(err=>{
            console.log('ERR in getAllImages: ', err.message);
        });
});


app.get('/user', (req, res) => {
    database.getUsersProfile(req.session.user.id)
        .then(usersProfile => {
            // console.log('USERS PROFILE: ', usersProfile.rows[0]);
            res.json(usersProfile.rows[0]);

        })
        .catch(err => {
            console.log('ERROR in db.getUsersProfile: ', err.message)
        })
});

app.get('/get-all-friends.json', (req, res) => {
    database.getFriends(req.session.user.id)
        .then(allFriends => {
            console.log("RESULT of getAllFriends: ", allFriends.rows)
            res.json(allFriends.rows)
        })
        .catch(err => {
            console.log("Error in getFriends: ", err);
        })
});

app.get('/friendship.status.json/:id', (req, res)=>{
    database.getFriendsStatus(req.params.id, req.session.user.id)
    .then(fStatus => {
        // console.log(fStatus.rows[0].sender_id);
        if (typeof (fStatus.rows[0]) == 'undefined') {
            res.json('Send friend request');
            return;
        } else if (fStatus.rows[0].sender_id == req.session.user.id && !fStatus.rows[0].accepted) {
            //change this condition as it's not enough!!!
            // console.log(fStatus.rows[0].accepted);
            res.json('Cancel my friend request');
        } else if((fStatus.rows[0].sender_id == req.session.user.id && fStatus.rows[0].accepted) ||
    (fStatus.rows[0].receiver_id ==req.session.user.id && fStatus.rows[0].accepted)){
            res.json('End friendship');
        } else if (fStatus.rows[0].receiver_id ==req.session.user.id && !fStatus.rows[0].accepted) {
            res.json('Accept friend request');
        }
    })
    .catch(err=> {
        console.log('ERROR in db.getFriendsStatus: ', err);
    })
});

//SENDING FRIEND REQUEST
app.post('/sendFRequest.json', (req, res) => {
    database.sendFriendsRequest(req.body.id, req.session.user.id)
    .then(friendsRequest => {
        // console.log('RESULTS of sendFriendsRequest: ', friendsRequest.rows[0]);
        res.json('Cancel my friend request');
    })
    .catch(err => {
        console.log('ERR in sendFriendsRequest: ', err.message);
    })
})

///CANCELLING FRIENDSHIP REQUEST
app.post('/cancelFRequest.json', (req,res) => {
    database.cancelFriendsRequest(req.body.id, req.session.user.id)
    .then(fRequestCancelled => {
        // console.log('RESULTS of cancelFriendsRequest: ', fRequestCancelled.rows[0]);
        res.json('Send friend request');
    })
    .catch(err =>{
        console.log('ERR in cancelFriendsRequest: ', err.message);
    })
})

///ENDING FRIENDSHIP :((
//calling the same function in database as for cancelling but switched places of IDs
app.post('/endFriendship.json', (req,res) => {
    database.cancelFriendsRequest(req.session.user.id, req.body.id)
    .then(fRequestCancelled => {
        // console.log('RESULTS of cancelFriendsRequest: ', fRequestCancelled.rows[0]);
        res.json('Send friend request');
    })
    .catch(err =>{
        console.log('ERR in cancelFriendsRequest: ', err.message);
    })
})

//ACCEPTING FRIENDSHIP REQUEST
app.post('/acceptFRequest.json', (req, res) => {
    database.acceptFriendsRequest(req.body.id, req.session.user.id)
    .then(fRequestAccepted => {
        // console.log('RESULTS of acceptFriendsRequest: ', fRequestAccepted.rows[0]);
        res.json('End friendship')
    })
    .catch(err=> {
        console.log('ERR in acceptFriendsRequest: ', err.message);
    })
})

app.get('/get-other-user.json/:id',  (req, res) => {
    // console.log('REQ PARAMS ID', req.params.id);
    if(req.params.id==req.session.user.id) {
        res.json(false);
    }else {
        database.getOtherUsersProfile(req.params.id)
        .then(otherUsersProfile => {
            // console.log('OTHER USER`S PROFILE: ', otherUsersProfile.rows[0]);
            res.json(otherUsersProfile.rows[0]);
        })
        .catch(err=> {
            console.log('ERROR in db.getOtherUsersProfile: ', err.message)
        })
    }
});

app.post('/add-bio.json', (req, res)=> {
    database.saveBio(req.body.bio, req.session.user.id)
    .then(results => {
        // console.log('RESULTS OF SAVE BIO:', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(err=> {
        console.log(err.message);
    })
})

// route in the app.post should be the same as in handleSubmit in welcome.js
app.post('/register', function(req, res) {
    // console.log(req.body);
    database.hashedPassword(req.body.password)
        .then(hash => {
            return database.insertNewUser(
            req.body.first,
            req.body.last,
            req.body.email,
            hash
            );
        })
    .then(result => {
        req.session.user = {}
        req.session.user.id = result['rows'][0].id;
        res.json({success: true});
        // res.redirect('/');
    })
    .catch(err =>{
        console.log(err.message);
    });
});

app.post('/login', (req, res) => {
    database.getPassword(req.body.email)
        .then(result => {
            //will compare email and password from the login page with the ones in DB
            // console.log('HASHED PW: ', result.rows[0].password);
            database.checkPassword(req.body.password, result.rows[0].password)
                .then(userRegistered => {
                    console.log("User registered:", userRegistered);
                    if(userRegistered) {
                        req.session.user = {}
                        req.session.user.id = result.rows[0].id;
                        res.json({success: true});
                    } else {
                        res.json({success: false});
                    }
                })
                .catch(err => {
                    console.log('Error in checkPassword: ', err);
                    // res.redirect('/login');
                });
        })
        .catch(err => {
            console.log('Error in the getPassword: ', err);
            });
});

app.get('/logout', (req, res) => {
    req.session = null;
    console.log('SESSION:', req.session);
    res.redirect('/');
});

app.get('/welcome', function(req, res, next) {
    if(req.session.user) {
        res.redirect('/')
    } else {
        res.sendFile(__dirname + '/index.html');
    }
})

// star route handles everything;
app.get('*', function(req, res) {
    if(!req.session.user) {
        res.redirect('/welcome')

    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

//not app anymore, so we can also listen to socket, too
server.listen(8080, function() {
    console.log("I'm listening.");
});



//socket io server side code -------------------//////////////////////////

let onlineUsers=[];

io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    //socket.request.session.user.id to get user's id!!!!
    console.log(socket.request.session);

    //list of everyone who's currently online;
    onlineUsers.push({
        userId: socket.request.session.user.id,
        socketId: socket.id
    });
    //will return array of every single user ids
    let ids = onlineUsers.map(user=> {
        return user.userId;
    });
///// USER ONLNE
    database.getOnlineUsersByIds(ids)
        .then(results=> {
            // console.log('result of getOnlineUsersByIds: ', results.rows);
            //send message to a new user who's logged in;
            socket.emit('onlineUsersMuffin', results.rows);
        })
        .catch(err => {
            console.log('Error in getOnlineUsersByIds: ', err.message);
        });

//// CHAT: LAST 10 MESSAGES ////////////////////////////////////
    database.getLastChatMessages()
        .then(lastMessages=>{
            // console.log('LAST MESSAGES: ', lastMessages.rows);
            socket.emit('lastChatMessages', lastMessages.rows.reverse());
        })
        .catch(err=> {
            console.log('ERR in getLastChatMessages: ', err.message);
        });

///// SPACES: ALL AVAILABLE USER'S SPACES  //////////////////////////////
    database.getAllUsersSpaces(socket.request.session.user.id)
        .then(allSpaces =>{
            // console.log('All SPACES: ', allSpaces.rows);
            socket.emit('allUsersSpaces', allSpaces.rows);
        })
        .catch(err => {
            console.log('ERR in getAllUsersSpaces: ', err.message);
        });
//// TASKS: ALL AVAILABLE USER'S TASKS  //////////////////////
    database.getTasksFromCurrentSpace(1)
        .then(allTasks =>{
            console.log('All TASKS FROM CUR SPACE: ', allTasks.rows);
            socket.emit('allUsersSpaces', allTasks.rows);
        })
        .catch(err => {
            console.log('ERR in getTasksFromCurrentSpace: ', err.message);
        });

///// USER JOINED ////////////////////////////////////////////
    let counter=0;
    for(let i=0; i<ids.length; i++){
        if(ids[i]==socket.request.session.user.id){
            counter++;
        }
    }
    if(counter===1) {
        database.getUsersProfile(socket.request.session.user.id)
            .then(results =>{
                // console.log('Result of getUsersProfile that JOINED: ', results.rows)
                socket.broadcast.emit('userJoined', results.rows);

            })
            .catch(err=> {
                console.log('Error in getUsersProfile', err.message);
            });
    }

    ///USER LEFT ////////////////////////////////////////////////
    socket.on('disconnect', function() {
        console.log(`socket with the id ${socket.id} is now disconnected`);

        let indexToRemove = onlineUsers.findIndex(user => {
            console.log('USER!!!!!!!!!!!!!!!', user)
            return user.socketId == socket.id;
        });
        console.log('indextoremove: ', indexToRemove)
        onlineUsers.splice(indexToRemove, 1);

        let counter= 0;
        for(let i=0; i<onlineUsers.length; i++) {
            if(onlineUsers[i].userId === socket.request.session.user.id) {
                counter++;
            }
        }
        if(!counter) {
            io.sockets.emit('userLeft',  socket.request.session.user.id);
        }

    });

    // CHAT: HANDLING NEW MESSAGE //////////////////////////////////////////////
    socket.on('newMessage', function(newMessage) {
        // console.log('newMessage from CHAT: ', newMessage);
        database.saveMessage(newMessage, socket.request.session.user.id)
            .then(result=> {
                console.log('SAVE MESSAGE RESULTS FROM DB: ID:',result.rows[0].user_id);

                database.getUsersProfile(result.rows[0].user_id)
                    .then(chatter => {
                        // console.log('RESULT of getUsersProfile CHAT: ', chatter.rows[0]);
                        let chatterObj= {
                            first: chatter.rows[0].first,
                            last: chatter.rows[0].last,
                            url: chatter.rows[0].url,
                            created_at: result.rows[0].created_at,
                            message: result.rows[0].message
                        };
                        console.log('CHATTER OBJ: ', chatterObj);
                        io.sockets.emit('singleChatMessage', chatterObj);
                    })

                    .catch(err=> {
                        console.log('ERR in getUsersProfile:', err.message);
                    });
            })
            .catch(err => {
                console.log('ERR in saveMessage: ', err.message);
            });
    });

    // CREATING A NEW SPACE ////////////////////////////////////
    socket.on('newSpace', function(spaceObj) {
        // console.log('SPACE OBJ: ', spaceObj.name, spaceObj.category);
        database.saveNewSpace(socket.request.session.user.id, spaceObj.name, spaceObj.category)
            .then(space => {
                console.log('SPACE SAVED: ', space.rows[0].owner_id);
                database.getUsersProfile(space.rows[0].owner_id)
                    .then(user => {
                        let spaceInfo={
                            first: user.rows[0].first,
                            last: user.rows[0].last,
                            url: user.rows[0].url,
                            created_at: space.rows[0].created_at,
                            name: space.rows[0].name,
                            category: space.rows[0].category,
                            status: space.rows[0].status,
                            color: space.rows[0].color,
                            eta: space.rows[0].eta
                        };
                        // console.log('SPACE INFO TO BE SENT: ', spaceInfo);
                        io.sockets.emit('newSpace', spaceInfo);
                    })
                    .catch(err => {
                        console.log('ERR in getUsersProfile: ', err.message);
                    });
            })
            .catch(err => console.log('ERR in saveNewSpace: ', err.message));
    });

    //SAVING A NEW TASK //////////////////////////////////////////
    socket.on('newTask', function(task) {
        database.saveNewNote(socket.request.session.user.id, task.title, task.task, 1)
            .then(task => {
                console.log('NOTE SAVED: ', task.rows[0]);
                database.getUsersProfile(task.rows[0].owner_id)
                    .then(user => {
                        let taskInfo={
                            firstLetter: (user.rows[0].first).charAt(0),
                            lastLetter: (user.rows[0].last).charAt(0),
                            created_at: task.rows[0].created_at,
                            edited_at: task.rows[0].edited_at,
                            title: task.rows[0].title,
                            category: task.rows[0].category,
                            status: task.rows[0].status,
                            color: task.rows[0].color,
                            eta: task.rows[0].eta
                        };
                        console.log('TASK INFO TO BE SENT: ', taskInfo);
                        io.sockets.emit('newTask', taskInfo);
                    })
                    .catch(err => {
                        console.log('ERR in getUsersProfile in noteSaved: ', err.message);
                    });
            })
            .catch(err => {
                console.log('ERR in saveNewNote: ', err.message);
            });
    });

}); //end of io.on!!!!!!!
