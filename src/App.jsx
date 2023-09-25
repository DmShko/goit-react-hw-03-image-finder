import { Component } from 'react';
import Notiflix from 'notiflix';
import axios from 'axios';

import { Button } from 'components/Button/Button';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Modal } from 'components/Modal/Modal';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { Loader } from 'components/Loader/Loader';

export class App extends Component {
  static API_KEY = '39566581-ca703ce31ea011c9b51d6d8b4';

  state = {
    pageCounter: 0,
    totalH: 0,
    quantityCard: 12,
    checkData: '',
    inputData: '',
    cards: [],
    key: true,
    open: false,
    temporary: undefined,
    fillingLevel: function () {
      return Math.floor(this.totalH / this.quantityCard);
    },
    activeButton: false,
    load: false,
    cardID: '',
  };

  componentDidMount() {
    if (
      this.state.totalH <= this.state.quantityCard
    ) {
      
      this.changeState('quantityCard', 12);

      this.setState({ activeButton: false });
      
    }
  }

  componentDidUpdate(prevProps, prevState) {

    // scroll down, if 'activeButton' change
    if (prevState.activeButton !== this.state.activeButton) {
      // scroll only, if 'activeButton' change to 'true',
      // because, if 'activeButton' - false, she doesn't exist in DOM!!! It will be error!!
      if (this.state.activeButton === true) this.autoScroll('loadButton');
    }

    // visible button and hidden loader, when cards load
    if ((prevState.cards.length !== this.state.cards.length) && (
      this.state.totalH >= this.state.quantityCard
    )) {
      this.setState({ load: false, activeButton: true });
    } 

    // if elementsSet.totalH <= elementsSet.quantityCard
    if ((prevState.cards.length !== this.state.cards.length) && (
      this.state.totalH <= this.state.quantityCard
    )) {
      this.setState({ load: false,});

      // if elementsSet.totalH <= elementsSet.quantityCard
      if (
        this.state.totalH <= this.state.quantityCard && this.state.totalH !== 0
      ) {
        
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        
      }
    } 

    if (
      prevState.pageCounter !== this.state.pageCounter &&
      this.state.pageCounter !== 0
    ) {
      // 'activeButton: false', that scroll worked in next event load cards,
      // because scroll react on change 'activeButton'
      this.setState({ load: true, activeButton: false });

      // add last itteration, last part of totalH
      if (
        this.state.pageCounter === this.state.fillingLevel() &&
        this.state.totalH > this.state.quantityCard
      ) {
        // temporery value for 63's row
        this.setState(value => ({ temporary: value.fillingLevel() + 1 }));
        this.setState(value => ({
          quantityCard:
            value.totalH - value.quantityCard * value.fillingLevel(),
        }));
      }

      

      // control, when total quantity loaded images >= "data.totalHits"
      if (this.state.pageCounter > this.state.temporary) {
        this.changeState('quantityCard', 12);

        this.setState({ load: false });

        this.setState({ activeButton: false });

        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }

      this.request(this.state.inputData);
    }

    // new input data !== previous
    if (prevState.inputData !== this.state.inputData) {
      this.setState({
        pageCounter: 0,
        totalH: 0,
        quantityCard: 12,
        cards: [],
        key: true,
        open: false,
        temporary: undefined,
        fillingLevel: function () {
          return Math.floor(this.totalH / this.quantityCard);
        },
        activeButton: false,
        load: false,
        cardID: '',
      });

      this.setState({ key: this.loadPagesControl(this.state.inputData) });

      this.setState({ load: true });
    }
  }

  autoScroll = data => {
    // get first card on page and set her to top
    document.getElementById(data).scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  };

  changeState = (name, data) => {
    this.setState({ [name]: data });
  };

  openModal = data => {
    this.setState(value => ({ open: !value.open, cardID: data }));
  };

  getCards = parametr => {
    parametr.forEach(element => {
      const { id, webformatURL, largeImageURL } = element;

      this.setState(value => ({
        cards: [...value.cards, { id, webformatURL, largeImageURL }],
      }));
    });
  };

  getDataFromApi = async (data, counter, quantityCard) => {
    let url = `https://pixabay.com/api/?key=${App.API_KEY}&q=${data}&image_type=photo$orientation=horizontal&safesearch=true&page=1&per_page=${quantityCard}&page=${counter}`;
    return await axios.get(url).then(responce => {
      return responce;
    });
  };

  // "data.totalHits" control
  loadPagesControl = data => {
    // this.changeState('quantityCard', 200);

    //if the request data is repeate
    if (this.state.checkData === data) {
      // "key" - open/close access to calc loaded pages. When total quantity loaded images >= "data.totalHits",
      // "fillingLevel" will not accumulate further and cause an error.
      if (this.state.key) {
        // counter loaded pages
        this.setState(value => ({ pageCounter: value.pageCounter + 1 }));
      }
    }

    // if the request data isn't repeate
    else {
      this.setState(value => ({ key: value.key || true }));
      // this.changeState('key', true);
      this.changeState('temporary', undefined);
      this.changeState('pageCounter', 1);
      this.changeState('checkData', data);
      // changeState(scrollValue, 0);
    }

    return this.state.key;
  };

  request = async data => {
    //'viewKey' - dont't output content, if when total quantity loaded images >= "data.totalHits"
    // and output content, if < "data.totalHits"
    if (this.state.key && this.state.quantityCard !== 0) {
      await this.getDataFromApi(
        data,
        this.state.pageCounter,
        this.state.quantityCard
      )
        .then(responce => {
          if (responce.data.hits.length !== 0) {
            if (this.state.pageCounter === 1) {
              this.setState({ totalH: responce.data.totalHits });
              this.getCards(responce.data.hits);

              Notiflix.Notify.info(
                `Hooray! We found ${responce.data.totalHits} images.`
              );
            } else {
              this.getCards(responce.data.hits);
            }
            return;
          }

          Notiflix.Notify.warning(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        })
        .catch(error => {
          Notiflix.Notify.warning(error.message);
        });
    }
  };

  render() {
    return (
      <>
        <Searchbar onSubmit={this.changeState} />
        <ImageGallery cardData={this.state.cards} openModal={this.openModal} />
        {this.state.activeButton && (
          <Button
            addImages={this.loadPagesControl}
            addInput={this.state.inputData}
          />
        )}
        {this.state.load && <Loader />}
        {this.state.open && (
          <Modal
            currentState={this.state.cards}
            imageOpenID={this.state.cardID}
            onClose={this.openModal}
          />
        )}
      </>
    );
  }
}
