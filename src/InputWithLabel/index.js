import React, { useEffect } from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
border-top: 1px solid #171212;
border-left: 1px solid #171212;
padding-left: 5px;
font-size: 24px;
`;

const StyledInput = styled.input`
border: none;
border-bottom: 1px solid #171212;
background-color: transparent;
font-size: 24px;
`;



const InputWithLabel = ({ id, onInputChange, type = 'text', value, children, isFocused }) => {

	const inputRef = React.useRef();

	useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isFocused])

	return (
		<>
			<StyledLabel htmlFor={id} >{children}</StyledLabel>
			<StyledInput ref={inputRef} type={type} value={value} onChange={onInputChange} autoFocus={isFocused} />
			<p>
				Searching for <strong>{value}</strong>.
</p>
		</>
	)
}

export default InputWithLabel