import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { Link } from 'react-router-dom';

//REGSTRATION FORM
export default class Registration extends React.Component {
    constructor(props) {
        super(props);
         this.state = {
             first: '',
             last: '',
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
        axios.post('/register', {
            first: this.state.first,
            last:this.state.last,
            email: this.state.email,
            password: this.state.password,

        })
            .then(result =>{
                console.log('RESULT: ', result)
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
                console.log("Error in submit REGISTER", err.message);
            })
    }

    render() {
        return (
            <div>
                {this.state.error && <p className="error">Something went wrong! Try again</p>}
                <input name="first" placeholder="First name" onChange={this.handleChange} />
                <input name="last" placeholder="Last name" onChange={this.handleChange} />
                <br />
                <input name="email" placeholder="E-Mail address" onChange={this.handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={this.handleChange} />
                <br />
                <button className="bttn-to-space" onClick={this.handleSubmit}>Register</button>
                <br />
                <p>Already a member? <Link to="/login">Log in!</Link></p>


            </div>
            );
    }
}
