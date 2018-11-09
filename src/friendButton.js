import React from 'react'
import axios from './axios';
import { Link } from 'react-router-dom';

// 0 not sent
// 1 sent
// 2 pending
// 3 accepted
// 4 received
// 5 cancelled

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            status: '',
            // notSent: 'Send friend request',
            // sent: 'Cancel friend request',
            // received: 'Accept friend request',
            // pending: 'Friend request sent',
            // accepted: 'End friendship',
            // cancelled: 'Send friend request'
        }
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    componentDidMount(){
        let friendsId = this.props.oppId;
        console.log('POTENTIAL FRIEND`s ID', friendsId!==undefined);

            axios.get('/friendship.status.json/'+ friendsId)
            .then(friendshipStatus=> {
                console.log('FRIENDSHIP STATUS: ', friendshipStatus.data);
                    this.setState({
                        status: friendshipStatus.data
                    })
                })
            .catch(err=> {
                console.log('ERROR IN FRIEND STATUS: ', err.message);
            })
    }

    handleSubmit() {
        if(this.state.status == 'Send friend request') {
            axios.post('/sendFRequest.json', {
                id: this.props.oppId
            }).then(friendshipStatus => {
                console.log('RESULT sendFRequest: ', friendshipStatus);
                this.setState({
                    status: friendshipStatus.data
                })
            }).catch(err => {
                console.log('ERR in sendFRequest: ', err.message);
            })

        } else if(this.state.status == 'Cancel my friend request') {
            axios.post('/cancelFRequest.json', {
                id: this.props.oppId
            }).then(friendshipStatus => {
                console.log('RESULT cancelFRequest: ', friendshipStatus);
                this.setState({
                    status: friendshipStatus.data
                })
            }).catch(err => {
                console.log('ERR in cancelFRequest: ', err.message);
            })
        } else if(this.state.status == 'Accept friend request'){
            axios.post('/acceptFRequest.json', {
                id: this.props.oppId
            }).then(friendshipStatus => {
                console.log('RESULT acceptFRequest: ', friendshipStatus);
                this.setState({
                    status: friendshipStatus.data
                })
            }).catch(err => {
                console.log('ERR in acceptFRequest: ', err.message);
            })
        }else if(this.state.status == 'End friendship') {
            axios.post('/endFriendship.json', {
                id: this.props.oppId
            }).then(endOfFriendship => {
                console.log('RESULT endFriendship: ', endOfFriendship);
                this.setState({
                    status: endOfFriendship.data
                })
            }).catch(err=> {
                console.log('ERR in endOfFriendship: ', err.message);
            })
        }
    }
    render() {
        return (
            <button className="friend-req-bttn" onClick={this.handleSubmit} >{this.state.status}</button>
        )
    }

}
