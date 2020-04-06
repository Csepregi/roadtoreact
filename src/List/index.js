import React from 'react';
import { ReactComponent as Check } from '../check.svg';
import styled from 'styled-components';

const StyledItem = styled.div`
display: flex;
align-items: center;
padding-bottom: 5px;
`;
const StyledColumn = styled.span`
padding: 0 5px;
white-space: nowrap;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
a {
color: inherit;
}
width: ${props => props.width};
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

const StyledButtonSmall = styled(StyledButton)`
padding: 5px;
`;

const Svgstyle = styled.svg`
&:hover {
  fill: #ffffff;
  stroke: #ffffff;
}
  `;


const Item = ({ item, onRemoveItem }) => {

	return (
		<StyledItem>
			<StyledColumn width="40%">
				<a href={item.url}>{item.title}</a>
			</StyledColumn>
			<StyledColumn width='30%'>{item.author}</StyledColumn>
			<StyledColumn width='10%'>{item.num_comments}</StyledColumn>
			<StyledColumn width='10%'>{item.points}</StyledColumn>
			<StyledColumn width='10%'>
				<StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
					<Svgstyle height="18px" width="18px"><Check height="18px" width="18px" /></Svgstyle>
				</StyledButtonSmall>
			</StyledColumn>
		</StyledItem >
	);
}

const List = React.memo(({ list, onRemoveItem }) =>
	console.log('B:List') ||

	list.map(item =>
		<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
	)
);

export default List