import React, { useState } from 'react';

function GroupForm({ mode, existingGroup, groups, setGroups, setPage }) {
  const [group, setGroup] = useState(() => {
    if (existingGroup) {
      return {
        ...existingGroup,
        participants: [...existingGroup.participants],
        expenses: [...existingGroup.expenses],
      };
    }
    return { id: null, name: '', participants: [], expenses: [] };
  });

  const [newParticipantName, setNewParticipantName] = useState('');
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    paidBy: '',
    participants: [],
  });
  const [confirmDeleteParticipant, setConfirmDeleteParticipant] = useState(null);

  const updateGroupName = (name) => {
    setGroup((g) => ({ ...g, name }));
  };

  const addParticipant = () => {
    const name = newParticipantName.trim();
    if (!name || group.participants.includes(name)) return;
    setGroup((g) => ({
      ...g,
      participants: [...g.participants, name],
    }));
    setNewParticipantName('');
  };

  const participantInExpenses = (name) => {
    return group.expenses.some(
      (exp) => exp.paidBy === name || exp.participants.includes(name)
    );
  };

  const tryDeleteParticipant = (nameToDelete) => {
    if (participantInExpenses(nameToDelete)) {
      setConfirmDeleteParticipant(nameToDelete);
    } else {
      deleteParticipant(nameToDelete);
    }
  };

  const confirmDelete = () => {
    if (confirmDeleteParticipant) {
      deleteParticipant(confirmDeleteParticipant);
      setConfirmDeleteParticipant(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteParticipant(null);
  };

  const deleteParticipant = (nameToDelete) => {
    setGroup((g) => {
      const newParticipants = g.participants.filter((p) => p !== nameToDelete);
      const newExpenses = g.expenses
        .map((exp) => {
          const filteredParticipants = exp.participants.filter((p) => p !== nameToDelete);
          let newPaidBy =
            exp.paidBy === nameToDelete ? filteredParticipants[0] || '' : exp.paidBy;
          return { ...exp, participants: filteredParticipants, paidBy: newPaidBy };
        })
        .filter((exp) => exp.participants.length > 0);

      return {
        ...g,
        participants: newParticipants,
        expenses: newExpenses,
      };
    });

    if (newExpense.paidBy === nameToDelete) {
      setNewExpense((e) => ({ ...e, paidBy: '' }));
    }
    if (newExpense.participants.includes(nameToDelete)) {
      setNewExpense((e) => ({
        ...e,
        participants: e.participants.filter((p) => p !== nameToDelete),
      }));
    }
  };

  const deleteExpense = (expenseName) => {
    setGroup((g) => ({
      ...g,
      expenses: g.expenses.filter((exp) => exp.name !== expenseName),
    }));
  };

  const updateNewExpenseField = (field, value) => {
    setNewExpense((e) => ({ ...e, [field]: value }));
  };

  const toggleExpenseParticipant = (participant) => {
    setNewExpense((e) => {
      const exists = e.participants.includes(participant);
      const newParticipants = exists
        ? e.participants.filter((p) => p !== participant)
        : [...e.participants, participant];
      return { ...e, participants: newParticipants };
    });
  };

  const isExpenseNameUnique = (name) => {
    const lowerName = name.trim().toLowerCase();
    return !group.expenses.some((exp) => exp.name.toLowerCase() === lowerName);
  };

  const addExpense = () => {
    const amountNum = parseFloat(newExpense.amount);
    const trimmedExpenseName = newExpense.name.trim();

    if (
      !trimmedExpenseName ||
      isNaN(amountNum) ||
      amountNum <= 0 ||
      !newExpense.paidBy ||
      newExpense.participants.length === 0
    ) {
      return;
    }

    if (!isExpenseNameUnique(trimmedExpenseName)) {
      alert('Expense name already exists in this group.');
      return;
    }

    const expenseToAdd = {
      name: trimmedExpenseName,
      amount: amountNum,
      paidBy: newExpense.paidBy,
      participants: [...newExpense.participants],
    };

    setGroup((g) => ({
      ...g,
      expenses: [...g.expenses, expenseToAdd],
    }));

    setNewExpense({ name: '', amount: '', paidBy: '', participants: [] });
  };

  const handleSave = () => {
    const trimmedName = group.name.trim();
    if (!trimmedName || group.participants.length === 0) return;

    if (mode === 'add') {
      const newId = groups.length > 0 ? Math.max(...groups.map((g) => g.id)) + 1 : 1;
      setGroups([...groups, { ...group, id: newId }]);
      setPage({ name: 'home' });
    } else if (mode === 'edit' && group.id != null) {
      setGroups(groups.map((g) => (g.id === group.id ? group : g)));
      setPage({ name: 'view', groupId: group.id });
    }
  };

  const trimmedGroupName = group.name.trim();
  const groupNameTaken = groups.some(
    (g) => g.name.toLowerCase() === trimmedGroupName.toLowerCase() && g.id !== group.id
  );

  const saveDisabled =
    trimmedGroupName === '' || group.participants.length === 0 || groupNameTaken;

  const trimmedExpenseName = newExpense.name.trim();
  const amountNum = parseFloat(newExpense.amount);

  const addExpenseDisabled =
    !trimmedExpenseName ||
    !newExpense.amount ||
    isNaN(amountNum) ||
    amountNum <= 0 ||
    !newExpense.paidBy ||
    newExpense.participants.length === 0 ||
    !isExpenseNameUnique(trimmedExpenseName);

  return (
    <div>
      <h2>{mode === 'add' ? 'Add Group' : 'Edit Group'}</h2>

      <input
        type="text"
        placeholder="Enter group name"
        value={group.name}
        onChange={(e) => updateGroupName(e.target.value)}
        className="input"
      />

      <div>
        <h3>Participants</h3>
        <input
          type="text"
          placeholder="Enter participant name"
          value={newParticipantName}
          onChange={(e) => setNewParticipantName(e.target.value)}
          className="input"
        />
        <button className="button" onClick={addParticipant}>
          Add Participant
        </button>

        <ul className="participant-list">
          {group.participants.map((p, i) => (
            <li key={i} className="participant-item">
              {p}
              <button className="button red" onClick={() => tryDeleteParticipant(p)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Expenses</h3>

        <input
          type="text"
          placeholder="Expense name"
          value={newExpense.name}
          onChange={(e) => updateNewExpenseField('name', e.target.value)}
          className="input"
        />
        {!isExpenseNameUnique(trimmedExpenseName) && trimmedExpenseName && (
          <p style={{ color: 'red' }}>Expense name already exists!</p>
        )}

        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => updateNewExpenseField('amount', e.target.value)}
          className="input"
          min="0"
          step="0.01"
        />

        <select
          value={newExpense.paidBy}
          onChange={(e) => updateNewExpenseField('paidBy', e.target.value)}
          className="select"
        >
          <option value="">Paid By</option>
          {group.participants.map((p, idx) => (
            <option key={idx} value={p}>
              {p}
            </option>
          ))}
        </select>

        <div>
          {group.participants.map((p, idx) => (
            <label key={idx} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={newExpense.participants.includes(p)}
                onChange={() => toggleExpenseParticipant(p)}
              />{' '}
              {p}
            </label>
          ))}
        </div>

        <button className="button" onClick={addExpense} disabled={addExpenseDisabled}>
          Add Expense
        </button>

        {group.expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul className="expense-list">
            {group.expenses.map((expense, idx) => (
              <li key={idx} className="expense-item">
                <strong>{expense.name}</strong> - ${expense.amount.toFixed(2)}
                <br />
                Paid by: <em>{expense.paidBy}</em>
                <br />
                Shared among: {expense.participants.join(', ')}
                <button
                  className="button red"
                  onClick={() => deleteExpense(expense.name)}
                  title="Delete Expense"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="button" onClick={handleSave} disabled={saveDisabled}>
        {mode === 'add' ? 'Save Group' : 'Save Changes'}
      </button>
      <button
        className="button gray"
        onClick={() =>
          setPage(
            mode === 'add' ? { name: 'home' } : { name: 'view', groupId: group.id }
          )
        }
      >
        Cancel
      </button>

      {confirmDeleteParticipant && (
  <div className="confirm-modal-overlay">
    <div className="confirm-modal">
      <p>
        Participant <strong>{confirmDeleteParticipant}</strong> is involved in existing expenses.
        <br />
        Deleting will remove them from those expenses and may affect your data.
        <br />
        Are you sure?
      </p>
      <button className="button red" onClick={confirmDelete}>
        Yes, Delete
      </button>
      <button className="button gray" onClick={cancelDelete} style={{ marginLeft: '10px' }}>
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default GroupForm;
