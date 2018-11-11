import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { initSocket } from './socket';
import { connect } from 'react-redux';
import NewSpacePopup from './spacePopup.js';

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
        //LATER APPROACH
        // let {yourSpaces} = this.props;
        // console.log('yourSpaces: ', this.props);
        // if(!this.props.spaces) {
        //     return null;
        // }
        // let allSpaces = this.props.spaces.map(space => {
        //
        //     return (
        //         <div key={space.id}>
        //             {space.name}
        //         </div>
        //     );
        // });
        // console.log('space: ', allSpaces);

        // OLD APPROACH
        // let {yourSpaces} = this.props;
        // console.log('yourSpaces: ', this.props);
        // const allYourSpaces = (
        //     <div>
        //         <h5 id="space-manager-list">Your own spaces</h5>
        //         <div id="your-space-container">
        //
        //             {this.props.yourSpaces.map(space => (
        //                 <div key={space.id} className="single-space">
        //                     <p>{space.name}</p>
        //                     <p>{space.category}</p>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        // );

        return (
            <div>
                <h5 id="space-manager-title">Create and manage your space</h5>


                <button className="bttn" onClick={this.showSpacePopup}>Create a new space</button>


                <div id="all-spaces">
                    <div>
                        <h5 id="space-manager-list">Your own spaces</h5>
                        <div id="your-space-container">
                            <a className="bttn" title="Your space" href="/space1">Your space</a>


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

export default connect(mapStateToProps)(SpaceManager)
