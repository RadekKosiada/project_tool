import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { initSocket } from './socket';
import { connect } from 'react-redux';

class Space extends React.Component {
    constructor(props) {
        super(props)
        this.state ={
            title: '',
            task: '',
            textareaValue: ''
        }
        this.handleChangeTitle=this.handleChangeTitle.bind(this);
        this.handleChangeTask=this.handleChangeTask.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        // this.saveTask=this.saveTask.bind(this);
    }
    componentDidMount() {
        const currentSpaceId = this.props.match.params.id;
        console.log('CURRENT SPACE ID: ', currentSpaceId);

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
            task: this.state.task
        };
        console.log('HANLDE SUBMIT FIRED: ',taskObj);
        socket.emit('newTask', taskObj);
        // this.setState({
        //     textareaValue: ''
        // });
    }
    // saveTask(e) {
    //     let socket=initSocket();
    //
    //     if(e.which===13){
    //         let taskToSave= e.target.value;
    //         //from the frontend to the backend;
    //         console.log('SAVE TASK FIRED: ', taskToSave);
    //         socket.emit('newTask', taskToSave);
    //         e.target.value = '';
    //     }
    // }

    render() {
        let {yourTasks} =this.props;
        if(!this.props.yourTasks) {
            return null
        }
        console.log('YOUR TASKS!!!!!', this.props.yourTasks[0]);
        let tasksFromCurrentSpace = this.props.yourTasks.map(task => {
            return (
                <div key={task.id} className="single-task">
                    <div className="task-infobar">
                        {/*  INITIALS*/}
                        <span className="task-initials bold">
                            {(task.first).charAt(0)}
                            {(task.last).charAt(0)}
                        </span>
                        {/*  TITLE  */}
                        <span className="task-title">
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
                </div>
            );
        });
        return (
            <div className="single-space">
                <h3 className="space-name">Your work space!</h3>
                <div className="space-nav-bar">
                    <p><span className="bold">Owner:</span> Radek</p>
                    <p><span className="bold">Name:</span> Private errands</p>
                    <p><span className="bold">Category:</span> Current</p>
                    <div className="space-color-bttns">
                        <p><span className="bold">Colors: </span></p>
                        <button className="yellow"></button>
                        <button className="green"></button>
                        <button className="blue"></button>
                        <button className="red"></button>
                    </div>
                </div>
                <div className="tasks-container">
                    <div className="tasks-saving-tool">
                        <div className="task-input">
                            <input placeholder="Label your task" onChange={this.handleChangeTitle}></input>
                            <textarea placeholder="Make a note" onChange={this.handleChangeTask}></textarea>
                        </div>
                        <button className="bttn" onClick={this.handleSubmit}>Save</button>
                    </div>
                    <div className="tasks-list">
                        {tasksFromCurrentSpace}
                    </div>


                </div>

            </div>
        );

    }
}

const mapStateToProps=state=> {
    return{
        yourTasks: state.allTasksReducer
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
    const dateFormat =  {hour: 'numeric', minute: 'numeric' };
    return new Date(date).toLocaleDateString(lang, dateFormat);
}
