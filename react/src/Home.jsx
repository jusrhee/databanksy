import React, { Component } from 'react';

import styled from 'styled-components';
import gallery from './background.jpg';

import ArtList from './ArtList';
import ArtworkModal from './ArtworkModal'
import Search from './Search';

class Home extends Component {
  state = {
    firstRender: true,
    currentScreen: 'Home',
    selectedArtwork: null,
    resetExhibit: false,
  }

  selectArtwork = (selectedArtwork) => {
    this.setState({ selectedArtwork });
  }

  renderMain = () => {
    switch(this.state.currentScreen) {
      case 'Home':
        return (
          <ArtList
            selectArtwork={this.selectArtwork}
            firstRender={this.state.firstRender}
            resetExhibit={this.state.resetExhibit}
            setResetExhibit={this.setResetExhibit}
          />
        );
        break;
      case 'Search':
        return <Search />
        break;
      default:
        return <div>Nothing saved bao bei</div>
        break;
    }
  }

  renderModal = () => {
    if (this.state.selectedArtwork) {
      return (
        <ModalWrapper>
          <ArtworkModal
            selectArtwork={this.selectArtwork}
            selectedArtwork={this.state.selectedArtwork}
          />
        </ModalWrapper>
      );
    }
    return null;
  }

  setResetExhibit = (bool) => {
    this.setState({ resetExhibit: bool });
  }

  setCurrentScreen = (currentScreen) => {
    this.setState({ currentScreen, firstRender: false, resetExhibit: true });
  }

  render() {
    return (
      <StyledHome>
        <Bg src={gallery} />
        <TopBar>
        </TopBar>
        <Main>
          {this.renderMain()}
        </Main>
        <NavBar>
          <Button onClick={() => this.setCurrentScreen('Home')}>
            <i className="material-icons">home</i>
            <Label>Home</Label>
          </Button>
          <Button onClick={() => this.setCurrentScreen('Search')}>
            <i className="material-icons">search</i>
            <Label>Search</Label>
          </Button>
          <Button onClick={() => this.setCurrentScreen('Saved')}>
            <i className="material-icons">bookmark</i>
            <Label>Saved</Label>
          </Button>
          <Button>
            <i className="material-icons">exit_to_app</i>
            <Label>Log Out</Label>
          </Button>
        </NavBar>
        {this.renderModal()}
      </StyledHome>
    );
  }
}

export default Home;

const ModalWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000112de;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0;
`;

const Label = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
  color: white;
  font-family: 'Open Sans', sans-serif;
  font-size: 11px;
  margin-top: -5px;
`;

const Button = styled.div`
  width: 50px;
  height: 50px;
  cursor: pointer;
  user-select: none;
  text-align: center;
  margin: 10px;
  margin-top: 15px;
  > i {
    color: #ffffffdd;
    font-size: 30px;
  }
`;

const NavBar = styled.div`
  position: fixed;
  width: 300px;
  height: 70px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background: #00000044;
  bottom: 0;
  left: calc(50vw - 170px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  opacity: 0;
  animation: float-nav 1s 1s;
  animation-fill-mode: forwards;
  @keyframes float-nav {
    from { bottom: -70px; opacity: 0; }
    to   { bottom: 0px; opacity: 1; }
  }
`;

const Bg = styled.img`
  width: 110%;
  position: fixed;
  top: -5%;
  left: 0;
  height: 110%;
  z-index: -1;
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
`;

const Main = styled.div`
  width: 100%;
  height: calc(100vh);
  background: none;
  z-index: 999;
`;
