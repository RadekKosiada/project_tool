import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { initSocket } from './socket';
import { connect } from 'react-redux';
import Chat from './chat.js';
import store from './store';
import {allTasks} from './actions';
import DelSpacePopup from './DelSpacePopup';

const green = 'rgb(74,125,62)';
const yellow = 'rgb(240, 216, 72)';
const blue = 'rgb(82,128,199)';
const red = 'rgb(242,58,58)';

// function to create object for each color and pass it with axios to server;
function createObj(id, clr) {
    let colorObj ={}
    return colorObj ={
        taskId: id,
        color: clr
    };
}

class Space extends React.Component {
    constructor(props) {
        super(props);
        console.log('PROPS FROM SPACE: ', props);

        this.state ={
            color: 'hello',
            title: '',
            task: '',
            textareaValue: '',
            submitFired: false,
            spaceOwner: '',
            chatOpened: false,
            classStyle: 'task-infobar',
            // classInitials: 'task-initials init-green bold',
            // styleInitials: {
            //     color: green
            // },
            // styleTaskbar: {
            //     backgroundColor: green
            // },
            delSpacePopupVisible: false,


        };
        this.handleChangeTitle=this.handleChangeTitle.bind(this);
        this.handleChangeTask=this.handleChangeTask.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.openChat=this.openChat.bind(this);
        this.hideChat=this.hideChat.bind(this);
        this.openDelSpacePopup=this.openDelSpacePopup.bind(this);
        this.hideDelSpacePopup =this.hideDelSpacePopup.bind(this);
    }
    componentDidMount() {
        const currentSpaceId = this.props.match.params.id;
        console.log('CURRENT SPACE ID: ', currentSpaceId);
        axios.get('/get-space-details/'+ currentSpaceId)
            .then(res => {
                console.log('SPACEINFO CLIENT: ', res.data);
                this.setState({
                    spaceOwner: res.data
                });
            })
            .catch(err => {
                console.log('ERR in getSpaceDetails: ', err.message);
            });
    }
    openChat(){
        this.setState({
            chatOpened: true
        });
    }
    hideChat(){
        this.setState({
            chatOpened: false
        });
        axios.post('/delete-chat')
            .then(res=> {
                console.log("YAY", res.data);
            })
            .catch(err=> {
                console.log('ERR in delete-chat', err.message);
            });
    }
    handleChangeTitle(e) {
        this.setState({
            title: e.target.value,
            // textareaValue: e.target.value
        });
    }
    handleChangeTask(e) {
        this.setState({
            task: e.target.value,
            // textareaValue: e.target.value
        });
        // console.log(e.target.value);
        console.log(this.state.task);
    }
    handleSubmit() {
        let socket=initSocket();
        let taskObj = {
            title: this.state.title,
            task: this.state.task,
            space_id: this.props.match.params.id
        };

        console.log('HANDLE SUBMIT FIRED: ',taskObj);
        socket.emit('newTask', taskObj);

        document.getElementById('spaceInput').value='';
        document.getElementById('spaceTextarea').value='';
    }

    changeToYellow(taskId){
        this.setState({
            color: 'yellow'
        }, function() {
            console.log('FIRST state color: ', this.state.color, );
        });


        console.log('SECOND state color: ', this.state.color, 'yellow', this.state.color);
        let yellowObj = createObj(taskId, this.state.color);
        console.log('YELLOW OBJ: ', yellowObj, yellow);

        axios.post('/change-to-yellow', yellowObj)
            .then(res=> {
                console.log("change-to-yellow-fired", res.data, taskId);
                store.dispatch(allTasks(res.data));
            })
            .catch(err=> {
                console.log('ERR in change-to-yellow', err.message);
            });

    }
    changeToBlue(taskId){
        this.setState({
            color: 'rgb(82,128,199)'
        });
        let blueObj = createObj(taskId, this.state.color);
        console.log('BLUE OBJ: ', blueObj, blue);

        axios.post('/change-to-blue', blueObj)
            .then(res=> {
                console.log("change-to-blue-fired", res.data, taskId);
                store.dispatch(allTasks(res.data));
            })
            .catch(err=> {
                console.log('ERR in change-to-blue', err.message);
            });
    }
    changeToRed(taskId){
        this.setState({
            color: 'rgb(242,58,58)'
        });
        let redObj = createObj(taskId, this.state.color);
        console.log('RED OBJ: ', redObj, red);
        axios.post('/change-to-red', redObj)
            .then(res=> {
                console.log("change-to-red-fired", res.data, taskId);
                store.dispatch(allTasks(res.data));
            })
            .catch(err=> {
                console.log('ERR in change-to-red', err.message);
            });
    }
    changeToGreen(taskId){
        this.setState({
            color: 'rgb(74,125,62)'
        });
        let greenObj = createObj(taskId, this.state.color);
        console.log('GREEN  OBJ: ', greenObj, green);
        axios.post('/change-to-green', greenObj)
            .then(res=> {
                console.log("change-to-green-fired", res.data, taskId);
                store.dispatch(allTasks(res.data));
            })
            .catch(err=> {
                console.log('ERR in change-to-green', err.message);
            });
    }

    deleteTask(taskId){
        let socket=initSocket();
        console.log(taskId);
        socket.emit('deleteSingleTask', taskId);
    }

    openDelSpacePopup(){
        this.setState({
            delSpacePopupVisible: true
        });
    }

    hideDelSpacePopup(){
        console.log('hideDelSpacePopup fired!!!!')
        this.setState({
            delSpacePopupVisible: false
        });
    }

    render() {
        let spaceId = this.props.match.params.id;

        let {yourTasks} =this.props;
        if(!this.props.yourTasks) {
            return null
        }
        // filter tasks only for this particular space!!!
        var tasksArr=[];
        for(var i=0; i<yourTasks.length; i++) {
            if(yourTasks[i].space_id == spaceId){
                tasksArr.push(yourTasks[i])
            }
        }
        // console.log('YOUR TASKS ARRAY!!!!!', tasksArr);
        console.log('STATE!!!!!!!', this.state);
        let tasksFromCurrentSpace = tasksArr.map(task => {
            return (
                <div key={task.id} className="single-task">
                    <div className="task-infobar" style={this.state.styleTaskbar}>
                        {/*  INITIALS*/}
                        <span className="task-initials" style={this.state.styleInitials}>
                            {(task.first).charAt(0)}
                            {(task.last).charAt(0)}
                        </span>
                        {/*  TITLE  */}
                        <span className="task-title bold">
                            {task.title}
                        </span>
                        {/*  DATE   */}
                        <span className="task-date">
                            {changeDate(task.created_at)}
                        </span>
                    </div>
                    <div className="task-task">
                        {task.task}
                    </div>
                    <div className="task-toolbar">
                        <div className="task-yellow" onClick={this.changeToYellow.bind(this, task.id)}></div>
                        <div className="task-green" onClick={this.changeToGreen.bind(this, task.id)}></div>
                        <div className="task-blue" onClick={this.changeToBlue.bind(this, task.id)}></div>
                        <div className="task-red" onClick={this.changeToRed.bind(this, task.id)}></div>
                        <div className="task-delete" key={task.id} onClick={this.deleteTask.bind(this, task.id)}></div>
                    </div>
                </div>
            );
        });

        return (
            <div className="single-space">
                <h3 className="space-name"><span className="bold">Work space: </span>{this.state.spaceOwner.name}</h3>
                <div className="space-nav-bar">
                    <div className="space-info">
                        <p><span className="bold">Owner: </span>{this.state.spaceOwner.first} {this.state.spaceOwner.last}</p>
                        <p><span className="bold">Category: </span>{this.state.spaceOwner.category}</p>
                        <p><span className="space-date bold">Created at: </span>{changeDate(this.state.spaceOwner.created_at)}</p>
                    </div>
                    {/*}<p><span className="bold">ETA: </span>{this.state.spaceOwner.eta}</p>*/}
                    <div className="open-space-chat" onClick={this.openChat}></div>
                    <div className="space-color-bttns">
                        {/*}<p><span className="bold">Colors: </span></p>
                        <button className="yellow"></button>
                        <button className="green"></button>
                        <button className="blue"></button>
                        <button className="red"></button>*/}
                        <div className="space-delete" onClick={this.openDelSpacePopup}></div>
                    </div>


                </div>
                <div className="tasks-container">
                    <div className="tasks-saving-tool">
                        <div className="task-input">
                            <input id="spaceInput" placeholder="Label your task..." onChange={this.handleChangeTitle}></input>
                            <textarea id="spaceTextarea" placeholder="... and describe it" onChange={this.handleChangeTask}></textarea>
                        </div>
                        <button className="bttn-white" onClick={this.handleSubmit}>Save</button>
                    </div>
                    <div className="tasks-list">
                        {tasksFromCurrentSpace}

                    </div>

                </div>
                {this.state.chatOpened &&
                <Chat
                    hideChat={this.hideChat}
                    spaceOwner={this.state.spaceOwner.first}
                    name={this.state.spaceOwner.name}
                />}
                {this.state.delSpacePopupVisible &&
                <DelSpacePopup
                    hideDelSpacePopup ={this.hideDelSpacePopup}
                    spaceId={this.props.match.params.id}
                    deleteSpace={this.deleteSpace}
                />}
            </div>
        );

    }
}

const mapStateToProps=state=> {
    return{
        yourTasks: state.allTasksReducer,
        yourSpaces: state.allSpacesReducer

    };
};

export default connect(mapStateToProps)(Space);

let lang = '';
function getLang()
{
    if (navigator.languages != undefined)
        lang = (navigator.languages[0]).toString();
    else
        lang = (navigator.languages).toString();
}
getLang();
console.log('LANGUAGE: ', lang);

// console.log(lang);
function changeDate(date) {
    const dateFormat =  { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(date).toLocaleDateString(lang, dateFormat);
}
