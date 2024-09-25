import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Action, Edge } from '../types/Action';
import { ActionCard } from './ActionCard';
import { EdgeLine } from './EdgeLine';
import { executeQuery, runQuery, closeDatabase } from '../db/database';

export const ActionCanvas: React.FC = () => {
	const [actions, setActions] = useState<Action[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const actionsResult = await executeQuery('SELECT * FROM actions');
				const edgesResult = await executeQuery('SELECT * FROM edges');

				setActions(
					actionsResult[0]?.values.map((row: any) => ({
						id: row[0] as string,
						name: row[1] as string,
						description: row[2] as string,
						position: JSON.parse(row[3] as string),
					})) || []
				);

				setEdges(
					edgesResult[0]?.values.map((row: any) => ({
						id: row[0] as string,
						startActionId: row[1] as string,
						endActionId: row[2] as string,
						weight: row[3] as number,
					})) || []
				);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();

		return () => {
			closeDatabase();
		};
	}, []);

	const handleCreateAction = async () => {
		const newAction: Action = {
			id: uuidv4(),
			name: 'New Action',
			description: 'Description here',
			position: { x: Math.random() * 500, y: Math.random() * 500 },
		};

		try {
			await runQuery(
				'INSERT INTO actions (id, name, description, position) VALUES (?, ?, ?, ?)',
				[
					newAction.id,
					newAction.name,
					newAction.description,
					JSON.stringify(newAction.position),
				]
			);
			setActions([...actions, newAction]);
		} catch (error) {
			console.error('Error creating action:', error);
		}
	};

	const handleEditAction = async (updatedAction: Action) => {
		try {
			await runQuery(
				'UPDATE actions SET name = ?, description = ?, position = ? WHERE id = ?',
				[
					updatedAction.name,
					updatedAction.description,
					JSON.stringify(updatedAction.position),
					updatedAction.id,
				]
			);
			setActions(
				actions.map((action) =>
					action.id === updatedAction.id ? updatedAction : action
				)
			);
		} catch (error) {
			console.error('Error updating action:', error);
		}
	};

	const handleDeleteAction = async (id: string) => {
		try {
			await runQuery('DELETE FROM actions WHERE id = ?', [id]);
			await runQuery(
				'DELETE FROM edges WHERE startActionId = ? OR endActionId = ?',
				[id, id]
			);
			setActions(actions.filter((action) => action.id !== id));
			setEdges(
				edges.filter(
					(edge) => edge.startActionId !== id && edge.endActionId !== id
				)
			);
		} catch (error) {
			console.error('Error deleting action:', error);
		}
	};

	const handleDragAction = (id: string, newPosition: { x: number; y: number }) => {
		const updatedAction = actions.find((action) => action.id === id);
		if (updatedAction) {
			updatedAction.position = newPosition;
			handleEditAction(updatedAction);
		}
	};

	const handleActionSelect = (id: string) => {
		if (selectedActionId === null) {
			setSelectedActionId(id);
		} else if (selectedActionId !== id) {
			handleCreateEdge(selectedActionId, id);
			setSelectedActionId(null);
		} else {
			setSelectedActionId(null);
		}
	};

	const handleCreateEdge = async (startId: string, endId: string) => {
		const newEdge: Edge = {
			id: uuidv4(),
			startActionId: startId,
			endActionId: endId,
			weight: 1, // Default weight
		};

		try {
			await runQuery(
				'INSERT INTO edges (id, startActionId, endActionId, weight) VALUES (?, ?, ?, ?)',
				[newEdge.id, newEdge.startActionId, newEdge.endActionId, newEdge.weight]
			);
			setEdges([...edges, newEdge]);
		} catch (error) {
			console.error('Error creating edge:', error);
		}
	};

	const handleDeleteEdge = async (id: string) => {
		try {
			await runQuery('DELETE FROM edges WHERE id = ?', [id]);
			setEdges(edges.filter((edge) => edge.id !== id));
		} catch (error) {
			console.error('Error deleting edge:', error);
		}
	};

	return (
		<div className="action-canvas">
			<button onClick={handleCreateAction}>Create Action</button>
			{actions.map((action) => (
				<div
					key={action.id}
					style={{
						position: 'absolute',
						left: action.position.x,
						top: action.position.y,
						border: action.id === selectedActionId ? '2px solid blue' : 'none',
					}}
					draggable
					onDragEnd={(e) =>
						handleDragAction(action.id, {
							x: e.clientX,
							y: e.clientY,
						})
					}
					onClick={() => handleActionSelect(action.id)}
				>
					<ActionCard
						action={action}
						onEdit={handleEditAction}
						onDelete={handleDeleteAction}
					/>
				</div>
			))}
			{edges.map((edge) => (
				<EdgeLine
					key={edge.id}
					edge={edge}
					actions={actions}
					onDelete={() => handleDeleteEdge(edge.id)}
				/>
			))}
		</div>
	);
};