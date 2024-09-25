import React, { useState } from 'react';
import { Action } from '../types/Action';

interface ActionCardProps {
  action: Action;
  onEdit: (action: Action) => void;
  onDelete: (id: string) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(action.name);
  const [editedDescription, setEditedDescription] = useState(action.description);

  const handleSave = () => {
    onEdit({
      ...action,
      name: editedName,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(action.name);
    setEditedDescription(action.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="action-card editing">
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    );
  }

  return (
    <div className="action-card">
      <h3>{action.name}</h3>
      <p>{action.description}</p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => onDelete(action.id)}>Delete</button>
    </div>
  );
};