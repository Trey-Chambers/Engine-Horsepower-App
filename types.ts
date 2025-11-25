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