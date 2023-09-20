import { Component } from "react";
import Notiflix from "notiflix";
import axios from 'axios';

import { Button } from "components/Button/Button";
import { ImageGallery } from "components/ImageGallery/ImageGallery";
import { Modal } from "components/Modal/Modal";
import { Searchbar } from "components/Searchbar/Searchbar";
import { Loader } from "components/Loader/Loader";


export class App extends Component {

  static API_KEY = '39566581-ca703ce31ea011c9b51d6d8b4';

  state = {

    pageCounter: 1,
    totalH: 0,
    quantityCard: 12,
    cards: [],

  }

  changeState = (name, data) => {
    this.setState({[name]: data});
  }

  getCards = (parametr) => {
    parametr.map(({ id, webformatURL, largeImageURL }) => {
      return this.setState(value => ({
        cards: [...value.cards + {id, webformatURL, largeImageURL}],
      }));
    })

  }

  getDataFromApi = async(data, counter, quantityCard) => {
  
    let url = `https://pixabay.com/api/?key=${App.API_KEY}&q=${data}&image_type=photo$orientation=horizontal&safesearch=true&page=1&per_page=${quantityCard}&page=${counter}`;
    return await axios.get(url).then(responce => {
      console.log(responce);
        return responce;
    });
  }

  request = async (data) => {
    
    await this.getDataFromApi(data, this.state.pageCounter, this.state.quantityCard).then(responce => {
        
      if(responce.data.hits.length !== 0) {

        if(this.state.pageCounter === 1) {

          this.setState(({totalH: responce.data.totalHits,}))
          this.getCards(responce.data.hits);
          
          Notiflix.Notify.info(`Hooray! We found ${responce.data.totalHits} images.`);

        }

        return;

      } 
      
      Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
    }).catch(error => {
      Notiflix.Notify.warning(error.message);
    });
  }

  render() {
    console.log(this.state.cards);
    return(

      <>
        <Searchbar onSubmit={this.request}/>
        <ImageGallery cardData={this.state.cards}/>
        <Button/>
        <Modal/>
        <Loader/>
      </>
            
    )
  }
}
