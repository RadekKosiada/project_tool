import React from 'react';
import { connect } from 'react-redux';
import ProfilePic from './profilePic.js';
// import SpaceReqButton from './spaceReqButton.js';
import { initSocket } from './socket';



class AllSpaces extends React.Component {
    constructor(props) {
        super(props);
    }

    handleRequest(spaceId){
        console.log('LOGG!!!!!!', spaceId);
        let socket=initSocket();
        socket.emit('sendAccessReq', spaceId);
    }

    render() {
        let currentUsersId = this.props.id;
        let accessReqs=this.props;
        console.log(accessReqs);

        if(!this.props.allSpacesComponent) {
            return null;
        }
        let allAvailSpaces = this.props.allSpacesComponent.map((space, idx) => {

            // console.log('single space: ', space);

            let accessButton ='';
            if(space.accepted){
                accessButton= 'Access granted';
            }else if (space.accepted===false) {
                accessButton= 'Request sent';
            } else if (typeof space.accepted=='undefined'){
                accessButton='Request access';
            }

            // console.log('CURR USER ID: ', space.owner_id);
            // console.log('OTHER ID: ', this.props);

            return (
                <div key={ idx } className="all-spaces-single">
                    <div>
                        <ProfilePic image={space.url} />
                    </div>
                    <div>
                        <p className="all-spaces-user">Owner: {space.first} {space.last}</p>
                        <p className="all-spaces-name"> Space: <span className="bold">{space.name}</span></p>

                        {space.owner_id !== currentUsersId && <button className="all-spaces-bttn" onClick={this.handleRequest.bind(this, space.id)}>{accessButton}</button> || ''}
                    </div>
                </div>
            );
        });
        // spaceId={space.id}
        // spaceName={space.name}
        // spaceOwnerId={space.owner_id}
        // userOnlineId={currentUsersId}

        return (
            <div>
                <h3 id="all-spaces">All available spaces:</h3>
                <div className="all-spaces-container">
                    {allAvailSpaces}
                </div>
            </div>
        );
    }
}

const mapStateToProps=state=> {
    return {
        allSpacesComponent: state.allAvailSpacesReducer,
        // reqAccessStatus: state.access
    };
};


export default connect(mapStateToProps)(AllSpaces);
