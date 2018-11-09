import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import Bio from './bio.js';
import ProfilePic from './profilePic.js';
import {App, Logout, Uploader } from './app.js';
import FriendButton from './friendButton.js';

export function DeletePopup(props) {

    return (
        <div className="overlay">
            <div id="delete-popup">
                <p className="close-popup" onClick={props.hideDeletePopup}>&#10006;</p>
                <h4>Do you really want to delete your profile?</h4>
                <button className="bio-bttn" onClick={props.deleteProfile}>Yes</button>
                <button className="bio-bttn" onClick={props.hideDeletePopup}>No</button>
            </div>
        </div>
    )
}

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            deletePopupVisible: false
        }
        this.showDeletePopup=this.showDeletePopup.bind(this);
        this.deleteProfile=this.deleteProfile.bind(this);
        this.hideDeletePopup=this.hideDeletePopup.bind(this);
    }
    showDeletePopup() {
        this.setState({
            deletePopupVisible: true
        });
    }
    hideDeletePopup() {
        this.setState({
            deletePopupVisible: false
        });
    }
    deleteProfile() {
        console.log("deleteProfile fired!"),
        axios.post('/deleteProfile')
            .then(response => {
                console.log('AXIOS DELETE', response);
                location.replace('/welcome');
            })
            .catch(err=> {
                console.log('ERR in AXIOS DELETE: ', err.message);
            });
        this.setState({
            deletePopupVisible: false
        });
    }

    render() {
        return (
            <div className="profile-big">
                <div>
                    <ProfilePic
                        image={this.props.image}
                        first={this.props.muffin}
                        last={this.props.last}
                        clickHandler={this.props.clickHandler}
                    />
                </div>
                <div className="profile-menu">
                    <h3 className="profile-name">{this.props.muffin} {this.props.last}</h3>
                    <Bio
                        cupcakeBio={this.props.muffinBio}
                        setMuffinBio={this.props.setBio}
                    />
                    <button className="bio-bttn"
                        onClick={this.showDeletePopup}>Delete profile</button>
                    {this.state.deletePopupVisible &&
                            (<DeletePopup
                                hideDeletePopup={this.hideDeletePopup}
                                deleteProfile={this.deleteProfile}
                            />)}
                </div>
            </div>
        );
    }
}
