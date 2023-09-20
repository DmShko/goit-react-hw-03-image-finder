import { Component } from 'react'

import lo from './Loader.module.css'

export class Loader extends Component {
    render(){
        return(
            <div className={lo.element}></div>
        )
    }
}