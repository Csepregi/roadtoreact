import React, { useState } from 'react';
import { ReactComponent as Check } from '../check.svg';
import styled from 'styled-components';
import { sortBy } from 'lodash';

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

const SORTS = {
	NONE: list => list,
	TITLE: list => sortBy(list, 'title'),
	AUTHOR: list => sortBy(list, 'author'),
	COMMENT: list => sortBy(list, 'num_comments').reverse(),
	POINT: list => sortBy(list, 'points').reverse(),
};


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

const List = React.memo(({ list, onRemoveItem }) => {
	const [sort, setSort] = useState({
		sortKey: 'NONE',
		isReverse: false,
	})

	const handleSort = sortKey => {
		const isReverse = sort.sortKey === sortKey && !sort.isReverse
		setSort({ sortKey, isReverse })
	};

	const sortFunction = SORTS[sort.sortKey];
	const sortedList = sort.isReverse
		? sortFunction(list).reverse()
		: sortFunction(list)

	return (
		< div >
			<StyledItem>
				<StyledColumn width="40%"><button type="button" onClick={() => handleSort('TITLE')}>Title</button></StyledColumn>
				<StyledColumn width='30%'><button type="button" onClick={() => handleSort('AUTHOR')}>Author</button></StyledColumn>
				<StyledColumn width='10%'><button type="button" onClick={() => handleSort('COMMENT')}>Comments</button></StyledColumn>
				<StyledColumn width='10%'><button type="button" onClick={() => handleSort('POINT')}>Point</button></StyledColumn>
				<StyledColumn width='10%'>Actions</StyledColumn>
			</StyledItem >
			{
				sortedList.map(item => (
					<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
				))}
		</div >
	)
})
export default List