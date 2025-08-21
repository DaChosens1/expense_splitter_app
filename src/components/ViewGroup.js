import React from 'react';

function ViewGroup({ group, setPage, groups, setGroups }) {
    // Calculate net balances per participant
    const totals = {};
    group.participants.forEach(p => (totals[p] = 0));

    group.expenses.forEach(({ amount, paidBy, participants }) => {
        const splitAmount = amount / participants.length;
        participants.forEach(participant => {
            if (participant === paidBy) {
                totals[participant] += amount - splitAmount;
            } else {
                totals[participant] -= splitAmount;
            }
        });
    });

    return (
        <div style={{ padding: '20px' }}>
            <h2>{group.name}</h2>

            <h3>Participants Balances</h3>
            <ul>
                {group.participants.map((p, i) => {
                    const balance = totals[p];
                    if (balance > 0.01) {
                        return (
                            <li key={i} style={{ color: 'green' }}>
                                {p} is owed ${balance.toFixed(2)}
                            </li>
                        );
                    } else if (balance < -0.01) {
                        return (
                            <li key={i} style={{ color: 'red' }}>
                                {p} owes ${Math.abs(balance).toFixed(2)}
                            </li>
                        );
                    } else {
                        return (
                            <li key={i} style={{ color: 'gray' }}>
                                {p} is settled
                            </li>
                        );
                    }
                })}
            </ul>

            <h3>Expenses</h3>
            {group.expenses.length === 0 ? (
                <p>No expenses yet.</p>
            ) : (
                <ul>
                    {group.expenses.map((expense, i) => (
                        <li key={i}>
                            <strong>{expense.name}</strong> - ${expense.amount.toFixed(2)} <br />
                            Paid by: {expense.paidBy} <br />
                            Shared among: {expense.participants.join(', ')}
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => setPage({ name: 'edit', groupId: group.id })}>✏️ Edit Group</button>
            <button onClick={() => setPage({ name: 'home' })} style={{ marginLeft: '10px' }}>
                🏠 Back to Home
            </button>
        </div>
    );
}

export default ViewGroup;
