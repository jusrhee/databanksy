import React, { Component } from 'react';

import Home from './Home';
import Login from './Login';
import axios from 'axios';

class App extends Component {
  state = {
    loggedIn: false,
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/artworks')
    .then(() => {
      this.setState({ loggedIn: true });
    })
  }

  renderContent = () => {
    if (this.state.loggedIn) {
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
