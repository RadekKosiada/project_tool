import React from 'react';
import { connect } from 'react-redux';
import ProfilePic from './profilePic.js';
import SpaceReqButton from './spaceReqButton.js';



class AllSpaces extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let currentUsersId = this.props.id;
        let accessReqs=this.props;
        console.log(accessReqs);
        console.log()

        if(!this.props.allSpacesComponent) {
            return null;
        }
        let allAvailSpaces = this.props.allSpacesComponent.map((space, idx) => {
            console.log('single space: ', space);

            console.log('CURR USER ID: ', space.owner_id);
            console.log('OTHER ID: ', this.props);
            return (
                <div key={ idx } className="all-spaces-single">
                    <div>
                        <ProfilePic image={space.url} />
                    </div>
                    <div>
                        <p className="all-spaces-user">Owner: {space.first} {space.last}</p>
                        <p className="all-spaces-name"> Space: <span className="bold">{space.name}</span></p>

                        {space.owner_id !== currentUsersId &&
                            <SpaceReqButton
                                spaceId={space.id}
                                spaceName={space.name}
                                spaceOwnerId={space.owner_id}
                                userOnlineId={currentUsersId}
                            /> || ''}

                        {/*<button className="all-spaces-bttn" onClick={this.handleRequest}>Request access</button>*/}
                    </div>
                </div>
            );
        });

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
        // accessRequests: state.reqAccessReducer,
        reqAccessStatus: state.access
    };
};


export default connect(mapStateToProps)(AllSpaces);
