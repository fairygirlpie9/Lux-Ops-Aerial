import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Grid, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Drone } from '../types';
import { Compass, Crosshair } from 'lucide-react';

const DroneEntity: React.FC<{ drone: Drone; isSelected: boolean; darkMode: boolean }> = ({ drone, isSelected, darkMode }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Simulation State
  const initialZ = drone.position[2];
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Hover effect for all
      const hoverY = Math.sin(time * 3 + parseInt(drone.id)) * 0.05;
      
      // Movement Logic
      let newZ = initialZ;
      let newX = drone.position[0];
      
      if (drone.status === 'OPERATIONAL' || drone.status === 'WARNING') {
        // Move along track back and forth - WIDER RANGE to go in/out of view
        const speed = 2 + (parseInt(drone.id) * 0.5);
        const range = 120; // Increased from 60 to 120
        newZ = initialZ + Math.sin(time * 0.2 * speed) * range;
        
        // Tilt body based on direction
        const direction = Math.cos(time * 0.2 * speed); 
        meshRef.current.rotation.x = direction * 0.15;
      } else if (drone.status === 'CRITICAL') {
         // Critical drone hovers erratically in place (Eagle-03)
         newZ = initialZ + Math.sin(time * 0.5) * 2; 
         meshRef.current.rotation.z = Math.sin(time * 5) * 0.05;
         meshRef.current.rotation.x = Math.sin(time * 2) * 0.1;
      }

      // Update position prop for extraction (hacky but works for visual sync)
      drone.position[0] = newX;
      drone.position[2] = newZ;

      // LOWER ALTITUDE - closer to track (y=0.5 instead of ~2)
      meshRef.current.position.set(newX, 0.5 + hoverY, newZ);
    }
  });

  const isCritical = drone.status === 'CRITICAL';
  // Lighter color in dark mode for visibility
  const bodyColor = isCritical ? '#DC2626' : drone.status === 'WARNING' ? '#F59E0B' : (darkMode ? '#9CA3AF' : '#374151');

  return (
    <group position={[drone.position[0], drone.position[1], drone.position[2]]} ref={meshRef}>
      
      {/* Target Lock Visualization */}
      {isSelected && (
         <group>
             {/* Base Ring */}
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
                 <ringGeometry args={[1.5, 1.6, 32]} />
                 <meshBasicMaterial color="#3B82F6" opacity={0.8} transparent side={THREE.DoubleSide} />
             </mesh>
             
             {/* Vertical Beam */}
             <mesh position={[0, -2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 5]} />
                <meshBasicMaterial color="#3B82F6" opacity={0.3} transparent />
             </mesh>

             {/* UI Tag - strictly attached to mesh */}
             {/* Moved position to prevent cutoff */}
             <Html position={[2, 0, 0]} center zIndexRange={[10, 0]}>
                 <div className="flex flex-col items-start pointer-events-none transition-opacity duration-200 ml-4">
                     <div className="h-px w-8 bg-blue-500 mb-1 origin-left"></div>
                     <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 font-bold whitespace-nowrap shadow-sm">TARGET LOCK</span>
                 </div>
             </Html>
         </group>
      )}

      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
         <circleGeometry args={[1.0, 32]} />
         <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Drone Body - Scaled up for visibility */}
      <group scale={[2, 2, 2]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.15, 0.8]} />
            <meshStandardMaterial color={bodyColor} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
             <cylinderGeometry args={[0.15, 0.15, 0.15]} />
             <meshStandardMaterial color="#111" />
          </mesh>
          
          {/* Rotors - Spinning */}
          {[[-0.5, 0, -0.5], [0.5, 0, -0.5], [-0.5, 0, 0.5], [0.5, 0, 0.5]].map((pos, i) => (
              <Rotor key={i} position={[pos[0], 0.1, pos[2]]} />
          ))}
      </group>

      {/* Label */}
      <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div className={`text-[9px] font-bold px-1.5 py-0.5 shadow-sm whitespace-nowrap transition-all border flex items-center gap-1 ${
            isCritical 
            ? 'bg-red-600 text-white border-red-700' 
            : isSelected 
              ? 'bg-blue-600 text-white border-blue-700'
              : (darkMode ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-white/90 text-gray-800 border-gray-200')
        }`}>
          {isCritical && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>}
          {drone.callsign}
        </div>
      </Html>

      {/* Critical Zone Visual */}
      {isCritical && (
         <CriticalZone />
      )}
    </group>
  );
};

const Rotor: React.FC<{ position: number[] }> = ({ position }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 20; // Spin
        }
    });
    return (
        <mesh ref={ref} position={[position[0], position[1], position[2]]}>
             <boxGeometry args={[0.7, 0.02, 0.05]} />
             <meshBasicMaterial color="#9CA3AF" transparent opacity={0.8} />
             <mesh rotation={[0, Math.PI/2, 0]}>
                 <boxGeometry args={[0.7, 0.02, 0.05]} />
                 <meshBasicMaterial color="#9CA3AF" transparent opacity={0.8} />
             </mesh>
        </mesh>
    )
}

const CriticalZone = () => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            const s = 2.5 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
            ref.current.scale.set(s, s, s);
            (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.3 - (s - 2.5) * 0.2;
        }
    });
    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
             <mesh ref={ref}>
                <ringGeometry args={[1.5, 1.6, 64]} />
                <meshBasicMaterial color="#EF4444" transparent opacity={0.5} />
             </mesh>
        </group>
    )
}

const RadarGrid: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
    const color = darkMode ? "#374151" : "#E5E7EB";
    return (
        <group rotation={[-Math.PI/2, 0, 0]} position={[0, 0.02, 0]}>
            {/* Concentric circles for Radar look */}
            <mesh>
                <ringGeometry args={[10, 10.1, 64]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} />
            </mesh>
            <mesh>
                <ringGeometry args={[20, 20.1, 64]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} />
            </mesh>
            <mesh>
                <ringGeometry args={[30, 30.1, 64]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} />
            </mesh>
            {/* Cross axis */}
             <mesh position={[0, 0, 0]}>
                 <planeGeometry args={[0.1, 60]} />
                 <meshBasicMaterial color={color} transparent opacity={0.5} />
             </mesh>
             <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                 <planeGeometry args={[0.1, 60]} />
                 <meshBasicMaterial color={color} transparent opacity={0.5} />
             </mesh>
        </group>
    )
}

const Infrastructure: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Extended Rails - Dark High Contrast - 200m length */}
      <mesh position={[0, 0.05, -1]} receiveShadow>
        <boxGeometry args={[200, 0.1, 0.15]} />
        <meshStandardMaterial color={darkMode ? "#6B7280" : "#374151"} />
      </mesh>
      <mesh position={[0, 0.05, 1]} receiveShadow>
        <boxGeometry args={[200, 0.1, 0.15]} />
        <meshStandardMaterial color={darkMode ? "#6B7280" : "#374151"} />
      </mesh>
      
      {/* Ties Loop - Extended to cover full rail length (-100 to 100) */}
      {Array.from({ length: 200 }).map((_, i) => (
         <mesh key={i} position={[-100 + i, 0, 0]} receiveShadow>
             <boxGeometry args={[0.4, 0.05, 3]} />
             <meshStandardMaterial color={darkMode ? "#1F2937" : "#D1D5DB"} />
         </mesh>
      ))}
    </group>
  );
}

// Scene component to access three fiber context for controls
const SceneController: React.FC<{ 
    setCompassHeading: (h: number) => void; 
    setLiveCoords: (c: any) => void;
    drones: Drone[];
    selectedDroneId: string | null;
}> = ({ setCompassHeading, setLiveCoords, drones, selectedDroneId }) => {
    const controlsRef = useRef<any>(null);
    const { camera } = useThree();

    useFrame((state) => {
        // Update compass heading from controls
        if (controlsRef.current) {
            setCompassHeading(controlsRef.current.getAzimuthalAngle());
        }

        // Update Live Coords based on selected drone simulation
        const selected = drones.find(d => d.id === selectedDroneId);
        if (selected) {
            // Convert scene coords to fake Lat/Lon
            const baseLat = 59.9139;
            const baseLon = 10.7522;
            const latOffset = selected.position[2] * 0.0001; // Z maps to Lat
            const lonOffset = selected.position[0] * 0.0001; // X maps to Lon
            
            setLiveCoords({
                lat: baseLat + latOffset,
                lon: baseLon + lonOffset,
                status: 'TRACKING'
            });
        } else {
            setLiveCoords(prev => ({ ...prev, status: 'SCANNING' }));
        }
    });

    return (
        <OrbitControls 
            ref={controlsRef}
            makeDefault 
            enableZoom={true} 
            zoomSpeed={0.5}
            minZoom={20}
            maxZoom={60}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.2} 
            minPolarAngle={0}
            target={[0, 0, 0]} 
        />
    );
}

const OperationalMap: React.FC<{ drones: Drone[]; selectedDroneId: string | null; darkMode: boolean }> = ({ drones, selectedDroneId, darkMode }) => {
  const [heading, setHeading] = useState(0);
  const [coords, setCoords] = useState({ lat: 59.9139, lon: 10.7522, status: 'SCANNING' });

  return (
    <div className={`w-full h-full relative ${darkMode ? 'bg-[#111827]' : 'bg-[#F9FAFB]'}`}>
      <div className={`absolute top-4 right-4 z-10 backdrop-blur border px-3 py-2 shadow-sm rounded-sm pointer-events-none ${
          darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/90 border-gray-200'
      }`}>
         <h3 className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Sector-7 Live View</h3>
         <div className="text-[9px] text-gray-500 mt-0.5">ORTHOGRAPHIC VECTOR FEED</div>
      </div>

      {/* Compass / HUD Overlay */}
      <div className="absolute bottom-4 left-4 z-10 flex items-end gap-3 pointer-events-none">
          <div className={`backdrop-blur border p-2 rounded-full shadow-sm ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
             <div className={`w-10 h-10 rounded-full border-2 relative flex items-center justify-center transition-transform duration-200 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`} style={{ transform: `rotate(${heading * (180/Math.PI)}deg)` }}>
                 <div className="absolute inset-0 rounded-full border-t-4 border-red-500 w-full h-full"></div>
                 <Compass size={20} className={darkMode ? 'text-gray-500' : 'text-gray-400'} style={{ transform: `rotate(${-heading * (180/Math.PI)}deg)` }} /> 
                 <div className={`absolute top-0 text-[8px] font-bold -mt-1.5 px-0.5 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`} style={{ transform: `rotate(${-heading * (180/Math.PI)}deg)` }}>N</div>
             </div>
          </div>
          <div className={`backdrop-blur border px-3 py-2 shadow-sm rounded-sm min-w-[120px] ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
             <div className="flex items-center gap-2 mb-1">
                <Crosshair size={12} className={coords.status === 'TRACKING' ? 'text-blue-500 animate-pulse' : 'text-gray-500'} />
                <span className={`text-[10px] font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{coords.status === 'TRACKING' ? 'LIVE TRACKING' : 'SECTOR SCAN'}</span>
             </div>
             {coords.status === 'TRACKING' ? (
                 <div className="font-mono text-[10px] text-gray-500 leading-tight">
                    LAT: {coords.lat.toFixed(6)}<br/>
                    LON: {coords.lon.toFixed(6)}
                 </div>
             ) : (
                 <div className="font-mono text-[10px] text-gray-500 leading-tight italic">
                    Acquiring Signal...
                 </div>
             )}
          </div>
      </div>

      <Canvas shadows dpr={[1, 2]} className="w-full h-full">
        <color attach="background" args={[darkMode ? '#111827' : '#F9FAFB']} />
        
        <SceneController 
            setCompassHeading={setHeading} 
            setLiveCoords={setCoords}
            drones={drones}
            selectedDroneId={selectedDroneId}
        />
        
        {/* Camera setup - Adjusted zoom/position */}
        <OrthographicCamera 
            makeDefault 
            position={[30, 30, 30]} 
            zoom={30} 
            near={-100} 
            far={300} 
        />
        
        <ambientLight intensity={darkMode ? 0.5 : 1.5} />
        <directionalLight 
            position={[10, 20, 5]} 
            intensity={darkMode ? 0.8 : 1.2} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
        />
        
        <group position={[0, -2, 0]}>
            <Grid 
                args={[200, 200]} 
                cellSize={1} 
                cellThickness={0.5} 
                cellColor={darkMode ? "#374151" : "#E5E7EB"} 
                sectionSize={5} 
                sectionThickness={1} 
                sectionColor={darkMode ? "#4B5563" : "#D1D5DB"} 
                fadeDistance={100} 
                infiniteGrid
            />
            <RadarGrid darkMode={darkMode} />
            <Infrastructure darkMode={darkMode} />
            {drones.map(d => (
                <DroneEntity 
                    key={d.id} 
                    drone={d} 
                    isSelected={selectedDroneId === d.id} 
                    darkMode={darkMode}
                />
            ))}
        </group>
      </Canvas>
    </div>
  );
};

export default OperationalMap;