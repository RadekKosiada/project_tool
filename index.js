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
const io = require('socket.io')(server, { origins: 'localhost:8080 online-workspace.herokuapp.com:*' });
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

// app.post('/upload',  uploader.single('file'), s3.upload, (req, res) =>{
//     console.log('REQ FILE NAME: ', req.file.filename);
// });

// single as we upload a signle file;
// 'file' the same string as in the formData.append

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    console.log('REQ FILE NAME: ', req.file.filename);
    const imgUrl = s3Url + req.file.filename;
    console.log('IMG URL: ', imgUrl);
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
        console.log('SESSION AFTER DEL: ', req.session);
        req.session = null;
        res.json(null);
        //location.replace in client
    })
        .catch(err=> {
            console.log('ERR IN DEL PROFILE: ', err.message);
            res.sendStatus(500);
        });
});

///// DELETING CHAT //////////////////////////////////////////////////
app.post('/delete-chat', (req, res) => {
    database.deletingChat()
        .then(result=>{
            console.log('DELETING CHAT: ', result.rows);
            res.json(null);
        })
        .catch(err => {
            console.log('ERR in DELETING CHAT: ', err.message);
        });
})


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
        });
});


// ////// GETTING AN ACCESS REQUEST /////////////////////////
// app.get('/get-access-status.json', (req, res)=> {
//     database.getAllSpaces()
//         .then(allSpaces => {
//             // console.log('ALL SPACES !!!!!!: ', allSpaces.rows);
//             let spaceIds=[];
//             for(let i=0; i<allSpaces.rows.length; i++){
//                 spaceIds.push(allSpaces.rows[i].id);
//             }
//             // console.log('ALL SPACES IDS !!!!!!: ', spaceIds);
//
//             database.getAccessStatus(req.session.user.id, spaceIds)
//                 .then(accessStatus => {
//
//                     for (let a=0; a<accessStatus.rows.length; a++) {
//                         console.log('RES OF ACCESS STAT: ', accessStatus.rows[a].accepted);
//                         if(typeof accessStatus.rows[a].accepted=='undefined') {
//                             res.json('Request access');
//                         } else if(accessStatus.rows[a].accepted== false) {
//                             res.json('Request pending');
//                         } else if (accessStatus.rows[a].accepted ==true) {
//                             console.log('YAAAAAAAAAAAY!!!!!!!!')
//                             res.json(`Access granted`)
//                         }
//                     }
//                     // res.json(accessStatus.rows);
//                 })
//                 .catch(err=> {
//                     console.log('ERR IN getAccessStatus: ', err.message);
//                 })
//         })
//         .catch(err=> {
//             console.log('ERR IN getAllSpaces: ', err.message);
//         })
// })

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

///OTHER USERS PROFILE //////////////////////////////////////////////////
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

/// GETTING INFO ABOUT SPACES /////////////////////////////
app.get('/get-space-details/:id', (req, res) => {
    database.getSpaceDetails(req.params.id)
        .then(spaceInfo => {
            // console.log('SPACE INFO: ', spaceInfo.rows[0]);
            database.getUsersProfile(spaceInfo.rows[0].owner_id)
                .then(spaceOwner => {
                    // console.log('SPACE OWNER: ', spaceOwner.rows);
                    let currSpaceObj={
                        first: spaceOwner.rows[0].first,
                        last: spaceOwner.rows[0].last,
                        name:spaceInfo.rows[0].name,
                        created_at: spaceInfo.rows[0].created_at,
                        category: spaceInfo.rows[0].category,
                        color: spaceInfo.rows[0].color,
                        eta: spaceInfo.rows[0].eta,
                    };
                    console.log('SPACE INFO: ', currSpaceObj);
                    res.json(currSpaceObj);
                })
                .catch(err=>{
                    console.log('ERR IN SPACE OWNER INFO: ', err.message);
                })
        })
        .catch(err=> {
            console.log('ERR in getSpaceDetails: ', err.message);
        })
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
    console.log('SESSION!!!!', req.session);
    if(req.session.user) {
        res.redirect('/')
    } else {
        res.sendFile(__dirname + '/index.html');
    }
})

app.post('/create-space', (req, res) => {
    console.log('SPACE OBJ: ', req.body.name, req.body.category);
    database.saveNewSpace(req.session.user.id, req.body.name, req.body.category)
        .then(space => {
            console.log('SPACE SAVED: ', space.rows[0].owner_id);
            database.getUsersProfile(space.rows[0].owner_id)
                .then(user => {
                    let spaceInfo={
                        first: user.rows[0].first,
                        last: user.rows[0].last,
                        url: user.rows[0].url,
                        id: space.rows[0].id,
                        created_at: space.rows[0].created_at,
                        name: space.rows[0].name,
                        category: space.rows[0].category,
                        status: space.rows[0].status,
                        color: space.rows[0].color,
                        eta: space.rows[0].eta
                    };
                    // console.log('SPACE INFO TO BE SENT: ', spaceInfo);
                    res.json(spaceInfo);
                })
                .catch(err => {
                    console.log('ERR in getUsersProfile: ', err.message);
                });
        });
});

app.post('/change-to-yellow', (req, res) => {
    console.log('yellowObj: ', req.body.color, req.body.taskId);
    database.changeToYellow(req.body.color, req.body.taskId)
        .then(result => {
            console.log('RES of changeToYellow!!!!! ', result.data);
        })
        .catch(err=> {
            console.log('ERR IN changeToYellow: ', err.message);
        });
});

// star route handles everything;
app.get('*', function(req, res) {
    if(!req.session.user) {
        res.redirect('/welcome');

    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

//not app anymore, so we can also listen to socket, too
server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});

//socket io server side code -------------------//////////////////////////

let onlineUsers=[];

io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    //socket.request.session.user.id to get user's id!!!!
    console.log('SOCKET REQ SESSION', socket.request.session);

    //list of everyone who's currently online;
    onlineUsers.push({
        userId: socket.request.session.user.id,
        socketId: socket.id
    });
    console.log('ONLINE USERS!!!!!!!!!!!!!!!!!!!!!!!!!', onlineUsers)
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
            // console.log('All SPACES: ', allSpaces.rows[0].id);
            socket.emit('allUsersSpaces', allSpaces.rows);
        })
        .catch(err => {
            console.log('ERR in getAllUsersSpaces: ', err.message);
        });
///////////////////////////////////////////////////////////////

///// ALL POSSIBLE EXISTING SPACES ////////////////////////////

///////////////////////////////////////////////////////////////

    database.getAllSpaces()
        .then(allTheSpaces =>{
            // console.log('All SPACES !!!!!: ', allTheSpaces.rows);
            let usersArr=[];
            for(let i=0; i<allTheSpaces.rows.length; i++) {
                usersArr.push(allTheSpaces.rows[i].owner_id);
            }
            let ownersIds=[...new Set(usersArr)];
            let spaceIdsArr=[];
            for(let i=0; i<allTheSpaces.rows.length; i++){
                spaceIdsArr.push(allTheSpaces.rows[i].id);
            }
            // console.log('OWNERS ARR: ', ownersIds);
            database.getAllSpacesAndOwners(ownersIds)
                .then(ownersAndSpaces =>{
                    // console.log('OWNERS & SPACE!!!!!! ', ownersAndSpaces.rows[2]);
                    // console.log('HEYYYY', ownersAndSpaces.rows);
                    database.getAccessStatus(socket.request.session.user.id, spaceIdsArr)
                        .then(access=> {
                            // console.log('RES ALL SPACES & OWNERS: ', ownersAndSpaces.rows);
                            // console.log('RES get Access Status', access.rows);
                            for(let s=0; s<ownersAndSpaces.rows.length; s++){
                                for(let a=0; a<access.rows.length; a++){
                                    if(ownersAndSpaces.rows[s].id ==access.rows[a].space_id) {
                                        ownersAndSpaces.rows[s].permissionId=access.rows[a].id;
                                        ownersAndSpaces.rows[s].ownerId=access.rows[a].owner_id;
                                        ownersAndSpaces.rows[s].spaceId=access.rows[a].space_id;
                                        ownersAndSpaces.rows[s].spaceName=access.rows[a].name;
                                        ownersAndSpaces.rows[s].contributor_id=access.rows[a].contributor_id;
                                        ownersAndSpaces.rows[s].accepted=access.rows[a].accepted;
                                    }
                                }
                            }
                            // console.log('BIG FAT OBJECT!!!!!!!!', ownersAndSpaces.rows);

                            socket.emit('AllSpacesAndOwners', ownersAndSpaces.rows);
                            // socket.emit('AllSpacesAndOwners', ownersSpacesAccess.rows);
                        })
                        .catch(err=> {
                            console.log('ERR in getAccessStatus: ', err.message);
                        });
                })
                .catch(err=> {
                    console.log('ERR IN getAllSpacesAndOwners: ', err.message);
                });
        })
        .catch(err => {
            console.log('ERR in allTheSpaces: ', err.message);
        });

// ALL PERMISSIONS /////////////////////////////////////////////

//// TASKS: ALL USER'S TASKS  //////////////////////
    database.getAllTasks()
        .then(allTasks =>{
            // console.log('All TASKS: ', allTasks.rows);
            socket.emit('allCurrentTasks', allTasks.rows);
        })
        .catch(err => {
            console.log('ERR in getAllTasks: ', err.message);
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

    //SAVING A NEW TASK //////////////////////////////////////////
    socket.on('newTask', function(task) {
        database.saveNewTask(socket.request.session.user.id, task.title, task.task, task.space_id)
            .then(task => {
                console.log('NOTE SAVED: ', task.rows[0]);
                database.getUsersProfile(task.rows[0].owner_id)
                    .then(user => {
                        let taskInfo={
                            first: user.rows[0].first,
                            last: user.rows[0].last,
                            id: task.rows[0].id,
                            created_at: task.rows[0].created_at,
                            edited_at: task.rows[0].edited_at,
                            space_id: task.rows[0].space_id,
                            title: task.rows[0].title,
                            task: task.rows[0].task,
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
                io.sockets.emit('newTaskCreationError', task);
                console.log('ERR in saveNewNote: ', err.message);
            });
    });

    /// SENDING AN ACCESS REQUEST //////////////////////////////////
    socket.on('sendAccessReq',function(spaceId){
        database.getSpaceDetails(spaceId)
            .then(res => {
                console.log('spaceDetails from sendAccessReq: ', res.rows);
                database.sendAccessReq(spaceId, res.rows[0].owner_id, socket.request.session.user.id)
                    .then(result => {
                        console.log('RES of sendAccessReq: ', result.rows[0]);
                        // let accessObj = {
                        //     requester: socket.request.session.user.id,
                        //     id: result.rows[0].id,
                        //     owner_id: result.rows[0].owner_id,
                        //     created_at: result.rows[0].created_at,
                        //     name: result.rows[0].name,
                        //     category: result.rows[0].category
                        // }
                        socket.emit('sendingAccessReq', result.rows[0])
                    })
                    .catch(err => {
                        console.log('ERR in sendAccessReq: ', err.message);
                    });
            })
            .catch(err=> {
                console.log('ERR in spaceDetails from sendAccessReq: ', err.message);
            });
    });

    ///// GIVING ACCESS //////////////////////////////////////////////
    socket.on('giveAccess', function(spaceId, contributor_id) {
        database.giveAccess(spaceId, contributor_id)
            .then(result =>{
                console.log('RESULT of giveAccess', result.rows[0]);
                socket.emit('givingAccess', result.rows[0]);
                // onlineUsers.push({
                //     userId: socket.request.session.user.id,
                //     socketId: socket.id
                // });
                // console.log('ONLINE USERS!!!!!!!GIVING ACESS', onlineUsers);
            })
            .catch(err => {
                console.log('ERR in giveAccess: ', err);
            });
    });

//io.sockets.sockets[socketId].emit

    /// REJECTING ACCESS ///////////////////////////////////////////
    socket.on('rejectAccess', function(spaceId, contributor_id) {
        database.rejectAccess(spaceId, contributor_id)
            .then(result =>{
                console.log('RESULT of rejectAccess', result.rows);
                // passing id of permission from permission table to redux
                socket.emit('rejectingAccess', result.rows[0].id);
            })
            .catch(err => {
                console.log('ERR in rejectAccess: ', err);
            });
    });
    //// DELETING SINGLE TASK ////////////////////////////////////
    socket.on('deleteSingleTask', function(taskId) {
        database.deleteSingleTask(taskId)
            .then(result => {
                // console.log('RES OF DEL 1 TASK: ', result.rows);
                socket.emit('deletingTask', taskId);
            })
            .catch(err=> {
                console.log('ERR in deleteSingleTask', err);
            });
    });

    ///// DELETING SINGLE SPACE AND ALL THE TASKS INSIDE ///////////////
    socket.on('deleteSingleSpace', function(spaceId) {
        database.deleteSingleSpace(spaceId)
            .then(result=> {
                // console.log('RES OF DEL SPACE: ', result.rows);
                socket.emit('deletingSpace', spaceId);
                // let destination = '/';
                // client.emit('redirect', destination);
                //client-side;
                // props.history.push()

            })
            .catch(err=> {
                console.log('ERR in deleteSingleSpace', err.message);
            });
    });

}); //end of io.on!!!!!!!
