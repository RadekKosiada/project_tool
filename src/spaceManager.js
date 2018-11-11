import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { initSocket } from './socket';
import { connect } from 'react-redux';

export class NewSpacePopup extends React.Component {
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
        console.log('space category:', this.state.category);
    }
    handleSubmit(){
        let socket=initSocket();
        let spaceObj= {
            name: this.state.name,
            category: this.state.category
        };
        console.log(spaceObj);
        socket.emit('newSpace', spaceObj);
        // socket.emit('spaceCategory', this.state.category);
    }
    render() {
        return (
            <div className="overlay">
                <div id="space-popup">
                    <p className="close-popup" onClick={this.props.hideSpacePopup}>&#10006;</p>
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
    // componentDidUpdate(){
    //     console.log('THIS', this);
    //     this.elem.scrollTop=this.elem.scrollHeight - this.elem.clientHeight;
    // }
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
        let {yourSpaces} = this.props;
        if(!yourSpaces) {
            return null;
        }
        const allYourSpaces = (
            <div>
                <h5 id="space-manager-list">Your own spaces</h5>
                <div id="your-space-container">

                    {this.props.yourSpaces.map(space => (
                        <div key={space.id} className="single-space">
                            <p>{space.name}</p>
                            <p>{space.category}</p>
                        </div>
                    ))}
                </div>
            </div>
        );

        return (
            <div>
                <h5 id="space-manager-title">Create and manage your space</h5>
                <a className="bttn" title="Your space" href="/space1">Your space</a>

                <button className="bttn" onClick={this.showSpacePopup}>Create a new space</button>


                <div id="all-spaces">
                    <div>
                        <h5 id="space-manager-list">Your own spaces</h5>
                        <div id="your-space-container">
                            {allYourSpaces}


                        </div>
                    </div>
                </div>

                {this.state.newSpacePopupVisible &&
                    (<NewSpacePopup
                        hideSpacePopup={this.hideSpacePopup}
                    />)}
            </div>
        );
    }
}

const mapStateToProps=state=> {
    return {
        yourSpaces: state.allSpacesReducer
    };
};
// console.log('mapStateToProps: ', mapStateToProps);

export default connect(mapStateToProps)(SpaceManager)
