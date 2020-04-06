import React from 'react';
import InputWithLabel from '../InputWithLabel';
import styled from 'styled-components';

const StyledSearchForm = styled.form`
padding: 10px 0 20px 0;
display: flex;
align-items: baseline;
`;

const StyledButton = styled.button`
background: transparent;
border: 1px solid #171212;
padding: 5px;
cursor: pointer;
transition: all 0.1s ease-in;
&:hover {
background: #171212;
color: #ffffff;
}
`;

const StyledButtonLarge = styled(StyledButton)`
padding: 10px;
`;

const SearchForm = ({
	handleSearchSubmit,
	searchTerm,
	handleChange
}) => (
		<StyledSearchForm onSubmit={handleSearchSubmit} >
			<InputWithLabel onInputChange={handleChange} id="search" type='text' searchTerm={searchTerm} value={searchTerm} isFocused>
				<strong>Search:</strong>
			</InputWithLabel>
			<StyledButtonLarge type="submit" disabled={!searchTerm}>Submit</StyledButtonLarge>
		</StyledSearchForm>
	)

export default SearchForm;