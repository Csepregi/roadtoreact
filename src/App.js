import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];



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
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}> Dismiss</button>
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
      <h1>My Hacker Stories</h1>
      <label htmlFor={id}>{children}</label>
      <input ref={inputRef} type={type} value={value} onChange={onInputChange} autoFocus={isFocused} />
      <p>
        Searching for <strong>{value}</strong>.
</p>
    </>
  )
}



const getTitle = (title) => {
  return title
}

const App = () => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')
  const [stories, setStories] = useState(initialStories)

  const handleRemoveStory = item => {
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );

    setStories(newStories)
  }

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const searchedStories = stories.filter(list =>
    list.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()))

  return (
    <div className="App">
      <h1>Hello {getTitle('React')} </h1>
      <InputWithLabel onInputChange={handleChange} id="search" type='text' searchTerm={searchTerm} value={searchTerm} isFocused>
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />

      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      <hr />
    </div>
  );
}

export default App;
