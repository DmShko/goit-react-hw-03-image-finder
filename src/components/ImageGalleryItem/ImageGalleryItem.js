import { Component } from 'react';

import it from './ImageGalleryItem.module.css';

export class ImageGalleryItem extends Component {
  clickHandle = data => {
    this.props.openModal(data);
  };

  render() {
    return (
      <li
        className={it.item}
        onClick={() => this.clickHandle(this.props.dataItem.id)}
      >
        <img className={it.img} src={this.props.dataItem.webformatURL} alt="" />
      </li>
    );
  }
}
