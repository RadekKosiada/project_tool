import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { initSocket } from './socket';
import { connect } from 'react-redux';
import NewSpacePopup from './spacePopup.js';
import {Link} from 'react-router-dom';

class SpaceManager extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            newSpacePopupVisible: false,
            spaceName: '',
            spaceCategory: '',
        };
        this.showSpacePopup=this.showSpacePopup.bind(this);
        this.hideSpacePopup=this.hideSpacePopup.bind(this);
    }
    // componentDidUpdate(){
    //     console.log('THIS', this);
    //     this.elem.scrollTop=this.elem.scrollHeight - this.elem.clientHeight;
    // }
    showSpacePopup() {
        this.setState({
            newSpacePopupVisible: true
        });
    }
    hideSpacePopup() {
        this.setState({
            newSpacePopupVisible: false
        });
    }
    giveAccess(spaceId, contributor_id){
        let socket=initSocket();
        console.log('SPACE ID:', spaceId, contributor_id);
        socket.emit('giveAccess', spaceId, contributor_id);
    }

    rejectAccess(spaceId, contributor_id){
        let socket=initSocket();
        console.log('SPACE ID:', spaceId, contributor_id);
        socket.emit('rejectAccess', spaceId, contributor_id);
    }

    render() {
        let {yourSpaces, spaceInfo } = this.props;
        // console.log('PROPS: ', this.props);
        let userId = this.props.currentUserId;

        if(!this.props.yourSpaces) {
            return null;
        }
        let allSpaces = this.props.yourSpaces.map((space, idx) => {
            return (
                <div key={idx} className="single-space-bttn">
                    <Link to = {`/space/${space.id}`} className="bttn-to-space" >
                        {space.name}
                    </Link>
                </div>
            );
        });
        // console.log('space: ', spaceInfo);

        if(!this.props.spaceInfo) {
            return null;
        }
        let requestsForYou = this.props.spaceInfo.map((permission, idx) =>{

            // console.log('PERMISSION: ', permission, userId);
            if(permission.ownerId==userId && !permission.accepted){
                return (
                    <div key={idx} className="">
                        <p>User {permission.contributor_id} requested access to {permission.name}</p>
                        <button className="bttn-to-space" onClick={this.giveAccess.bind(this, permission.spaceId, permission.contributor_id)}>Grant access</button>
                        <button className="bttn-to-space" onClick={this.rejectAccess.bind(this, permission.spaceId, permission.contributor_id)}>Reject access</button>
                    </div>
                );
            }
        });

        let otherSpaces = this.props.spaceInfo.map((permission, idx) => {

            if(permission.contributor_id==userId && permission.accepted){
                return(
                    <div key={idx} className="single-space-bttn">
                        <Link to = {`/space/${permission.spaceId}`} className="bttn-to-space" >
                            {permission.name} created by user {permission.ownerId}
                        </Link>
                    </div>
                )
            }
        })
        // console.log('SPACES!!!!!!!!!!!!!!!!!!!!!!!: ',typeof  otherSpaces);
        // console.log('LOOOOPING', looping(otherSpaces));

        return (
            <div>
                {/* <h5 id="space-manager-title">Create and manage your space</h5> */}
                <button className="bttn-to-space" onClick={this.showSpacePopup}>Create a new space</button>
                <div id="all-spaces">
                    <div>
                        {!this.props.yourSpaces.length && <h5 id="space-manager-list">You have no spaces yet</h5> ||
                            <h5 id="space-manager-list">Your own spaces</h5>}
                        <div id="your-space-container">
                            {allSpaces}
                        </div>

                        {!otherSpaces.length && <h5 id="other-spaces-list">No access granted to other spaces</h5> ||
                                <h5 id="req-manager-list">You received access to:</h5>}

                        <div id="others-space-container">
                            {otherSpaces}
                        </div>

                        {/*{!requestsForYou.length && <h5 id="req-manager-list">No requests received</h5>}*/}
                        <div id="your-req-container">
                            {requestsForYou}
                        </div>




                    </div>
                </div>

                {this.state.newSpacePopupVisible &&
                    (<NewSpacePopup
                        hideSpacePopup={this.hideSpacePopup}
                    />)}
            </div>
        );
    }
}

const mapStateToProps=state=> {
    // console.log('STATE:', state);
    return {
        yourSpaces: state.allSpacesReducer,
        spaceInfo: state.allAvailSpacesReducer
    };
};

export default connect(mapStateToProps)(SpaceManager);


// function looping(arg){
//     let counter=0;
//     for(let i=0; i<arg.length; i++){
//         if(typeof arg[i] === 'object'){
//             return counter++;
//         }
//     }
// }
