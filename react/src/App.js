import React, { Component } from 'react';

import Home from './Home';
import Login from './Login';

class App extends Component {
  state = {
    loggedIn: false,
  }

  renderContent = () => {
    if (this.loggedIn) {
      return <Home />
    }
    return <Login />
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
