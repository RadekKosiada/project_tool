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
                    <ProfilePic image={user.url} />

                    <p>{user.first} {user.last}</p>
                </div>
            );
        });

        // console.log('newUser: ', this.props);
        // if(!this.props.newUserOnlineComponent) {
        //     return null;
        // }
        // let newUser = this.props.newUserOnlineComponent.map(user => {
        //     console.log('new user: ', user);
        //     return(
        //         <div key={ user.id }>
        //             {!user.url ? (
        //                 <img className='pic-friends-list' src='/imgs/default_bolek.png' />
        //             ) : (
        //                 <img className='pic-friends-list' src={user.url} />
        //             )}
        //             <p>{user.first} {user.last}</p>
        //         </div>
        //     );
        // });
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
