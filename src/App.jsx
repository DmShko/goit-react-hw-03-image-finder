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

    pageCounter: 0,
    totalH: 0, 
    quantityCard: 12,
    checkData: "",
    inputData: "",
    cards: [],
    key: true,
    temporary: undefined,
    fillingLevel: function () { return Math.floor(this.totalH / this.quantityCard)},
    activeButton: false,

  }
  
  componentDidUpdate(prevProps, prevState) {

    if((prevState.pageCounter !== this.state.pageCounter) && ( this.state.pageCounter !== 0)){ 
      console.log(this.state.pageCounter);
      this.request(this.state.inputData)
    } 
       
    if(prevState.inputData !== this.state.inputData) {
      
      this.setState(({
        pageCounter: 0,
        totalH: 0, 
        quantityCard: 12,
        cards: [],
        key: true,
        temporary: undefined,
        fillingLevel: function () { return Math.floor(this.totalH / this.quantityCard)},
        activeButton: false,
      }))
      
      this.setState({key:  this.loadPagesControl(this.state.inputData),
        activeButton: true,
      });
      
    }   
  }
    
  changeState = (name, data) => {
    this.setState({[name]: data});
  }

  getCards = (parametr) => {

    parametr.forEach(element => {
      const { id, webformatURL, largeImageURL } = element;
  
      this.setState(value => ({
        cards: [...value.cards, {id, webformatURL, largeImageURL}],
      }));
      
    });

  }

  getDataFromApi = async(data, counter, quantityCard) => {
  
    let url = `https://pixabay.com/api/?key=${App.API_KEY}&q=${data}&image_type=photo$orientation=horizontal&safesearch=true&page=1&per_page=${quantityCard}&page=${counter}`;
    return await axios.get(url).then(responce => {
        // console.log(counter);
        return responce;
    });

  }

  // "data.totalHits" control
  loadPagesControl = (data) => {
    
    this.changeState('quantityCard', 12);
   
    //if the request data is repeate
    if(this.state.checkData === data) {
      console.log("==");
      // "elementsSet.key" - open/close access to calc loaded pages. When total quantity loaded images >= "data.totalHits",
      // "elementsSet.fillingLevel" will not accumulate further and cause an error.
      if(this.state.key) { 

        // counter loaded pages
        this.setState(value => ({pageCounter: value.pageCounter + 1}));
        
      }
      
      // add one itteration
      if(this.state.pageCounter === this.state.fillingLevel() + 1 && this.state.totalH > this.state.quantityCard) {

        // temporery value for 63's row
        this.setState(value => ({temporary: value.fillingLevel() + 1}));
        this.setState(value => ({quantityCard: value.totalH - value.quantityCard * value.fillingLevel()}));
        
      } 

      // if elementsSet.totalH <= elementsSet.quantityCard
      if(this.state.pageCounter === this.state.fillingLevel() + 2 && this.state.totalH <= this.state.quantityCard) {

        // temporery value for 63's row
        this.setState(value => ({temporary: value.fillingLevel()}));
        
      }

      // control, when total quantity loaded images >= "data.totalHits"
      if(this.state.pageCounter > this.state.temporary) {
        
        this.setState(value => ({activeButton: !value.activeButton}));
    
        this.changeState('quantityCard', 12);
        
        // reset property and output notification
        // elementsSet.checkData = 0;
        this.setState(value => ({key: value.key && false}));
      
        // elementsSet.simpleArray.instance.destroy();
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      
      } 
    }
    // if the request data isn't repeate
    else {
      console.log("!=");
      this.setState(value => ({key: value.key || true}));
      // this.changeState('key', true);
      this.changeState('temporary', undefined);
      this.changeState('pageCounter', 1);
      this.changeState('checkData', data);
      // changeState(scrollValue, 0);
  
    }

    return this.state.key;
  }

  request = async (data) => {
   console.log(`${this.state.key} ${this.state.quantityCard}`);
    //'viewKey' - dont't output content, if when total quantity loaded images >= "data.totalHits" 
    // and output content, if < "data.totalHits"
    if(this.state.key && this.state.quantityCard !== 0) {
     
     
      await this.getDataFromApi(data, this.state.pageCounter, this.state.quantityCard).then(responce => {
        
        console.log(responce);
        if(responce.data.hits.length !== 0) {

          if(this.state.pageCounter === 1) {

            this.setState(({totalH: responce.data.totalHits,}))
            this.getCards(responce.data.hits);
            
            Notiflix.Notify.info(`Hooray! We found ${responce.data.totalHits} images.`);

          } else {
            this.getCards(responce.data.hits);
          }
          
          return;

        } 
        
        Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
      }).catch(error => {
        Notiflix.Notify.warning(error.message);
      });
    }
  }

  render() {
    
    // console.log(this.state.cards);
    console.log(this.state.key);
    
    // console.log(this.state.inputData);
    return(

      <>
        <Searchbar onSubmit={this.changeState}/>
        <ImageGallery cardData={this.state.cards}/> 
        {this.state.activeButton && <Button addImages={this.loadPagesControl} addInput={this.state.inputData}/>}
        <Modal/>
        <Loader/>
      </>
            
    )
  }
}
