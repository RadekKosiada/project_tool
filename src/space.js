import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { initSocket } from './socket';
import { connect } from 'react-redux';
import Chat from './chat.js';

class Space extends React.Component {
    constructor(props) {
        super(props)
        console.log('PROPS FROM SPACE: ', props)
        this.state ={
            title: '',
            task: '',
            textareaValue: '',
            submitFired: false,
            spaceOwner: '',
            chatOpened: false,
            classStyle: 'task-infobar-green'
        };
        this.handleChangeTitle=this.handleChangeTitle.bind(this);
        this.handleChangeTask=this.handleChangeTask.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.openChat=this.openChat.bind(this);
        this.hideChat=this.hideChat.bind(this);
        this.changeToYellow=this.changeToYellow.bind(this);
        this.changeToBlue=this.changeToBlue.bind(this);
        this.changeToRed=this.changeToRed.bind(this);
        this.changeToGreen=this.changeToGreen.bind(this);
        // this.deleteSpace=this.deleteSpace.bind(this);
        // this.deleteTask=this.deleteTask.bind(this, i);
        // this.saveTask=this.saveTask.bind(this);
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

    changeToYellow(){
        this.setState({
            classStyle: 'task-infobar-yellow'
        });
    }
    changeToBlue(){
        this.setState({
            classStyle: 'task-infobar-blue'
        });
    }
    changeToRed(){
        this.setState({
            classStyle: 'task-infobar-red'
        });
    }
    changeToGreen(){
        this.setState({
            classStyle: 'task-infobar-green'
        });
    }

    deleteTask(taskId){
        let socket=initSocket();
        console.log(taskId);
        socket.emit('deleteSingleTask', taskId);
    }

    deleteSpace(spaceId) {
        let socket=initSocket();
        console.log(spaceId);
        socket.emit('deleteSingleSpace', spaceId);
        this.props.history.push()
        location.replace('/');
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
                    <div className={this.state.classStyle}>
                        {/*  INITIALS*/}
                        <span className="task-initials bold">
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
                        <div className="task-yellow" onClick={this.changeToYellow}></div>
                        <div className="task-green" onClick={this.changeToGreen}></div>
                        <div className="task-blue" onClick={this.changeToBlue}></div>
                        <div className="task-red" onClick={this.changeToRed}></div>
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
                        <div className="space-delete" onClick={this.deleteSpace.bind(this, spaceId)}></div>
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
