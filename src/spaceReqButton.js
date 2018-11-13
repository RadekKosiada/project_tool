import React from 'react';
import { connect } from 'react-redux';
import ProfilePic from './profilePic.js';

export default class SpaceReqButton extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){
        return (
            <button className="all-spaces-bttn" onClick={this.handleRequest}>Request access</button>
        )
    }
}
