import { twoline2satrec, propagate, gstime, eciToGeodetic } from 'satellite.js';

export interface SatelliteData {
  name: string;
  tle1: string;
  tle2: string;
  type: 'weather' | 'comm' | 'science' | 'iss';
  frequency?: string;
  status: 'active' | 'degraded' | 'inactive';
  description: string;
  services: string[];
}

export const COMMON_SATELLITES: SatelliteData[] = [
  {
    name: 'ISS (ZARYA)',
    tle1: '1 25544U 98067A   24074.52643519  .00016717  00000-0  30276-3 0  9999',
    tle2: '2 25544  51.6416  24.7462 0004817 124.8134  17.5855 15.49546708444006',
    type: 'iss',
    frequency: '145.800 MHz',
    status: 'active',
    description: 'International Space Station. Habitable artificial satellite in low Earth orbit.',
    services: ['Voice Repeater', 'APRS Packet', 'SSTV Images']
  },
  {
    name: 'NOAA 19',
    tle1: '1 33591U 09005A   24074.52445602  .00000074  00000-0  73412-4 0  9997',
    tle2: '2 33591  99.1945 137.6432 0013917 197.3452 162.7564 14.12463456778453',
    type: 'weather',
    frequency: '137.100 MHz',
    status: 'active',
    description: 'Polar-orbiting operational environmental satellite.',
    services: ['APT Weather Images', 'HRPT Data', 'Telemetry']
  },
  {
    name: 'NOAA 18',
    tle1: '1 28654U 05018A   24074.45678901  .00000085  00000-0  84523-4 0  9998',
    tle2: '2 28654  99.1567 145.2345 0014567 185.6789 174.3456 14.11234567889012',
    type: 'weather',
    frequency: '137.912 MHz',
    status: 'active',
    description: 'Older polar-orbiting weather satellite, still providing APT.',
    services: ['APT Weather Images', 'Telemetry']
  },
  {
    name: 'AO-91 (RadFxSat)',
    tle1: '1 43017U 17073E   24074.51234567  .00001234  00000-0  12345-3 0  9991',
    tle2: '2 43017  97.6543 123.4567 0254321 234.5678 125.4321 14.76543210987654',
    type: 'comm',
    frequency: '145.960 MHz',
    status: 'active',
    description: 'Amateur radio CubeSat with FM repeater.',
    services: ['FM Voice Repeater', 'Telemetry']
  },
  {
    name: 'HUBBLE SPACE TELESCOPE',
    tle1: '1 20580U 90037B   24074.48765432  .00000456  00000-0  56789-4 0  9995',
    tle2: '2 20580  28.4690  45.6789 0002345 345.6789  14.3456 15.08765432123456',
    type: 'science',
    frequency: '2255.5 MHz',
    status: 'active',
    description: 'Space telescope that was launched into low Earth orbit in 1990.',
    services: ['Science Data', 'Telemetry']
  }
];

export function getSatellitePosition(tle1: string, tle2: string, date: Date = new Date()) {
  const satrec = twoline2satrec(tle1, tle2);
  const positionAndVelocity = propagate(satrec, date);
  const gmst = gstime(date);

  if (typeof positionAndVelocity.position === 'boolean') return null;

  const positionGd = eciToGeodetic(positionAndVelocity.position, gmst);
  
  return {
    lat: (positionGd.latitude * 180) / Math.PI,
    lng: (positionGd.longitude * 180) / Math.PI,
    alt: positionGd.height
  };
}
