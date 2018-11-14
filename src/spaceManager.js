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

    render() {
        let {yourSpaces, accessRequests, spaceInfo } = this.props;
        console.log('PROPS: ', this.props);

        if(!this.props.yourSpaces) {
            return null;
        }
        let allSpaces = this.props.yourSpaces.map((space, idx) => {
            return (
                <div key={idx} className="single-space-bttn">
                    <Link to = {`/space/${space.id}`} className="bttn-white" >
                        {space.name}
                    </Link>
                </div>
            );
        });
        console.log('space: ', allSpaces);

        if(!this.props.spaceInfo) {
            return null;
        }
        let requestsForYou = this.props.spaceInfo.map((permission, idx) =>{
            let userId = this.props.currentUserId;

            console.log('PERMISSION: ', permission, userId);
            if(permission.ownerId==userId && permission.accepted==false){
                return (
                    <div key={idx} className="single-space-bttn">
                        <button className="bttn-white">Access request for {permission.name}</button>
                    </div>
                );
            }
        });

        return (
            <div>
                {/* <h5 id="space-manager-title">Create and manage your space</h5> */}
                <button className="bttn-white" onClick={this.showSpacePopup}>Create a new space</button>
                <div id="all-spaces">
                    <div>
                        {!this.props.yourSpaces.length && <h5 id="space-manager-list">You have no spaces yet</h5> ||
                            <h5 id="space-manager-list">Your own spaces</h5>}

                        <div id="your-space-container">
                            {allSpaces}
                        </div>

                        {!this.props.spaceInfo.length && <h5 id="req-manager-list">No requests received</h5> ||
                            <h5 id="req-manager-list">Access requests to your space: </h5>}
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
    console.log('STATE:', state);
    return {
        yourSpaces: state.allSpacesReducer,
        accessRequests: state.accessStatusReducer,
        spaceInfo: state.allAvailSpacesReducer
    };
};

export default connect(mapStateToProps)(SpaceManager)
