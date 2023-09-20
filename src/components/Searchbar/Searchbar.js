import { Component } from "react";

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
        this.props.onSubmit(this.state.imputValue);
    }

    render(){
        return(
            <header className={search.searchbar}>
                <form className={search.form} onSubmit={this.formSubmit}>
                    <button type="submit" className={search.button}>
                        <span className="search.button-label">Search</span>
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