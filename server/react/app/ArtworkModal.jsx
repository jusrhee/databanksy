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

  renderTemp = () => {
    if (this.state.showTemp) {
      return (
        <Temp>
          <ArtworkAlt onMouseOver={() => {this.setState({ showTemp: false })}} ref='artwork' src={this.props.selectedArtwork.image} />
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
      console.log(this.state.wider);
      return <Artwork src={this.props.selectedArtwork.image} wider={this.state.wider === 0} />
    }
    return null;
  }

  render() {
    const { selectedArtwork } = this.props;
    return (
      <StyledDetailedView>
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
  font-family: Helvetica, sans-serif;
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
  font-family: Helvetica, sans-serif;
`;

const Artist = styled.div`
  font-size: 20px;
  margin-top: 15px;
  font-family: Helvetica, sans-serif;
  line-spacing: 1.2em;
`;

const Bio = styled.div`
  font-size: 16px;
  margin-top: 30px;
  font-family: Helvetica, sans-serif;
`;

const Artwork = styled.img`
  height: ${props => !props.wider ? '80%' : ''};
  width: ${props => props.wider ? '80%' : ''};
  margin-top: -5%;
  margin-right: 60px;
  box-shadow: 0px 3px 15px #00000055;
`;
