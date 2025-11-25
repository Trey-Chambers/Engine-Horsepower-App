import { EngineSpec, CalculationResult, EngineFamily } from '../types';
import { FORD_PARTS_DB, FAMILY_RPM_LIMITS } from '../constants';

export const calculateEnginePower = (spec: EngineSpec): CalculationResult => {
  const { displacementCI, family, headId, camId, intakeId, forcedInductionPsi, transmission, compressionRatio } = spec;

  // Lookup Component Specs
  // We use "find" safely, falling back to the first item if something is wrong with state
  const headSpec = FORD_PARTS_DB.heads[family].find(p => p.id === headId) || FORD_PARTS_DB.heads[family][0];
  const camSpec = FORD_PARTS_DB.cams[family].find(p => p.id === camId) || FORD_PARTS_DB.cams[family][0];
  const intakeSpec = FORD_PARTS_DB.intakes[family].find(p => p.id === intakeId) || FORD_PARTS_DB.intakes[family][0];

  // 1. Establish Base Efficiency
  let baseVE = headSpec.flowModifier || 0.8;
  
  // Family Adjustments (Architecture specifics)
  if (family === EngineFamily.MODULAR) {
    baseVE += 0.05; // OHC naturally breathes better
  }

  // Cam Adjustments
  baseVE += (camSpec.veAdder || 0);

  // Compression Ratio Adjustments
  // Base reference is 9.5:1. Roughly 3.2% power difference per point of compression.
  const baseCR = 9.5;
  const crDelta = compressionRatio - baseCR;
  const crMultiplier = 1 + (crDelta * 0.032);

  // Induction Adjustments (Torque efficiency)
  const torqueMod = intakeSpec.torqueMod || 1.0;
  
  // Calculate Peak Torque (NA)
  // Rule of thumb: Good street engines make ~1.2-1.3 lb-ft per CI
  // Highly efficient race engines make ~1.5+
  const torqueEfficiency = 1.15 * baseVE * torqueMod * crMultiplier;
  let rawTorque = displacementCI * torqueEfficiency;

  // Calculate RPM Peaks
  let peakHpRpm = camSpec.rpmAdder || 5000;
  
  // Induction shifts RPM
  // Short runner / Single plane adds RPM
  if ((intakeSpec.topEndMod || 1) > 1.1) {
    peakHpRpm += 500;
  }
  // Long runner restricts RPM
  if ((intakeSpec.topEndMod || 1) < 0.9) {
    peakHpRpm -= 500;
  }

  // Family RPM Caps (Realistic constraints)
  const familyLimit = FAMILY_RPM_LIMITS[family];
  // If user selects solid roller or Kaase heads, we relax limits
  const isRaceBuild = (headSpec.flowModifier || 0) > 1.2 || (camSpec.rpmAdder || 0) > 6500;
  const hardLimit = isRaceBuild ? familyLimit + 1500 : familyLimit;
  
  if (peakHpRpm > hardLimit) {
    peakHpRpm = hardLimit;
  }

  // Boost Calculation
  // Pressure Ratio = (14.7 + Boost) / 14.7
  const pressureRatio = (14.7 + forcedInductionPsi) / 14.7;
  // Boost efficiency loss (heat)
  const boostEfficiency = forcedInductionPsi > 0 ? 0.85 : 1.0; 
  
  const totalBoostMultiplier = 1 + ((pressureRatio - 1) * boostEfficiency);

  // Apply Boost
  const peakTorque = Math.floor(rawTorque * totalBoostMultiplier);

  // Calculate HP
  // HP = (Torque * RPM) / 5252
  // We model torque drop-off at peak HP RPM based on induction flow capabilities.
  
  let topEndBreathing = intakeSpec.topEndMod || 1.0;
  let torqueRetentionFactor = 0.85 * topEndBreathing;

  // Cam profile affects how well it hangs on
  if ((camSpec.rpmAdder || 0) > 6000) torqueRetentionFactor += 0.05;

  // Clamp factor to realistic physics
  if (torqueRetentionFactor > 0.98) torqueRetentionFactor = 0.98;
  if (torqueRetentionFactor < 0.60) torqueRetentionFactor = 0.60;

  const torqueAtPeakHpRpm = peakTorque * torqueRetentionFactor;
  const peakHP = Math.floor((torqueAtPeakHpRpm * peakHpRpm) / 5252);

  // Peak Torque RPM is usually 1500-2000 RPM below Peak HP
  const peakTorqueRPM = Math.max(2500, peakHpRpm - 1500);

  // Drivetrain Loss
  const drivetrainLoss = transmission === 'Auto' ? 0.20 : 0.15;
  const wheelHP = Math.floor(peakHP * (1 - drivetrainLoss));

  // Generate Messages based on config
  const messages: string[] = [];
  
  if ((headSpec.flowModifier || 0) < 0.9 && (camSpec.rpmAdder || 0) > 5500) {
    messages.push(`Bottleneck: ${headSpec.name} heads are choking the ${camSpec.name}.`);
  }
  if (family === EngineFamily.WINDSOR && displacementCI === 302 && peakHP > 500 && forcedInductionPsi === 0) {
    messages.push("Structural Warning: Stock 302 blocks are prone to splitting above 500HP.");
  }
  if (family === EngineFamily.WINDSOR && headId.includes('kaase') && displacementCI < 351) {
    messages.push("Note: P-38 heads are physically large for a small displacement block, check PTV clearance.");
  }
  if (compressionRatio > 10.5 && forcedInductionPsi > 4) {
    messages.push("Detonation Risk: High compression (>10.5:1) with boost requires E85 or Race Gas.");
  }

  return {
    peakHP,
    peakTorque,
    peakHPRPM: peakHpRpm,
    peakTorqueRPM,
    wheelHP,
    vePercentage: Math.floor(baseVE * 100 * crMultiplier),
    messages
  };
};