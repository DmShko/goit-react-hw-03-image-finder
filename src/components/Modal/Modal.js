import { Component } from "react";

import mod from './Modal.module.css'

export class Modal extends Component {
    render(){
        return(
            <div className={mod.overlay}>
                <div className={mod.modal}>
                    <img src="" alt="" />
                </div>
            </div>
        )
    }
}