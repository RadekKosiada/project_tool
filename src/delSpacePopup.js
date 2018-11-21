import React from 'react';
import { initSocket } from './socket';

export default class DelSpacePopup extends React.Component{
    constructor(props){
        super(props);
    }

    deleteSpace(spaceId) {
        let socket=initSocket();
        console.log(spaceId);
        socket.emit('deleteSingleSpace', spaceId);
        // this.props.history.push();
        location.replace('/');

        // this.hideDelSpacePopup();
    }

    render(){
        return(
            <div className="overlay">
                <div id="delete-space-popup">
                    <p className="close-del-popup" onClick={this.props.hideDelSpacePopup}>&#10006;</p>
                    <h4>Do you really want to delete this space?</h4>
                    <p>It will delete all your and other contributors' input.</p>
                    <button className="bttn-to-space" onClick={this.deleteSpace.bind(this, this.props.spaceId)}>Yes</button>
                    <button className="bttn-to-space" onClick={this.props.hideDelSpacePopup}>No</button>
                </div>
            </div>
        )
    }
}
