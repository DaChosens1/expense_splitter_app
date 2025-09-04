import React from 'react';

function ViewGroup({ group, setPage, groups, setGroups }) {
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
    <div>
      <h2>{group.name}</h2>

      <h3>Participants Balances</h3>
      <ul className="participant-list">
        {group.participants.map((p, i) => {
          const balance = totals[p];
          const colorClass =
            balance > 0.01 ? 'green' : balance < -0.01 ? 'red' : 'gray';

          return (
            <li key={i} style={{ color: colorClass }}>
              {balance > 0.01
                ? `${p} is owed $${balance.toFixed(2)}`
                : balance < -0.01
                ? `${p} owes $${Math.abs(balance).toFixed(2)}`
                : `${p} is settled`}
            </li>
          );
        })}
      </ul>

      <h3>Expenses</h3>
      {group.expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <ul className="expense-list">
          {group.expenses.map((expense, i) => (
            <li key={i} className="expense-item">
              <strong>{expense.name}</strong> - ${expense.amount.toFixed(2)} <br />
              Paid by: {expense.paidBy} <br />
              Shared among: {expense.participants.join(', ')}
            </li>
          ))}
        </ul>
      )}

      <button className="button" onClick={() => setPage({ name: 'edit', groupId: group.id })}>
        ✏️ Edit Group
      </button>
      <button className="button gray" onClick={() => setPage({ name: 'home' })}>
        🏠 Back to Home
      </button>
    </div>
  );
}

export default ViewGroup;
