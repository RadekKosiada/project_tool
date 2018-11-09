import React from 'react'
import axios from './axios';
import ProfilePic from './profilePic.js';
import { Link } from 'react-router-dom';
import FriendButton from './friendButton.js';



export default class Opp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    //this.props.match.params.id belongs a React;
    componentDidMount(){
        const otherUsersId=this.props.match.params.id;
        // console.log('otherUsersId:', otherUsersId, 'myId: ', this.props.id );

        axios.get('/get-other-user.json/'+ otherUsersId)
        .then(otherUser=> {
            console.log('RESULT of get other user:', otherUser.data);
            if(!otherUser.data){
                this.props.history.push('/');
                return;
            } else {
                this.setState({
                    first: otherUser.data.first,
                    last: otherUser.data.last,
                    url: otherUser.data.url,
                    bio: otherUser.data.bio
                })
            }
        })
        .catch(err=> { console.log('ERROR of get other user:', err.message);
        })
    }

    render() {
        return (


            <div className="profile-big">
                <div>
                    <ProfilePic
                        image={this.state.url}
                    />
                    <FriendButton oppId={this.props.match.params.id}/>
                </div>
                <div className="profile-menu">
                    <h3>Name: {this.state.first} {this.state.last}</h3>
                    <p className="displayed-bio">Bio: {this.state.bio}</p>

                 </div>
            </div>
        )
    }
}
