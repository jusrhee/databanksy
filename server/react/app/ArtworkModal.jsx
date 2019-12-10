import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

class ArtworkModal extends Component {
  state = {
    showTemp: true,
    wider: -1,
  }

  componentDidMount() {
    let { clientHeight, clientWidth } = this.refs.artwork;
  }

  renderNavLeft = () => {
    if (this.props.showNavLeft) {
      return (
        <NavLeft onClick={() => this.props.selectArtworkByIndex(this.props.index - 1)}>
          <i className="material-icons">arrow_back_ios</i>
        </NavLeft>
      )
    }
  }

  renderNavRight = () => {
    if (this.props.showNavRight) {
      return (
        <NavRight onClick={() => this.props.selectArtworkByIndex(this.props.index + 1)}>
          <i className="material-icons">arrow_forward_ios</i>
        </NavRight>
      )
    }
  }

  renderTemp = () => {
    if (this.state.showTemp) {
      return (
        <Temp>
          <ArtworkAlt onLoad={() => {this.setState({ showTemp: false })}} ref='artwork' src={this.props.selectedArtwork.image} />
        </Temp>
      )
    }
    if (this.refs.artwork) {
      if (this.refs.artwork.clientWidth !== 0) {
        if (this.refs.artwork.clientWidth > this.refs.artwork.clientHeight) {
          if (this.state.wider !== 0) {
            this.setState({ wider: 0 });
          }
        } else {
          if (!this.state.wider !== 1) {
            this.setState({ wider: 1 });
          }
        }
      }
    }
    return null;
  }

  renderArtwork = () => {
    if (this.state.wider >= 0) {
      return <Artwork src={this.props.selectedArtwork.image} wider={this.state.wider === 0} />
    }
    return null;
  }

  render() {
    const { selectedArtwork } = this.props;
    return (
      <StyledDetailedView>
      <NavWrapper>
          {this.renderNavLeft()}
          {this.renderNavRight()}
        </NavWrapper>
      <ArtworkContainer>
        {this.renderArtwork()}
      </ArtworkContainer>
      <InfoPanel>
        <ContentWrapper>
          <Title>{selectedArtwork.title}</Title>
          <Artist>By {selectedArtwork.name}</Artist>
          <Tilde>~~~~~~~~~~~~~~~~</Tilde>
          <Date>Created: {selectedArtwork.date}</Date>
          <Bio>Artist Information: {selectedArtwork.bio} <br /><br />{selectedArtwork.note}</Bio>
        </ContentWrapper>
      </InfoPanel>
      <CloseButton onClick={() => this.props.selectArtwork(null)}>
        <i className="material-icons">close</i>
      </CloseButton>
      {this.renderTemp()}
      </StyledDetailedView>
    );
  }
}

export default ArtworkModal;

const ArtworkAlt = styled.img`
  height: 1000%;
  opacity: 0;
`;
const Temp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const NavLeft = styled.div`
  float: left;
  height: 90px;
  width: 45px;
  border-top-right-radius: 80px;
  border-bottom-right-radius: 80px;
  background: #ffffff22;
  cursor: pointer;
  > i {
    color: white;
    font-size: 20px;
    margin-top: 35px;
    margin-left: 10px;
  }
  opacity: 0;
  animation: 'nav-left' 1s 0s;
  animation-fill-mode: forwards;
  @keyframes nav-left {
    from { margin-left: -50px; opacity: 0; }
    to   { margin-left: 10px; opacity: 1; }
  }
`;

const NavRight = styled.div`
  float: right;
  height: 90px;
  width: 45px;
  border-top-left-radius: 80px;
  border-bottom-left-radius: 80px;
  background: #ffffff22;
  cursor: pointer;
  > i {
    color: white;
    font-size: 20px;
    float: right;
    margin-top: 35px;
    margin-right: 10px;
  }
  opacity: 0;
  animation: 'nav-right' 1s 0s;
  animation-fill-mode: forwards;
  @keyframes nav-right {
    from { margin-right: -50px; opacity: 0; }
    to   { margin-righ: 10px; opacity: 1; }
  }
`;

const NavWrapper = styled.div`
  position: absolute;
  height: 90px;
  width: 100%;
  margin-top: calc(50vh - 55px);
`;


const CloseButton = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  top: 50px;
  right: 80px;
  cursor: pointer;

  > i {
    color: white;
    font-size: 40px;
  }
`;

const StyledDetailedView = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  overscroll-behavior-x: none;
`;

const InfoPanel = styled.div`
  margin-right: 100px;
  min-width: 20%;
  max-width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: white;
`;

const ArtworkContainer = styled.div`
  height: 100%;
  width: 200%;
  margin-right: 0px;
  padding-left: 80px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;




const Date = styled.div`
  font-size: 16px;
  margin-top: 50px;
  font-family: Merriweather, sans-serif;
`;

const Tilde = styled(Date)`
  margin-bottom: 50px;
`;

const ContentWrapper = styled.div`
  margin-top: 0px;
  max-height: 70%;
  overflow-y: auto;
  padding-right: 20px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  font-family: Merriweather, sans-serif;
`;

const Artist = styled.div`
  font-size: 20px;
  margin-top: 15px;
  font-family: Merriweather, sans-serif;
  line-spacing: 1.2em;
`;

const Bio = styled.div`
  font-size: 16px;
  margin-top: 30px;
  font-family: Merriweather, sans-serif;
  line-height: 150%;
`;

const Artwork = styled.img`
  height: ${props => !props.wider ? '80%' : ''};
  width: ${props => props.wider ? '80%' : ''};
  margin-top: -5%;
  margin-right: 60px;
  box-shadow: 0px 3px 15px #00000055;
`;
