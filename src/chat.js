import React from 'react';
import { connect } from 'react-redux';
import { initSocket } from './socket';
import ProfilePic from './profilePic';


class Chat extends React.Component{
    constructor() {
        super()
        this.sendMessage=this.sendMessage.bind(this);
    }
    //when the component updates;
    //ie when user posts a new chat message;
    componentDidUpdate(){
        // console.log('THIS', this);
        //only works if you have a srollbar
        //if you dont have it, it wont work it;
        this.elem.scrollTop=this.elem.scrollHeight - this.elem.clientHeight;
        // this.chatContainer.scrollTop=this.chatContainer.scrollHeight - this.chatContainer.clientHeight;
    }
//shift + enter lets make a new line without sending;
    sendMessage(e){
        let socket=initSocket();

        console.log('sendMessage running!!!')
        if(e.which===13){
            let message= e.target.value;
            //from the frontend to the backend;
            console.log('CHAT MESSAGE: ', message);
            socket.emit('newMessage', message);
            e.target.value = '';
        }
    }
    render(){
        let { messages} = this.props;
        console.log('chat messages: ', this.props.messages);
        if (!messages) {
            return null;
        }
        const displayMessages = (
            <div id="chat-component">
                <h3>Welcome to the chat room</h3>
                <p>Type a message and push enter</p>
                <div className="chat-messages-container"
                    ref={elem => (this.elem = elem)} >

                    {this.props.messages.map((message, idx)=> (
                        <div key={idx} className="single-message">
                            <div>
                                <ProfilePic image={message.url} />
                            </div>
                            <div>

                                <p id="chat-date">{changeDate(message.created_at)}</p>
                                <p id="chat-names">{message.first} {message.last}: <span id="chat-message">{message.message}</span></p>

                            </div>
                        </div>
                    ))}
                </div>
                <textarea className="chat-textarea" onKeyDown={this.sendMessage} />
            </div>
        )
        return (


            <div>
                {displayMessages}
            </div>

        );
    }


}

const mapStateToProps=state=> {
    return {
        messages: state.allMessagesReducer
    };
};

export default connect(mapStateToProps)(Chat)

function changeDate(date) {
    const dateFormat =  { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(date).toLocaleDateString('us-US', dateFormat);
}
