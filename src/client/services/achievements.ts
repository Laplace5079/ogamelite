// Achievements System

import { Achievement } from '../types/game-enhanced';

export const ACHIEVEMENTS: Achievement[] = [
  // Combat Achievements
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first battle',
    icon: '⚔️',
    category: 'combat',
    requirement: { type: 'battles_won', value: 1 },
    reward: { metal: 1000, crystal: 500, deuterium: 100, energy: 0 },
    unlocked: false
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Win 10 battles',
    icon: '🗡️',
    category: 'combat',
    requirement: { type: 'battles_won', value: 10 },
    reward: { metal: 5000, crystal: 2500, deuterium: 500, energy: 0 },
    unlocked: false
  },
  {
    id: 'conqueror',
    name: 'Conqueror',
    description: 'Win 50 battles',
    icon: '👑',
    category: 'combat',
    requirement: { type: 'battles_won', value: 50 },
    reward: { metal: 25000, crystal: 12500, deuterium: 2500, energy: 0 },
    unlocked: false
  },
  {
    id: 'destroyer',
    name: 'Destroyer',
    description: 'Destroy 100 enemy ships',
    icon: '💥',
    category: 'combat',
    requirement: { type: 'ships_destroyed', value: 100 },
    reward: { metal: 10000, crystal: 5000, deuterium: 1000, energy: 0 },
    unlocked: false
  },
  {
    id: 'defender',
    name: 'Defender',
    description: 'Win 10 defensive battles',
    icon: '🛡️',
    category: 'combat',
    requirement: { type: 'defenses_won', value: 10 },
    reward: { metal: 5000, crystal: 2500, deuterium: 500, energy: 0 },
    unlocked: false
  },

  // Economy Achievements
  {
    id: 'rich',
    name: 'Getting Rich',
    description: 'Accumulate 100,000 resources',
    icon: '💰',
    category: 'economy',
    requirement: { type: 'max_resources', value: 100000 },
    reward: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
    unlocked: false
  },
  {
    id: 'tycoon',
    name: 'Tycoon',
    description: 'Accumulate 1,000,000 resources',
    icon: '💎',
    category: 'economy',
    requirement: { type: 'max_resources', value: 1000000 },
    reward: { metal: 50000, crystal: 25000, deuterium: 5000, energy: 0 },
    unlocked: false
  },
  {
    id: 'industrialist',
    name: 'Industrialist',
    description: 'Build 100 buildings',
    icon: '🏭',
    category: 'economy',
    requirement: { type: 'buildings_built', value: 100 },
    reward: { metal: 10000, crystal: 5000, deuterium: 1000, energy: 0 },
    unlocked: false
  },

  // Exploration Achievements
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Colonize your first planet',
    icon: '🧭',
    category: 'exploration',
    requirement: { type: 'planets_colonized', value: 1 },
    reward: { metal: 2000, crystal: 1000, deuterium: 200, energy: 0 },
    unlocked: false
  },
  {
    id: 'colonizer',
    name: 'Colonizer',
    description: 'Colonize 5 planets',
    icon: '🏝️',
    category: 'exploration',
    requirement: { type: 'planets_colonized', value: 5 },
    reward: { metal: 10000, crystal: 5000, deuterium: 1000, energy: 0 },
    unlocked: false
  },
  {
    id: 'empire',
    name: 'Empire Builder',
    description: 'Colonize 10 planets',
    icon: '🌍',
    category: 'exploration',
    requirement: { type: 'planets_colonized', value: 10 },
    reward: { metal: 50000, crystal: 25000, deuterium: 5000, energy: 0 },
    unlocked: false
  },

  // Research Achievements
  {
    id: 'researcher',
    name: 'Researcher',
    description: 'Complete 10 research projects',
    icon: '🔬',
    category: 'research',
    requirement: { type: 'research_completed', value: 10 },
    reward: { metal: 5000, crystal: 2500, deuterium: 500, energy: 0 },
    unlocked: false
  },
  {
    id: 'scientist',
    name: 'Scientist',
    description: 'Complete 25 research projects',
    icon: '🧪',
    category: 'research',
    requirement: { type: 'research_completed', value: 25 },
    reward: { metal: 15000, crystal: 7500, deuterium: 1500, energy: 0 },
    unlocked: false
  },
  {
    id: 'genius',
    name: 'Genius',
    description: 'Complete 50 research projects',
    icon: '🧠',
    category: 'research',
    requirement: { type: 'research_completed', value: 50 },
    reward: { metal: 50000, crystal: 25000, deuterium: 5000, energy: 0 },
    unlocked: false
  },

  // Special Achievements
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 10 builds in a single day',
    icon: '⚡',
    category: 'special',
    requirement: { type: 'daily_builds', value: 10 },
    reward: { metal: 10000, crystal: 5000, deuterium: 1000, energy: 0 },
    unlocked: false
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Play for 100 hours',
    icon: '🏆',
    category: 'special',
    requirement: { type: 'play_time', value: 100 * 3600 }, // 100 hours in seconds
    reward: { metal: 100000, crystal: 50000, deuterium: 10000, energy: 0 },
    unlocked: false
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Fill all building slots on a planet',
    icon: '✨',
    category: 'special',
    requirement: { type: 'max_fields', value: 1 },
    reward: { metal: 25000, crystal: 12500, deuterium: 2500, energy: 0 },
    unlocked: false
  }
];

// Check achievement progress
export function checkAchievements(stats: any, achievements: Achievement[]): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  achievements.forEach(achievement => {
    if (achievement.unlocked) return;

    let progress = 0;
    switch (achievement.requirement.type) {
      case 'battles_won':
        progress = stats.attacksWon || 0;
        break;
      case 'ships_destroyed':
        progress = stats.shipsDestroyed || 0;
        break;
      case 'defenses_won':
        progress = stats.defensesWon || 0;
        break;
      case 'max_resources':
        progress = (stats.maxMetal || 0) + (stats.maxCrystal || 0) + (stats.maxDeuterium || 0);
        break;
      case 'buildings_built':
        progress = stats.buildingsBuilt || 0;
        break;
      case 'planets_colonized':
        progress = stats.planetsColonized || 0;
        break;
      case 'research_completed':
        progress = stats.researchCompleted || 0;
        break;
      case 'play_time':
        progress = stats.playTime || 0;
        break;
    }

    if (progress >= achievement.requirement.value) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      newlyUnlocked.push(achievement);
    }
  });

  return newlyUnlocked;
}

// Get achievement progress percentage
export function getAchievementProgress(achievement: Achievement, stats: any): number {
  let progress = 0;
  switch (achievement.requirement.type) {
    case 'battles_won':
      progress = stats.attacksWon || 0;
      break;
    case 'ships_destroyed':
      progress = stats.shipsDestroyed || 0;
      break;
    case 'max_resources':
      progress = (stats.maxMetal || 0) + (stats.maxCrystal || 0) + (stats.maxDeuterium || 0);
      break;
    case 'buildings_built':
      progress = stats.buildingsBuilt || 0;
      break;
    case 'planets_colonized':
      progress = stats.planetsColonized || 0;
      break;
    case 'research_completed':
      progress = stats.researchCompleted || 0;
      break;
    case 'play_time':
      progress = stats.playTime || 0;
      break;
    default:
      progress = 0;
  }

  return Math.min(100, Math.floor((progress / achievement.requirement.value) * 100));
}
