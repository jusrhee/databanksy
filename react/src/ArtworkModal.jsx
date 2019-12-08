import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

class ArtworkModal extends Component {

  render() {
    const { selectedArtwork } = this.props;
    return (
      <StyledDetailedView>
      <InfoPanel>
        <ContentWrapper>
          <Title>{selectedArtwork.title}</Title>
          <Artist>By Guy Fieri</Artist>
          <Date>Created: {selectedArtwork.date}</Date>
          <Bio>Artist Information:<br /><br />BIO holds a trade meeting each year in the United States, which are essential for the business development and partnering activities that are required in the biotechnology sector, in which it is expensive to develop products, timelines to develop products are long, and regulatory risks are high.[6] In 2018 the BIO International Convention was held in Boston and was attended by 18,289 delegates from 49 states, the District of Columbia and Puerto Rico and 67 countries.[7] The event also held over 46,916 One-On-One Partnering Meetings, becoming a Guinness World Records, Record Holder for the "Largest Business Partnering Event."[8][9]</Bio>
          <Tilde>~~~~~~~~~~~~~~~~</Tilde>
        </ContentWrapper>
      </InfoPanel>
      <ArtworkContainer>
        <Artwork src={selectedArtwork.image} />
      </ArtworkContainer>
      <CloseButton onClick={() => this.props.selectArtwork(null)}>
        <i className="material-icons">close</i>
      </CloseButton>
      </StyledDetailedView>
    );
  }
}

export default ArtworkModal;

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
  margin-left: 100px;
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
  margin-right: 60px;
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
  margin-top: -10px;
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
  max-width: 80%;
  max-height: 80%;
  margin-right: 60px;
  box-shadow: 0px 3px 15px #00000055;
`;
