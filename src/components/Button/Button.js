import { Component } from "react";

import b from './/Button.module.css'

export class Button extends Component {
    render(){
        return(
            <button type="submit" className={b.button} >Load more</button>
        )
    }
}