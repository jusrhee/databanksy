import React, { Component } from 'react';

import Home from './Home';

class Main extends Component {
  render() {
    return (
      <div className="Main">
        <Home currentScreen={this.props.currentScreen}/>
      </div>
    );
  }
}

export default Main;
