import { Component } from "react";

import it from './ImageGalleryItem.module.css'

export class ImageGalleryItem extends Component {
    render(){
        return(
            <li className={it.item}>
                <img src={this.props.dataItem.webformatURL} alt="" width={250} height={200}/>
            </li>
        )
    }
}