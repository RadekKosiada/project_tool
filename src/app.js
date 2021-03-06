import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import Profile from './profile.js';
import {BrowserRouter, Route, Link } from 'react-router-dom';
import ProfilePic from './profilePic.js';
import Opp from './opp.js';
import Friends from './friends.js';
import FriendsOnline from './FriendsOnline.js';
import Chat from './chat.js';
import Space from './space.js';
import AllSpaces from './allSpaces.js';
// import Navbar from './navbar.js';

// import { createStore, applyMiddleware } from 'redux';
// import reduxPromise from 'redux-promise';
// import { reducer } from './reducer';
//
// const store = createStore(reducer, applyMiddleware(reduxPromise));
//<img src={'https://via.placeholder.com/200x125'} />

///// LOGO COMPONENT ///////////////////////////////
export function Logo() {
    return (
        <div className="logo-wrapper">
            <h1 id="logo-small">Your online<br />
                <span className="hover">w</span>
                <span className="hover">o</span>
                <span className="hover">r</span>
                <span className="hover">k</span>
                <span className="hover">s</span>
                <span className="hover">p</span>
                <span className="hover">a</span>
                <span className="hover">c</span>
                <span className="hover">e</span>

            </h1>
        </div>
    );
}

////// LOG OUT BUTTON //////////////////////////////
export function Logout(props) {
    return <a className="logout-bttn" title="Log out" href='/logout'>LOGOUT</a>
    {/*return <img className="logout-bttn" src="/imgs/logout.png" />*/}
}

/////////LINK TO MY PROFILE ///////////////////////
export function LinkToProfile(props) {
    return <a className="to-my-profile-bttn" title="Your profile" href='/'>PROFILE</a>
}

///////UPLOADER ///////////////////////////////////
export function Uploader(props) {
    // var overlayHidden = true;
    function uploadImage(e) {
        console.log('clicked!', props.uploaderIsVisible);
        // overlayHidden = false;
        var file= e.target.files[0];
        //object?
        var formData = new FormData();
        formData.append('file', file);
        axios.post('/upload', formData)
            .then(response => {
                console.log('RESPONSE DATA: ', response.data.url);
                props.setImage(response.data.url);
            }).catch(function(err) {
                console.log('ERROR IN UPLOAD', err.message);
            });
    }

    return (
        <div className="overlay">
            <div id="uploader">
                <p className="close-uploader" onClick={props.hideUploader}>&#10006;</p>
                <h3>Update your picture</h3>
                <br />
                <label htmlFor="file">
                    <p>Choose a new picture from your disk</p>
                    <br />
                    <div id="bttn-uploader">Load
                        <input
                            id="file"
                            type="file"
                            accept="image/*"
                            name="file"
                            onChange={uploadImage}
                        />
                    </div>
                </label>
            </div>
        </div>
    )
}


/////////// APP CLASS COMPONENT /////////////////////////
export class App extends React.Component {
    constructor(props){
        super(props)
        this.state={
            first: '',
            last: '',
            bio: '',
            imgUrl: '',
            uploaderIsVisible: false,
        }
        this.showUploader=this.showUploader.bind(this);
        this.hideUploader=this.hideUploader.bind(this);
        this.setImage=this.setImage.bind(this);
        this.setBio=this.setBio.bind(this);
    }
    // showing text area for adding/changing profile pic
    showUploader(){
        this.setState({
            uploaderIsVisible: true
        });
    }
    hideUploader(){
        this.setState({
            uploaderIsVisible: false
        });
    }
    setBio(bio){
        console.log(bio);
        this.setState({
            bio: bio
        })
    }
    setImage(imgUrl){
        this.setState({
            url: imgUrl,
            uploaderIsVisible: false
        })
    }
    componentDidMount() {
        axios.get('/user')
            .then(usersData =>{
            // console.log(
            //     'RESULT of getUsersProfile: ', usersData.data,
            //     'IMG URL',usersData.data.url
            // );
                this.setState({
                    first: usersData.data.first,
                    firstLetter: usersData.data.first.charAt(0),
                    last: usersData.data.last,
                    id: usersData.data.id,
                    url: usersData.data.url,
                    bio: usersData.data.bio

                });
            })
            .catch(err=>{
                console.log('ERROR IN usersData:', err.message);
            });
    }
    render() {
        return (
            <div id="app-component">
                <div id="nav-bar">
                    <Logo />
                    <LinkToProfile />
                    {/*BUTTON TO SPACES*/}
                    <a className="bttn-spaces" title="Spaces" href={`/spaces/${this.state.id}`}>SPACES</a>

                    {/*BUTTON TO FRIENDS  <a className="bttn-to-friends" title="Your friends" href="/friends">FRIENDS</a>*/}
                    {/* CHAT <a className="bttn-chat" title="Chat" href="/chat">CHAT</a> */}
                    {/*ONLINE <a className="bttn-online" title="Who's online" href="/online"><span>ONLINE</span></a>*/}

                    <Logout />

                    <h3 id="name-nav-bar">{this.state.first}</h3>
                    <ProfilePic
                        image={this.state.url}
                        muffin={this.state.first}
                        firstLetter = {this.state.firstLetter}
                        last={this.state.last}
                        muffinBio={this.state.bio}
                        clickHandler={this.showUploader}
                    />
                </div>

                <BrowserRouter>
                    <div>
                        <Route exact path="/"
                            render={props => (
                                <Profile
                                    muffin={this.state.first}
                                    last={this.state.last}
                                    id={this.state.id}
                                    muffinBio={this.state.bio}
                                    image={this.state.url}
                                    setBio={this.setBio}
                                    clickHandler={this.showUploader}
                                    key={props.match.url}
                                />
                            )}
                        />

                        <Route exact path="/user/:id"
                            render={props => (
                                <Opp {...props} key={props.match.url} />
                            )}
                        />
                        <Route exact path="/friends"
                            render={props => (
                                <Friends />
                            )}
                        />
                        <Route exact path="/chat"
                            render={props => (
                                <Chat />
                            )}
                        />
                        <Route exact path={`/spaces/${this.state.id}`}
                            render={props => (
                                <AllSpaces
                                    key={props.match.url}
                                    id={this.state.id}
                                />
                            )}
                        />
                        <Route exact path="/online"
                            render={props => (<FriendsOnline />
                            )}
                        />

                        <Route exact path="/space/:id"
                            render={props => (<Space {...props}
                                // first={props.first}
                                // last={props.last}
                                // name={props.name}
                            />
                            )}
                        />


                    </div>
                </BrowserRouter>
                {this.state.uploaderIsVisible && (<Uploader setImage={this.setImage} hideUploader={this.hideUploader}/>)}

            </div>
        );
    }
}
