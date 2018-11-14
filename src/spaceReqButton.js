// import React from 'react';
// import { connect } from 'react-redux';
// import { initSocket } from './socket';
// import { receiveAccessStatus } from './actions.js';
//
// // spaceId={space.id}
// // spaceName={space.name}
// // spaceOwnerId={space.owner_id}
//
// class SpaceReqButton extends React.Component {
//     constructor(props) {
//         super(props)
//         // this.handleRequest=this.handleRequest.bind(this);
//     }
//
//     componentDidMount() {
//         // console.log('PROPS: ', this.props);
//     //     !this.props.accessRequests && this.props.dispatch(receiveAccessStatus())
//     //
//     // }
//
//     handleRequest(spaceId){
//         // console.log(spaceId);
//         let socket=initSocket();
//         // socket.emit('sendAccessReq', spaceId);
//         console.log('LOGG!!!!!!', this.props.accessRequests)
//         // if(this.props.)
//     }
//
//     render(){
//         const { accessRequests } =this.props;
//         console.log('PROPS: ', this.props);
//         // if(this.props.spaceId==this.props.)
//
//         return (
//             <button className="all-spaces-bttn" onClick={this.handleRequest.bind(this, this.props.spaceId)}>{this.props.accessRequests}</button>
//         );
//     }
// }
// const mapStateToProps=state=> {
//     return {
//         accessRequests: state.accessStatusReducer
//         // reqAccessStatus: state.access
//     };
// };
//
// export default connect(mapStateToProps)(SpaceReqButton);
