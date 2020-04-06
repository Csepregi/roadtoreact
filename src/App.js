import React, { useState, useEffect, useReducer, useCallback } from 'react';
import axios from 'axios'
//import styles from './App.module.css';
import styled from 'styled-components';
import SearchForm from './SearchForm';
import List from './List';



const StyledContainer = styled.div`
height: 100vw;
padding: 20px;
background: #83a4d4;
background: linear-gradient(to left, #b6fbff, #83a4d4);
color: #171212;
`;
const StyledHeadlinePrimary = styled.h1`
font-size: 48px;
font-weight: 300;
letter-spacing: 2px;
`;


const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        )
      }
    default:
      throw new Error()
  }
}

const getSumComments = stories => {
  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};


const useSemiPersistentState = (key, initialState) => {
  const isMounted = React.useRef(false);

  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      console.log('A')
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};



const App = () => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  )

  const [url, setUrl] = useState(
    `${API_ENDPOINT} ${searchTerm}`
  );

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' })

    try {
      const result = await axios.get(url)
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      })
    } catch (e) {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])



  const handleRemoveStory = React.useCallback(item => {

    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    })
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  const sumComments = React.useMemo(() => getSumComments(stories),
    [stories]);

  console.log('B:App');

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories with {sumComments} comments </StyledHeadlinePrimary>
      <SearchForm handleSearchSubmit={handleSearchSubmit} searchTerm={searchTerm} handleChange={handleChange} />
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
          <List list={stories.data} onRemoveItem={handleRemoveStory} />
        )}
    </StyledContainer>
  );
}

export default App;
