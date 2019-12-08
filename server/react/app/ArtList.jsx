import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.png';
import styled from 'styled-components';

class ArtList extends Component {
  myRef = React.createRef()

  state = {
    hoverIndex: -1
  }

  componentDidUpdate(prevProps) {
    // Reset exhibit
    if (this.props.currentScreen !== prevProps.currentScreen) {
      this.myRef.current.scrollTo(0, 0);
    }
  }

  handleMouseOver = (i) => {
    this.setState({ hoverIndex: i });
  }

  handleMouseOut = () => {
    this.setState({ hoverIndex: -1 });
  }

  render() {
    return (
      <StyledArtList ref={this.myRef}>
        <Greeting>
          <Name
            firstRender={this.props.firstRender}
            shrink={this.props.name !== 'Databanksy.'}
          >
            {this.props.name}
          </Name>
          <Line 
            firstRender={this.props.firstRender} 
          />
        </Greeting>
        {this.props.artworks.map((artwork, i) => {
          let saved = this.props.saved.includes(artwork.artwork_ID);
          let savedText = saved ? 'Saved!' : 'Save';

          return (
            <Wrapper>
              <Placard>
                {artwork.title}
                <Creator>
                  {artwork.name}
                </Creator>
              </Placard>
              <ArtPost
                key={i}
                onMouseOver={() => this.handleMouseOver(i)}
                onMouseOut={this.handleMouseOut}
              >
                <Artwork key={i} src={artwork.image} />
                <Overlay show={i === this.state.hoverIndex}>
                  <OptionWrapper>
                    <OptionButton onClick={() => this.props.selectArtwork(artwork)}>
                      <i className="material-icons">info</i>
                      <Label>Info</Label>
                    </OptionButton>
                    <OptionButton onClick={() => this.props.getArtworks(artwork)}>
                      <i className="material-icons">brush</i>
                      <Label>Exhibit</Label>
                    </OptionButton>
                    <OptionButton onClick={() => this.props.saveArtwork(artwork.artwork_ID)}>
                      <i className="material-icons">bookmark_border</i>
                      <Label>{savedText}</Label>
                    </OptionButton>
                  </OptionWrapper>
                </Overlay>
              </ArtPost>
            </Wrapper>
          );
        })}
        <Bufferer />
      </StyledArtList>
    );
  }
}

export default ArtList;

const Label = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
  color: white;
  font-family: 'Open Sans', sans-serif;
  font-size: 11px;
  margin-top: -5px;
`;

const OptionButton = styled.div`
  width: 50px;
  height: 50px;
  cursor: pointer;
  user-select: none;
  text-align: center;
  margin: 10px;
  margin-top: 15px;
  padding: 5px;
  padding-top: 9px;
  border-radius: 10px;
  :hover {
    background: #ffffff44;
  }
  > i {
    color: #ffffffdd;
    font-size: 30px;
  }
`;

const OptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Bufferer = styled.div`
  display: inline-block;
  width: 30vw;
  height: 1px;
`;

const Greeting = styled.span`
  display: inline-block;
  background: red;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  margin-left: 7%;
`;

const Line = styled.div`
  width: 400px;
  height: 3px;
  background: black;
  display: inline-block;
  position: absolute;
  top: 45vh;
  left: 20px;

  opacity: ${props => props.firstRender ? 0 : '100%'};
  animation: ${props => props.firstRender ? 'expand-line 1s 1.2s' : ''};
  animation-fill-mode: forwards;
  @keyframes expand-line {
    from { width: 0; opacity: 0; }
    to   { width: 370px; opacity: 1; }
  }
`;

const Creator = styled.div`
  margin-top: 10px;
  font-weight: normal;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Placard = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap');
  position: absolute;
  font-family: 'Merriweather', serif;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  top: 190px;
  padding: 20px;
  padding-bottom: 35px;
  left: 70px;
  width: 200px;
  background: #efefef;
  display: inline-block;
  box-shadow: 0px 2px 4px #00000022;
`;

const Name = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Source+Serif+Pro:600&display=swap');
  font-family: 'Source Serif Pro', serif;
  font-size: ${props => props.shrink ? '50px' : '80px'};
  position: absolute;
  top: ${props => (props.shrink || props.firstRender) ? '35vh' : '30vh'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 450px;
  margin-left:  ${props => props.shrink ? '20px' : ''};

  opacity: ${props => props.firstRender ? 0 : '100%'};
  animation: ${props => props.firstRender ? 'float-greeting 1s 0.5s' : ''};
  animation-fill-mode: forwards;
  @keyframes float-greeting {
    from { top: 40vh; opacity: 0; }
    to   { top: ${props => props.shrink ? '35vh' : '30vh'}; opacity: 1; }
  }
`;

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
  background: #00001299;
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
`;

const ArtPost = styled.div`
  max-width: 100%;
  position: relative;
  margin-left: 340px;
  margin-right: 70px;
  display: inline-block;
  box-shadow: 0px 5px 15px #00000055;
  text-align: center;
`;

const Artwork = styled.img`
  height: 420px;
  margin-bottom: -5px;
`;

const StyledArtList = styled.div`
  width: calc(100% - 600px);
  padding-top: calc(50vh - 320px);
  padding-bottom: calc(50vh - 255px);
  padding-left: 600px;
  float: left;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
  display: inline-block;
`;
