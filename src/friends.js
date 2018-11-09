import React from 'react'
import axios from './axios';
import ProfilePic from './profilePic.js';
import FriendButton from './friendButton.js';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { receiveFriendsAndWannabes, acceptFriendRequest, unfriend } from './actions.js';

function UsersList(props) {
    return (
        <div id='friends-container'>

            <h3>{props.title}</h3>
            {props.users.map(user=> (
                <div key={user.id} className='wannabe'>
                    <div>
                        <ProfilePic image={user.url} />
                    </div>
                    <div>
                        <p>{user.first} {user.last}</p>
                        <br />
                        <button className='friend-req-bttn' onClick={()=>{props.onClick(user.id);}}>{props.buttonLabel}</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

class Friends extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        !this.props.users &&
        this.props.dispatch(receiveFriendsAndWannabes())
    }
    render() {
        const { dispatch, wannabes, friends, users } = this.props;
        if(!wannabes && !friends) {
            return null;
        }
        console.log('Wannabes & friends: ', wannabes, friends);
        return (
            <div id='notFriends'>
                {!users.length && <h3>There are nor friends neither friends requests.</h3>}
                {users.length>0 &&
                <div id='users-container'>

                    {!this.props.wannabes.length && <h3 className="friends-list-title">There are no friends requests :((</h3> || <h3 className="friends-list-title">Your friends requests:</h3>}
                    <UsersList
                        users={this.props.wannabes}
                        buttonLabel='Accept friend request'
                        onClick={(userId) => dispatch(acceptFriendRequest(userId))}
                    />

                    {!this.props.friends.length && <h3 className="friends-list-title">You have no friends :((</h3> || <h3 className="friends-list-title">Your current friends:</h3>}
                    <UsersList
                        users={this.props.friends}
                        buttonLabel='End friendship'
                        onClick={(userId) => dispatch(unfriend(userId))}
                    />
                </div>
                }
            </div>
        );

    }
}

const mapStateToProps = function(state) {
    return {
        users: state.users,
        friends:
            state.users && state.users.filter(user => user.accepted),
        wannabes:
            state.users && state.users.filter(user => !user.accepted)
    };
};

export default connect(mapStateToProps)(Friends)
