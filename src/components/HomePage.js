import React from 'react';

function HomePage({ groups, setPage }) {
    return (
        <div style={{ padding: '20px' }}>
            <h2>All Groups</h2>

            <div>
                {groups.length === 0 ? (
                    <p>No groups yet. Click below to add one!</p>
                ) : (
                    groups.map((group) => {
                        const total = group.participants.length;
                        const preview = group.participants.slice(0, 3).join(', ');
                        const showEllipsis = total > 3;

                        return (
                            <div
                                key={group.id}
                                onClick={() => setPage({ name: 'view', groupId: group.id })}
                                style={{ cursor: 'pointer', marginBottom: '10px' }}
                            >
                                <h3>{group.name || `Group ${group.id}`}</h3>

                                <p>
                                    👥 {total} participant{total !== 1 ? 's' : ''}: {preview}
                                    {showEllipsis && '...'}
                                </p>

                                <p>
                                    💸 {group.expenses.length} expense{group.expenses.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>

            <button onClick={() => setPage({ name: 'add' })}>➕ Add Group</button>
        </div>
    );
}

export default HomePage;
