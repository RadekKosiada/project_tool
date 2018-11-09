import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import Registration from './registration';
import Login from './login';

//THE WHOLE WELCOME PAGE
export default function Welcome() {
    return (
        <div id="welcome-component">
            <h1>Welcome to</h1>
            <br />
            <h1 id="logo-big">SOCIETY</h1>
            <br />
            <h3>Join our community!</h3>
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
