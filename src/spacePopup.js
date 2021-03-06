import React from 'react';
import axios from './axios';
import {newSpace} from './actions';
import store from './store';

export default class NewSpacePopup extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            name: '',
            category: '',
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleChangeName(e) {
        this.setState({
            name:e.target.value
        });
        // console.log('space name:', this.state.name);
    }
    handleChangeCategory(e){
        this.setState({
            category:e.target.value
        });
        // console.log('space category:', this.state.category);
    }
    handleSubmit(){

        let spaceObj= {
            name: this.state.name,
            category: this.state.category
        };
        console.log(spaceObj);
        axios.post('/create-space', spaceObj)
            .then(function (response){
                store.dispatch(newSpace(response.data));
            })
            .catch(function(err) {
                alert(err.message);
            });

        this.props.hideSpacePopup();
    }
    render() {
        return (
            <div className="overlay">
                <div id="space-popup">
                    <p className="space-close-popup" onClick={this.props.hideSpacePopup}>&#10006;</p>
                    <p>Fill the following fields:</p>
                    <input
                        className="space-input"
                        onChange={this.handleChangeName}
                        placeholder="Your new space's name"
                    />
                    <br />
                    <input
                        className="space-input"
                        onChange={this.handleChangeCategory}
                        placeholder="Set a category"
                    />
                    <br />
                    <button className="bttn"
                        onClick={this.handleSubmit}
                    >Save</button>
                    <button className="bttn" onClick={this.props.hideSpacePopup}>Cancel</button>
                </div>
            </div>
        );
    }
}
