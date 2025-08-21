import React, { useState } from 'react';
import HomePage from './components/HomePage.js';
import GroupForm from './components/GroupForm.js';
import ViewGroup from './components/ViewGroup.js';

function App() {
	// page state as an object: { name: 'home' | 'add' | 'view' | 'edit', groupId?: number }
	const [page, setPage] = useState({ name: 'home' });
	const [groups, setGroups] = useState([]);

	let middleDiv;

	switch (page.name) {
		case 'home':
			middleDiv = (
				<HomePage
					groups={groups}
					setPage={setPage}
				/>
			);
			break;

		case 'add':
			middleDiv = (
				<GroupForm
					mode="add"
					groups={groups}
					setGroups={setGroups}
					setPage={setPage}
				/>
			);
			break;

		case 'view':
			// find group by id or fallback
			const groupToView = groups.find(g => g.id === page.groupId);
			if (!groupToView) {
				// fallback to home if group not found
				setPage({ name: 'home' });
				return null;
			}
			middleDiv = (
				<ViewGroup
					group={groupToView}
					setPage={setPage}
					groups={groups}
					setGroups={setGroups}
				/>
			);
			break;

		case 'edit':
			// find group by id or fallback
			const groupToEdit = groups.find(g => g.id === page.groupId);
			if (!groupToEdit) {
				setPage({ name: 'home' });
				return null;
			}
			middleDiv = (
				<GroupForm
					mode="edit"
					existingGroup={groupToEdit}
					groups={groups}
					setGroups={setGroups}
					setPage={setPage}
				/>
			);
			break;

		default:
			middleDiv = (
				<HomePage
					groups={groups}
					setPage={setPage}
				/>
			);
			break;
	}

	return (
		<div style={{ padding: '20px' }}>
			<h1>Expense Splitter</h1>
			<div>{middleDiv}</div>
		</div>
	);
}

export default App;
