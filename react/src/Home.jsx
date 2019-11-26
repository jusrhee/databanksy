import React, { Component } from 'react';

import styled from 'styled-components';
import logo from './logo.png';

import ArtList from './ArtList';
import DetailedView from './DetailedView'

class Home extends Component {
  state = {
    selectedArtwork: null,
  }

  selectArtwork = (selectedArtwork) => {
    this.setState({ selectedArtwork });
  }

  renderMain = () => {
    const { selectedArtwork } = this.state;
    if (selectedArtwork) {
      return (
        <DetailedView
          selectArtwork={this.selectArtwork}
          selectedArtwork={selectedArtwork}
        />
      );
    }
    return <ArtList selectArtwork={this.selectArtwork} />
  }

  render() {
    return (
      <StyledHome>
        <TopBar>
          <Logo onClick={() => this.selectArtwork(null)} src={logo} />
        </TopBar>
        <Main>
          {this.renderMain()}
        </Main>
      </StyledHome>
    );
  }
}

export default Home;

const Logo = styled.img`
  width: 120px;
  margin-top: 21px;
  margin-left: 70px;
  cursor: pointer;
  :active {
    opacity: 50%;
  }
`;

const StyledHome = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

const TopBar = styled.div`
  width: 100vw;
  height: 60px;
  background: #f7f7f7;
  border-bottom: 1px solid #cdcdcd;
`;

const Main = styled.div`
  background: #efeff4;
  width: 100%;
  height: calc(100vh - 40px);
  overflow: auto;
`;
