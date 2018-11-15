import axios from './axios';

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get('/get-all-friends.json');
    return {
        type: 'RECEIVE_USERS',
        users: data
    };
}

export async function acceptFriendRequest(id) {
    const { data } = await axios.post('/acceptFRequest.json', { id });
    return {
        type: 'ACCEPT_REQUEST',
        status: id
    };
}

export async function unfriend(id) {
    const { data } = await axios.post('/endFriendship.json', { id });
    return {
        type: 'END_FRIENDSHIP',
        status: id
    };
}

//the same 2 when user joined and left
export function onlineUsers(listOfUsers) {
    // console.log("onlineUsers function fired!", listOfUsers);
    return {
        type: 'USERS_ONLINE',
        listOfUsers
    };
}

export function userJoined(newUserOnline) {
    // console.log('userJoined fired!', newUserOnline);
    return {
        type: 'USER_JOINED',
        newUserOnline
    }
}

export function userLeft(userWentOff) {
    // console.log('userLeft fired!', userWentOff);
    return{
        type: 'USER_LEFT',
        userWentOff
    }
}

export function singleChatMessage(newMessageAction) {
    // console.log('newMessageAction: ', newMessageAction);
    return {
        type: 'CHAT_MESSAGE',
        newMessageAction
    }
}

export function lastChatMessages(lastMessagesAction) {
    // console.log('lastMessagesAction: ', lastMessagesAction);
    return {
        type: 'LAST_MESSAGES',
        lastMessagesAction
    };
}

export function allUsersSpaces(allSpacesAction) {
    // console.log('allSpacesAction: ', allSpacesAction);
    return {
        type: 'ALL_SPACES',
        allSpacesAction
    };
}

export function newSpace(newSpaceAction) {
    // console.log('newSpaceAction: ', newSpaceAction);
    return {
        type: 'NEW_SPACE',
        newSpaceAction
    };
}

export function allTasks(allTasksAction) {
    // console.log('allTasks ACTION: ', allTasksAction);
    return {
        type: 'ALL_TASKS',
        allTasksAction
    };
}

export function newTask(newTaskAction) {
    // console.log('newTaskAction: ', newTaskAction);
    return {
        type: 'NEW_TASK',
        newTaskAction
    };
}

export function deletedTask(delTaskAction) {
    // console.log('delTaskAction: ', delTaskAction);
    return {
        type: 'DELETE_TASK',
        delTaskAction
    };
}

export function deletedSpace(delSpaceAction) {
    // console.log('Del Space Action: ', delSpaceAction);
    return {
        type: 'DELETE_SPACE',
        delSpaceAction
    };
}

export function allTheSpaces(allAvailSpacesAction) {
    // console.log('ALL AVAIL SPACES: ', allAvailSpacesAction);
    return{
        type: 'ALL_AVAIL_SPACES',
        allAvailSpacesAction
    };
}

export async function receiveAccessStatus() {
    const { data } = await axios.get('/get-access-status.json');
    return {
        type: 'SPACE_ACCESS_STATUS',
        access: data
    };
}

export function sentAccessRequest(accessReqAction) {
    console.log('ACCESS SENT ACTION: ', accessReqAction);
    return {
        type: 'REQ_ACCESS_SENT',
        accessReqAction
    };
}

export function givingAccess(giveAccessAction) {
    console.log('ACCESS GRANTED ACTION: ', giveAccessAction);
    return {
        type: 'ACCESS_GIVEN',
        giveAccessAction
    };
}

export function deletingAccess(delAccessAction) {
    console.log('ACCESS REJECTED ACTION: ', delAccessAction);
    return {
        type: 'ACCESS_DELETED',
        delAccessAction
    };
}
