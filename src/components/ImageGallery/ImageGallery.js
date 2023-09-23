import { Component } from "react";

import { ImageGalleryItem } from "components/ImageGalleryItem/ImageGalleryItem";

import im from './ImageGallery.module.css'

export class ImageGallery extends Component {
    render(){
        
        return(
            <ul className={im.gallery}>
                
                { 
                    this.props.cardData.map(value => {
                        return <ImageGalleryItem key={value.id} dataItem={value} openModal={this.props.openModal}/>
                    })
                }
                
            </ul>
        )
    }
}