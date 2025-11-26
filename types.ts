export enum EngineFamily {
  WINDSOR = 'Windsor (Small Block)',
  CLEVELAND = 'Cleveland (335 Series)',
  FE = 'FE Series (Big Block)',
  SERIES_385 = '385 Series (Big Block)',
  MODULAR = 'Modular / Coyote',
}

export interface PartSpec {
  id: string;
  name: string;
  family: EngineFamily | 'ALL';
  // Performance Modifiers
  flowModifier?: number; // 1.0 = baseline for that family
  rpmAdder?: number; // How much RPM this part supports
  veAdder?: number; // Volumetric Efficiency adder
  torqueMod?: number; // Torque characteristic
  topEndMod?: number; // High RPM breathing
  desc?: string; // Short description for UI
  // UI Display Stats
  stats?: {
    flow?: string;      // e.g. "250/190 cfm"
    chamber?: string;   // e.g. "58cc"
    vol?: string;       // e.g. "185cc"
    valves?: string;    // e.g. "2.02/1.60"
    duration?: string;  // e.g. "224/232 @ .050"
    lift?: string;      // e.g. ".555/.565"
    rpm?: string;       // e.g. "1500-6500"
    type?: string;      // e.g. "Dual Plane"
  };
}

export interface EngineSpec {
  family: EngineFamily;
  displacementCI: number;
  headId: string;      // ID reference to PartSpec
  camId: string;       // ID reference to PartSpec
  intakeId: string;    // ID reference to PartSpec
  forcedInductionPsi: number;
  transmission: 'Manual' | 'Auto';
  compressionRatio: number;
}

export interface CalculationResult {
  peakHP: number;
  peakTorque: number;
  peakHPRPM: number;
  peakTorqueRPM: number;
  wheelHP: number;
  vePercentage: number;
  messages: string[];
}