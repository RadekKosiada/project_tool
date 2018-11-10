import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import Registration from './registration';
import Login from './login';
import {Logo} from './app.js';

//THE WHOLE WELCOME PAGE
export default function Welcome() {
    return (
        <div id="welcome-component">
            <h1>Welcome to<br />YOUR ONLINE WORKSPACE</h1>
            <br />
            <Logo />
            <br />
            <h3>Register and get things done!</h3>
            <br />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
