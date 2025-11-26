import { EngineFamily, PartSpec } from './types';

// Displacements available per family (Cubic Inches)
export const FAMILY_DISPLACEMENTS: Record<EngineFamily, number[]> = {
  [EngineFamily.WINDSOR]: [289, 302, 331, 347, 351, 393, 408, 427],
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
      { 
        id: 'w_stock_e7', name: 'Stock E7TE (Stock 5.0L)', family: EngineFamily.WINDSOR, flowModifier: 0.78, desc: 'Iron OEM',
        stats: { flow: '155/110 cfm', chamber: '64cc', vol: '124cc', valves: '1.78/1.46' }
      },
      { 
        id: 'w_stock_e7_port', name: 'Stock E7TE (Ported)', family: EngineFamily.WINDSOR, flowModifier: 0.85, desc: 'Iron OEM Ported',
        stats: { flow: '217/175 cfm', chamber: '64cc', vol: '124cc+', valves: '1.90/1.60' }
      },
      { 
        id: 'w_gt40', name: 'Ford GT40 (Cobra/Explorer)', family: EngineFamily.WINDSOR, flowModifier: 0.88, desc: 'Iron Upgrade',
        stats: { flow: '192/128 cfm', chamber: '64cc', vol: '145cc', valves: '1.84/1.54' }
      },
      { 
        id: 'w_gt40p', name: 'Ford GT40P (Explorer)', family: EngineFamily.WINDSOR, flowModifier: 0.90, desc: 'High Efficiency Iron',
        stats: { flow: '196/139 cfm', chamber: '60cc', vol: '145cc', valves: '1.84/1.46' }
      },
      { 
        id: 'w_x303', name: 'Ford Perf Turbo Swirl (X303)', family: EngineFamily.WINDSOR, flowModifier: 1.02, desc: 'Aluminum',
        stats: { flow: '230/165 cfm', chamber: '64cc', vol: '160cc', valves: '1.94/1.54' }
      },
      { 
        id: 'w_afr165', name: 'AFR Renegade 165', family: EngineFamily.WINDSOR, flowModifier: 1.08, desc: 'Street/Strip Aluminum',
        stats: { flow: '250/205 cfm', chamber: '58cc', vol: '165cc', valves: '1.90/1.60' }
      },
      { 
        id: 'w_tfs170', name: 'Trick Flow Twisted Wedge 170', family: EngineFamily.WINDSOR, flowModifier: 1.05, desc: 'Twisted Wedge Design',
        stats: { flow: '245/185 cfm', chamber: '61cc', vol: '170cc', valves: '2.02/1.60' }
      },
      { 
        id: 'w_afr185', name: 'AFR Renegade 185', family: EngineFamily.WINDSOR, flowModifier: 1.15, desc: 'High Performance',
        stats: { flow: '275/215 cfm', chamber: '58cc', vol: '185cc', valves: '2.02/1.60' }
      },
      { 
        id: 'w_afr_enforcer', name: 'AFR Enforcer 185', family: EngineFamily.WINDSOR, flowModifier: 1.12, desc: 'Budget As-Cast',
        stats: { flow: '255/166 cfm', chamber: '64cc', vol: '185cc', valves: '2.02/1.60' }
      },
      { 
        id: 'w_tfs192', name: 'Trick Flow High Port 192', family: EngineFamily.WINDSOR, flowModifier: 1.22, desc: 'Race/Stroker',
        stats: { flow: '280/205 cfm', chamber: '64cc', vol: '192cc', valves: '2.02/1.60' }
      },
      { 
        id: 'w_afr205', name: 'AFR Renegade 205', family: EngineFamily.WINDSOR, flowModifier: 1.28, desc: 'Competition CNC',
        stats: { flow: '295/210 cfm', chamber: '58cc', vol: '205cc', valves: '2.08/1.60' }
      },
      { 
        id: 'w_kaase', name: 'Kaase P-38 Canted', family: EngineFamily.WINDSOR, flowModifier: 1.35, desc: 'Exotic Geometry',
        stats: { flow: '300+ cfm', chamber: '60cc', vol: '240cc', valves: 'Canted' }
      },
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
      { 
        id: 'mod_2v_pi', name: '4.6L 2V PI (Stock)', family: EngineFamily.MODULAR, flowModifier: 0.85, desc: 'OEM 99-04',
        stats: { flow: '160/115 cfm', chamber: '42cc', valves: '1.75/1.42', vol: 'PI' }
      },
      { 
        id: 'mod_tfs_185', name: 'Trick Flow TW 185 (2V)', family: EngineFamily.MODULAR, flowModifier: 1.08, desc: 'Top 2V Upgrade',
        stats: { flow: '240/190 cfm', chamber: '38cc', valves: '1.84/1.45', vol: '185cc' }
      },
      { id: 'mod_3v', name: '4.6L 3V Stock', family: EngineFamily.MODULAR, flowModifier: 0.92, desc: '05-10 GT' },
      { id: 'mod_4v_b', name: '4.6L 4V B-Head', family: EngineFamily.MODULAR, flowModifier: 1.05, desc: '96-98 Cobra high rpm' },
      { 
        id: 'coyote_1', name: 'Coyote Gen 1 (11-14)', family: EngineFamily.MODULAR, flowModifier: 1.15, desc: 'Stock GT',
        stats: { flow: '285/195 cfm', chamber: '57cc', valves: '37mm/31.8mm' }
      },
      { 
        id: 'coyote_3', name: 'Coyote Gen 3 (18+)', family: EngineFamily.MODULAR, flowModifier: 1.25, desc: 'Direct Injection',
        stats: { flow: '295/205 cfm', chamber: '55cc', valves: '37.7mm/32mm' }
      },
      { 
        id: 'voodoo', name: '5.2L Voodoo (GT350)', family: EngineFamily.MODULAR, flowModifier: 1.32, desc: 'CNC Ported',
        stats: { flow: '310/210 cfm', chamber: '57cc', valves: '38.3mm/32.5mm' }
      },
    ]
  },
  cams: {
    [EngineFamily.WINDSOR]: [
      { 
        id: 'w_stock_ho', name: 'Stock 5.0L HO', family: EngineFamily.WINDSOR, rpmAdder: 4800, veAdder: 0.0, desc: 'Smooth Idle',
        stats: { duration: '210/210', lift: '.444/.444', rpm: '1500-4800' }
      },
      { 
        id: 'w_e303', name: 'Ford Letter E303', family: EngineFamily.WINDSOR, rpmAdder: 5500, veAdder: 0.05, desc: 'Performance Street',
        stats: { duration: '220/220', lift: '.498/.498', rpm: '2500-5500' }
      },
      { 
        id: 'w_b303', name: 'Ford Letter B303', family: EngineFamily.WINDSOR, rpmAdder: 5800, veAdder: 0.06, desc: 'Lopey Idle',
        stats: { duration: '224/224', lift: '.480/.480', rpm: '3000-6000' }
      },
      { 
        id: 'w_f303', name: 'Ford Letter F303', family: EngineFamily.WINDSOR, rpmAdder: 6200, veAdder: 0.07, desc: 'Mid-Range',
        stats: { duration: '226/226', lift: '.512/.512', rpm: '3500-6200' }
      },
      { 
        id: 'w_x303_cam', name: 'Ford Letter X303', family: EngineFamily.WINDSOR, rpmAdder: 6400, veAdder: 0.08, desc: 'Aggressive',
        stats: { duration: '224/224', lift: '.542/.542', rpm: '2200-6200' }
      },
      { 
        id: 'w_xe264', name: 'Comp XE264HR', family: EngineFamily.WINDSOR, rpmAdder: 5400, veAdder: 0.04, desc: 'Towing/Mild',
        stats: { duration: '212/218', lift: '.512/.512', rpm: '1500-5500' }
      },
      { 
        id: 'w_xe268', name: 'Comp XE268H', family: EngineFamily.WINDSOR, rpmAdder: 5800, veAdder: 0.06, desc: 'Flat Tappet',
        stats: { duration: '224/230', lift: '.509/.512', rpm: '1600-5800' }
      },
      { 
        id: 'w_xe274', name: 'Comp XE274HR', family: EngineFamily.WINDSOR, rpmAdder: 6000, veAdder: 0.08, desc: 'Hot Street',
        stats: { duration: '224/232', lift: '.555/.565', rpm: '2200-6000' }
      },
      { 
        id: 'w_xe284', name: 'Comp XE284HR', family: EngineFamily.WINDSOR, rpmAdder: 6500, veAdder: 0.10, desc: 'Pro Street',
        stats: { duration: '224/230', lift: '.533/.544', rpm: '2000-6000' }
      },
      { 
        id: 'w_tfs1', name: 'Trick Flow Stage 1', family: EngineFamily.WINDSOR, rpmAdder: 5700, veAdder: 0.07, desc: 'Proven Power',
        stats: { duration: '221/225', lift: '.499/.510', rpm: '2000-5500' }
      },
      { 
        id: 'w_anderson_n41', name: 'Anderson Ford N-41', family: EngineFamily.WINDSOR, rpmAdder: 6400, veAdder: 0.11, desc: 'NA Legend',
        stats: { duration: '228/236', lift: '.576/.576', rpm: '2600-6600' }
      },
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
      { 
        id: 'mod_stock', name: 'Stock Cams (PI)', family: EngineFamily.MODULAR, rpmAdder: 6000, veAdder: 0.0, desc: 'Factory',
        stats: { duration: '200/210', lift: '.505/.535', rpm: 'Idle-5800' }
      },
      { 
        id: 'mod_xe270', name: 'Comp XE270AH (2V)', family: EngineFamily.MODULAR, rpmAdder: 6200, veAdder: 0.07, desc: 'Hot Street 2V',
        stats: { duration: '234/238', lift: '.550/.550', rpm: '2000-6200' }
      },
      { 
        id: 'coy_stock', name: 'Coyote Stock', family: EngineFamily.MODULAR, rpmAdder: 7000, veAdder: 0.08, desc: 'Gen 1',
        stats: { duration: '211/211', lift: '.472/.433', rpm: 'Idle-7000' }
      },
      { 
        id: 'coy_comp_cr', name: 'Comp CR Series 235', family: EngineFamily.MODULAR, rpmAdder: 7600, veAdder: 0.12, desc: 'Gen 1/2 Race',
        stats: { duration: '235/237', lift: '.516/.516', rpm: '2000-7600' }
      },
      { 
        id: 'voodoo_cam', name: 'Gen 2 Perf (Voodoo Spec)', family: EngineFamily.MODULAR, rpmAdder: 8250, veAdder: 0.15, desc: 'Max Effort',
        stats: { duration: '270/270', lift: '.551/.551', rpm: '3500-8250' }
      },
    ]
  },
  intakes: {
    [EngineFamily.WINDSOR]: [
      { 
        id: 'w_stock_efi', name: 'Stock 5.0L EFI', family: EngineFamily.WINDSOR, topEndMod: 0.85, torqueMod: 1.05, desc: 'Long Runner',
        stats: { type: 'EFI Long Runner', rpm: 'Idle-5500' }
      },
      { 
        id: 'w_explorer', name: 'Explorer / Cobra EFI', family: EngineFamily.WINDSOR, topEndMod: 0.95, torqueMod: 1.05, desc: 'Budget Upgrade',
        stats: { type: 'EFI Long Runner', rpm: 'Idle-5800' }
      },
      { 
        id: 'w_perf_289', name: 'Edelbrock Performer 289', family: EngineFamily.WINDSOR, topEndMod: 0.92, torqueMod: 1.08, desc: 'Stock Replacement',
        stats: { type: 'Dual Plane', rpm: 'Idle-5500' }
      },
      { 
        id: 'w_perf_rpm', name: 'Edelbrock Performer RPM', family: EngineFamily.WINDSOR, topEndMod: 1.0, torqueMod: 1.10, desc: 'Street/Strip',
        stats: { type: 'Dual Plane', rpm: '1500-6500' }
      },
      { 
        id: 'w_airgap', name: 'Edelbrock RPM Air-Gap', family: EngineFamily.WINDSOR, topEndMod: 1.05, torqueMod: 1.12, desc: 'Cooler Charge',
        stats: { type: 'Air-Gap Dual Plane', rpm: '1500-6500' }
      },
      { 
        id: 'w_systemax', name: 'Holley Systemax II', family: EngineFamily.WINDSOR, topEndMod: 1.12, torqueMod: 1.0, desc: 'EFI Performance',
        stats: { type: 'EFI Long Runner', rpm: '2000-6500' }
      },
      { 
        id: 'w_vic_jr', name: 'Edelbrock Victor Jr', family: EngineFamily.WINDSOR, topEndMod: 1.20, torqueMod: 0.90, desc: 'High RPM Race',
        stats: { type: 'Single Plane', rpm: '3500-7500' }
      },
      { 
        id: 'w_tfs_box', name: 'Trick Flow Street Burner', family: EngineFamily.WINDSOR, topEndMod: 1.02, torqueMod: 1.05, desc: 'Box Style',
        stats: { type: 'EFI Box', rpm: '1500-6000' }
      },
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
      { 
        id: 'mod_stock', name: 'Stock Gen 2/3 Composite', family: EngineFamily.MODULAR, topEndMod: 0.95, torqueMod: 1.05, desc: 'Long Runner',
        stats: { type: 'Long Runner', rpm: 'Idle-7000' }
      },
      { 
        id: 'mod_boss', name: 'Ford Boss 302', family: EngineFamily.MODULAR, topEndMod: 1.15, torqueMod: 0.95, desc: 'Track Day',
        stats: { type: 'Short Runner', rpm: '3500-7800' }
      },
      { 
        id: 'mod_cj', name: 'Ford Cobra Jet', family: EngineFamily.MODULAR, topEndMod: 1.20, torqueMod: 0.92, desc: 'Drag Race',
        stats: { type: 'Short Runner', rpm: '3500-8000' }
      },
      { 
        id: 'mod_gt350', name: 'Ford GT350', family: EngineFamily.MODULAR, topEndMod: 1.18, torqueMod: 0.98, desc: 'Balanced',
        stats: { type: 'Mid Runner', rpm: '3000-7500' }
      },
      { 
        id: 'mod_sniper', name: 'Holley Sniper / Hi-Ram', family: EngineFamily.MODULAR, topEndMod: 1.25, torqueMod: 0.85, desc: 'Boost/Race',
        stats: { type: 'Sheet Metal', rpm: '2200-8200' }
      },
    ]
  }
};