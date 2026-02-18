// Game Constants - Building Costs & Production

import { Buildings, Ships, Defense, Research, ResourceRates } from '../types/game';

// ============================================
// RESOURCE COSTS (Base costs at level 1)
// ============================================

export const BUILDING_COSTS: Record<keyof Buildings, { metal: number; crystal: number; deuterium: number; energy: number }> = {
  metalMine: { metal: 60, crystal: 15, deuterium: 0, energy: 0 },
  crystalMine: { metal: 48, crystal: 24, deuterium: 0, energy: 0 },
  deuteriumSynthesizer: { metal: 225, crystal: 75, deuterium: 0, energy: 0 },
  solarPlant: { metal: 75, crystal: 30, deuterium: 0, energy: 0 },
  fusionReactor: { metal: 900, crystal: 360, deuterium: 180, energy: 0 },
  robotFactory: { metal: 400, crystal: 120, deuterium: 200, energy: 0 },
  shipyard: { metal: 400, crystal: 200, deuterium: 100, energy: 0 },
  researchLab: { metal: 200, crystal: 400, deuterium: 200, energy: 0 },
  allianceHub: { metal: 10000, crystal: 10000, deuterium: 10000, energy: 0 },
  missileSilo: { metal: 2000, crystal: 2000, deuterium: 1000, energy: 0 },
  naniteFactory: { metal: 100000, crystal: 50000, deuterium: 10000, energy: 0 },
  terraformer: { metal: 50000, crystal: 100000, deuterium: 50000, energy: 0 },
  spaceDock: { metal: 500000, crystal: 250000, deuterium: 100000, energy: 0 },
};

// Building cost multiplier per level
export const BUILDING_COST_MULTIPLIER = 1.5;

// ============================================
// RESOURCE PRODUCTION (Per hour at level 1)
// ============================================

export const BUILDING_PRODUCTION: Record<keyof Buildings, ResourceRates | null> = {
  metalMine: { metal: 30, crystal: 0, deuterium: 0, energy: -10 },
  crystalMine: { metal: 0, crystal: 20, deuterium: 0, energy: -10 },
  deuteriumSynthesizer: { metal: 0, crystal: 0, deuterium: 10, energy: -20 },
  solarPlant: { metal: 0, crystal: 0, deuterium: 0, energy: 20 },
  fusionReactor: { metal: 0, crystal: 0, deuterium: -5, energy: 50 },
  robotFactory: null,
  shipyard: null,
  researchLab: null,
  allianceHub: null,
  missileSilo: null,
  naniteFactory: null,
  terraformer: null,
  spaceDock: null,
};

// ============================================
// SHIP COSTS
// ============================================

export const SHIP_COSTS: Record<keyof Ships, { metal: number; crystal: number; deuterium: number }> = {
  lightFighter: { metal: 3000, crystal: 1000, deuterium: 0 },
  heavyFighter: { metal: 6000, crystal: 4000, deuterium: 0 },
  cruiser: { metal: 20000, crystal: 7000, deuterium: 2000 },
  battleship: { metal: 45000, crystal: 15000, deuterium: 5000 },
  interceptor: { metal: 60000, crystal: 50000, deuterium: 15000 },
  bomber: { metal: 50000, crystal: 25000, deuterium: 15000 },
  destroyer: { metal: 100000, crystal: 60000, deuterium: 40000 },
  deathstar: { metal: 5000000, crystal: 4000000, deuterium: 1000000 },
  cargoShip: { metal: 2000, crystal: 2000, deuterium: 0 },
  colonyShip: { metal: 10000, crystal: 20000, deuterium: 10000 },
  recycler: { metal: 10000, crystal: 6000, deuterium: 2000 },
  espionageProbe: { metal: 0, crystal: 1000, deuterium: 0 },
  solarSatellite: { metal: 2000, crystal: 500, deuterium: 0 },
};

// Ship Speed (units per hour)
export const SHIP_SPEED: Record<keyof Ships, number> = {
  lightFighter: 12500,
  heavyFighter: 10000,
  cruiser: 15000,
  battleship: 10000,
  interceptor: 20000,
  bomber: 7000,
  destroyer: 5000,
  deathstar: 200,
  cargoShip: 5000,
  colonyShip: 2500,
  recycler: 4000,
  espionageProbe: 100000000,
  solarSatellite: 0,
};

// Ship Cargo Capacity
export const SHIP_CARGO: Record<keyof Ships, number> = {
  lightFighter: 50,
  heavyFighter: 100,
  cruiser: 800,
  battleship: 1500,
  interceptor: 750,
  bomber: 1000,
  destroyer: 2000,
  deathstar: 1000000,
  cargoShip: 5000,
  colonyShip: 7500,
  recycler: 20000,
  espionageProbe: 5,
  solarSatellite: 0,
};

// Ship Fuel Consumption (Deuterium per unit distance)
export const SHIP_CONSUMPTION: Record<keyof Ships, number> = {
  lightFighter: 10,
  heavyFighter: 20,
  cruiser: 50,
  battleship: 100,
  interceptor: 120,
  bomber: 150,
  destroyer: 250,
  deathstar: 1,
  cargoShip: 20,
  colonyShip: 100,
  recycler: 50,
  espionageProbe: 1,
  solarSatellite: 0,
};

// ============================================
// DEFENSE COSTS
// ============================================

export const DEFENSE_COSTS: Record<keyof Defense, { metal: number; crystal: number; deuterium: number }> = {
  rocketLauncher: { metal: 2000, crystal: 0, deuterium: 0 },
  lightLaser: { metal: 1500, crystal: 500, deuterium: 0 },
  heavyLaser: { metal: 6000, crystal: 2000, deuterium: 0 },
  ionTurret: { metal: 2000, crystal: 6000, deuterium: 0 },
  gaussCannon: { metal: 35000, crystal: 15000, deuterium: 5000 },
  plasmaTurret: { metal: 100000, crystal: 50000, deuterium: 10000 },
  shieldDome: { metal: 10000, crystal: 10000, deuterium: 0 },
  missileDefense: { metal: 8000, crystal: 0, deuterium: 2000 },
};

// ============================================
// RESEARCH COSTS
// ============================================

export const RESEARCH_COSTS: Record<keyof Research, { metal: number; crystal: number; deuterium: number }> = {
  energyTech: { metal: 0, crystal: 800, deuterium: 400 },
  laserTech: { metal: 200, crystal: 600, deuterium: 0 },
  ionTech: { metal: 2000, crystal: 4000, deuterium: 600 },
  hyperspaceTech: { metal: 10000, crystal: 20000, deuterium: 6000 },
  plasmaTech: { metal: 40000, crystal: 80000, deuterium: 40000 },
  combustionDrive: { metal: 400, crystal: 0, deuterium: 600 },
  impulseDrive: { metal: 2000, crystal: 4000, deuterium: 600 },
  hyperspaceDrive: { metal: 10000, crystal: 20000, deuterium: 6000 },
  espionageTech: { metal: 1000, crystal: 500, deuterium: 500 },
  computerTech: { metal: 0, crystal: 400, deuterium: 600 },
  astrophysics: { metal: 8000, crystal: 4000, deuterium: 4000 },
  networkTech: { metal: 100000, crystal: 100000, deuterium: 10000 },
  gravitonTech: { metal: 0, crystal: 0, deuterium: 0 },
};

// ============================================
// COMBAT STATS
// ============================================

export const SHIP_ATTACK: Record<keyof Ships, number> = {
  lightFighter: 100,
  heavyFighter: 250,
  cruiser: 400,
  battleship: 1000,
  interceptor: 700,
  bomber: 700,
  destroyer: 2000,
  deathstar: 200000,
  cargoShip: 5,
  colonyShip: 50,
  recycler: 1,
  espionageProbe: 0,
  solarSatellite: 0,
};

export const SHIP_SHIELD: Record<keyof Ships, number> = {
  lightFighter: 100,
  heavyFighter: 250,
  cruiser: 500,
  battleship: 2000,
  interceptor: 400,
  bomber: 500,
  destroyer: 1500,
  deathstar: 50000,
  cargoShip: 200,
  colonyShip: 400,
  recycler: 100,
  espionageProbe: 0,
  solarSatellite: 0,
};

export const SHIP_HULL: Record<keyof Ships, number> = {
  lightFighter: 400,
  heavyFighter: 1200,
  cruiser: 2700,
  battleship: 6000,
  interceptor: 2800,
  bomber: 7500,
  destroyer: 11000,
  deathstar: 1000000,
  cargoShip: 2000,
  colonyShip: 4000,
  recycler: 5000,
  espionageProbe: 100,
  solarSatellite: 200,
};

export const DEFENSE_ATTACK: Record<keyof Defense, number> = {
  rocketLauncher: 80,
  lightLaser: 100,
  heavyLaser: 250,
  ionTurret: 500,
  gaussCannon: 1100,
  plasmaTurret: 3000,
  shieldDome: 0,
  missileDefense: 0,
};

export const DEFENSE_SHIELD: Record<keyof Defense, number> = {
  rocketLauncher: 200,
  lightLaser: 100,
  heavyLaser: 250,
  ionTurret: 500,
  gaussCannon: 2000,
  plasmaTurret: 5000,
  shieldDome: 5000,
  missileDefense: 500,
};

export const DEFENSE_HULL: Record<keyof Defense, number> = {
  rocketLauncher: 200,
  lightLaser: 200,
  heavyLaser: 800,
  ionTurret: 1500,
  gaussCannon: 8000,
  plasmaTurret: 20000,
  shieldDome: 20000,
  missileDefense: 800,
};

// ============================================
// BUILDING TIMES (Seconds at level 1, robot factory level 1)
// ============================================

export const BUILDING_TIME: Record<keyof Buildings, number> = {
  metalMine: 180,
  crystalMine: 192,
  deuteriumSynthesizer: 216,
  solarPlant: 144,
  fusionReactor: 240,
  robotFactory: 360,
  shipyard: 480,
  researchLab: 600,
  allianceHub: 3600,
  missileSilo: 600,
  naniteFactory: 3600,
  terraformer: 7200,
  spaceDock: 7200,
};

// Research times
export const RESEARCH_TIME: Record<keyof Research, number> = {
  energyTech: 240,
  laserTech: 240,
  ionTech: 360,
  hyperspaceTech: 720,
  plasmaTech: 1440,
  combustionDrive: 300,
  impulseDrive: 480,
  hyperspaceDrive: 1200,
  espionageTech: 360,
  computerTech: 400,
  astrophysics: 1800,
  networkTech: 3600,
  gravitonTech: 3600,
};

// ============================================
// FIELD LIMITS
// ============================================

export const BASE_FIELDS = 163;
export const FIELDS_PER_TERRAFORMER = 5;

// ============================================
// SPEED FACTORS
// ============================================

export const UNIVERSE_SPEED = 1;
export const SPEED_FACTOR = 1;
