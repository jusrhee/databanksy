import React, { Component } from 'react';
import styled from 'styled-components';

const options = [
    'All', 'Architecture', 'Drawing', 'Sculpture', 'Installation', 'Painting', 'Print', 'Video', 'Photograph', 'Design', 'Illustrated Book', 'Multiple', 'Film', 'Periodical', 'Textile', 'Performance', '(not assigned)', 'Ephemera', 'Audio', 'Digital', 'Collage', 'Graphic Design', 'Media', 'Work on Paper', 'Poster', 'Architectural Model', 'Software'
];

class CategoryFilter extends Component {
    state = {
      showFilterDropdown: false,
      selectedTagLabel: null,
    }

    toggleFilterDropdown = () => {
      this.setState({ showFilterDropdown: !this.state.showFilterDropdown });
    }

    renderFilterDropdown = () => {
      if (this.state.showFilterDropdown) {
        return (
              <FilterDropdown>
                    {options.map((option, i) => {
              return (
                            <TagOption
                                onClick={() => {this.props.selectTag(option)}}
                                selected={this.props.selectedTag === option}
                                alt={this.props.selectedTag === option}
                        >
                                {option}
                            </TagOption>
                        );
                    })}
              </FilterDropdown>
        );
      }
    }

    render() {
      return (
          <StyledTagFilter>
            <CloseMask
              onClick={this.toggleFilterDropdown}
              show={this.state.showFilterDropdown}
            />
            <FilterButton
              onClick={this.toggleFilterDropdown}
              showFilterDropdown={this.state.showFilterDropdown}
            >
              <i className="material-icons">filter_list</i>
              {this.props.selectedTag}
              <DropdownIcon>
                <i className="material-icons">arrow_drop_down</i>
              </DropdownIcon>
            </FilterButton>
            {this.renderFilterDropdown()}
          </StyledTagFilter>
      );
    }
}

export default CategoryFilter;

const TagOption = styled.div`
    padding: 12px 12px 12px 20px;
    cursor: pointer;
    position: relative;
    color: ${(props) => (props.alt ? '#6a9be8' : props.selected ? '' : '#afafaf')};

    :hover {
        background: #f6f6f9;
    }
    @import url('https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap');
    font-family: Merriweather, sans-serif;
    font-size: 12px;

    > i {
        display: ${(props) => (props.selected ? '' : 'none')};
        position: absolute;
        top: 8px;
        left: 12px;
        font-size: 16px;
    }
`;

const TagLabel = styled(TagOption)`
    padding-left: 15px;
    color: #dedede;
    background: #fafafa;

    :hover {
        background: #fafafa;
    }
`;

const FilterDropdown = styled.div`
  position: absolute;
  background-color: white;
  max-height: 300px;
    overflow: auto;
  width: 200px;
  top: 38px
  right: -20px;
    text-align: left;
  border-radius: 10px;
  box-shadow: -1px 4px 10px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;

  animation: floatDropdown 0.2s;
`;

const CloseMask = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    display: ${(props) => (props.show ? '' : 'none')};
`;

const DropdownIcon = styled.div`
    > i {
        position: absolute;
        top: 7px;
        font-size: 15px;
        right: 10px;
    }
`;

const StyledTagFilter = styled.div`
    position: relative;
`;

const FilterButton = styled.div`
    text-align: center;
    height: 24px;
    padding-left: 40px;
    @import url('https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap');
    font-family: Merriweather, sans-serif;
    padding-right: 33px;
    padding-top: 7px;
    font-size: 13px;
    position: relative;
    color: #67677e;
    cursor: pointer;
    border-radius: 5px;
    background: ${(props) => (props.showFilterDropdown ? '#00000011' : '')};

    > i {
        position: absolute;
        top: 6px;
        left: 10px;
        font-size: 16px;
    }

    :hover {
        background: #00000011;
    }
`;
