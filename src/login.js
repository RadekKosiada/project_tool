import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';


//LOGIN FORM
export default class Login extends React.Component {
    constructor(props) {
        super(props);
         this.state = {
             email: '',
             password: '',
             error: false
     }
         this.handleChange = this.handleChange.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleSubmit(e){
        axios.post('/login', {
            email: this.state.email,
            password: this.state.password,

        })
        .then(result =>{
            console.log("RESULT LOGIN:", result)
            if(result.data.success) {

            // if(result.data) {
                // console.log('SUCCESS: ', result.data, result.data.success);
                location.replace('/')
            } else {
                this.setState({
                    error : true
                })
            }
        })
        .catch(err => {
            console.log("Error in submit LOGIN ", err.message);
        })
    }

    render() {
        return (
            <div id="login-component">
                {this.state.error && <p className="error">Something went wrong! Try again</p>}
                <input name="email" className="input-email" placeholder="E-Mail Address" onChange={this.handleChange} />
                <br />
                <input name="password" type="password" placeholder="Password" onChange={this.handleChange} />
                <br />
                <button className="bio-bttn" onClick={this.handleSubmit}>Log in</button>
            </div>
            );
    }
}
