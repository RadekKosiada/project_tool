import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome.js';
// import Logout from './profile.js';
import {App} from './app.js';

import {Provider} from 'react-redux';

import store from './store';
//socket stuff, the function initialized in socket.js
import {initSocket} from './socket';


// import './style.css';

let component;

if(location.pathname=== '/welcome'){
    component= <Welcome />
} else {
    console.log("else running!");
    //we pass redux store into socket
    component = (initSocket(store),
    (
        <Provider store={store}>
            <App />
        </Provider>
    )
    );
}


ReactDOM.render(
    component,
    document.querySelector('main')
);
