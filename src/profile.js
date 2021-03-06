import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import Bio from './bio.js';
import ProfilePic from './profilePic.js';
import {App, Logout, Uploader } from './app.js';
import FriendButton from './friendButton.js';
import SpaceManager from './SpaceManager.js';
import NewSpacePopup from './spacePopup.js';
import { connect } from 'react-redux';

// console.log('space manager', SpaceManager);

function DeletePopup(props) {
    return (
        <div className="overlay">
            <div id="delete-popup">
                <p className="close-del-popup" onClick={props.hideDeletePopup}>&#10006;</p>
                <h4>Do you really want to delete your profile?</h4>
                <p>It will delete all the spaces with your and your friends' input as well as your contribution to spaces of your friends.</p>
                <button className="bttn-to-space" onClick={props.deleteProfile}>Yes</button>
                <button className="bttn-to-space" onClick={props.hideDeletePopup}>No</button>
            </div>
        </div>
    )
}

class Profile extends React.Component {
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
        // location.replace('/welcome');
    }

    render() {
        return (
            <div className="profile-big">
                <div>
                    <ProfilePic
                        image={this.props.image}
                        firstLetter={this.props.firstLetter}
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

                    <SpaceManager currentUserId={this.props.id}/>

                    <br />
                    <button className="bttn-to-space delete"
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

const mapStateToProps=state=> {
    return {
        accessRequests: state.accessStatusReducer
        // reqAccessStatus: state.access
    };
};

export default connect(mapStateToProps)(Profile);
