import { EngineFamily, PartSpec } from './types';

// Displacements available per family (Cubic Inches)
export const FAMILY_DISPLACEMENTS: Record<EngineFamily, number[]> = {
  [EngineFamily.WINDSOR]: [289, 302, 331, 347, 351, 393, 408, 427], // Added 331/347 strokers
  [EngineFamily.CLEVELAND]: [351, 393, 408],
  [EngineFamily.FE]: [390, 410, 427, 428, 445], 
  [EngineFamily.SERIES_385]: [429, 460, 514, 557],
  [EngineFamily.MODULAR]: [281, 302, 315], // 4.6L, 5.0L, 5.2L
};

export const DISPLACEMENT_LABELS: Record<number, string> = {
  281: '4.6L (281ci)',
  289: '289ci',
  302: '302ci / 5.0L',
  315: '5.2L Voodoo (315ci)',
  331: '331ci Stroker',
  347: '347ci Stroker',
  351: '351ci',
  390: '390ci',
  393: '393ci Stroker',
  408: '408ci Stroker',
  410: '410ci Mercury',
  427: '427ci',
  428: '428ci (CJ/SCJ)',
  429: '429ci (Boss/CJ)',
  445: '445ci FE Stroker',
  460: '460ci',
  514: '514ci Stroker',
  557: '557ci Stroker',
};

// Architecture Limits (Rod ratio, valvetrain weight limits)
export const FAMILY_RPM_LIMITS: Record<EngineFamily, number> = {
  [EngineFamily.WINDSOR]: 6500, 
  [EngineFamily.CLEVELAND]: 7200, 
  [EngineFamily.FE]: 6200, 
  [EngineFamily.SERIES_385]: 6000, 
  [EngineFamily.MODULAR]: 8200, 
};

// --------------------------------------------------------------------------
// COMPONENT DATABASE
// --------------------------------------------------------------------------

interface PartsDatabase {
  heads: Record<EngineFamily, PartSpec[]>;
  cams: Record<EngineFamily, PartSpec[]>;
  intakes: Record<EngineFamily, PartSpec[]>;
}

export const FORD_PARTS_DB: PartsDatabase = {
  heads: {
    [EngineFamily.WINDSOR]: [
      { id: 'w_stock_e7', name: 'Stock Iron (E7TE/E6SE)', family: EngineFamily.WINDSOR, flowModifier: 0.78, desc: 'Restrictive stock heads' },
      { id: 'w_gt40p', name: 'Ford GT40 / GT40P', family: EngineFamily.WINDSOR, flowModifier: 0.88, desc: 'Factory upgrade from Explorer/Cobra' },
      { id: 'w_afr165', name: 'AFR 165 Renegade', family: EngineFamily.WINDSOR, flowModifier: 1.05, desc: 'Excellent street head' },
      { id: 'w_tfs11r', name: 'Trick Flow TW 11R 190', family: EngineFamily.WINDSOR, flowModifier: 1.12, desc: 'Twisted wedge design' },
      { id: 'w_afr205', name: 'AFR 205 / 220', family: EngineFamily.WINDSOR, flowModifier: 1.20, desc: 'Race/Stroker application' },
      { id: 'w_kaase', name: 'Kaase P-38 Canted', family: EngineFamily.WINDSOR, flowModifier: 1.28, desc: 'Exotic canted valve geometry' },
    ],
    [EngineFamily.CLEVELAND]: [
      { id: 'c_2v_open', name: 'Factory 2V Open Chamber', family: EngineFamily.CLEVELAND, flowModifier: 0.90, desc: 'Good street potential' },
      { id: 'c_4v_closed', name: 'Factory 4V Closed Chamber', family: EngineFamily.CLEVELAND, flowModifier: 1.15, desc: 'Massive ports, poor low end' },
      { id: 'c_chi_3v', name: 'CHI 3V Aluminum', family: EngineFamily.CLEVELAND, flowModifier: 1.25, desc: 'Modern Engine Masters winner' },
    ],
    [EngineFamily.FE]: [
      { id: 'fe_c8ae', name: 'Stock C8AE Log Head', family: EngineFamily.FE, flowModifier: 0.80, desc: 'Restrictive exhaust port' },
      { id: 'fe_cj', name: 'Cobra Jet C8OE-N', family: EngineFamily.FE, flowModifier: 0.95, desc: 'Factory performance standard' },
      { id: 'fe_edel', name: 'Edelbrock Performer RPM', family: EngineFamily.FE, flowModifier: 1.05, desc: 'Modern aluminum efficiency' },
      { id: 'fe_survival', name: 'Survival FElony', family: EngineFamily.FE, flowModifier: 1.15, desc: 'Serious street/strip' },
    ],
    [EngineFamily.SERIES_385]: [
      { id: 'bb_d3ve', name: 'Stock D3VE (Smog)', family: EngineFamily.SERIES_385, flowModifier: 0.82, desc: 'Low compression smog head' },
      { id: 'bb_d0ve', name: 'Early D0VE-C', family: EngineFamily.SERIES_385, flowModifier: 0.92, desc: 'High compression factory' },
      { id: 'bb_scj', name: 'Ford Super Cobra Jet (Alum)', family: EngineFamily.SERIES_385, flowModifier: 1.10, desc: 'Factory performance crate' },
      { id: 'bb_kaase_p51', name: 'Kaase P-51', family: EngineFamily.SERIES_385, flowModifier: 1.35, desc: 'The king of big block heads' },
    ],
    [EngineFamily.MODULAR]: [
      { id: 'mod_2v_pi', name: '4.6L 2V PI (Perf Improved)', family: EngineFamily.MODULAR, flowModifier: 0.85, desc: 'Standard 99-04 GT' },
      { id: 'mod_3v', name: '4.6L 3V', family: EngineFamily.MODULAR, flowModifier: 0.92, desc: '05-10 GT' },
      { id: 'mod_4v_b', name: '4.6L 4V B-Head', family: EngineFamily.MODULAR, flowModifier: 1.05, desc: '96-98 Cobra high rpm' },
      { id: 'coyote_1', name: 'Coyote Gen 1 Stock', family: EngineFamily.MODULAR, flowModifier: 1.15, desc: '11-14 GT' },
      { id: 'coyote_2', name: 'Coyote Gen 2 Stock', family: EngineFamily.MODULAR, flowModifier: 1.20, desc: '15-17 GT (Better valves)' },
      { id: 'coyote_3', name: 'Coyote Gen 3 / Voodoo', family: EngineFamily.MODULAR, flowModifier: 1.28, desc: 'Direct Injection / GT350' },
    ]
  },
  cams: {
    [EngineFamily.WINDSOR]: [
      { id: 'w_stock_ho', name: 'Stock 5.0L HO', family: EngineFamily.WINDSOR, rpmAdder: 4800, veAdder: 0.0, desc: 'Smooth idle' },
      { id: 'w_e303', name: 'Ford Letter E303', family: EngineFamily.WINDSOR, rpmAdder: 5500, veAdder: 0.05, desc: 'The classic alphabet cam' },
      { id: 'w_b303', name: 'Ford Letter B303', family: EngineFamily.WINDSOR, rpmAdder: 5800, veAdder: 0.06, desc: 'Lopey idle, older design' },
      { id: 'w_tfs1', name: 'Trick Flow Stage 1', family: EngineFamily.WINDSOR, rpmAdder: 5700, veAdder: 0.07, desc: 'Modern split duration' },
      { id: 'w_anderson_n41', name: 'Anderson Ford N-41', family: EngineFamily.WINDSOR, rpmAdder: 6200, veAdder: 0.09, desc: 'Famous NA powerhouse' },
      { id: 'w_xe274', name: 'Comp XE274HR', family: EngineFamily.WINDSOR, rpmAdder: 6000, veAdder: 0.08, desc: 'Aggressive street hydraulic' },
    ],
    [EngineFamily.CLEVELAND]: [
      { id: 'c_stock', name: 'Stock Hydraulic', family: EngineFamily.CLEVELAND, rpmAdder: 5000, veAdder: 0.0, desc: 'Smooth' },
      { id: 'c_comp_268', name: 'Comp High Energy 268', family: EngineFamily.CLEVELAND, rpmAdder: 5800, veAdder: 0.06, desc: 'Street performance' },
      { id: 'c_solid', name: 'Solid Flat Tappet (Boss spec)', family: EngineFamily.CLEVELAND, rpmAdder: 6800, veAdder: 0.10, desc: '70s Race tech' },
    ],
    [EngineFamily.FE]: [
      { id: 'fe_stock', name: 'Stock 390 Hydraulic', family: EngineFamily.FE, rpmAdder: 4400, veAdder: 0.0, desc: 'Truck-like power band' },
      { id: 'fe_cj_cam', name: '428 CJ Restoration', family: EngineFamily.FE, rpmAdder: 5400, veAdder: 0.05, desc: 'Factory muscle' },
      { id: 'fe_comp_270', name: 'Comp Magnum 270H', family: EngineFamily.FE, rpmAdder: 5600, veAdder: 0.07, desc: 'Street choppy' },
    ],
    [EngineFamily.SERIES_385]: [
      { id: 'bb_stock', name: 'Stock RV / Towing', family: EngineFamily.SERIES_385, rpmAdder: 4200, veAdder: -0.02, desc: 'All torque' },
      { id: 'bb_cj_perf', name: 'CJ Factory Grind', family: EngineFamily.SERIES_385, rpmAdder: 5200, veAdder: 0.04, desc: 'Muscle car era' },
      { id: 'bb_comp_xe', name: 'Comp Xtreme Energy 4x4', family: EngineFamily.SERIES_385, rpmAdder: 5400, veAdder: 0.06, desc: 'Modern fast ramp' },
    ],
    [EngineFamily.MODULAR]: [
      { id: 'mod_stock', name: 'Stock Cams', family: EngineFamily.MODULAR, rpmAdder: 6000, veAdder: 0.0, desc: 'Factory smooth' },
      { id: 'mod_fp_stage2', name: 'Ford Performance Stage 2', family: EngineFamily.MODULAR, rpmAdder: 6800, veAdder: 0.06, desc: 'Hot street' },
      { id: 'mod_comp_stg3', name: 'Comp Stage 3 (Locked VCT)', family: EngineFamily.MODULAR, rpmAdder: 7400, veAdder: 0.10, desc: 'Race only' },
      { id: 'mod_ghost', name: 'Ghost Cam Tune', family: EngineFamily.MODULAR, rpmAdder: 6000, veAdder: -0.01, desc: 'Sound only, no gain' },
    ]
  },
  intakes: {
    [EngineFamily.WINDSOR]: [
      { id: 'w_stock_efi', name: 'Stock 5.0L EFI Manifold', family: EngineFamily.WINDSOR, topEndMod: 0.85, torqueMod: 1.05, desc: 'Great low end, chokes at 5k' },
      { id: 'w_explorer', name: 'Explorer / Cobra Intake', family: EngineFamily.WINDSOR, topEndMod: 0.95, torqueMod: 1.05, desc: 'Best budget upgrade' },
      { id: 'w_perf_rpm', name: 'Edelbrock Performer RPM', family: EngineFamily.WINDSOR, topEndMod: 1.0, torqueMod: 1.10, desc: 'Dual plane standard' },
      { id: 'w_vic_jr', name: 'Edelbrock Victor Jr', family: EngineFamily.WINDSOR, topEndMod: 1.15, torqueMod: 0.90, desc: 'Single plane carb' },
      { id: 'w_tfs_r', name: 'Trick Flow R-Series Box', family: EngineFamily.WINDSOR, topEndMod: 1.18, torqueMod: 0.95, desc: 'High RPM EFI' },
    ],
    [EngineFamily.CLEVELAND]: [
      { id: 'c_stock_iron', name: 'Stock Iron 4V', family: EngineFamily.CLEVELAND, topEndMod: 1.0, torqueMod: 1.0, desc: 'Heavy but flows' },
      { id: 'c_torker', name: 'Edelbrock Torker', family: EngineFamily.CLEVELAND, topEndMod: 1.12, torqueMod: 0.92, desc: 'Single plane' },
      { id: 'c_funnelweb', name: 'Parker Funnelweb', family: EngineFamily.CLEVELAND, topEndMod: 1.20, torqueMod: 0.88, desc: 'High rise Australian' },
    ],
    [EngineFamily.FE]: [
      { id: 'fe_stock_iron', name: 'Stock Cast Iron "S"', family: EngineFamily.FE, topEndMod: 0.85, torqueMod: 1.05, desc: 'Weighs 80lbs' },
      { id: 'fe_streetmaster', name: 'Holley Streetmaster', family: EngineFamily.FE, topEndMod: 1.05, torqueMod: 0.95, desc: 'Single plane street' },
      { id: 'fe_rpm', name: 'Edelbrock Performer RPM', family: EngineFamily.FE, topEndMod: 1.05, torqueMod: 1.10, desc: 'Modern dual plane' },
    ],
    [EngineFamily.SERIES_385]: [
      { id: 'bb_stock', name: 'Stock Cast Iron', family: EngineFamily.SERIES_385, topEndMod: 0.80, torqueMod: 1.05, desc: 'Restrictive' },
      { id: 'bb_stealth', name: 'Weiand Stealth', family: EngineFamily.SERIES_385, topEndMod: 1.0, torqueMod: 1.10, desc: 'High rise dual plane' },
      { id: 'bb_vic_460', name: 'Edelbrock Victor 460', family: EngineFamily.SERIES_385, topEndMod: 1.18, torqueMod: 0.90, desc: 'Race single plane' },
    ],
    [EngineFamily.MODULAR]: [
      { id: 'mod_stock', name: 'Stock Composite', family: EngineFamily.MODULAR, topEndMod: 0.95, torqueMod: 1.05, desc: 'Long runners' },
      { id: 'mod_boss', name: 'Boss 302 Intake', family: EngineFamily.MODULAR, topEndMod: 1.15, torqueMod: 0.95, desc: 'Short runner high RPM' },
      { id: 'mod_cj', name: 'Cobra Jet', family: EngineFamily.MODULAR, topEndMod: 1.20, torqueMod: 0.92, desc: 'High volume, high RPM' },
      { id: 'mod_sniper', name: 'Holley Sniper / Hi-Ram', family: EngineFamily.MODULAR, topEndMod: 1.25, torqueMod: 0.85, desc: 'Sheet metal style' },
    ]
  }
};
