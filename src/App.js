import React, { useState, useEffect, useReducer, useCallback } from 'react';
import axios from 'axios'
import './App.css';

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





const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const Item = ({ item, onRemoveItem }) => {

  return (
    <div className="item">
      <span style={{ width: '40%' }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
      <span style={{ width: '10%' }}>
        <button type="button" onClick={() => onRemoveItem(item)} className="button button_small"> Dismiss</button>
      </span>
    </div>
  );
}


const List = ({ list, onRemoveItem }) =>
  list.map(item =>
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  );


const TextComp = (props) => {
  return (
    <span>{props.children}</span>
  )
}

const InputWithLabel = ({ id, onInputChange, type = 'text', value, children, isFocused }) => {

  const inputRef = React.useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused])

  return (
    <>
      <label htmlFor={id} className="label">{children}</label>
      <input ref={inputRef} type={type} value={value} onChange={onInputChange} autoFocus={isFocused} className="input" />
      <p>
        Searching for <strong>{value}</strong>.
</p>
    </>
  )
}


const SearchForm = ({
  handleSearchSubmit,
  searchTerm,
  handleChange
}) => (
    <form onSubmit={handleSearchSubmit} className="search-form">
      <InputWithLabel onInputChange={handleChange} id="search" type='text' searchTerm={searchTerm} value={searchTerm} isFocused>
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm} className="button button_large">Submit</button>
    </form>
  )

const App = () => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  )

  const [url, setUrl] = useState(
    `${API_ENDPOINT}${searchTerm}`
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



  const handleRemoveStory = item => {

    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    })
  }

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>
      <SearchForm handleSearchSubmit={handleSearchSubmit} searchTerm={searchTerm} handleChange={handleChange} />
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
          <List list={stories.data} onRemoveItem={handleRemoveStory} />
        )}
    </div>
  );
}

export default App;
