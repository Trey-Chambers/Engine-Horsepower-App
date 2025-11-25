import React from 'react';

interface GaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color?: string;
  subLabel?: string;
}

export const Gauge: React.FC<GaugeProps> = ({ 
  label, 
  value, 
  max, 
  unit, 
  color = '#1ea7fd',
  subLabel
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900/50 rounded-xl border border-gray-800 shadow-xl relative overflow-hidden group">
      {/* Background glow effect */}
      <div 
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
      />
      
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Track Circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#1f2937"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Digital Readout */}
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold font-gauge tracking-tighter text-white">
            {value.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 font-tech uppercase">{unit}</span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">{label}</h3>
        {subLabel && <p className="text-xs text-ford-performance mt-1">{subLabel}</p>}
      </div>
    </div>
  );
};