//frontend socket code here;
import * as io from 'socket.io-client';
import {onlineUsers, userLeft, userJoined, singleChatMessage, lastChatMessages } from './actions';
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

        //this is where we will listen for socket events;
        //ie wher you wil write your socket frontend code;

        // socket.on('userOnline', (userWhosOnline) => {
        //     store.dispatch(userOnline(userWhosOnline));
        // });
        //

        //
        // socket.on('userLeft', (userWhoLeft) => {
        //     store.dispatch(userLeft(userWhoLeft));
        // });
    }

    return socket;
}