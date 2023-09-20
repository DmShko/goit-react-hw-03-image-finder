import { Component } from "react";

import it from './ImageGalleryItem.module.css'

export class ImageGalleryItem extends Component {
    render(){
        return(
            <li className={it.galleryItem}>
                <img src={this.porps.webformatURL} alt="" />
            </li>
        )
    }
}