import { Alert, Drone, LogEntry, WeatherData } from './types';

export const INITIAL_WEATHER: WeatherData = {
  windSpeed: 18.5,
  windDirection: 'E/SE',
  visibility: 8500,
  temp: 4.2
};

export const INITIAL_ALERTS: Alert[] = [
  {
    id: '1',
    code: 'EAGLE-03',
    severity: 'CRITICAL',
    message: 'BATTERY CELL IMBALANCE',
    details: 'Voltage deviation > 150mV on Cell 4. IMMED RTB.',
    timestamp: '13:13'
  },
  {
    id: '2',
    code: 'EAGLE-01',
    severity: 'WARNING',
    message: 'WIND SHEAR DETECTED',
    details: 'Gust factor 1.8x exceeding safety envelope.',
    timestamp: '13:12'
  },
  {
    id: '3',
    code: 'EAGLE-02',
    severity: 'WARNING',
    message: 'GEOFENCE PROXIMITY',
    details: 'Sector 4B approach. Distance < 50m.',
    timestamp: '13:10'
  }
];

export const INITIAL_DRONES: Drone[] = [
  {
    id: 'd1',
    callsign: 'EAGLE-01',
    status: 'WARNING',
    position: [-8, 2, -2],
    heading: 45,
    battery: 22,
    velocity: 12.4
  },
  {
    id: 'd2',
    callsign: 'EAGLE-02',
    status: 'OPERATIONAL',
    position: [6, 3, 4],
    heading: 120,
    battery: 58,
    velocity: 14.1
  },
  {
    id: 'd3',
    callsign: 'EAGLE-03',
    status: 'CRITICAL',
    position: [0, 1.8, 0], // Center stage
    heading: 270,
    battery: 78, // High battery but cell imbalance
    velocity: 22.8
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: 'l1', timestamp: '13:12:33', level: 'SYS', message: 'System initialized at 13:12:33 UTC' },
  { id: 'l2', timestamp: '13:12:34', level: 'INFO', message: 'Weather model updated: GFS-12' },
  { id: 'l3', timestamp: '13:12:35', level: 'INFO', message: 'Sector 7 Geo-fence active' },
  { id: 'l4', timestamp: '13:12:36', level: 'INFO', message: 'Link quality verified check_sum=ok' },
  { id: 'l5', timestamp: '13:12:40', level: 'ERR', message: 'ALERT: Threshold breach detected' },
  { id: 'l6', timestamp: '13:12:42', level: 'SYS', message: 'Real-time stream active...' },
];