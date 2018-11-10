import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';

export class NewSpacePopup extends React.Component {
    constructor(props) {
        super(props);
        this.state={};

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleChangeName() {
        console.log("yey");
    }
    handleChangeCategory(){
        console.log("YUPPI!");
    }
    handleSubmit(){
        console.log("YEAYE!");
    }

    render() {
        return (
            <div className="overlay">
                <div id="space-popup">
                    <p className="close-popup" onClick={this.props.hideSpacePopup}>&#10006;</p>
                    <input
                        className="space-input"
                        onChange={this.handleChangeName}
                        placeholder="Your new space's name"
                    />
                    <input
                        className="space-input"
                        onChange={this.handleChangeCategory}
                        placeholder="Set a category"
                    />
                    <button className="bttn" onClick={this.handleSubmit}>Save</button>
                    <button className="bttn" onClick={this.props.hideSpacePopup}>Cancel</button>
                </div>
            </div>
        );
    }
}

export class SpaceManager extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            newSpacePopupVisible: false,
            spaceName: '',
            spaceCategory: '',
        };
        this.showSpacePopup=this.showSpacePopup.bind(this);
        this.hideSpacePopup=this.hideSpacePopup.bind(this);
    }
    showSpacePopup() {
        this.setState({
            newSpacePopupVisible: true
        });
    }
    hideSpacePopup() {
        this.setState({
            newSpacePopupVisible: false
        });
    }

    render() {
        return (
            <div>
                <h5 id="space-manager-title">Create and manage your space</h5>
                <a className="bttn" title="Your space" href="/space1">Your space</a>

                <button className="bttn" onClick={this.showSpacePopup}>Create a new space</button>


                {this.state.newSpacePopupVisible &&
                    (<NewSpacePopup
                        hideSpacePopup={this.hideSpacePopup}
                    />)}
            </div>
        );
    }
}
