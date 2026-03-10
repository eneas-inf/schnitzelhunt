export interface Task {
  type: (LocationTask | TravelTask | QrTask | FlipTask | PowerTask | WifiTask)['type'];
}

export interface LocationTask extends Task {
  type: 'location';
  targetName: string;
  targetPos: {
    lat: number,
    lng: number,
  };
}

export interface TravelTask extends Task {
  type: 'travel';
  targetDistanceMeters: number;
}

export interface QrTask extends Task {
  type: 'scanqr';
  targetValue: string;
}

export interface FlipTask extends Task {
  type: 'flip';
}

export interface PowerTask extends Task {
  type: 'power';
  requireDisconnect: boolean;
  requireConnect: boolean;
}

export interface WifiTask extends Task {
  type: 'wifi';
  requireDisconnect: boolean;
  requireConnect: boolean;
}
