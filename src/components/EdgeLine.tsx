import React from 'react';
import { Edge, Action } from '../types/Action';

interface EdgeLineProps {
  edge: Edge;
  actions: Action[];
  onDelete: () => void;
}

export const EdgeLine: React.FC<EdgeLineProps> = ({ edge, actions, onDelete }) => {
  const startAction = actions.find(a => a.id === edge.startActionId);
  const endAction = actions.find(a => a.id === edge.endActionId);

  if (!startAction || !endAction) return null;

  const midX = (startAction.position.x + endAction.position.x) / 2;
  const midY = (startAction.position.y + endAction.position.y) / 2;

  return (
    <svg className="edge-line">
      <line
        x1={startAction.position.x}
        y1={startAction.position.y}
        x2={endAction.position.x}
        y2={endAction.position.y}
        stroke="black"
        strokeWidth={edge.weight}
        markerEnd="url(#arrowhead)"
      />
      <circle cx={midX} cy={midY} r="10" fill="red" onClick={onDelete} />
    </svg>
  );
};