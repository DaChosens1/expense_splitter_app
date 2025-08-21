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

  // Temp state for adding participant name and expense inputs
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    paidBy: '',
    participants: [],
  });

  // State for confirm participant deletion modal
  const [confirmDeleteParticipant, setConfirmDeleteParticipant] = useState(null);

  // Helper to update group name
  const updateGroupName = (name) => {
    setGroup((g) => ({ ...g, name }));
  };

  // Add a participant to group
  const addParticipant = () => {
    const name = newParticipantName.trim();
    if (!name || group.participants.includes(name)) return;

    setGroup((g) => ({
      ...g,
      participants: [...g.participants, name],
    }));

    setNewParticipantName('');
  };

  // Check if participant is involved in any expense
  const participantInExpenses = (name) => {
    return group.expenses.some(
      (exp) =>
        exp.paidBy === name || exp.participants.includes(name)
    );
  };

  // Initiate participant delete with confirmation if needed
  const tryDeleteParticipant = (nameToDelete) => {
    if (participantInExpenses(nameToDelete)) {
      setConfirmDeleteParticipant(nameToDelete);
    } else {
      deleteParticipant(nameToDelete);
    }
  };

  // Confirm participant deletion after warning
  const confirmDelete = () => {
    if (confirmDeleteParticipant) {
      deleteParticipant(confirmDeleteParticipant);
      setConfirmDeleteParticipant(null);
    }
  };

  // Cancel participant deletion confirmation
  const cancelDelete = () => {
    setConfirmDeleteParticipant(null);
  };

  // Delete participant and clean up expenses accordingly
  const deleteParticipant = (nameToDelete) => {
    setGroup((g) => {
      const newParticipants = g.participants.filter((p) => p !== nameToDelete);

      // Remove participant from expenses and adjust payer if needed
      const newExpenses = g.expenses
        .map((exp) => {
          const filteredParticipants = exp.participants.filter(
            (p) => p !== nameToDelete
          );
          let newPaidBy =
            exp.paidBy === nameToDelete ? filteredParticipants[0] || '' : exp.paidBy;
          return { ...exp, participants: filteredParticipants, paidBy: newPaidBy };
        })
        .filter((exp) => exp.participants.length > 0); // remove expenses with no participants

      return {
        ...g,
        participants: newParticipants,
        expenses: newExpenses,
      };
    });

    // Clear selected expense participants if deleted
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

  // Delete expense by name
  const deleteExpense = (expenseName) => {
    setGroup((g) => ({
      ...g,
      expenses: g.expenses.filter((exp) => exp.name !== expenseName),
    }));
  };

  // Update new expense input fields
  const updateNewExpenseField = (field, value) => {
    setNewExpense((e) => ({ ...e, [field]: value }));
  };

  // Toggle participants in new expense participants list
  const toggleExpenseParticipant = (participant) => {
    setNewExpense((e) => {
      const exists = e.participants.includes(participant);
      const newParticipants = exists
        ? e.participants.filter((p) => p !== participant)
        : [...e.participants, participant];
      return { ...e, participants: newParticipants };
    });
  };

  // Check if expense name is unique within the group
  const isExpenseNameUnique = (name) => {
    const lowerName = name.trim().toLowerCase();
    return !group.expenses.some(
      (exp) => exp.name.toLowerCase() === lowerName
    );
  };

  // Add the new expense to group.expenses
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

    // reset new expense inputs
    setNewExpense({ name: '', amount: '', paidBy: '', participants: [] });
  };

  // Save group: add new or update existing
  const handleSave = () => {
    const trimmedName = group.name.trim();
    if (!trimmedName || group.participants.length === 0) return;

    if (mode === 'add') {
      const newId = groups.length > 0 ? Math.max(...groups.map((g) => g.id)) + 1 : 1;
      setGroups([...groups, { ...group, id: newId }]);
      setPage({ name: 'home' }); // after add, go home
    } else if (mode === 'edit' && group.id != null) {
      setGroups(groups.map((g) => (g.id === group.id ? group : g)));
      setPage({ name: 'view', groupId: group.id }); // after edit, go to view group
    }
  };

  // Disabled logic for save button
  const trimmedGroupName = group.name.trim();
  const groupNameTaken = groups.some(
    (g) => g.name.toLowerCase() === trimmedGroupName.toLowerCase() && g.id !== group.id
  );

  const saveDisabled =
    trimmedGroupName === '' || group.participants.length === 0 || groupNameTaken;

  // Disabled logic for add expense button
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
    <div style={{ padding: '20px' }}>
      <h2>{mode === 'add' ? 'Add Group' : 'Edit Group'}</h2>

      {/* group name input */}
      <input
        type="text"
        placeholder="Enter group name"
        value={group.name}
        onChange={(e) => updateGroupName(e.target.value)}
        style={{ display: 'block', marginBottom: '10px', width: '100%', maxWidth: '400px' }}
      />

      {/* Participants management (add/delete) */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Participants</h3>
        <input
          type="text"
          placeholder="Enter participant name"
          value={newParticipantName}
          onChange={(e) => setNewParticipantName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={addParticipant}>Add Participant</button>

        <ul>
          {group.participants.map((p, i) => (
            <li
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <span>{p}</span>
              <button
                onClick={() => tryDeleteParticipant(p)}
                style={{ color: 'red' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Expenses management (add/delete) */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Expenses</h3>

        <input
          type="text"
          placeholder="Expense name"
          value={newExpense.name}
          onChange={(e) => updateNewExpenseField('name', e.target.value)}
          style={{ marginRight: '10px' }}
        />
        {!isExpenseNameUnique(trimmedExpenseName) && trimmedExpenseName !== '' && (
          <p style={{ color: 'red', marginTop: 0 }}>Expense name already exists!</p>
        )}

        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => updateNewExpenseField('amount', e.target.value)}
          style={{ marginRight: '10px', width: '100px' }}
          min="0"
          step="0.01"
        />

        <select
          value={newExpense.paidBy}
          onChange={(e) => updateNewExpenseField('paidBy', e.target.value)}
          style={{ marginRight: '10px' }}
        >
          <option value="">Paid By</option>
          {group.participants.map((p, idx) => (
            <option key={idx} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Expense participants multi-select */}
        <div style={{ margin: '10px 0' }}>
          {group.participants.length === 0 && (
            <p>Add participants first to assign expense.</p>
          )}
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

        <button onClick={addExpense} disabled={addExpenseDisabled}>
          Add Expense
        </button>

        {/* List expenses */}
        {group.expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul>
            {group.expenses.map((expense, idx) => (
              <li key={idx} style={{ marginBottom: '10px' }}>
                <strong>{expense.name}</strong> - ${expense.amount.toFixed(2)}
                <br />
                Paid by: <em>{expense.paidBy}</em>
                <br />
                Shared among: {expense.participants.join(', ')}{' '}
                <button
                  onClick={() => deleteExpense(expense.name)}
                  style={{
                    color: 'red',
                    marginLeft: '10px',
                    cursor: 'pointer',
                  }}
                  title="Delete Expense"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Save and Cancel buttons */}
      <button onClick={handleSave} disabled={saveDisabled}>
        {mode === 'add' ? 'Save Group' : 'Save Changes'}
      </button>
      <button
        onClick={() =>
          setPage(
            mode === 'add' ? { name: 'home' } : { name: 'view', groupId: group.id }
          )
        }
        style={{ marginLeft: '10px' }}
      >
        Cancel
      </button>

      {/* Confirm Delete Participant Modal */}
      {confirmDeleteParticipant && (
        <div>
            <p>
              Participant <strong>{confirmDeleteParticipant}</strong> is involved in
              existing expenses. Deleting will remove them from those expenses and
              may affect your data. Are you sure?
            </p>
            <button
              onClick={confirmDelete}
              style={{ marginRight: '10px', backgroundColor: 'red', color: 'white' }}
            >
              Yes, Delete
            </button>
            <button onClick={cancelDelete}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default GroupForm;
