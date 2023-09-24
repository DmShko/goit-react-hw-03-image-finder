import { Component } from "react";
import { ReactComponent as IconMenu } from '../images/search-com.svg'

import search from './Searchbar.module.css'

export class Searchbar extends Component {

    state = {
        imputValue: "",
    }
    
    changeInput = (evt) => {
        this.setState(({imputValue: evt.target.value,}))
        
    }

    formSubmit = (evt) => {

        evt.preventDefault();
        this.props.onSubmit('pageCounter', 0)
        if(this.state.imputValue.length !== 0) this.props.onSubmit('inputData', this.state.imputValue);
    }

    render(){
        // <span className="search.button-label">Search</span> row 29!!!!
        return(
            <header className={search.searchbar}>
                <form className={search.form} onSubmit={this.formSubmit}>
                    <button type="submit" className={search.button}>
                        <IconMenu className={search.icon} width="25px" />
                    </button>

                    <input
                    value={this.state.imputValue}
                    className={search.input}
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search images and photos"
                    onChange={this.changeInput}
                    />
                </form>
            </header>
        )
    }
}