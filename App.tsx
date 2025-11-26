import React, { useState, useEffect } from 'react';
import { 
  EngineFamily, 
  EngineSpec, 
  CalculationResult
} from './types';
import { 
  FAMILY_DISPLACEMENTS, 
  DISPLACEMENT_LABELS,
  FORD_PARTS_DB
} from './constants';
import { calculateEnginePower } from './services/engineMath';
import { Gauge } from './components/Gauge';
import { DynoChart } from './components/DynoChart';
import { Settings, Info, Gauge as GaugeIcon, AlertTriangle, Wind, ChevronRight, Activity, Copy, Camera, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  // Default State: A classic 5.0 Mustang setup
  const [spec, setSpec] = useState<EngineSpec>({
    family: EngineFamily.WINDSOR,
    displacementCI: 302,
    headId: 'w_stock_e7',
    camId: 'w_stock_ho',
    intakeId: 'w_stock_efi',
    forcedInductionPsi: 0,
    transmission: 'Manual',
    compressionRatio: 9.0
  });

  const [results, setResults] = useState<CalculationResult | null>(null);
  const [compareResults, setCompareResults] = useState<CalculationResult | null>(null);

  // Calculate whenever spec changes
  useEffect(() => {
    const res = calculateEnginePower(spec);
    setResults(res);
  }, [spec]);

  // Handle Family Change
  const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFamily = e.target.value as EngineFamily;
    
    const defaultHeads = FORD_PARTS_DB.heads[newFamily][0].id;
    const defaultCam = FORD_PARTS_DB.cams[newFamily][0].id;
    const defaultIntake = FORD_PARTS_DB.intakes[newFamily][0].id;

    setSpec(prev => ({
      ...prev,
      family: newFamily,
      displacementCI: FAMILY_DISPLACEMENTS[newFamily][0],
      headId: defaultHeads,
      camId: defaultCam,
      intakeId: defaultIntake
    }));
    setCompareResults(null); // Clear comparison when changing platform
  };

  const copyBuildToClipboard = () => {
    if (!results) return;
    const text = `
BLUE OVAL BUILD ESTIMATOR
-------------------------
Platform: ${spec.family}
Displacement: ${spec.displacementCI}ci
Heads: ${FORD_PARTS_DB.heads[spec.family].find(h => h.id === spec.headId)?.name}
Cam: ${FORD_PARTS_DB.cams[spec.family].find(c => c.id === spec.camId)?.name}
Intake: ${FORD_PARTS_DB.intakes[spec.family].find(i => i.id === spec.intakeId)?.name}
Induction: ${spec.forcedInductionPsi > 0 ? `${spec.forcedInductionPsi}psi Boost` : 'Naturally Aspirated'}
Compression: ${spec.compressionRatio}:1

ESTIMATED RESULTS
-----------------
Peak HP: ${results.peakHP} @ ${results.peakHPRPM} RPM
Peak TQ: ${results.peakTorque} @ ${results.peakTorqueRPM} RPM
Wheel HP: ${results.wheelHP} (${spec.transmission})
    `.trim();
    navigator.clipboard.writeText(text);
    alert("Build sheet copied to clipboard!");
  };

  const toggleSnapshot = () => {
    if (compareResults) {
      setCompareResults(null);
    } else {
      setCompareResults(results);
    }
  };

  // Helper to render spec badges
  const renderSpecBadges = (stats?: Record<string, string>) => {
    if (!stats) return null;
    return (
      <div className="flex flex-wrap gap-2 mt-2 px-1">
        {Object.entries(stats).map(([key, val]) => (
          <span key={key} className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 border border-gray-700">
            {key}: <span className="text-gray-200">{val}</span>
          </span>
        ))}
      </div>
    );
  };

  const selectedHead = FORD_PARTS_DB.heads[spec.family].find(p => p.id === spec.headId);
  const selectedCam = FORD_PARTS_DB.cams[spec.family].find(p => p.id === spec.camId);
  const selectedIntake = FORD_PARTS_DB.intakes[spec.family].find(p => p.id === spec.intakeId);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-ford-blue selection:text-white pb-20">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-ford-blue to-ford-light rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(44,57,104,0.5)]">
              <GaugeIcon className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-tech text-xl text-white tracking-widest uppercase">Blue Oval</h1>
              <p className="text-xs text-ford-performance font-semibold tracking-wider">Build Estimator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={copyBuildToClipboard}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs font-bold text-gray-300 transition-colors border border-gray-700"
            >
              <Copy className="w-3 h-3" /> COPY BUILD
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Controls */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 text-ford-performance">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <h2 className="font-tech text-lg uppercase tracking-wide">Configuration</h2>
              </div>
              {compareResults && (
                <span className="text-xs bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded border border-yellow-800/50 animate-pulse">
                  COMPARING
                </span>
              )}
            </div>

            <div className="space-y-6">
              {/* Engine Family */}
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Engine Architecture</label>
                <select 
                  className="w-full bg-[#050505] border border-gray-700 rounded-md px-3 py-3 text-sm focus:border-ford-performance focus:ring-1 focus:ring-ford-performance focus:outline-none transition-colors"
                  value={spec.family}
                  onChange={handleFamilyChange}
                >
                  {Object.values(EngineFamily).map(fam => (
                    <option key={fam} value={fam}>{fam}</option>
                  ))}
                </select>
              </div>

              {/* Displacement */}
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Displacement</label>
                <select 
                  className="w-full bg-[#050505] border border-gray-700 rounded-md px-3 py-3 text-sm focus:border-ford-performance focus:ring-1 focus:ring-ford-performance focus:outline-none transition-colors"
                  value={spec.displacementCI}
                  onChange={(e) => setSpec({...spec, displacementCI: Number(e.target.value)})}
                >
                  {FAMILY_DISPLACEMENTS[spec.family].map(ci => (
                    <option key={ci} value={ci}>{DISPLACEMENT_LABELS[ci] || `${ci} ci`}</option>
                  ))}
                </select>
              </div>

              {/* Heads */}
              <div className="space-y-2 group">
                <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Cylinder Heads</label>
                <select 
                  className="w-full bg-[#050505] border border-gray-700 rounded-md px-3 py-3 text-sm focus:border-ford-performance focus:ring-1 focus:ring-ford-performance focus:outline-none transition-colors"
                  value={spec.headId}
                  onChange={(e) => setSpec({...spec, headId: e.target.value})}
                >
                  {FORD_PARTS_DB.heads[spec.family].map(part => (
                    <option key={part.id} value={part.id}>{part.name}</option>
                  ))}
                </select>
                <div className="pt-1">
                  <p className="text-[10px] text-gray-500 px-1">{selectedHead?.desc}</p>
                  {renderSpecBadges(selectedHead?.stats)}
                </div>
              </div>

              {/* Camshaft */}
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Camshaft Profile</label>
                <select 
                  className="w-full bg-[#050505] border border-gray-700 rounded-md px-3 py-3 text-sm focus:border-ford-performance focus:ring-1 focus:ring-ford-performance focus:outline-none transition-colors"
                  value={spec.camId}
                  onChange={(e) => setSpec({...spec, camId: e.target.value})}
                >
                  {FORD_PARTS_DB.cams[spec.family].map(part => (
                    <option key={part.id} value={part.id}>{part.name}</option>
                  ))}
                </select>
                 <div className="pt-1">
                  <p className="text-[10px] text-gray-500 px-1">{selectedCam?.desc}</p>
                  {renderSpecBadges(selectedCam?.stats)}
                </div>
              </div>

              {/* Induction */}
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Intake Manifold</label>
                <select 
                  className="w-full bg-[#050505] border border-gray-700 rounded-md px-3 py-3 text-sm focus:border-ford-performance focus:ring-1 focus:ring-ford-performance focus:outline-none transition-colors"
                  value={spec.intakeId}
                  onChange={(e) => setSpec({...spec, intakeId: e.target.value})}
                >
                  {FORD_PARTS_DB.intakes[spec.family].map(part => (
                    <option key={part.id} value={part.id}>{part.name}</option>
                  ))}
                </select>
                 <div className="pt-1">
                  <p className="text-[10px] text-gray-500 px-1">{selectedIntake?.desc}</p>
                  {renderSpecBadges(selectedIntake?.stats)}
                </div>
              </div>

              {/* Compression Ratio */}
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <div className="flex justify-between items-center">
                    <label className="text-xs uppercase text-gray-500 font-bold tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      Static Compression
                    </label>
                    <span className="font-mono text-ford-performance font-bold">{spec.compressionRatio.toFixed(1)}:1</span>
                </div>
                <input 
                  type="range" 
                  min="7.5" 
                  max="14.0" 
                  step="0.1"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-ford-performance"
                  value={spec.compressionRatio}
                  onChange={(e) => setSpec({...spec, compressionRatio: Number(e.target.value)})}
                />
              </div>

              {/* Forced Induction Slider */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                   <label className="text-xs uppercase text-gray-500 font-bold tracking-wider flex items-center gap-2">
                      <Wind className="w-4 h-4 text-white" />
                      Boost Pressure
                   </label>
                   <span className="font-mono text-ford-performance font-bold">{spec.forcedInductionPsi} psi</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="25" 
                  step="1"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-ford-performance"
                  value={spec.forcedInductionPsi}
                  onChange={(e) => setSpec({...spec, forcedInductionPsi: Number(e.target.value)})}
                />
              </div>

              {/* Transmission */}
              <div className="space-y-2 pt-2">
                <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Transmission</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className={`px-3 py-2 rounded border text-sm font-medium transition-all ${spec.transmission === 'Manual' ? 'bg-ford-blue border-ford-blue text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
                    onClick={() => setSpec({...spec, transmission: 'Manual'})}
                  >
                    Manual
                  </button>
                  <button 
                     className={`px-3 py-2 rounded border text-sm font-medium transition-all ${spec.transmission === 'Auto' ? 'bg-ford-blue border-ford-blue text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
                     onClick={() => setSpec({...spec, transmission: 'Auto'})}
                  >
                    Auto
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Right Column: Dashboard */}
        <section className="lg:col-span-8 space-y-6">
          {/* Main Gauges */}
          {results && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Gauge 
                label="Peak Horsepower" 
                value={results.peakHP} 
                max={1200} 
                unit="HP" 
                color="#1ea7fd"
                subLabel={`@ ${results.peakHPRPM} RPM`}
              />
              <Gauge 
                label="Peak Torque" 
                value={results.peakTorque} 
                max={1200} 
                unit="LB-FT" 
                color="#fbbf24"
                subLabel={`@ ${results.peakTorqueRPM} RPM`}
              />
              <Gauge 
                label="Estimated Wheel HP" 
                value={results.wheelHP} 
                max={1200} 
                unit="WHP" 
                color="#ef4444"
                subLabel={spec.transmission}
              />
            </div>
          )}

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 text-center">
                <p className="text-xs text-gray-500 uppercase font-bold">VE Efficiency</p>
                <p className="text-lg font-mono text-white">{results?.vePercentage}%</p>
             </div>
             <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 text-center">
                <p className="text-xs text-gray-500 uppercase font-bold">Disp / Cylinder</p>
                <p className="text-lg font-mono text-white">{(spec.displacementCI / 8).toFixed(1)} ci</p>
             </div>
             <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 text-center">
                <p className="text-xs text-gray-500 uppercase font-bold">HP / CID</p>
                <p className="text-lg font-mono text-white">{(results ? results.peakHP / spec.displacementCI : 0).toFixed(2)}</p>
             </div>
             <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 text-center">
                <p className="text-xs text-gray-500 uppercase font-bold">Pressure Ratio</p>
                <p className="text-lg font-mono text-white">{((14.7 + spec.forcedInductionPsi) / 14.7).toFixed(2)}:1</p>
             </div>
          </div>

          {/* Dyno Chart */}
          <div className="relative">
            {results && <DynoChart data={results} compareData={compareResults} />}
            <div className="absolute top-6 right-6 flex gap-2">
               <button 
                  onClick={toggleSnapshot}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors border ${compareResults ? 'bg-yellow-900/20 text-yellow-500 border-yellow-700/50' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'}`}
               >
                  {compareResults ? <RotateCcw className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                  {compareResults ? 'CLEAR GHOST' : 'SNAPSHOT'}
               </button>
            </div>
          </div>

          {/* Messages & Warnings */}
          {results && results.messages.length > 0 && (
             <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 text-yellow-500">
                   <AlertTriangle className="w-5 h-5" />
                   <h3 className="font-bold text-sm uppercase">Build Notes</h3>
                </div>
                <ul className="space-y-1">
                   {results.messages.map((msg, idx) => (
                      <li key={idx} className="text-sm text-yellow-200/80 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                        {msg}
                      </li>
                   ))}
                </ul>
             </div>
          )}

          {/* Pro Tip Section */}
          <div className="bg-ford-blue/10 border border-ford-blue/30 rounded-lg p-4 flex items-start gap-4">
            <Info className="w-6 h-6 text-ford-performance shrink-0" />
            <div>
              <h3 className="text-ford-performance font-bold text-sm uppercase mb-1">Parts Database Updated</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The database now includes AFR Enforcer, Trick Flow 11R, Coyote Gen 3, and Voodoo specific parts. 
                Use the Snapshot button to compare your new build against your previous setup.
              </p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default App;