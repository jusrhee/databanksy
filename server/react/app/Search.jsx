import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import CategoryFilter from './CategoryFilter';

class Search extends Component {
  state = {
    searchText: '',
    results: null,
    hoverIndex: -1,
    startDate: '',
    endDate: '',
    selectedTag: 'All',
  }

  handleSearch = () => {    
    axios.get('/api/artworks/search', {
      params: {
        keyword: this.state.searchText.length === 0 ? ' ' : this.state.searchText,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        classification: this.state.selectedTag === 'All' ? undefined : this.state.selectedTag
      }
    })
    .then((res) => {
      this.setState({ results: res.data });
    })
    .catch((err) => {
      console.log(err);
    })
  }

  handleChange = (event) => {
    this.setState({ searchText: event.target.value });
  };

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  }

  selectTag = (selectedTag) => {
    this.setState({ selectedTag });
  }

  handleMouseOver = (i) => {
    this.setState({ hoverIndex: i });
  }

  handleMouseOut = () => {
    this.setState({ hoverIndex: -1 });
  }

  renderResults = () => {
    if (!this.state.results) {
      return <Placeholder>Press 'Enter' to search</Placeholder>
    }
    if (this.state.results.length === 0) {
      return <Placeholder>No matching results found</Placeholder>
    }
    return (
      <div>
        {this.state.results.map((artwork, i) => {
          let saved = this.props.saved.includes(artwork.artwork_ID);
          let savedText = saved ? 'Saved!' : 'Save';

          return (
            <Result
              key={i}
              onMouseOver={() => this.handleMouseOver(i)}
              onMouseOut={this.handleMouseOut}
              onClick={() => this.props.selectArtwork(artwork)}
            >
              <Bold>{artwork.title}</Bold>
              <Artist>by {artwork.name}</Artist>
              <OptionWrapper show={i === this.state.hoverIndex}>
                    <OptionButton onClick={() => this.props.selectArtwork(artwork)}>
                      <i className="material-icons">info</i>
                      <Label>Info</Label>
                    </OptionButton>
                    <OptionButton onClick={(e) => {
                      e.stopPropagation();
                      this.props.getArtworks('Home', artwork)}
                    }>
                      <i className="material-icons">brush</i>
                      <Label>Exhibit</Label>
                    </OptionButton>
                    <OptionButton onClick={(e) => {
                      e.stopPropagation();
                      this.props.saveArtwork(artwork.artwork_ID)
                    }}>
                      <i className="material-icons">bookmark_border</i>
                      <Label>{savedText}</Label>
                    </OptionButton>
              </OptionWrapper>
            </Result>
          );
        })}
      </div>
    )
  }

  render() {
    const { selectedArtwork } = this.props;
    return (
      <StyledSearch>
        <Searchbar>
          <SearchIcon>
            <i className="material-icons">category</i>
          </SearchIcon>
          <SearchInput
            placeholder='Search DataBanksy . . .'
            value={this.state.searchText}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          <ReturnIcon onClick={this.handleSearch}>
            <i className="material-icons">search</i>
          </ReturnIcon>
        </Searchbar>
        <FilterWrapper>
          <Date
            placeholder='Start date'
            value={this.state.startDate}
            onChange={(e) => this.setState({ startDate: e.target.value })}
            onKeyDown={this.handleKeyDown}
            maxLength='4'
          >
          </Date>
          <i className="material-icons">arrow_right_alt</i>
          <Date
            placeholder='End date'
            value={this.state.endDate}
            onChange={(e) => this.setState({ endDate: e.target.value })}
            onKeyDown={this.handleKeyDown}
            maxLength='4'
          >
          </Date>
          <CategoryFilter
            selectTag={this.selectTag}
            selectedTag={this.state.selectedTag}
          />
        </FilterWrapper>
        <ResultsPanel>
          {this.renderResults()}
        </ResultsPanel>
      </StyledSearch>
    );
  }
}

export default Search;

const Date = styled.input`
  width: 70px;
  background: transparent;
  text-align: center;
  border: 0;
  border-bottom: 2px solid #787878;
  margin-right: 7px;
  font-size: 14px;
  :focus{
    outline: none;
  }
`;

const FilterWrapper = styled.div`
  width: 80%;
  height: 35px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  > i {
    margin-top: 8px;
    margin-right: 10px;
    color: #00000099;
  }
`;

const Artist = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 270px);
  font-size: 13px;
  display: inline-block;
  color: #898989;
`;

const Label = styled.div`
  color: #00000099;
  font-family: 'Open Sans', sans-serif;
  font-size: 11px;
  margin-top: -3px;
`;

const OptionButton = styled.div`
  width: 50px;
  height: 45px;
  cursor: pointer;
  user-select: none;
  text-align: center;
  margin: 10px;
  margin-top: -32px;
  margin-right: 10px;
  padding: 5px;
  padding-top: 10px;
  border-radius: 10px;
  :hover {
    background: #ffffff44;
  }
  > i {
    color: #00000099;
    font-size: 25px;
  }
`;

const OptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  float: right;

  opacity: 0;
  animation: ${props => props.show ? 'slide-left 0.8s 0s' : ''};
  animation-fill-mode: forwards;
  @keyframes slide-left {
    from { margin-right: -100px; opacity: 0; }
    to   { margin-right: 20px; opacity: 1; }
  }
`;

const Bold = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 17px;
  width: calc(100% - 270px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Result = styled.div`
  margin-bottom: 30px;
  width: 100%;
  height: 50px;
  font-family: Merriweather, sans-serif;
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  border-radius: 5px;
  padding: 15px;

  :hover {
    background: #00000011;
  }
`;

const Placeholder = styled.div`
  margin-top: 25vh;
  width: 500px;
  text-align: center;
  margin-left: calc(50% - 250px);
  font-size: 16px;
  font-family: Merriweather, sans-serif;
  letter-spacing: 1;
  color: #787878;
`;

const ResultsPanel = styled.div`
  width: 80%;
  height: calc(80% - 150px);
  overflow-y: auto;
  margin-top: 10px;
`;

const ReturnIcon = styled.div`
  position: absolute;
  top: 0px;
  user-select: none;
  cursor: pointer;
  right: 0px;
  background: red;
  color: white;
  border-radius: 5px;
  padding: 1px 15px;
  background: #515569;
  box-shadow: 0 2px 5px 0 #00000030;
  > i {
    font-size: 20px;
    color: #ffffff
    margin-top: 4px;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 1px;
  left: 9px;

  > i {
    font-size: 20px;
    color: #565656;
  }
`;

const StyledSearch = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Searchbar = styled.div`
  height: 50px;
  width: 80%;
  position: relative;

  opacity: 0;
  animation: float-search 1s 0s;
  animation-fill-mode: forwards;
  @keyframes float-search {
    from { margin-top: 15vh; opacity: 0; }
    to   { margin-top: 0vh; opacity: 1; }
  }
`;

const SearchInput = styled.input`
  background: none;
  border: 0;
  padding-left: 45px;
  width: calc(100% - 80px);
  font-family: Merriweather, serif;
  letter-spacing: 1px;
  border-bottom: 2px solid black;
  padding-bottom: 12px;
  padding-right: 40px;
  outline-width: 0;
  font-size: 16px;
  display: inline-block;

  :placeholder {
    font-size: 16px;
  }
`;
