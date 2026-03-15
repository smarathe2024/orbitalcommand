import React, { useState, useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Satellite, 
  Radio, 
  Activity, 
  Info, 
  Terminal, 
  Download, 
  Zap, 
  Globe as GlobeIcon,
  ChevronRight,
  X,
  Signal,
  Cpu
} from 'lucide-react';
import { COMMON_SATELLITES, getSatellitePosition, SatelliteData } from './satelliteData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const SatelliteDetails = ({ 
  satellite, 
  onClose,
  onCommunicate 
}: { 
  satellite: SatelliteData; 
  onClose: () => void;
  onCommunicate: (service: string) => void;
}) => {
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed right-4 top-4 bottom-4 w-96 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl z-50"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Satellite className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-bold text-white tracking-tight">{satellite.name}</h2>
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                satellite.status === 'active' ? "bg-emerald-500" : "bg-amber-500"
              )} />
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                {satellite.status}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <section>
          <div className="flex items-center gap-2 mb-3 text-zinc-400">
            <Info className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Description</h3>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {satellite.description}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Frequency</div>
            <div className="text-sm font-mono text-emerald-400">{satellite.frequency || 'N/A'}</div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Type</div>
            <div className="text-sm text-zinc-300 capitalize">{satellite.type}</div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 text-zinc-400">
            <Zap className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Available Services</h3>
          </div>
          <div className="space-y-2">
            {satellite.services.map((service) => (
              <button
                key={service}
                onClick={() => onCommunicate(service)}
                className="w-full group flex items-center justify-between p-4 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-xl transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                    <Radio className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400" />
                  </div>
                  <span className="text-sm text-zinc-300 group-hover:text-white font-medium">{service}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="p-6 bg-zinc-900/50 border-t border-white/10">
        <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
          <Terminal className="w-3 h-3" />
          <span>System Ready for Uplink</span>
        </div>
      </div>
    </motion.div>
  );
};

const CommConsole = ({ 
  service, 
  satellite, 
  onClose 
}: { 
  service: string; 
  satellite: SatelliteData; 
  onClose: () => void 
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      `Initializing SDR interface...`,
      `Tuning to ${satellite.frequency}...`,
      `Wait for satellite pass...`,
      `Signal locked. SNR: 24dB`,
      `Demodulating ${service} stream...`,
      `Decoding data packets...`,
      `Process complete.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[currentStep]}`]);
        setProgress((currentStep + 1) / steps.length * 100);
        currentStep++;
      } else {
        setIsProcessing(false);
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [service, satellite]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-white tracking-tight">Communication Terminal</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{service} @ {satellite.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-black font-mono text-xs space-y-2 h-80 overflow-y-auto custom-scrollbar">
          {logs.map((log, i) => (
            <div key={i} className={cn(
              "flex gap-3",
              i === logs.length - 1 ? "text-emerald-400" : "text-zinc-500"
            )}>
              <span className="opacity-50">[{i.toString().padStart(2, '0')}]</span>
              <span>{log}</span>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
              <span className="w-1 h-4 bg-emerald-400" />
              <span>Processing...</span>
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-900/50 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-zinc-500">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          
          {!isProcessing && (
            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download Result
              </button>
              <button onClick={onClose} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-colors">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const HelpOverlay = ({ 
  step, 
  onNext, 
  onSkip 
}: { 
  step: number; 
  onNext: () => void; 
  onSkip: () => void 
}) => {
  const steps = [
    {
      title: "Welcome to Orbital Command",
      description: "You are now connected to the global satellite tracking network. This interface allows you to monitor and communicate with public orbital assets in real-time.",
      icon: <GlobeIcon className="w-6 h-6 text-emerald-400" />
    },
    {
      title: "Explore the Globe",
      description: "Click and drag to rotate the Earth. Use your mouse wheel to zoom in on specific regions or satellites. The trails show the last 60 seconds of orbital history.",
      icon: <Activity className="w-6 h-6 text-blue-400" />
    },
    {
      title: "Satellite Intelligence",
      description: "Hover over or click any satellite icon to see its name and status. Emerald indicates active systems, while Amber suggests degraded performance.",
      icon: <Satellite className="w-6 h-6 text-emerald-400" />
    },
    {
      title: "Establish Communication",
      description: "Select a satellite to open its dossier. From there, you can initiate communication services like downloading weather images or receiving telemetry.",
      icon: <Radio className="w-6 h-6 text-purple-400" />
    }
  ];

  const currentStep = steps[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            {currentStep.icon}
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">{currentStep.title}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {currentStep.description}
            </p>
          </div>
          
          <div className="flex gap-2 justify-center">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === step ? "w-8 bg-emerald-500" : "w-2 bg-white/10"
                )} 
              />
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={onSkip}
              className="flex-1 py-3 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
            >
              Skip Tour
            </button>
            <button 
              onClick={onNext}
              className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              {step === steps.length - 1 ? "Begin Mission" : "Next Step"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const globeRef = useRef<any>();
  const [selectedSat, setSelectedSat] = useState<SatelliteData | null>(null);
  const [hoveredSat, setHoveredSat] = useState<string | null>(null);
  const [activeComm, setActiveComm] = useState<string | null>(null);
  const [satPositions, setSatPositions] = useState<any[]>([]);
  const [pathHistory, setPathHistory] = useState<Record<string, any[]>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [walkthroughStep, setWalkthroughStep] = useState<number | null>(null);

  const pathsData = useMemo(() => {
    return Object.entries(pathHistory)
      .filter(([_, path]) => Array.isArray(path) && path.length >= 2)
      .map(([name, path]) => ({
        points: path,
        color: COMMON_SATELLITES.find(s => s.name === name)?.status === 'active' ? '#10b981' : '#f59e0b',
        name
      }));
  }, [pathHistory]);

  // Check for first-time visit
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('orbital_command_tour');
    if (!hasSeenTour) {
      setWalkthroughStep(0);
    }
  }, []);

  const handleNextStep = () => {
    if (walkthroughStep !== null) {
      if (walkthroughStep < 3) {
        setWalkthroughStep(walkthroughStep + 1);
      } else {
        handleSkipTour();
      }
    }
  };

  const handleSkipTour = () => {
    setWalkthroughStep(null);
    localStorage.setItem('orbital_command_tour', 'true');
  };

  // Update positions and history
  useEffect(() => {
    const now = new Date();
    
    // Initial positions
    const initialPositions = COMMON_SATELLITES.map(sat => {
      const pos = getSatellitePosition(sat.tle1, sat.tle2, now);
      return pos ? { ...sat, ...pos } : null;
    }).filter(Boolean);
    setSatPositions(initialPositions);

    // Initial history (last 60 seconds)
    const initialHistory: Record<string, any[]> = {};
    COMMON_SATELLITES.forEach(sat => {
      const history = [];
      for (let i = 60; i >= 0; i--) {
        const pastDate = new Date(now.getTime() - i * 1000);
        const pos = getSatellitePosition(sat.tle1, sat.tle2, pastDate);
        if (pos) {
          history.push({ lat: pos.lat, lng: pos.lng, alt: pos.alt / 6371 });
        }
      }
      initialHistory[sat.name] = history;
    });
    setPathHistory(initialHistory);

    const timer = setInterval(() => {
      const tickNow = new Date();
      setCurrentTime(tickNow);
      
      const positions = COMMON_SATELLITES.map(sat => {
        const pos = getSatellitePosition(sat.tle1, sat.tle2, tickNow);
        return pos ? { ...sat, ...pos } : null;
      }).filter(Boolean);
      
      setSatPositions(positions);

      setPathHistory(prev => {
        const next = { ...prev };
        positions.forEach((sat: any) => {
          const history = next[sat.name] || [];
          const newHistory = [...history, { lat: sat.lat, lng: sat.lng, alt: sat.alt / 6371 }];
          next[sat.name] = newHistory.slice(-60);
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const globeData = useMemo(() => {
    return satPositions.map(sat => ({
      lat: sat.lat,
      lng: sat.lng,
      alt: sat.alt / 6371, // Altitude relative to earth radius
      radius: 0.01,
      color: sat.status === 'active' ? '#10b981' : '#f59e0b',
      name: sat.name,
      data: sat
    }));
  }, [satPositions]);

  return (
    <div className="h-screen w-screen bg-[#050505] overflow-hidden relative text-white font-sans">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 z-40 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-500 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <GlobeIcon className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Orbital Command</h1>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>System Online</span>
            </div>
            <span>•</span>
            <span>{currentTime.toUTCString()}</span>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col items-end gap-4">
          <button 
            onClick={() => setWalkthroughStep(0)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Info className="w-3 h-3 text-blue-400" />
            System Help
          </button>
          <div className="bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-8 shadow-xl">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Active Sats</span>
              <span className="text-xl font-mono font-bold text-emerald-400">{COMMON_SATELLITES.length}</span>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Ground Stations</span>
              <span className="text-xl font-mono font-bold text-white">124</span>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Network Load</span>
              <span className="text-xl font-mono font-bold text-white">12%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Globe */}
      <div className="absolute inset-0 z-0">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          
          /* Satellite Models */
          customLayerData={globeData}
          customThreeObject={(d: any) => {
            const group = new THREE.Group();
            
            // Satellite body
            const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);
            const material = new THREE.MeshPhongMaterial({ color: d.color });
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);

            // Solar panels
            const panelGeom = new THREE.PlaneGeometry(0.04, 0.01);
            const panelMat = new THREE.MeshPhongMaterial({ color: '#3b82f6', side: THREE.DoubleSide });
            const panel1 = new THREE.Mesh(panelGeom, panelMat);
            panel1.position.x = 0.025;
            group.add(panel1);
            
            const panel2 = new THREE.Mesh(panelGeom, panelMat);
            panel2.position.x = -0.025;
            group.add(panel2);

            return group;
          }}
          customThreeObjectUpdate={(obj, d: any) => {
            if (!globeRef.current || !d) return;
            try {
              const coords = globeRef.current.getCoords(d.lat, d.lng, d.alt);
              if (coords) {
                Object.assign(obj.position, coords);
                obj.lookAt(0, 0, 0);

                // Enlarge on hover or selection
                const isFocused = hoveredSat === d.name || selectedSat?.name === d.name;
                const targetScale = isFocused ? 2.5 : 1;
                obj.scale.set(targetScale, targetScale, targetScale);
              }
            } catch (e) {
              // Silently catch coordinate calculation errors during init
            }
          }}
          onCustomLayerClick={(d: any) => {
            setSelectedSat(d.data);
          }}
          onCustomLayerHover={(d: any) => {
            setHoveredSat(d ? d.name : null);
          }}

          /* Interactive Labels */
          labelsData={globeData}
          labelLat={(d: any) => d.lat}
          labelLng={(d: any) => d.lng}
          labelAltitude={(d: any) => d.alt + 0.02}
          labelText={(d: any) => d.name}
          labelSize={(d: any) => (hoveredSat === d.name || selectedSat?.name === d.name) ? 0.8 : 0.4}
          labelDotRadius={0.1}
          labelColor={(d: any) => d.color}
          labelResolution={2}
          onLabelClick={(d: any) => {
            setSelectedSat(d.data);
          }}
          onLabelHover={(d: any) => {
            setHoveredSat(d ? d.name : null);
          }}

          /* Orbital Trails */
          pathsData={pathsData}
          pathPoints="points"
          pathColor="color"
          pathPointLat="lat"
          pathPointLng="lng"
          pathPointAlt="alt"
          pathDashLength={0.01}
          pathDashGap={0.004}
          pathDashAnimateTime={10000}
          pathStroke={2}
        />
      </div>

      {/* UI Overlays */}
      <AnimatePresence>
        {walkthroughStep !== null && (
          <HelpOverlay 
            step={walkthroughStep} 
            onNext={handleNextStep} 
            onSkip={handleSkipTour} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSat && (
          <SatelliteDetails 
            satellite={selectedSat} 
            onClose={() => setSelectedSat(null)}
            onCommunicate={(service) => setActiveComm(service)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeComm && selectedSat && (
          <CommConsole 
            service={activeComm} 
            satellite={selectedSat} 
            onClose={() => setActiveComm(null)} 
          />
        )}
      </AnimatePresence>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
        <div className="pointer-events-auto space-y-4">
          <div className="bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-64 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Live Telemetry</span>
            </div>
            <div className="space-y-2">
              {satPositions.slice(0, 3).map(sat => (
                <div key={sat.name} className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-400">{sat.name}</span>
                  <span className="text-emerald-400">{sat.lat.toFixed(2)}°, {sat.lng.toFixed(2)}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-auto bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Uplink: Active</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">SDR: Ready</span>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
