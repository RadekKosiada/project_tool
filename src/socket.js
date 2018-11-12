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
        deletingTask
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
            console.log('allCurrentTasks Socket: ', allSpacesTasks);
            store.dispatch(allTasks(allSpacesTasks));
        });

        socket.on('newTask', function(workTask) {
            console.log('newTask Socket: ', workTask);
            store.dispatch(newTask(workTask));
        });

        socket.on('deletingTask', function(deletedTask) {
            console.log('DELETED TASK!!!!!!!: ',deletedTask);
            store.dispatch(deletingTask(deletedTask));
        });
    }

    return socket;
}
