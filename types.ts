export interface Drone {
  id: string;
  callsign: string;
  status: 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'RTB';
  position: [number, number, number]; // x, y, z
  heading: number;
  battery: number;
  velocity: number;
}

export interface Alert {
  id: string;
  code: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  timestamp: string;
  details: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERR' | 'SYS';
  message: string;
}

export interface WeatherData {
  windSpeed: number;
  windDirection: string;
  visibility: number; // meters
  temp: number; // Celsius
}
