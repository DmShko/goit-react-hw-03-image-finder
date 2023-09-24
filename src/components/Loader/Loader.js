import { Component } from 'react';

import lo from './Loader.module.css';

export class Loader extends Component {
  state = {
    counter: 0,
  };

  componentDidMount() {
    this.change();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.counter !== this.state.counter) this.change();
  }

  change = () => {
    setTimeout(() => {
      this.state.counter < 3
        ? this.setState(value => ({ counter: value.counter + 1 }))
        : this.setState({ counter: 0 });
    }, 200);
  };

  render() {
    return (
      <div className={lo.element}>
        <div
          className={
            this.state.counter === 1 ? `${lo.scale} ${lo.circle}` : lo.circle
          }
        ></div>
        <div
          className={
            this.state.counter === 2 ? `${lo.scale} ${lo.circle}` : lo.circle
          }
        ></div>
        <div
          className={
            this.state.counter === 3 ? `${lo.scale} ${lo.circle}` : lo.circle
          }
        ></div>
      </div>
    );
  }
}
