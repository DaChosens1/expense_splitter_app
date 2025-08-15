import React, { useState } from 'react';
import AddGroup from './components/AddGroup.js';
import HomePage from './components/HomePage.js';
import ViewGroup from './components/ViewGroup.js';

function App() {
	const [page, setPage] = useState(0);
	const [groups, setGroups] = useState([]);

	let middleDiv;

	if (page === 0) {
		middleDiv = (
			<HomePage
				groups={groups}
				setPage={setPage}
			/>
		);
	} else if (page === -1) {
		middleDiv = (
			<AddGroup
				setPage={setPage}
				setGroups={setGroups}
			/>
		);
	} else if (page > 0) {
		middleDiv = (
			<ViewGroup
				page={page}
				groups={groups}
				setPage={setPage}
				setGroups={setGroups}
			/>
		);
	}

	return (
		<div style={{ padding: '20px' }}>
			<h1>Expense Splitter</h1>
			{middleDiv}
		</div>
	);
}

export default App;
