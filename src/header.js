// import React from 'react';
// import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
// import ProfilePic from './profilePic.js';
// import {LinkToProfile, Logout} from './app.js'
//
// export default class Header extends React.Component{
//     constructor(props) {
//         super(props)
//     }
//     render(){
//         return (
//             <div id="nav-bar">
//                 <LinkToProfile />
//                 {/*BUTTON TO SPACES*/}
//                 <a className="bttn-chat" title="Spaces" href={`/spaces/${this.state.id}`}>SPACES</a>
//                 {/*BUTTON TO FRIENDS*/}
//                 <a className="bttn-to-friends" title="Your friends" href="/friends">FRIENDS</a>
//
//                 <a className="bttn-chat" title="Chat" href="/chat">CHAT</a>
//
//                 <Logout />
//                 <a className="bttn-online" title="Who's online" href="/online"><span>ONLINE</span></a>
//
//                 <h3 id="name-nav-bar">{this.state.first}</h3>
//                 <ProfilePic
//                     image={this.state.url}
//                     muffin={this.state.first}
//                     firstLetter = {this.state.firstLetter}
//                     last={this.state.last}
//                     muffinBio={this.state.bio}
//                     clickHandler={this.showUploader}
//                 />
//             </div>
//         )
//
//     }
// }
