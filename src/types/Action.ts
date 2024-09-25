export interface Action {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
}

export interface Edge {
  id: string;
  startActionId: string;
  endActionId: string;
  weight: number;
}