import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

class ArtList extends Component {
  state = {
    artworks: [],
    hoverIndex: -1,
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/artworks')
    .then(response => {
      if (response.data) this.setState({ artworks: response.data });
    })
    .catch(error => {
      console.log(error)
    })
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
              key={i}
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
  text-align: center;
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
