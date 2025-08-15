import React from 'react';

function HomePage({ groups, setPage }) {
    return (
        <div style={{ padding: '20px' }}>
            <h2>All Groups</h2>

            {/* Scrollable container */}
            <div>
                {groups.length === 0 ? (
                    <p>No groups yet. Click below to add one!</p>
                ) : (
                    groups.map((group) => (
                        <div
                            key={group.id}
                            onClick={() => setPage(group.id)}
                        >
                            <h3>{group.name || `Group ${group.id}`}</h3>
                            <p>{group.participants.length} participants</p>
                            <p>{group.expenses.length} expenses</p>
                        </div>
                    ))
                )}
            </div>

            {/* Add Group Button */}
            <button
                onClick={() => setPage(-1)}
            >
                ➕ Add Group
            </button>
        </div>
    );
}

export default HomePage;
