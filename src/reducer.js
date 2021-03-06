export default function reducer (state = {}, action) {
    if (action.type == 'RECEIVE_USERS') {
        state = Object.assign({}, state, {
            users: action.users
        });
    }
    else if (action.type == 'ACCEPT_REQUEST'){
        state = {
            ...state,
            users: state.users.map(wannabe=> {
                if(wannabe.id == action.status) {
                    return {
                        ...wannabe,
                        accepted: true
                    };
                } else {
                    return wannabe;
                }
            })
        };
    } else if (action.type == 'END_FRIENDSHIP') {
        // console.log('action', action);
        state= {
            ...state,
            users: state.users.filter(wannabe =>
                wannabe.id != action.status
            )
        };
    } else if(action.type=='USERS_ONLINE') {
        // console.log('???:' , action.listOfUsers[0].first);
        state={
            ...state,
            onlineUsersReducer: action.listOfUsers
        };
    } else if(action.type=='USER_JOINED') {
        // console.log('name of the new user: ', action);
        state={
            ...state,
            onlineUsersReducer: [ ...state.onlineUsersReducer,
                action.newUserOnline[0]]
        };
    } else if(action.type=='USER_LEFT') {
        // console.log('the user who left:', action.userWentOff[0].first);
        state={
            ...state,
            onlineUsersReducer: state.onlineUsersReducer.filter(user => {
                console.log('USER FROM REDUCER:', user);
                if(user.id != action.userWentOff) {
                    // console.log('USER FROM REDUCER from if statement:', user);
                    return user;
                }

            })

        };
    }

    // SINGLE MESSAGE ///////////////////////////////////
    else if(action.type=='CHAT_MESSAGE') {
        state= {
            ...state,
            allMessagesReducer: [...state.allMessagesReducer, action.newMessageAction]
        };
        // console.log('SINGLE MSSG in REDUCER: ', state.chatMessageReducer);
    }
    // ALL MESSAGES ///////////////////////////////////////
    else if (action.type=='LAST_MESSAGES') {
        state={
            ...state,
            allMessagesReducer: action.lastMessagesAction
        };
        // console.log('MSSGS from REDUCER: ', state.allMessagesReducer);
    }

    // ALL SPACES ///////////////////////////////////////////////
    else if(action.type == 'ALL_SPACES') {
        state = {
            ...state,
            allSpacesReducer: action.allSpacesAction
        };
        // console.log('ACTION FROM REDUCER: ', action);
    }
    // SINGLE SPACE ////////////////////////////////////////////
    else if(action.type=='NEW_SPACE') {
        state= {
            ...state,
            allSpacesReducer: [...state.allSpacesReducer, action.newSpaceAction]
        };
        // console.log('1 SPACE from REDUCER: ', state.allSpacesReducer);
    }

    // SINGLE TASK ///////////////////////////////////////////////
    else if(action.type=='NEW_TASK') {
        state={
            ...state,
            allTasksReducer: [...state.allTasksReducer, action.newTaskAction]
        };
        // console.log('1 TASK from REDUCER: ', state.newTaskReducer);
    }
    //ALL TASKS FROM THE SPACE ////////////////////////////////////
    else if(action.type=='ALL_TASKS') {
        state={
            ...state,
            allTasksReducer: action.allTasksAction
        };
        // console.log('ALL TASKS REDUCER: ', state.allTasksReducer);
    }
    else if(action.type=='DELETE_TASK') {
        state={
            ...state,
            allTasksReducer: state.allTasksReducer.filter(task =>{
                if(task.id !== action.delTaskAction) {
                    return task;
                }
            })
        };
        // console.log('TASKS AFTER DELETE: ', state.allTasksReducer);
    }
    // else if (action.type=='SPACE_ACCESS_STATUS') {
    //     state={
    //         ...state,
    //         accessStatusReducer: action.access
    //     };
    //     console.log('STATE ACCESS REDUCER: ', state.reqStatusReducer);
    // }
    else if(action.type=='DELETE_SPACE') {
        state= {
            ...state,
            allSpacesReducer: state.allSpacesReducer.filter(space => {
                if(space.id !==action.delSpaceAction) {
                    return space;
                }
            })
        };
    }
    else if(action.type=='ALL_AVAIL_SPACES') {
        state={
            ...state,
            allAvailSpacesReducer: action.allAvailSpacesAction
        };
        // console.log('ALL AVAIL SPACES: ', state.allAvailSpacesReducer);
    }

    else if (action.type=='REQ_ACCESS_SENT'){
        state={
            ...state,
            allAvailSpacesReducer: state.allAvailSpacesReducer.map(space=> {
                // console.log('ACTION: ', action)
                if(space.id == action.accessReqAction.space_id) {
                    // console.log('IF BLOCK REQ ACCESS SENT');
                    return {
                        ...space,
                        accepted: false,
                        contributor_id: action.contributor_id,
                        permissionId: action.id
                    };
                }else {
                    return space;
                }
            })

        };
        // console.log('ACCESS SENT REDUCER: ', state.allAvailSpacesReducer);
    }
    else if (action.type=='ACCESS_GIVEN') {

        state={
            ...state,
            allAvailSpacesReducer: state.allAvailSpacesReducer.map(space => {
                // console.log('ACTION ACCESS GRANTED:', action);
                if(space.id === action.giveAccessAction.space_id) {
                    console.log('IF BLOCK REQ ACCESS GIVEN');
                    return {
                        ...space,
                        accepted: true,
                        contributor_id: action.contributor_id,
                        permissionId: action.id
                    };
                }else {
                    return space;
                }
            })
        };
        console.log('ACCESS GIVEN REDUCER: ', state.allAvailSpacesReducer);
    }
    //DONE
    else if(action.type=='ACCESS_DELETED') {

        state={
            ...state,
            allAvailSpacesReducer: state.allAvailSpacesReducer.filter(permission => {
                console.log('ACTION ACCESS REJECTED:', action);
                if(permission.permissionId !== action.delAccessAction) {
                    return permission;
                }
            })
        };
        console.log('ACCESS_DELETED REDUCER: ', state.allAvailSpacesReducer);
    }

    return state;
}
