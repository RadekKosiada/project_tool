import React from 'react';
import { connect } from 'react-redux';
import { initSocket } from './socket';

// spaceId={space.id}
// spaceName={space.name}
// spaceOwnerId={space.owner_id}

export default class SpaceReqButton extends React.Component {
    constructor(props) {
        super(props)
        // this.handleRequest=this.handleRequest.bind(this);
    }

    handleRequest(spaceId){
        console.log(spaceId);
        let socket=initSocket();
        socket.emit('sendAccessReq', spaceId);
    }

    render(){
        return (
            <button className="all-spaces-bttn" onClick={this.handleRequest.bind(this, this.props.spaceId)}>Request access</button>
        );
    }
}
