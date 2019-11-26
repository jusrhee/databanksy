import React, { Component } from 'react';

import styled from 'styled-components';

const dummyArtworks = [
  {
    title: 'Wave Thing',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1920px-Great_Wave_off_Kanagawa2.jpg',
    creator: 'Japanese Dude',
    date: '7/18/1999',
  },
  {
    title: 'Wave Thing',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1920px-Great_Wave_off_Kanagawa2.jpg',
    creator: 'Japanese Dude',
    date: '7/18/1999',
  },
  {
    title: 'Wave Thing',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1920px-Great_Wave_off_Kanagawa2.jpg',
    creator: 'Japanese Dude',
    date: '7/18/1999',
  },
  {
    title: 'Wave Thing',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1920px-Great_Wave_off_Kanagawa2.jpg',
    creator: 'Japanese Dude',
    date: '7/18/1999',
  },
  {
    title: 'Wave Thing',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1920px-Great_Wave_off_Kanagawa2.jpg',
    creator: 'Japanese Dude',
    date: '7/18/1999',
  },
  {
    title: 'Wave Thing',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1920px-Great_Wave_off_Kanagawa2.jpg',
    creator: 'Japanese Dude',
    date: '7/18/1999',
  },
  {
    title: 'Wave Thing',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1920px-Great_Wave_off_Kanagawa2.jpg',
    creator: 'Japanese Dude',
    date: '7/18/1999',
  },
];

class DetailedView extends Component {
  state = {
    exhibition: dummyArtworks,
    hoverIndex: -1,
  }

  handleMouseOver = (i) => {
    this.setState({ hoverIndex: i });
  }

  handleMouseOut = () => {
    this.setState({ hoverIndex: -1 });
  }

  render() {
    const { selectedArtwork } = this.props;
    return (
      <StyledDetailedView>
        <TopSection>
          <InfoPanel>
            <ContentWrapper>
              <Title>{selectedArtwork.title}</Title>
              <Artist>By {selectedArtwork.creator}</Artist>
              <Date>Created on {selectedArtwork.date}</Date>
              <Tilde>~~~~~~~~~~~~~~~~</Tilde>
            </ContentWrapper>
          </InfoPanel>
          <ArtworkContainer>
            <Artwork src={selectedArtwork.image} />
          </ArtworkContainer>
        </TopSection>
        <Carousel>
          <Label>Exhibit</Label>
          {this.state.exhibition.map((artwork, i) => {
            return (
              <ArtPost
                onMouseOver={() => this.handleMouseOver(i)}
                onMouseOut={this.handleMouseOut}
                onClick={() => this.props.selectArtwork(artwork)}
              >
                <CarouselArtwork key={i} src={artwork.image} />
                <Overlay show={i === this.state.hoverIndex}>
                  <CarouselTitle>{artwork.title}</CarouselTitle>
                </Overlay>
              </ArtPost>
            );
          })}
        </Carousel>
      </StyledDetailedView>
    );
  }
}

export default DetailedView;

const CarouselTitle = styled.div`
  color: white;
  font-family: Helvetica, sans-serif;
  letter-spacing: 2px;
`;

const Label = styled.div`
  margin-top: 80px;
  margin-left: -10px;
  margin-bottom: 80px;
  color: black;
  font-family: Helvetica, sans-serif;
  font-weight: bold;
  font-size: 30px;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00001288;
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
`;

const ArtPost = styled.div`
  max-width: calc(50% - 200px);
  margin-bottom: 80px;
  margin-left: 40px;
  margin-right: 40px;
  position: relative;
  display: inline-block;
  box-shadow: 0px 3px 15px #00000055;
  cursor: pointer;
`;

const CarouselArtwork = styled.img`
  max-height: 100%;
  max-width: 100%;
`;

const Date = styled.div`
  font-size: 16px;
  margin-top: 50px;
  font-family: Helvetica, sans-serif;
  color: #ababab;
`;

const Tilde = styled(Date)`
  color: #cdcdcd;
`;

const ContentWrapper = styled.div`
  margin-top: -50px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  font-family: Helvetica, sans-serif;
`;

const Artist = styled.div`
  font-size: 20px;
  margin-top: 10px;
  font-family: Helvetica, sans-serif;
`;

const TopSection = styled.div`
  width: 100%
  height: 800px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #cdcdcd;

  box-shadow: 0px 3px 15px #00000055;
`;

const Artwork = styled.img`
  max-width: 80%;
  max-height: 80%;
  margin-right: 60px;
  box-shadow: 0px 3px 15px #00000055;
`;

const InfoPanel = styled.div`
  margin-left: 100px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ArtworkContainer = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Carousel = styled.div`
  width: 100%;
  padding-left: 100px;
  overflow: auto;
  padding-bottom: 80px;
`;

const StyledDetailedView = styled.div`
  width: 100%;
`;
