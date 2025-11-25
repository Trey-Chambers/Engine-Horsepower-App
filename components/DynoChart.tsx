import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CalculationResult } from '../types';

interface DynoChartProps {
  data: CalculationResult;
}

export const DynoChart: React.FC<DynoChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const points = [];
    // Generate curve points from 2000 RPM to Redline + 500
    const startRpm = 2000;
    const endRpm = data.peakHPRPM + 1000;
    const steps = 20; // Increased resolution
    const stepSize = (endRpm - startRpm) / steps;

    // We need to fit a parabola T(rpm) = PeakT - k * (rpm - PeakTRPM)^2
    // such that it passes through (PeakHPRPM, TorqueAtPeakHP).
    // TorqueAtPeakHP = (PeakHP * 5252) / PeakHPRPM
    
    const torqueAtPeakHP = (data.peakHP * 5252) / data.peakHPRPM;
    const rpmDiffPeak = data.peakHPRPM - data.peakTorqueRPM;
    
    // Solve for k: TorqueAtPeakHP = PeakT - k * (rpmDiffPeak)^2
    // k = (PeakT - TorqueAtPeakHP) / (rpmDiffPeak^2)
    // Avoid division by zero or negative k (physically impossible if T_peak is actually peak)
    let k = (data.peakTorque - torqueAtPeakHP) / Math.pow(rpmDiffPeak, 2);
    
    if (k < 0) k = 0.000001; // Safety fallback

    for (let i = 0; i <= steps; i++) {
      const rpm = Math.round(startRpm + (i * stepSize));
      
      const rpmDiff = rpm - data.peakTorqueRPM;
      let torque = data.peakTorque - (k * Math.pow(rpmDiff, 2));
      
      // Clamp logic: Engines don't lose all torque instantly, but efficiency drops.
      // We clamp the minimum torque to simulate idle/friction limits at low RPM and breathing limits at high RPM
      const minTorque = data.peakTorque * 0.3;
      if (torque < minTorque) torque = minTorque;

      // Calculate HP from the simulated torque
      const hp = (torque * rpm) / 5252;

      points.push({
        rpm,
        hp: Math.round(hp),
        torque: Math.round(torque)
      });
    }
    return points;
  }, [data]);

  return (
    <div className="w-full h-80 bg-gray-900/50 rounded-xl border border-gray-800 p-4 mt-6">
      <h3 className="text-gray-400 font-tech text-xs uppercase mb-4 tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-ford-performance"></span> Estimated Dyno Curve
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorHp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1ea7fd" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#1ea7fd" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="rpm" 
            stroke="#9ca3af" 
            tick={{fontSize: 12, fontFamily: 'Rajdhani'}} 
            tickFormatter={(val) => `${val/1000}k`}
          />
          <YAxis 
            stroke="#9ca3af" 
            tick={{fontSize: 12, fontFamily: 'Rajdhani'}} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1f2937', color: '#fff' }}
            itemStyle={{ fontFamily: 'Orbitron' }}
            labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
          />
          <Area 
            type="monotone" 
            dataKey="hp" 
            stroke="#1ea7fd" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorHp)" 
            name="Horsepower"
          />
          <Area 
            type="monotone" 
            dataKey="torque" 
            stroke="#fbbf24" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorTq)" 
            name="Torque (lb-ft)"
          />
          {/* Peak Markers */}
          <ReferenceLine x={data.peakHPRPM} stroke="#1ea7fd" strokeDasharray="3 3" />
          <ReferenceLine x={data.peakTorqueRPM} stroke="#fbbf24" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};