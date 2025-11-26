import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line } from 'recharts';
import { CalculationResult } from '../types';

interface DynoChartProps {
  data: CalculationResult;
  compareData: CalculationResult | null;
}

export const DynoChart: React.FC<DynoChartProps> = ({ data, compareData }) => {
  const chartData = useMemo(() => {
    const points = [];
    // Generate curve points from 2000 RPM to Redline + 500
    const startRpm = 2000;
    const endRpm = Math.max(data.peakHPRPM, compareData?.peakHPRPM || 0) + 1000;
    const steps = 30; 
    const stepSize = (endRpm - startRpm) / steps;

    // Helper to calculate HP at a given RPM for a specific dataset
    const calculatePoint = (res: CalculationResult, rpm: number) => {
      const torqueAtPeakHP = (res.peakHP * 5252) / res.peakHPRPM;
      const rpmDiffPeak = res.peakHPRPM - res.peakTorqueRPM;
      let k = (res.peakTorque - torqueAtPeakHP) / Math.pow(rpmDiffPeak, 2);
      if (k < 0) k = 0.000001;

      const rpmDiff = rpm - res.peakTorqueRPM;
      let torque = res.peakTorque - (k * Math.pow(rpmDiff, 2));
      
      const minTorque = res.peakTorque * 0.3;
      if (torque < minTorque) torque = minTorque;
      
      const hp = (torque * rpm) / 5252;
      return { hp: Math.round(hp), torque: Math.round(torque) };
    }

    for (let i = 0; i <= steps; i++) {
      const rpm = Math.round(startRpm + (i * stepSize));
      
      const current = calculatePoint(data, rpm);
      const compare = compareData ? calculatePoint(compareData, rpm) : null;

      points.push({
        rpm,
        hp: current.hp,
        torque: current.torque,
        compareHp: compare?.hp,
        compareTorque: compare?.torque
      });
    }
    return points;
  }, [data, compareData]);

  return (
    <div className="w-full h-80 bg-gray-900/50 rounded-xl border border-gray-800 p-4 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-400 font-tech text-xs uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ford-performance"></span> Estimated Dyno Curve
        </h3>
        {compareData && (
          <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
            <span className="w-3 h-0.5 bg-gray-500 border-t border-dashed"></span>
             Comparison Snapshot
          </div>
        )}
      </div>
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
          
          {/* Comparison Lines */}
          {compareData && (
            <>
              <Area type="monotone" dataKey="compareHp" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Compare HP" />
            </>
          )}

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
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};