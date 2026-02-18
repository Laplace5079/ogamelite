// AI Player System - Core Logic

import { 
  AIPlayer, 
  AIPersonality, 
  AIDifficulty, 
  AIStrategy, 
  AIPlanet,
  DEFAULT_AI_PERSONALITY 
} from '../types/game-enhanced';
import { Buildings, Ships, Resources } from '../types/game';
import { v4 as uuidv4 } from 'uuid';

// Predefined AI names
const AI_NAMES = [
  'CyberX', 'NovaPrime', 'StarLord', 'VoidWalker', 'CosmosKing',
  'GalaxyEmperor', 'NebulaLord', 'PulsarMaster', 'QuantumAce', 'StellarKing',
  'DarkMatter', 'SolarFlare', 'LunarCommand', 'OrbitalAce', 'AstroKing'
];

// AI Colors for UI
const AI_COLORS = [
  '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181',
  '#aa96da', '#fcbad3', '#a8d8ea', '#ff9a3c', '#00d2d3'
];

// Difficulty modifiers
const DIFFICULTY_MODIFIERS: Record<AIDifficulty, number> = {
  [AIDifficulty.EASY]: 0.5,
  [AIDifficulty.NORMAL]: 1.0,
  [AIDifficulty.HARD]: 1.5,
  [AIDifficulty.INSANE]: 2.5
};

// Strategy presets
const STRATEGY_PRESETS: Record<AIStrategy, Partial<AIPersonality>> = {
  [AIStrategy.ECONOMIC]: {
    aggression: 0.2,
    expansion: 0.7,
    defense: 0.4,
    patience: 0.6,
    greed: 0.8
  },
  [AIStrategy.MILITARY]: {
    aggression: 0.9,
    expansion: 0.6,
    defense: 0.3,
    patience: 0.3,
    greed: 0.3
  },
  [AIStrategy.BALANCED]: {
    aggression: 0.5,
    expansion: 0.5,
    defense: 0.5,
    patience: 0.5,
    greed: 0.5
  }
};

export class AISystem {
  private players: Map<string, AIPlayer> = new Map();
  private playerIdCounter = 0;

  /**
   * Create a new AI player
   */
  createAI(difficulty: AIDifficulty, strategy: AIStrategy, existingNames: string[] = []): AIPlayer {
    const id = `ai_${uuidv4()}`;
    
    // Pick a unique name
    let name: string;
    do {
      name = AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];
    } while (existingNames.includes(name));
    
    // Combine base personality with strategy
    const strategyPersonality = STRATEGY_PRESETS[strategy];
    const personality: AIPersonality = {
      ...DEFAULT_AI_PERSONALITY,
      ...strategyPersonality,
      // Add some randomness
      aggression: (strategyPersonality.aggression || 0.5) + (Math.random() - 0.5) * 0.2,
      expansion: (strategyPersonality.expansion || 0.5) + (Math.random() - 0.5) * 0.2,
      defense: (strategyPersonality.defense || 0.5) + (Math.random() - 0.5) * 0.2,
      patience: (strategyPersonality.patience || 0.5) + (Math.random() - 0.5) * 0.2,
      greed: (strategyPersonality.greed || 0.5) + (Math.random() - 0.5) * 0.2
    };
    
    // Clamp values to 0-1
    Object.keys(personality).forEach(key => {
      (personality as any)[key] = Math.max(0, Math.min(1, (personality as any)[key]));
    });

    const ai: AIPlayer = {
      id,
      name,
      difficulty,
      strategy,
      personality,
      planets: this.generateInitialPlanets(difficulty),
      fleetPower: 0,
      economyPower: 0,
      lastAction: Date.now(),
      color: AI_COLORS[this.playerIdCounter % AI_COLORS.length]
    };

    this.playerIdCounter++;
    this.calculatePower(ai);
    this.players.set(id, ai);
    
    return ai;
  }

  /**
   * Generate AI's starting planets
   */
  private generateInitialPlanets(difficulty: AIDifficulty): AIPlanet[] {
    const planetCount = 1 + Math.floor(Math.random() * Math.min(difficulty, 3));
    const planets: AIPlanet[] = [];

    for (let i = 0; i < planetCount; i++) {
      planets.push({
        id: `ai_planet_${uuidv4()}`,
        name: `AI Colony ${i + 1}`,
        coordinates: `1:${100 + i * 50}:${Math.floor(Math.random() * 15) + 1}`,
        buildings: this.generateStartingBuildings(difficulty),
        ships: this.generateStartingShips(difficulty),
        defense: {},
        resources: this.generateStartingResources(difficulty),
        threatLevel: difficulty * 10
      });
    }

    return planets;
  }

  /**
   * Generate starting buildings based on difficulty
   */
  private generateStartingBuildings(difficulty: AIDifficulty): Partial<Buildings> {
    const level = difficulty + 1;
    return {
      metalMine: level + Math.floor(Math.random() * 3),
      crystalMine: Math.max(1, level - 1 + Math.floor(Math.random() * 3)),
      deuteriumSynthesizer: Math.max(1, level - 2 + Math.floor(Math.random() * 3)),
      solarPlant: level + Math.floor(Math.random() * 2),
      fusionReactor: Math.floor(difficulty / 2),
      robotFactory: Math.floor(level / 2),
      shipyard: Math.floor(level / 2),
      researchLab: Math.floor(level / 3),
    };
  }

  /**
   * Generate starting ships based on difficulty
   */
  private generateStartingShips(difficulty: AIDifficulty): Partial<Ships> {
    const multiplier = DIFFICULTY_MODIFIERS[difficulty];
    return {
      cargoShip: Math.floor(10 * multiplier),
      lightFighter: Math.floor(20 * multiplier),
      heavyFighter: Math.floor(10 * multiplier),
      cruiser: Math.floor(5 * multiplier),
      battleship: Math.floor(2 * multiplier),
      espionageProbe: Math.floor(10 * multiplier)
    };
  }

  /**
   * Generate starting resources
   */
  private generateStartingResources(difficulty: AIDifficulty): Resources {
    const base = 10000;
    const multiplier = DIFFICULTY_MODIFIERS[difficulty];
    return {
      metal: Math.floor(base * multiplier * (0.5 + Math.random())),
      crystal: Math.floor(base * multiplier * (0.3 + Math.random() * 0.5)),
      deuterium: Math.floor(base * multiplier * (0.2 + Math.random() * 0.3)),
      energy: 100
    };
  }

  /**
   * Calculate AI's power levels
   */
  calculatePower(ai: AIPlayer): void {
    let fleetPower = 0;
    let economyPower = 0;

    // Calculate from planets
    ai.planets.forEach(planet => {
      // Economy power from mines
      economyPower += (planet.buildings.metalMine || 0) * 10;
      economyPower += (planet.buildings.crystalMine || 0) * 15;
      economyPower += (planet.buildings.deuteriumSynthesizer || 0) * 20;
      
      // Fleet power from ships
      Object.entries(planet.ships || {}).forEach(([ship, count]) => {
        const attack = this.getShipAttack(ship as keyof Ships);
        fleetPower += attack * (count || 0);
      });
    });

    ai.fleetPower = fleetPower;
    ai.economyPower = economyPower;
  }

  /**
   * Get ship attack value
   */
  private getShipAttack(ship: keyof Ships): number {
    const attackValues: Record<string, number> = {
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
      recycler: 1
    };
    return attackValues[ship] || 0;
  }

  /**
   * AI decision making loop
   */
  updateAI(ai: AIPlayer, _deltaTime: number): AIAction[] {
    const actions: AIAction[] = [];
    const now = Date.now();
    const timeSinceLastAction = now - ai.lastAction;
    
    // AI acts based on its patience
    const actionInterval = 5000 + (1 - ai.personality.patience) * 15000; // 5-20 seconds
    
    if (timeSinceLastAction < actionInterval) {
      return actions;
    }

    // Decision tree based on personality and situation
    const resourcePressure = this.calculateResourcePressure(ai);
    
    if (resourcePressure > 0.7 && ai.personality.greed > 0.5) {
      // Focus on economy
      actions.push(...this.prioritizeEconomy(ai));
    } else if (ai.personality.aggression > 0.6 && Math.random() < 0.3) {
      // Consider attacking
      actions.push(...this.considerAttack(ai));
    } else if (ai.personality.expansion > 0.5 && Math.random() < 0.2) {
      // Consider colonizing
      actions.push(...this.considerColonize(ai));
    } else {
      // Default: build up
      actions.push(...this.prioritizeEconomy(ai));
    }

    ai.lastAction = now;
    return actions;
  }

  /**
   * Calculate how much the AI needs resources
   */
  private calculateResourcePressure(ai: AIPlayer): number {
    let totalResources = 0;
    let maxResources = 0;

    ai.planets.forEach(planet => {
      totalResources += planet.resources.metal + planet.resources.crystal + planet.resources.deuterium;
      maxResources += 100000; // Arbitrary max
    });

    return 1 - Math.min(1, totalResources / maxResources);
  }

  /**
   * Prioritize economic development
   */
  private prioritizeEconomy(ai: AIPlayer): AIAction[] {
    const actions: AIAction[] = [];
    
    ai.planets.forEach(planet => {
      // Upgrade mines first
      if (planet.buildings.metalMine && planet.buildings.metalMine < ai.difficulty * 5) {
        actions.push({
          type: 'build',
          planetId: planet.id,
          building: 'metalMine',
          priority: 1
        });
      }
      
      if (planet.buildings.crystalMine && planet.buildings.crystalMine < ai.difficulty * 4) {
        actions.push({
          type: 'build',
          planetId: planet.id,
          building: 'crystalMine',
          priority: 2
        });
      }

      // Build ships if economy is good
      if (Math.random() < ai.personality.greed) {
        actions.push({
          type: 'build_ship',
          planetId: planet.id,
          ship: 'cargoShip',
          count: Math.floor(Math.random() * 5) + 1,
          priority: 3
        });
      }
    });

    return actions;
  }

  /**
   * Consider launching an attack
   */
  private considerAttack(ai: AIPlayer): AIAction[] {
    const actions: AIAction[] = [];
    
    // Find a target (simplified - in real game would scan universe)
    if (ai.planets.length > 0) {
      const sourcePlanet = ai.planets[0];
      const hasShips = this.countTotalShips(sourcePlanet.ships) > 10;
      
      if (hasShips) {
        actions.push({
          type: 'attack',
          planetId: sourcePlanet.id,
          targetCoordinates: `1:${Math.floor(Math.random() * 500)}:5`,
          priority: 1
        });
      }
    }

    return actions;
  }

  /**
   * Consider colonizing new planets
   */
  private considerColonize(ai: AIPlayer): AIAction[] {
    const actions: AIAction[] = [];
    
    // Check if AI has colony ship
    const hasColonyShip = ai.planets.some(p => (p.ships.colonyShip || 0) > 0);
    
    if (hasColonyShip && ai.planets.length < ai.difficulty * 2) {
      actions.push({
        type: 'colonize',
        planetId: ai.planets[0].id,
        targetCoordinates: `1:${100 + ai.planets.length * 50}:${Math.floor(Math.random() * 15) + 1}`,
        priority: 1
      });
    }

    return actions;
  }

  /**
   * Count total ships
   */
  private countTotalShips(ships: Partial<Ships>): number {
    return Object.values(ships).reduce((sum, count) => sum + (count || 0), 0);
  }

  /**
   * Get all AI players
   */
  getAllPlayers(): AIPlayer[] {
    return Array.from(this.players.values());
  }

  /**
   * Get AI player by ID
   */
  getPlayer(id: string): AIPlayer | undefined {
    return this.players.get(id);
  }

  /**
   * Generate a universe of AI players
   */
  generateUniverse(playerCount: number = 10): AIPlayer[] {
    const players: AIPlayer[] = [];
    const difficulties: AIDifficulty[] = [AIDifficulty.EASY, AIDifficulty.NORMAL, AIDifficulty.HARD];
    const strategies: AIStrategy[] = [AIStrategy.ECONOMIC, AIStrategy.MILITARY, AIStrategy.BALANCED];

    for (let i = 0; i < playerCount; i++) {
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      const existingNames = players.map(p => p.name);
      
      const ai = this.createAI(difficulty, strategy, existingNames);
      players.push(ai);
    }

    return players;
  }

  /**
   * Generate a universe with specified difficulty
   */
  generateUniverseWithDifficulty(playerCount: number = 10, baseDifficulty: AIDifficulty): AIPlayer[] {
    const players: AIPlayer[] = [];
    const strategies: AIStrategy[] = [AIStrategy.ECONOMIC, AIStrategy.MILITARY, AIStrategy.BALANCED];

    for (let i = 0; i < playerCount; i++) {
      // Higher difficulty = more higher difficulty AIs
      let difficulty = baseDifficulty;
      if (Math.random() > 0.5 && baseDifficulty < AIDifficulty.INSANE) {
        difficulty = (baseDifficulty + 1) as AIDifficulty;
      }
      
      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      const existingNames = players.map(p => p.name);
      
      const ai = this.createAI(difficulty, strategy, existingNames);
      players.push(ai);
    }

    return players;
  }
}

// AI Action types
export interface AIAction {
  type: 'build' | 'build_ship' | 'research' | 'attack' | 'colonize' | 'defend' | 'trade';
  planetId: string;
  targetCoordinates?: string;
  building?: keyof Buildings;
  ship?: keyof Ships;
  count?: number;
  research?: string;
  priority: number;
}

// Export singleton instance
export const aiSystem = new AISystem();
