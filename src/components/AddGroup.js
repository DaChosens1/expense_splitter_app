import React, { useState } from 'react';

function AddGroup({ setPage, setGroups }) {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Add Group</h2>

            
            {/* Go Home Button */}
            <button
                onClick={() => setPage(0)}
            >
                 Back to Home
            </button>
        </div>
    );
}

export default AddGroup;
