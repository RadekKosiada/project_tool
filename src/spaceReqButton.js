import React from 'react';
import { connect } from 'react-redux';
import { initSocket } from './socket';
import { receiveAccessStatus } from './actions.js';

// spaceId={space.id}
// spaceName={space.name}
// spaceOwnerId={space.owner_id}

class SpaceReqButton extends React.Component {
    constructor(props) {
        super(props)
        // this.handleRequest=this.handleRequest.bind(this);
    }

    componentDidMount(){
        console.log('PROPS: ', this.props.accessRequests);
        !this.props.accessRequests && this.props.dispatch(receiveAccessStatus())
    }

    handleRequest(spaceId){
        // console.log(spaceId);
        let socket=initSocket();
        socket.emit('sendAccessReq', spaceId);
    }

    render(){
        // console.log('props', this.props);
        let accessReqs = this.props;
        // console.log('accessReqs', accessReqs);



        return (
            <button className="all-spaces-bttn" onClick={this.handleRequest.bind(this, this.props.spaceId)}>Request access</button>
        );
    }
}
const mapStateToProps=state=> {
    return {
        accessRequests: state.reqAccessReducer
        // reqAccessStatus: state.access
    };
};

export default connect(mapStateToProps)(SpaceReqButton);
