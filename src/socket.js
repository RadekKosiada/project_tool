//frontend socket code here;
import * as io from 'socket.io-client';
import {onlineUsers,
    userLeft,
    userJoined,
    singleChatMessage,
    lastChatMessages,
    newSpace,
    allUsersSpaces,
    newTask,
    allTasks,
    deletedTask,
    deletedSpace,
    allTheSpaces,
    sentAccessRequest,
    givingAccess,
    deletingAccess
} from './actions';

let socket;

export function initSocket(store) {
    if(!socket) {
        socket= io.connect();
        //function will run everytime we update online users;
        socket.on('onlineUsersMuffin', function(listOfUsers) {
            console.log('listOfUsers: ', listOfUsers);
            store.dispatch(onlineUsers(listOfUsers));
        });

        socket.on('userJoined', (userWhoJoined) => {
            store.dispatch(userJoined(userWhoJoined));
        });

        socket.on('userLeft', (userWhoLeft)=>{
            store.dispatch(userLeft(userWhoLeft));
        });

        socket.on('singleChatMessage', function(newMessage) {
            // console.log('SOCKET NEW MESSAGE: ', newMessage);
            store.dispatch(singleChatMessage(newMessage));
        });

        socket.on('lastChatMessages', function(lastMessages) {
            // console.log('SOCKET LAST MSSG: ', lastMessages);
            store.dispatch(lastChatMessages(lastMessages));
        });

        socket.on('allUsersSpaces', function(allSpaces) {
            // console.log('allSpace Socket: ', allSpaces);
            store.dispatch(allUsersSpaces(allSpaces));
        });

        socket.on('newSpace', function(newWorkspace) {
            // console.log('newSpace Socket: ', newSpace);
            store.dispatch(newSpace(newWorkspace));
        });

        socket.on('allCurrentTasks', function(allSpacesTasks) {
            // console.log('allCurrentTasks Socket: ', allSpacesTasks);
            store.dispatch(allTasks(allSpacesTasks));
        });

        socket.on('newTask', function(workTask) {
            // console.log('newTask Socket: ', workTask);
            store.dispatch(newTask(workTask));
        });
        ////// DELETING TASKS ////////////////////////////////////
        // deletingTask from index.js
        // deletedTask function from action.js
        // the argument delTask has to be different

        socket.on('deletingTask', function(delTask) {
            console.log('DELETED TASK SOCKET!!!!!!!: ', deletedTask);
            store.dispatch(deletedTask(delTask));
        });

        //// DELETING SPACES /////////////////////////////////////
        socket.on('deletingSpace', function(delSpace) {
            console.log('DELETED SPACE SOCKET!!!!!!', delSpace);
            store.dispatch(deletedSpace(delSpace));
        });

        /////ALL POSSIBLE EXISTING SPACES ////////////////////
        socket.on('AllSpacesAndOwners', function(allAvailSpaces){
            console.log('ALLTHE SPACES AVAIL:, ', allAvailSpaces);
            store.dispatch(allTheSpaces(allAvailSpaces));
        });

        //// SENDING ACCESS REQUEST ///////////////////////////////
        socket.on('sendingAccessReq', function(sentAccessReq) {
            console.log('SENT ACCESS SOCKET:', sentAccessReq);
            store.dispatch(sentAccessRequest(sentAccessReq));
        });

        /// ACCEPTING REQUEST ///////////////////////////////////
        socket.on('acceptingAccessReq', function(accessGranted) {
            // console.log('')
            store.dispatch(givingAccess(accessGranted));
        });
        ///// REJECTING ACCESS /////////////////////////////////
        socket.on('rejectingAccess', function(accessRejected) {
            store.dispatch(deletingAccess(accessRejected));
        });
    }

    return socket;
}
