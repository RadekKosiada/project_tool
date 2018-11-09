import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';

export default class Bio extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            bioTextareaIsVisible: false,
            bio: '',
        }
        this.showTextarea=this.showTextarea.bind(this);
        this.hideTextarea=this.hideTextarea.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    showTextarea() {
        this.setState({
            bioTextareaIsVisible: true
        });
    }
    hideTextarea() {
        this.setState({
            bioTextareaIsVisible: false
        });
    }
    handleChange(e) {
        this.setState({
            bio: e.target.value
        });
        // console.log(this.state.bio);
    };
    handleSubmit() {
            axios.post('/add-bio.json', {
                bio: this.state.bio,

            })
            .then(result => {
                console.log("RESULT OF SAVING BIO: ", result);
                this.setState({
                    bioTextareaIsVisible: false,
                });
                this.props.setMuffinBio(result.data.bio)
            })
            .catch(err => {
                console.log("Error in saving bio: ", err.message);
            })
    }

    render() {
        if(this.state.bioTextareaIsVisible) {
            return (
                <div>
                    {/*<p>{this.state.bio}</p>*/}
                    <textarea id="textarea-bio"
                        onChange={this.handleChange}
                    >{this.props.cupcakeBio}</textarea>
                    <br />
                    <button className="bio-bttn" onClick={this.handleSubmit}>Save</button>
                    <button className="bio-bttn" onClick={this.hideTextarea}>Cancel</button>
                </div>
            );
        } else {
            return(
                <div>
                    <p className="displayed-bio">{this.props.cupcakeBio}</p>
                    <p><button className="bio-bttn" onClick={this.showTextarea}>
                        Edit bio</button>
                    </p>
                </div>
            )
        }
    }
}

//axios.post
//this.props.setBio(this.bio);
//similar to update profile pic
