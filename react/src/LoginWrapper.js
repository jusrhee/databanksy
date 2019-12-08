import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Login from './Login';
import Register from './Register';
import bg from './nighthawks.jpg';

class LoginWrapper extends Component {

  state = {
    register: true
  }

  setRegister = (register) => {
    this.setState({ register });
  }

  renderContent = () => {
    if (this.state.register) {
      return <Register setRegister={this.setRegister} />
    }
    return <Login setRegister={this.setRegister} />
  }

  render() {
    return (
      <StyledLogin>
        <BgImage src={bg} />
        <Overlay />
        {this.renderContent()}
      </StyledLogin>
    );
  }
}

export default LoginWrapper;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #000000cc;
`;

const BgImage = styled.img`
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
`;

const StyledLogin = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;
