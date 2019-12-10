import React, { Component } from 'react';

import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

import gallery from './background.jpg';

import ArtList from './ArtList';
import ArtworkModal from './ArtworkModal'
import Search from './Search';

class Home extends Component {
  state = {
    currentScreen: this.props.currentScreen,
    name: this.props.currentScreen === 'Home' ? 'Databanksy.' : '',
    artworks: [],
    selectedArtwork: null,
    selectedArtworkIndex: -1,
    firstRender: true,
    saved: [],
    user: null,
    similar: false
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);

    axios.get('/api/user')
    .then(response => {
      this.setState({
        user: response.data
      });

      this.getInitialSaved();

      if (this.state.currentScreen === 'Saved') {
        this.getArtworks(this.state.currentScreen, null, true, true);
      } else if (this.state.currentScreen === 'Home') {
        this.getArtworks(this.state.currentScreen, null, false, true);
      }
      
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentScreen !== this.props.currentScreen) {
      this.setState({ currentScreen: this.props.currentScreen });

      if (this.props.currentScreen === 'Saved') {
        this.getArtworks(this.props.currentScreen, null, true, false);
      } else if (this.props.currentScreen === 'Home') {
        this.getArtworks(this.props.currentScreen, null, false, false);
      } else if (this.props.currentScreen === 'Search') {
        this.setCurrentScreen('Search')
      }
    }
  }

  getInitialSaved = () => {
    axios.get('/api/user/saved')
    .then(response => {
      this.setState({ 
        saved: response.data
      });
    })
    .catch(error => {
      console.log(error)
    })
  }

  getArtworks = (screen, selectedArtwork, user, firstRender) => {
    this.setState({
      firstRender
    });

    if (!selectedArtwork && !user) {
      this.setState({ 
          artworks: [],
          currentScreen: 'Home',
          name: 'Databanksy.'
        });

      axios.get('/api/artworks')
      .then(response => {
        this.setState({ 
          artworks: response.data,
          currentScreen: 'Home',
          name: 'Databanksy.'
        });
      })
      .catch(error => {
        console.log(error)
      })
    } else if (user) {
      this.setState({ 
        artworks: [],
        name: this.state.user.username,
        currentScreen: screen
      });

      axios.get('/api/user/saved',{
        params: {
          populate: true
        },
      })
      .then(response => {
          let sorting = this.state.saved;
          let items = response.data; 

          let result = items.map(function(item) {
              var n = sorting.indexOf(item['artwork_ID']);
              return [n, item]
          }).sort().map(function(j) { return j[1] })

          this.setState({ 
            artworks: result,
            name: this.state.user.displayName || this.state.user.username,
            currentScreen: screen
          });
      })
      .catch(error => {
        console.log(error)
      })
    } else if (selectedArtwork) {
      axios.get('/api/artworks/associated', {
        params: {
          id: selectedArtwork.creator_ID
        }
      })
      .then(response => {
        this.setState({ 
            artworks: response.data,
            name: selectedArtwork.name,
            currentScreen: screen,
          });
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

  selectArtwork = (selectedArtwork, selectedArtworkIndex) => {
    this.setState({ selectedArtwork, selectedArtworkIndex });
  }

  selectArtworkByIndex = (index) => {
    this.setState({ 
      selectedArtwork: this.state.artworks[index], 
      selectedArtworkIndex: index 
    });
  }

  saveArtwork = (artwork_ID) => {
    let saved = this.state.saved; 

    if (!saved.includes(artwork_ID)) {
      axios.post('/api/user/artwork/add', {
        artwork_id: artwork_ID
      }).then((res) => {

        saved.unshift(artwork_ID);

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

  setArtistOnly = () => {
    this.setState({ similar: false })
  }

  setSimilar = () => {
    this.setState({ similar: true })
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
            similar={this.state.similar}
            setArtistOnly={this.setArtistOnly}
            setSimilar={this.setSimilar}
          />
        );
        break;
      case 'Search':
        return (
          <Search 
            getArtworks={this.getArtworks}
            selectArtwork={this.selectArtwork}
            saved={this.state.saved}
            saveArtwork={this.saveArtwork}
          />
        )
        break;
    }
  }

  renderModal = () => {
    if (this.state.selectedArtwork) {
      return (
        <ModalWrapper>
          <ArtworkModal
            selectArtwork={this.selectArtwork}
            selectArtworkByIndex={this.selectArtworkByIndex}
            selectedArtwork={this.state.selectedArtwork}
            showNavLeft={(this.state.currentScreen !== 'Search') && 
              this.state.selectedArtworkIndex !== 0}
            showNavRight={(this.state.currentScreen !== 'Search') && 
              this.state.selectedArtworkIndex !== this.state.artworks.length - 1}
            index={this.state.selectedArtworkIndex}
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

  handleHomeClick = () => {
    if (this.state.currentScreen === 'Home') {
      this.getArtworks('Home', false, null, false)
    }
  }

  handleKeyDown = (e) => {
    if (this.state.selectedArtwork) {
      if (e.keyCode === 37 && this.state.selectedArtworkIndex > 0) {
        this.selectArtworkByIndex(this.state.selectedArtworkIndex - 1);
      } else if (e.keyCode === 39 && this.state.selectedArtworkIndex < 
        this.state.artworks.length) {
        this.selectArtworkByIndex(this.state.selectedArtworkIndex + 1);
      }
    }
  }

  render() {
    if (this.state.user) {
      return (
        <StyledHome onKeyDown={this.handleKeyDown}>
          <Bg src={gallery} />
          <TopBar>
          </TopBar>
          <Main>
            {this.renderMain()}
          </Main>
          <NavBar>
            <StyledLink to='/app' onClick={this.handleHomeClick}>
              <i className="material-icons">home</i>
              <Label>Home</Label>
            </StyledLink>
            <StyledLink to='/app/search'>
              <i className="material-icons">search</i>
              <Label>Search</Label>
            </StyledLink>
            <StyledLink to='/app/saved'>
              <i className="material-icons">bookmark</i>
              <Label>Saved</Label>
            </StyledLink>
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

const StyledLink = styled(Link)`
  text-decoration: none;
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
`

const ModalWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000112ee;
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
