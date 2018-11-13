import React from 'react';

// PROFILE PIC COMPONENT ////////////////////////

export default function ProfilePic(props) {
    // let letter= props.firstLetter;
    // console.log(letter);
    // let image = props.image;
    let imgSrc = '';
    if(!props.image) {
        imgSrc = '/imgs/default_bolek.png';
    } else {
        imgSrc = props.image;
    }
    // const image = props.image |< 'default.jpg'
    return (
        <div>
            <img className="pic-friends-list" src={imgSrc} onClick={props.clickHandler}/>
        </div>


    );
}


// export default class ProfilePic extends React.Component {
//     constructor(props) {
//         super(props)
//     }
//     // const image = props.image |< 'default.jpg'
//     render() {
//
//         let imgSrc = '';
//         if(!this.props.image) {
//             imgSrc = '/imgs/default_bolek.png';
//         } else {
//             imgSrc = this.props.image;
//         }
//         return (
//             <div>
//                 <img className="pic-friends-list" src={imgSrc} onClick={this.props.clickHandler}/>
//
//             </div>
//         );
//     }
//
// }
