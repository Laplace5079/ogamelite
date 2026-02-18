// Enhanced Game Types - Single Player with AI

import { Resources, Buildings, Ships, Defense, Research, Planet } from './game';

// ==================== AI System ====================

export enum AIDifficulty {
  EASY = 1,
  NORMAL = 2,
  HARD = 3,
  INSANE = 4
}

export enum AIStrategy {
  ECONOMIC = 'economic',
  MILITARY = 'military',
  BALANCED = 'balanced'
}

export interface AIPersonality {
  aggression: number;      // 0-1: How likely to attack
  expansion: number;       // 0-1: How quickly to colonize
  defense: number;          // 0-1: How much to invest in defense
  patience: number;        // 0-1: How long to wait before acting
  greed: number;           // 0-1: How much resources to keep vs invest
}

export interface AIPlayer {
  id: string;
  name: string;
  difficulty: AIDifficulty;
  strategy: AIStrategy;
  personality: AIPersonality;
  planets: AIPlanet[];
  fleetPower: number;
  economyPower: number;
  lastAction: number;
  color: string;           // UI color for this AI
}

// AI's planet (simplified version)
export interface AIPlanet {
  id: string;
  name: string;
  coordinates: string;
  buildings: Partial<Buildings>;
  ships: Partial<Ships>;
  defense: Partial<Defense>;
  resources: Resources;
  threatLevel: number;    // How dangerous this planet is
}

// ==================== Campaign & Missions ====================

export interface Campaign {
  id: string;
  name: string;
  description: string;
  difficulty: number;      // 1-10
  missions: CampaignMission[];
  unlocked: boolean;
  completed: boolean;
}

export interface CampaignMission {
  id: string;
  name: string;
  description: string;
  objectives: MissionObjective[];
  rewards: {
    resources?: Resources;
    ships?: Partial<Ships>;
    buildings?: Partial<Buildings>;
  };
  enemies?: string[];      // AI player IDs
  completed: boolean;
}

export interface MissionObjective {
  id: string;
  type: 'destroy' | 'colonize' | 'research' | 'build' | 'reach_resources';
  target: number;
  progress: number;
  description: string;
}

// ==================== Achievements ====================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'combat' | 'economy' | 'exploration' | 'research' | 'special';
  requirement: {
    type: string;
    value: number;
  };
  reward?: Resources;
  unlocked: boolean;
  unlockedAt?: number;
}

// ==================== Daily Missions ====================

export interface DailyMission {
  id: string;
  name: string;
  description: string;
  type: 'build' | 'research' | 'attack' | 'collect' | 'trade';
  target: number;
  progress: number;
  reward: Resources;
  expiresAt: number;
  completed: boolean;
}

// ==================== Battle Enhancements ====================

export interface FleetFormation {
  id: string;
  name: string;
  description: string;
  attackBonus: number;
  defenseBonus: number;
}

export interface BattleRound {
  round: number;
  attacker: {
    units: ShipUnit[];
    totalAttack: number;
    totalShield: number;
    totalHull: number;
    damageDealt: number;
  };
  defender: {
    units: ShipUnit[];
    totalAttack: number;
    totalShield: number;
    totalHull: number;
    damageDealt: number;
  };
}

export interface ShipUnit {
  type: string;
  count: number;
  attack: number;
  shield: number;
  hull: number;
  destroyed: number;
  damaged: number;
}

export interface BattleReport {
  id: string;
  timestamp: number;
  attacker: {
    playerId: string;
    units: ShipUnit[];
    lost: Resources;
  };
  defender: {
    playerId: string;
    units: ShipUnit[];
    lost: Resources;
  };
  loot: Resources;
  debris: Resources;
  rounds: BattleRound[];
  winner: 'attacker' | 'defender' | 'draw';
}

// ==================== Game Settings ====================

export interface GameSettings {
  autoStart: boolean;
  speed: number;           // 1x, 2x, 5x, 10x
  notifications: {
    attack: boolean;
    missionComplete: boolean;
    researchComplete: boolean;
    tradeComplete: boolean;
  };
  display: {
    animations: boolean;
    effects: boolean;
    compactMode: boolean;
  };
  shortcuts: {
    build: string;
    fleet: string;
    research: string;
    galaxy: string;
  };
}

// ==================== Player Stats ====================

export interface PlayerStats {
  totalAttacks: number;
  totalDefenses: number;
  attacksWon: number;
  attacksLost: number;
  resourcesLooted: number;
  resourcesLost: number;
  shipsBuilt: number;
  planetsColonized: number;
  researchCompleted: number;
  playTime: number;
  createdAt: number;
}

// ==================== Main Game State ====================

export interface GameState {
  // Core
  player: Player;
  planets: Planet[];
  activePlanetId: string;
  
  // AI System
  aiPlayers: AIPlayer[];
  campaignMode: boolean;
  currentCampaign?: Campaign;
  
  // Content
  achievements: Achievement[];
  dailyMissions: DailyMission[];
  battleReports: BattleReport[];
  
  // Settings & Stats
  settings: GameSettings;
  stats: PlayerStats;
  
  // Time
  gameTime: number;
  lastUpdate: number;
}

// ==================== Default Values ====================

export const DEFAULT_AI_PERSONALITY: AIPersonality = {
  aggression: 0.5,
  expansion: 0.5,
  defense: 0.5,
  patience: 0.5,
  greed: 0.5
};

export const DEFAULT_SETTINGS: GameSettings = {
  autoStart: true,
  speed: 1,
  notifications: {
    attack: true,
    missionComplete: true,
    researchComplete: true,
    tradeComplete: true
  },
  display: {
    animations: true,
    effects: true,
    compactMode: false
  },
  shortcuts: {
    build: 'b',
    fleet: 'f',
    research: 'r',
    galaxy: 'g'
  }
};

export const DEFAULT_STATS: PlayerStats = {
  totalAttacks: 0,
  totalDefenses: 0,
  attacksWon: 0,
  attacksLost: 0,
  resourcesLooted: 0,
  resourcesLost: 0,
  shipsBuilt: 0,
  planetsColonized: 0,
  researchCompleted: 0,
  playTime: 0,
  createdAt: Date.now()
};

// ==================== Battle Formations ====================

export const FLEET_FORMATIONS: FleetFormation[] = [
  { id: 'v', name: 'V-Formation', description: 'Attack bonus +20%', attackBonus: 0.2, defenseBonus: 0 },
  { id: 'circle', name: 'Circle Defense', description: 'Defense bonus +20%', attackBonus: 0, defenseBonus: 0.2 },
  { id: 'line', name: 'Line Attack', description: 'Attack bonus +10%, Defense +10%', attackBonus: 0.1, defenseBonus: 0.1 },
  { id: 'swarm', name: 'Swarm', description: 'Attack bonus +30%, Defense -10%', attackBonus: 0.3, defenseBonus: -0.1 }
];
