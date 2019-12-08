import React, { Component } from 'react';

import Home from './Home';
import LoginWrapper from './LoginWrapper';

class App extends Component {
  state = {
    loggedIn: false,
  }

  renderContent = () => {
    if (this.loggedIn) {
      return <Home />
    }
    return <LoginWrapper />
  }

  render() {
    return (
      <div className="App">
        {this.renderContent()}
      </div>
    );
  }
}

export default App;
