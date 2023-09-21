import { Component } from "react";

import b from './/Button.module.css'

export class Button extends Component {

    loadMore = () => {

        this.props.addImages(this.props.addInput)
    }

    render(){
        return(
            <button type="button" className={b.button} onClick={this.loadMore}>Load more</button>
        )
    }
}