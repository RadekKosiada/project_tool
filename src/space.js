import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';

export default class Space1 extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="single-space">
                <h3>Your work space!</h3>
                <div id="space-nav-bar">
                    <p>Space's owner: Radek</p>
                    <p>Space's Name: Project Tool</p>
                    <p>Category: current</p>
                    <p>Colors: green, blue, orange, red </p>
                </div>

            </div>
        );

    }
}
