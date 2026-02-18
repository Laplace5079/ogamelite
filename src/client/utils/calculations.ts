// Game Calculation Helpers

import { Buildings, Ships, Defense, Research, Resources, ResourceRates } from '../types/game';
import { 
  BUILDING_COSTS, 
  BUILDING_COST_MULTIPLIER, 
  BUILDING_PRODUCTION,
  SHIP_COSTS,
  RESEARCH_COSTS,
  DEFENSE_COSTS,
  BASE_FIELDS,
  FIELDS_PER_TERRAFORMER,
  UNIVERSE_SPEED
} from './constants';

/**
 * Calculate building cost for a given level
 */
export function getBuildingCost(building: keyof Buildings, level: number): Resources {
  const base = BUILDING_COSTS[building];
  const multiplier = Math.pow(BUILDING_COST_MULTIPLIER, level);
  
  return {
    metal: Math.floor(base.metal * multiplier),
    crystal: Math.floor(base.crystal * multiplier),
    deuterium: Math.floor(base.deuterium * multiplier),
    energy: level === 0 ? base.energy : 0, // Energy cost only for level 0
  };
}

/**
 * Calculate ship cost
 */
export function getShipCost(ship: keyof Ships, count: number = 1): Resources {
  const base = SHIP_COSTS[ship];
  return {
    metal: base.metal * count,
    crystal: base.crystal * count,
    deuterium: base.deuterium * count,
  };
}

/**
 * Calculate defense cost
 */
export function getDefenseCost(defense: keyof Defense, count: number = 1): Resources {
  const base = DEFENSE_COSTS[defense];
  return {
    metal: base.metal * count,
    crystal: base.crystal * count,
    deuterium: base.deuterium * count,
  };
}

/**
 * Calculate research cost for a given level
 */
export function getResearchCost(research: keyof Research, level: number): Resources {
  const base = RESEARCH_COSTS[research];
  const multiplier = Math.pow(1.5, level); // 1.5x per level
  
  return {
    metal: Math.floor(base.metal * multiplier),
    crystal: Math.floor(base.crystal * multiplier),
    deuterium: Math.floor(base.deuterium * multiplier),
  };
}

/**
 * Calculate total resource production per hour for a planet
 */
export function calculateProduction(buildings: Buildings): ResourceRates {
  const production: ResourceRates = {
    metal: 0,
    crystal: 0,
    deuterium: 0,
    energy: 0,
  };

  // Metal Mine
  if (buildings.metalMine > 0) {
    const baseRate = 30 * Math.pow(1.1, buildings.metalMine - 1);
    production.metal = Math.floor(baseRate * UNIVERSE_SPEED);
  }

  // Crystal Mine
  if (buildings.crystalMine > 0) {
    const baseRate = 20 * Math.pow(1.1, buildings.crystalMine - 1);
    production.crystal = Math.floor(baseRate * UNIVERSE_SPEED);
  }

  // Deuterium Synthesizer
  if (buildings.deuteriumSynthesizer > 0) {
    const baseRate = 10 * Math.pow(1.1, buildings.deuteriumSynthesizer - 1);
    production.deuterium = Math.floor(baseRate * UNIVERSE_SPEED);
  }

  // Solar Plant
  if (buildings.solarPlant > 0) {
    production.energy += Math.floor(20 * buildings.solarPlant * UNIVERSE_SPEED);
  }

  // Fusion Reactor (produces energy, consumes deuterium)
  if (buildings.fusionReactor > 0) {
    production.energy += Math.floor(50 * buildings.fusionReactor * UNIVERSE_SPEED);
    production.deuterium -= Math.floor(5 * buildings.fusionReactor * UNIVERSE_SPEED);
  }

  return production;
}

/**
 * Calculate available fields on a planet
 */
export function getMaxFields(buildings: Buildings): number {
  let terraformerBonus = buildings.terraformer * FIELDS_PER_TERRAFORMER;
  return BASE_FIELDS + terraformerBonus;
}

/**
 * Calculate fleet travel time (in seconds)
 */
export function calculateTravelTime(
  distance: number,
  speed: number,
  speedFactor: number = 1,
  consumedFuel: number = 1
): number {
  // OGame formula: time = (3500 / speed) * distance^2 / speedFactor
  const time = (3500 / speed) * Math.pow(distance, 2) / speedFactor;
  return Math.floor(time);
}

/**
 * Calculate distance between two coordinates
 */
export function calculateDistance(coord1: string, coord2: string): number {
  const [g1, s1, p1] = coord1.split(':').map(Number);
  const [g2, s2, p2] = coord2.split(':').map(Number);

  if (g1 !== g2) {
    // Different galaxy - use galaxy gate or long distance
    return 200000; // Base distance for inter-galaxy
  }

  if (s1 !== s2) {
    // Same galaxy, different solar system
    return 2700 + Math.abs(s1 - s2) * 95;
  }

  // Same solar system
  return 5 + Math.abs(p1 - p2) * 35;
}

/**
 * Calculate fuel consumption for a fleet
 */
export function calculateFuelConsumption(
  ships: Ships,
  distance: number,
  speedPercent: number = 100
): number {
  const speedFactor = speedPercent / 100;
  let totalConsumption = 0;

  const shipTypes: (keyof Ships)[] = [
    'lightFighter', 'heavyFighter', 'cruiser', 'battleship',
    'interceptor', 'bomber', 'destroyer', 'deathstar',
    'cargoShip', 'colonyShip', 'recycler', 'espionageProbe', 'solarSatellite'
  ];

  for (const shipType of shipTypes) {
    if (ships[shipType] > 0) {
      const consumption = SHIP_COSTS[shipType].deuterium || 0;
      // Formula: baseConsumption * distance * (speed / 10) * shipCount
      totalConsumption += consumption * distance * (speedFactor / 10) * ships[shipType];
    }
  }

  return Math.floor(totalConsumption);
}

/**
 * Check if resources are sufficient
 */
export function hasResources(resources: Resources, cost: Resources): boolean {
  return (
    resources.metal >= cost.metal &&
    resources.crystal >= cost.crystal &&
    resources.deuterium >= cost.deuterium
  );
}

/**
 * Deduct resources
 */
export function deductResources(resources: Resources, cost: Resources): Resources {
  return {
    metal: resources.metal - cost.metal,
    crystal: resources.crystal - cost.crystal,
    deuterium: resources.deuterium - cost.deuterium,
    energy: resources.energy,
  };
}

/**
 * Format large numbers (OGame style)
 */
export function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

/**
 * Format time duration
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Calculate combat power
 */
export function calculateCombatPower(ships: Ships): number {
  let power = 0;
  const shipTypes: (keyof Ships)[] = [
    'lightFighter', 'heavyFighter', 'cruiser', 'battleship',
    'interceptor', 'bomber', 'destroyer', 'deathstar',
    'cargoShip', 'colonyShip', 'recycler'
  ];

  const attackValues: Record<keyof Ships, number> = {
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

  for (const shipType of shipTypes) {
    power += (attackValues[shipType] || 0) * ships[shipType];
  }

  return power;
}
