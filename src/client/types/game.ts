// Core Game Types

export interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

export interface ResourceRates {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

// Building Levels (ID -> Level)
export interface Buildings {
  metalMine: number;
  crystalMine: number;
  deuteriumSynthesizer: number;
  solarPlant: number;
  fusionReactor: number;
  robotFactory: number;
  shipyard: number;
  researchLab: number;
  allianceHub: number;
  missileSilo: number;
  naniteFactory: number;
  terraformer: number;
  spaceDock: number;
}

// Ship Counts (ID -> Count)
export interface Ships {
  lightFighter: number;
  heavyFighter: number;
  cruiser: number;
  battleship: number;
  interceptor: number;
  bomber: number;
  destroyer: number;
  deathstar: number;
  cargoShip: number;
  colonyShip: number;
  recycler: number;
  espionageProbe: number;
  solarSatellite: number;
}

// Defense Counts (ID -> Count)
export interface Defense {
  rocketLauncher: number;
  lightLaser: number;
  heavyLaser: number;
  ionTurret: number;
  gaussCannon: number;
  plasmaTurret: number;
  shieldDome: number;
  missileDefense: number;
}

// Research Levels
export interface Research {
  energyTech: number;
  laserTech: number;
  ionTech: number;
  hyperspaceTech: number;
  plasmaTech: number;
  combustionDrive: number;
  impulseDrive: number;
  hyperspaceDrive: number;
  espionageTech: number;
  computerTech: number;
  astrophysics: number;
  networkTech: number;
  gravitonTech: number;
}

// Planet Data
export interface Planet {
  id: string;
  name: string;
  coordinates: string; // "1:234:5"
  diameter: number;
  fields: {
    used: number;
    max: number;
  };
  resources: Resources;
  resourceRates: ResourceRates;
  buildings: Buildings;
  defense: Defense;
  lastUpdate: number;
}

// User Data
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  planets: Planet[];
  mainPlanet: string; // Planet ID
  research: Research;
  ships: Ships;
  resources: Resources;
  rank: number;
  reputation: number;
  allianceId?: string;
  createdAt: number;
}

// Mission Types
export type MissionType = 
  | 'attack' 
  | 'federation' 
  | 'transport' 
  | 'deploy' 
  | 'spy' 
  | 'colonize' 
  | 'recycle' 
  | 'destroy';

// Fleet Mission
export interface FleetMission {
  id: string;
  userId: string;
  originPlanet: string;
  targetPlanet: string;
  mission: MissionType;
  ships: Ships;
  resources: Resources;
  departure: number;
  arrival: number;
  return: number;
  createdAt: number;
}

// Building Queue Item
export interface QueueItem {
  id: string;
  planetId: string;
  type: 'building' | 'ship' | 'defense' | 'research';
  itemId: string;
  level?: number;
  count?: number;
  startTime: number;
  endTime: number;
}

// Combat Result
export interface CombatResult {
  attacker: {
    unitsLost: Ships;
    unitsRemaining: Ships;
    resourcesLost: Resources;
  };
  defender: {
    unitsLost: Ships | Defense;
    unitsRemaining: Ships | Defense;
    resourcesLost: Resources;
  };
  loot: Resources;
  debris: {
    metal: number;
    crystal: number;
  };
  win: boolean;
}
