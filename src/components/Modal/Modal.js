import { Component } from "react";
import { createPortal } from "react-dom";

import mod from './Modal.module.css'

const modalRoot = document.querySelector('#modal-root')

export class Modal extends Component {

    state = {
       largeImageURL: "",
    }

    componentDidMount() {

        window.addEventListener("keydown", this.driveModal);

        this.props.currentState.forEach(value => {
            if(value.id === this.props.imageOpenID) 
                this.setState({largeImageURL: value.largeImageURL})
            }
        );
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.driveModal);
    }

    driveModal = (evt) => {
        if(evt.code === 'Escape') this.props.onClose();
    }

    clickBackdrob = (evt) => {
        if(evt.target === evt.currentTarget) this.props.onClose();
    }

    render(){
        return createPortal(
            <div className={mod.overlay} onClick={this.clickBackdrob}>
                <div className={mod.modal}>
                    <img src={this.state.largeImageURL} alt="" />
                </div>
            </div>, modalRoot
        )
    }
}