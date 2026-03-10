export interface SchnitzelhuntInfo {
  id: number;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  location: string;
}

export interface ActiveSchnitzelhunt {
  id: number;
  hunt: SchnitzelhuntInfo;
  startTime: Date,
  schnitzels: number;
  potatoes: number;
  currentTask: number;
}

export interface CompletedSchnitzelhunt {
  id: number;
  hunt: SchnitzelhuntInfo;
  schnitzels: number;
  potatoes: number;
  completionDate: Date;
  durationMs: number;
  points: number;
}
