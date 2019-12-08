import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

class Search extends Component {
  state = {
    searchText: '',
    results: [],
  }

  handleSearch = () => {
  }

  handleChange = (event) => {
    this.setState({ searchText: event.target.value });
  };

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  }

  renderResults = () => {
    if (true) {
      return <Placeholder>Press 'Enter' to search</Placeholder>
    }
    return (
      <div>
        <Result>Death in Venice</Result>
        <Result>Thus Spoke Zarathustra</Result>
        <Result>Despair</Result>
        <Result>A Hero of Our Time</Result>
        <Result>The Doestefication of Rus</Result>
      </div>
    )
  }

  render() {
    const { selectedArtwork } = this.props;
    return (
      <StyledSearch>
        <Searchbar>
          <SearchIcon>
            <i className="material-icons">search</i>
          </SearchIcon>
          <SearchInput
            placeholder='Search DataBanksy . . .'
            value={this.state.searchText}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          <ReturnIcon onClick={this.handleSearch}>
            <i className="material-icons">keyboard_return</i>
          </ReturnIcon>
        </Searchbar>
        <ResultsPanel>
          {this.renderResults()}
        </ResultsPanel>
      </StyledSearch>
    );
  }
}

export default Search;

const Result = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  height: 50px;
  @import url('https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap');
  font-family: Merriweather, sans-serif;
  letter-spacing: 1px;
`;

const Placeholder = styled.div`
  margin-top: 30vh;
  width: 500px;
  text-align: center;
  margin-left: calc(50% - 250px);
  font-size: 16px;
  @import url('https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap');
  font-family: Merriweather, sans-serif;
  letter-spacing: 1;
  color: #787878;
`;

const ResultsPanel = styled.div`
  width: 80%;
  height: calc(80% - 70px);
  overflow-y: auto;
`;

const ReturnIcon = styled.div`
  position: absolute;
  top: 0px;
  user-select: none;
  cursor: pointer;
  right: 13px;
  > i {
    font-size: 20px;
    color: #ababab;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 2px;
  left: 6px;

  > i {
    font-size: 20px;
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
  padding-left: 40px;
  width: calc(100% - 80px);
  @import url('https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap');
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
