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
    title: 'Alice in Wasteland',
    image: 'https://cdn.shopify.com/s/files/1/0439/8373/products/AliceInWasteland_web_store_file_6da1d3b1-11a0-4e5e-a3be-730ebe205055_1800x.progressive.jpg?v=1571449939',
    creator: 'Angsty Guy',
    date: '8/8/2008',
  },
  {
    title: 'Chapel Thingy',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Vincent_van_Gogh_-_The_Church_in_Auvers-sur-Oise%2C_View_from_the_Chevet_-_Google_Art_Project.jpg/1024px-Vincent_van_Gogh_-_The_Church_in_Auvers-sur-Oise%2C_View_from_the_Chevet_-_Google_Art_Project.jpg',
    creator: 'Yincent Yan Yo',
    date: '11/13/2032',
  },
];

class ArtList extends Component {
  state = {
    artworks: dummyArtworks,
    hoverIndex: -1,
  }

  handleMouseOver = (i) => {
    this.setState({ hoverIndex: i });
  }

  handleMouseOut = () => {
    this.setState({ hoverIndex: -1 });
  }

  render() {
    return (
      <StyledArtList>
        {this.state.artworks.map((artwork, i) => {
          return (
            <ArtPost
              onMouseOver={() => this.handleMouseOver(i)}
              onMouseOut={this.handleMouseOut}
              onClick={() => this.props.selectArtwork(artwork)}
            >
              <Artwork key={i} src={artwork.image} />
              <Overlay show={i === this.state.hoverIndex}>
                <Title>{artwork.title}</Title>
              </Overlay>
            </ArtPost>
          );
        })}
      </StyledArtList>
    );
  }
}

export default ArtList;

const Title = styled.div`
  color: white;
  font-family: Helvetica, sans-serif;
  letter-spacing: 2px;
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
  max-width: 100%;
  position: relative;
  display: block;
  margin-bottom: 80px;
  box-shadow: 0px 3px 15px #00000055;
  cursor: pointer;
`;

const Artwork = styled.img`
  max-width: 100%;
`;

const StyledArtList = styled.div`
  width: 50%;
  margin-left: 25%;
  padding-bottom: 30px;
  padding-top: 80px;
`;
