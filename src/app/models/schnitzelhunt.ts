import { Task } from './task';

export interface SchnitzelhuntInfo {
  id: number;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  location: string;
  tasks: Task[];
}

export interface ActiveSchnitzelhunt {
  id: number;
  info: SchnitzelhuntInfo;
  startTime: Date,
  schnitzels: number;
  potatoes: number;
  currentTask: number;
}

export interface CompletedSchnitzelhunt {
  id: number;
  info: SchnitzelhuntInfo;
  schnitzels: number;
  potatoes: number;
  completionDate: Date;
  durationMs: number;
  points: number;
}
