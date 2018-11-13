import React from 'react';
import { connect } from 'react-redux';
import ProfilePic from './profilePic.js';

class FriendsOnline extends React.Component {
    constructor() {
        super();
    }

    render() {
        // console.log('usersOnlineNow: ', this.props);
        if(!this.props.onlineUsersComponent) {
            return null;
        }
        let usersOnline = this.props.onlineUsersComponent.map((user, idx) => {
            console.log('new user joined: ', user);
            return (
                <div key={ idx } className="users-online-container">
                    <ProfilePic
                        image={user.url}
                    />
                    <h5>{user.first} {user.last}</h5>
                    <p>{user.name}</p>
                </div>
            );
        });

        return (
            <div>
                <h3 id="online-users-title">Online Now: </h3>
                { usersOnline }


            </div>
        );
    }
}

const mapStateToProps=state=> {
    return {
        onlineUsersComponent: state.onlineUsersReducer,

    };
};

export default connect(mapStateToProps)(FriendsOnline);
