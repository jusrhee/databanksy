import React, { Component } from 'react';

import styled from 'styled-components';
import axios from 'axios';

import gallery from './background.jpg';

import ArtList from './ArtList';
import ArtworkModal from './ArtworkModal'
import Search from './Search';

class Home extends Component {
  state = {
    currentScreen: 'Home',
    name: 'Databanksy.',
    artworks: [],
    selectedArtwork: null,
    firstRender: true,
    saved: [],
    user: null
  }

  componentDidMount() {
    axios.get('/api/user')
    .then(response => {
      this.setState({
        user: response.data
      });

      this.getInitial();
    })
  }

  getInitial = () => {
    axios.get('/api/artworks')
    .then(response => {
      if (response.data) {
        this.setState({ 
          artworks: response.data,
          name: 'Databanksy.'
        });
      }
    })
    .catch(error => {
      console.log(error)
    })

    axios.get('/api/user/saved')
    .then(response => {
      if (response.data) {
        this.setState({ 
          saved: response.data
        });
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  getArtworks = (screen, selectedArtwork, user) => {
    this.setState({ 
      currentScreen: screen,
      firstRender: false
    });

    if (!selectedArtwork && !user) {
      this.getInitial();
    } else if (user) {
      axios.get('/api/user/saved',{
        params: {
          populate: true
        },
      })
      .then(response => {
        if (response.data) {
          let sorting = this.state.saved;
          let items = response.data; 

          let result = items.map(function(item) {
              var n = sorting.indexOf(item['artwork_ID']);
              return [n, item]
          }).sort().map(function(j) { return j[1] })

          this.setState({ 
            artworks: result,
            name: this.state.user.username
          });
        }
      })
      .catch(error => {
        console.log(error)
      })
    } else if (selectedArtwork) {

    }
  }

  selectArtwork = (selectedArtwork) => {
    this.setState({ selectedArtwork });
  }

  saveArtwork = (artwork_ID) => {
    let saved = this.state.saved; 

    if (!saved.includes(artwork_ID)) {
      axios.post('/api/user/artwork/add', {
        artwork_id: artwork_ID
      }).then((res) => {

        saved.push(artwork_ID);

        this.setState({ saved });
      })
    } else {
      axios.post('/api/user/artwork/remove', {
        artwork_id: artwork_ID
      }).then((res) => {
        let index = saved.indexOf(artwork_ID)
        let artworks = this.state.artworks;
        saved.splice( index, 1 );

        if (this.state.currentScreen === 'Saved') {
          artworks.splice(index, 1);
        }

        this.setState({ saved, artworks });
      })
    }
  }

  renderMain = () => {
    switch(this.state.currentScreen) {
      case 'Home':
      case 'Saved':
        return (
          <ArtList
            getArtworks={this.getArtworks}
            artworks={this.state.artworks}
            selectArtwork={this.selectArtwork}
            firstRender={this.state.firstRender}
            name={this.state.name}
            saved={this.state.saved}
            saveArtwork={this.saveArtwork}
            currentScreen={this.state.currentScreen}
          />
        );
        break;
      case 'Search':
        return <Search />
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
    this.setState({ currentScreen, resetExhibit: true });
  }

  logout = () => {
    axios.post('/api/user/logout')
    .then(() => {
      window.location.href = '/accounts';
    });
  }

  render() {
    if (this.state.user) {
      return (
        <StyledHome>
          <Bg src={gallery} />
          <TopBar>
          </TopBar>
          <Main>
            {this.renderMain()}
          </Main>
          <NavBar>
            <Button onClick={() => this.getArtworks('Home', null, false)}>
              <i className="material-icons">home</i>
              <Label>Home</Label>
            </Button>
            <Button onClick={() => this.setCurrentScreen('Search')}>
              <i className="material-icons">search</i>
              <Label>Search</Label>
            </Button>
            <Button onClick={() => this.getArtworks('Saved', null, true)}>
              <i className="material-icons">bookmark</i>
              <Label>Saved</Label>
            </Button>
            <Button onClick={this.logout}>
              <i className="material-icons">exit_to_app</i>
              <Label>Log Out</Label>
            </Button>
          </NavBar>
          {this.renderModal()}
        </StyledHome>
      );
    } else {
      return null; 
    }
    
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
