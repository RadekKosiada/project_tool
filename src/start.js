import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome.js';
// import Logout from './profile.js';
import {App} from './app.js';

import { createStore, applyMiddleware } from 'redux';
import {Provider} from 'react-redux'
import reduxPromise from 'redux-promise';
import reducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

//socket stuff, the function initialized in socket.js
import {initSocket} from './socket';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

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

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//
//   render () {
//   return (
//     <div>
//        <Welcome />
//
//     </div>
//   );
// }
// };


ReactDOM.render(
    component,
    document.querySelector('main')
);
