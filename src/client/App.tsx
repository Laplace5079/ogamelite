import { useState, useEffect, useCallback } from 'react';
import { Planet, Resources, Ships, Defense, Buildings } from './types/game';
import { 
  GameSettings, 
  PlayerStats, 
  AIPlayer, 
  Achievement, 
  DailyMission,
  AIDifficulty,
  DEFAULT_SETTINGS,
  DEFAULT_STATS
} from './types/game-enhanced';
import { formatNumber } from './utils/calculations';
import { aiSystem, AIAction } from './services/ai-system';
import { ACHIEVEMENTS, checkAchievements, getAchievementProgress } from './services/achievements';

// Initial planet data
const createInitialPlanet = (): Planet => ({
  id: 'planet_1',
  name: 'Home World',
  coordinates: '1:1:5',
  diameter: 12000,
  fields: { used: 8, max: 163 },
  resources: { metal: 500, crystal: 300, deuterium: 100, energy: 50 },
  resourceRates: { metal: 30, crystal: 20, deuterium: 10, energy: 20 },
  buildings: {
    metalMine: 2,
    crystalMine: 1,
    deuteriumSynthesizer: 1,
    solarPlant: 2,
    fusionReactor: 0,
    robotFactory: 1,
    shipyard: 1,
    researchLab: 1,
    allianceHub: 0,
    missileSilo: 0,
    naniteFactory: 0,
    terraformer: 0,
    spaceDock: 0,
  },
  defense: {
    rocketLauncher: 0,
    lightLaser: 0,
    heavyLaser: 0,
    ionTurret: 0,
    gaussCannon: 0,
    plasmaTurret: 0,
    shieldDome: 0,
    missileDefense: 0,
  },
  lastUpdate: Date.now(),
});

const createSecondPlanet = (): Planet => ({
  id: 'planet_2',
  name: 'Colony Alpha',
  coordinates: '1:1:8',
  diameter: 10000,
  fields: { used: 3, max: 163 },
  resources: { metal: 200, crystal: 100, deuterium: 50, energy: 20 },
  resourceRates: { metal: 15, crystal: 10, deuterium: 5, energy: 10 },
  buildings: {
    metalMine: 1,
    crystalMine: 1,
    deuteriumSynthesizer: 1,
    solarPlant: 1,
    fusionReactor: 0,
    robotFactory: 0,
    shipyard: 0,
    researchLab: 0,
    allianceHub: 0,
    missileSilo: 0,
    naniteFactory: 0,
    terraformer: 0,
    spaceDock: 0,
  },
  defense: {
    rocketLauncher: 0,
    lightLaser: 0,
    heavyLaser: 0,
    ionTurret: 0,
    gaussCannon: 0,
    plasmaTurret: 0,
    shieldDome: 0,
    missileDefense: 0,
  },
  lastUpdate: Date.now(),
});

type Page = 'overview' | 'buildings' | 'fleet' | 'defense' | 'research' | 'galaxy' | 'ai' | 'achievements' | 'missions' | 'settings';

function App() {
  // Game State
  const [planets, setPlanets] = useState<Planet[]>([createInitialPlanet()]);
  const [activePlanetId, setActivePlanetId] = useState<string>('planet_1');
  const [resources, setResources] = useState<Resources>(createInitialPlanet().resources);
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  
  // AI System
  const [aiPlayers, setAiPlayers] = useState<AIPlayer[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Achievements & Stats
  const [achievements, setAchievements] = useState<Achievement[]>([...ACHIEVEMENTS]);
  const [stats, setStats] = useState<PlayerStats>({ ...DEFAULT_STATS, createdAt: Date.now() });
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  
  // Settings
  const [settings, setSettings] = useState<GameSettings>({ ...DEFAULT_SETTINGS });

  const activePlanet = planets.find(p => p.id === activePlanetId) || planets[0];

  // Get resources from active planet
  useEffect(() => {
    if (activePlanet) {
      setResources(activePlanet.resources);
    }
  }, [activePlanet]);

  // Resource production loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPlanets(prevPlanets => {
        return prevPlanets.map(planet => {
          const metalRate = planet.buildings.metalMine * 30 * settings.speed;
          const crystalRate = planet.buildings.crystalMine * 20 * settings.speed;
          const deuteriumRate = planet.buildings.deuteriumSynthesizer * 10 * settings.speed;
          const energyProduction = (planet.buildings.solarPlant * 20 + planet.buildings.fusionReactor * 50) * settings.speed;
          const energyConsumption = (planet.buildings.metalMine * 10 + planet.buildings.crystalMine * 10 + planet.buildings.deuteriumSynthesizer * 20) * settings.speed;
          const netEnergy = energyProduction - energyConsumption;

          return {
            ...planet,
            resources: {
              metal: Math.floor(planet.resources.metal + metalRate / 3600),
              crystal: Math.floor(planet.resources.crystal + crystalRate / 3600),
              deuterium: Math.floor(planet.resources.deuterium + deuteriumRate / 3600),
              energy: Math.max(0, netEnergy),
            },
            resourceRates: {
              metal: metalRate,
              crystal: crystalRate,
              deuterium: deuteriumRate,
              energy: netEnergy,
            }
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.speed]);

  // Track max resources for achievements
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      maxMetal: Math.max(prev.maxMetal || 0, resources.metal),
      maxCrystal: Math.max(prev.maxCrystal || 0, resources.crystal),
      maxDeuterium: Math.max(prev.maxDeuterium || 0, resources.deuterium),
    }));
  }, [resources]);

  // AI System update loop
  useEffect(() => {
    if (!gameStarted || aiPlayers.length === 0) return;

    const interval = setInterval(() => {
      aiPlayers.forEach(ai => {
        const actions = aiSystem.updateAI(ai, 1000);
        // Process AI actions (in a full game, this would modify AI state)
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [gameStarted, aiPlayers]);

  // Check achievements periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newlyUnlocked = checkAchievements(stats, achievements);
      if (newlyUnlocked.length > 0) {
        setAchievements([...achievements]);
        // Give rewards
        newlyUnlocked.forEach(achievement => {
          if (achievement.reward) {
            setPlanets(prev => prev.map(p => ({
              ...p,
              resources: {
                metal: p.resources.metal + (achievement.reward?.metal || 0),
                crystal: p.resources.crystal + (achievement.reward?.crystal || 0),
                deuterium: p.resources.deuterium + (achievement.reward?.deuterium || 0),
                energy: p.resources.energy,
              }
            })));
          }
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [stats, achievements]);

  // Start game with AI
  const startGame = useCallback((difficulty: AIDifficulty) => {
    const ais = aiSystem.generateUniverse(10);
    setAiPlayers(ais);
    setGameStarted(true);
    setCurrentPage('overview');
  }, []);

  // Building action
  const buildUpgrade = useCallback((buildingId: keyof Buildings) => {
    if (!activePlanet) return;
    
    const costs = getBuildingCost(buildingId, (activePlanet.buildings[buildingId] || 0) + 1);
    
    if (resources.metal >= costs.metal && resources.crystal >= costs.crystal && resources.deuterium >= costs.deuterium) {
      setPlanets(prev => prev.map(p => {
        if (p.id !== activePlanetId) return p;
        return {
          ...p,
          resources: {
            metal: p.resources.metal - costs.metal,
            crystal: p.resources.crystal - costs.crystal,
            deuterium: p.resources.deuterium - costs.deuterium,
            energy: p.resources.energy,
          },
          buildings: {
            ...p.buildings,
            [buildingId]: (p.buildings[buildingId] || 0) + 1
          },
          fields: {
            ...p.fields,
            used: p.fields.used + 1
          }
        };
      }));
      
      setStats(prev => ({
        ...prev,
        buildingsBuilt: (prev.buildingsBuilt || 0) + 1
      }));
    }
  }, [activePlanet, activePlanetId, resources]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="game-header">
        <div className="flex items-center">
          <span className="logo">OGAME</span>
          <span className="server-name">LITE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted">Commander: Michael</span>
          <div className="game-speed">
            {settings.speed}x
          </div>
        </div>
      </header>

      {/* Resources Bar */}
      <div className="resources-bar">
        <ResourceBar icon="⚙️" value={resources.metal} rate={activePlanet?.resourceRates.metal || 0} colorClass="text-metal" />
        <ResourceBar icon="💎" value={resources.crystal} rate={activePlanet?.resourceRates.crystal || 0} colorClass="text-crystal" />
        <ResourceBar icon="⛽" value={resources.deuterium} rate={activePlanet?.resourceRates.deuterium || 0} colorClass="text-deuterium" />
        <ResourceBar icon="⚡" value={resources.energy} rate={activePlanet?.resourceRates.energy || 0} colorClass="text-energy" isEnergy />
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <NavButton active={currentPage === 'overview'} onClick={() => setCurrentPage('overview')}>Overview</NavButton>
        <NavButton active={currentPage === 'buildings'} onClick={() => setCurrentPage('buildings')}>Buildings</NavButton>
        <NavButton active={currentPage === 'fleet'} onClick={() => setCurrentPage('fleet')}>Fleet</NavButton>
        <NavButton active={currentPage === 'defense'} onClick={() => setCurrentPage('defense')}>Defense</NavButton>
        <NavButton active={currentPage === 'research'} onClick={() => setCurrentPage('research')}>Research</NavButton>
        <NavButton active={currentPage === 'galaxy'} onClick={() => setCurrentPage('galaxy')}>Galaxy</NavButton>
        <NavButton active={currentPage === 'ai'} onClick={() => setCurrentPage('ai')}>AI</NavButton>
        <NavButton active={currentPage === 'achievements'} onClick={() => setCurrentPage('achievements')}>🏆</NavButton>
        <NavButton active={currentPage === 'missions'} onClick={() => setCurrentPage('missions')}>📋</NavButton>
        <NavButton active={currentPage === 'settings'} onClick={() => setCurrentPage('settings')}>⚙️</NavButton>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Planet Sidebar */}
        <div className="planet-sidebar">
          {planets.map(planet => (
            <PlanetCard 
              key={planet.id} 
              planet={planet} 
              isActive={planet.id === activePlanetId}
              onClick={() => setActivePlanetId(planet.id)}
            />
          ))}
          {planets.length < 5 && (
            <button className="btn btn-primary" style={{ width: '100%' }}>
              + Colonize
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="content-area">
          {!gameStarted ? (
            <StartScreen onStart={startGame} />
          ) : (
            <>
              {currentPage === 'overview' && <OverviewPage planet={activePlanet} resources={resources} stats={stats} />}
              {currentPage === 'buildings' && <BuildingsPage resources={resources} planet={activePlanet} onBuild={buildUpgrade} />}
              {currentPage === 'fleet' && <FleetPage resources={resources} />}
              {currentPage === 'defense' && <DefensePage resources={resources} />}
              {currentPage === 'research' && <ResearchPage resources={resources} />}
              {currentPage === 'galaxy' && <GalaxyPage aiPlayers={aiPlayers} />}
              {currentPage === 'ai' && <AIPage aiPlayers={aiPlayers} />}
              {currentPage === 'achievements' && <AchievementsPage achievements={achievements} stats={stats} />}
              {currentPage === 'missions' && <MissionsPage />}
              {currentPage === 'settings' && <SettingsPage settings={settings} onSettingsChange={setSettings} />}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="game-footer">
        <div>OGame Lite v1.1.0 - Enhanced Edition</div>
        <div className="flex gap-4">
          <span>Planets: {planets.length}</span>
          <span>AI Players: {aiPlayers.length}</span>
          <span>Day: {Math.floor((Date.now() - stats.createdAt) / 86400000) + 1}</span>
        </div>
      </footer>
    </div>
  );
}

// Start Screen Component
function StartScreen({ onStart }: { onStart: (difficulty: AIDifficulty) => void }) {
  return (
    <div className="panel fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="panel-header" style={{ justifyContent: 'center', fontSize: '24px' }}>
        🚀 Welcome to OGame Lite
      </div>
      <div className="panel-content" style={{ textAlign: 'center', padding: '40px' }}>
        <p className="mb-4">Choose your difficulty and battle against AI opponents!</p>
        
        <div className="difficulty-options mb-4">
          <button className="btn btn-primary mb-2" onClick={() => onStart(AIDifficulty.EASY)} style={{ width: '200px', margin: '5px' }}>
            🌱 Easy
          </button>
          <button className="btn btn-primary mb-2" onClick={() => onStart(AIDifficulty.NORMAL)} style={{ width: '200px', margin: '5px' }}>
            ⚔️ Normal
          </button>
          <button className="btn btn-primary mb-2" onClick={() => onStart(AIDifficulty.HARD)} style={{ width: '200px', margin: '5px' }}>
            🔥 Hard
          </button>
          <button className="btn btn-danger mb-2" onClick={() => onStart(AIDifficulty.INSANE)} style={{ width: '200px', margin: '5px' }}>
            💀 Insane
          </button>
        </div>
        
        <div className="features-list mt-4" style={{ textAlign: 'left' }}>
          <h3>🎮 Features</h3>
          <ul style={{ marginLeft: '20px' }}>
            <li>AI Opponents with unique strategies</li>
            <li>Achievement system with rewards</li>
            <li>Daily missions</li>
            <li>Enhanced battle system</li>
            <li>Resource management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Resource Bar Component
function ResourceBar({ icon, value, rate, colorClass, isEnergy = false }: { icon: string; value: number; rate: number; colorClass: string; isEnergy?: boolean }) {
  return (
    <div className="resource-item">
      <span className="resource-icon">{icon}</span>
      <div>
        <div className={`resource-value ${colorClass}`}>{formatNumber(value)}</div>
        {!isEnergy && <div className={`resource-rate ${rate < 0 ? 'negative' : ''}`}>{rate >= 0 ? '+' : ''}{formatNumber(rate)}/h</div>}
        {isEnergy && rate < 0 && <div className="resource-rate negative">{rate}/h</div>}
      </div>
    </div>
  );
}

// Nav Button
function NavButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{children}</button>;
}

// Planet Card
function PlanetCard({ planet, isActive, onClick }: { planet: Planet; isActive: boolean; onClick: () => void }) {
  return (
    <div className={`planet-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="planet-header">
        <span className="planet-name">{planet.name}</span>
        <span className="planet-coords">{planet.coordinates}</span>
      </div>
      <div className="planet-fields">Fields: {planet.fields.used}/{planet.fields.max}</div>
      <div className="planet-image">🌍</div>
    </div>
  );
}

// Page Components
function OverviewPage({ planet, resources, stats }: { planet: Planet; resources: Resources; stats: PlayerStats }) {
  return (
    <div className="panel fade-in">
      <div className="panel-header"><span>🏠</span> Planet Overview</div>
      <div className="panel-content">
        <div className="flex gap-4 mb-4">
          <div><div className="text-muted">Planet</div><div className="font-bold">{planet.name}</div></div>
          <div><div className="text-muted">Coordinates</div><div className="font-bold">{planet.coordinates}</div></div>
          <div><div className="text-muted">Diameter</div><div className="font-bold">{formatNumber(planet.diameter)} km</div></div>
        </div>
        
        <div className="stats-grid mt-4">
          <div className="stat-card">
            <div className="stat-label">Attacks Won</div>
            <div className="stat-value text-green">{stats.attacksWon}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Buildings Built</div>
            <div className="stat-value text-blue">{stats.buildingsBuilt || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Resources Looted</div>
            <div className="stat-value text-yellow">{formatNumber(stats.resourcesLooted)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuildingsPage({ resources, planet, onBuild }: { resources: Resources; planet: Planet; onBuild: (id: keyof Buildings) => void }) {
  const buildings = [
    { id: 'metalMine', name: 'Metal Mine', icon: '⛏️' },
    { id: 'crystalMine', name: 'Crystal Mine', icon: '💎' },
    { id: 'deuteriumSynthesizer', name: 'Deuterium Synthesizer', icon: '⛽' },
    { id: 'solarPlant', name: 'Solar Plant', icon: '☀️' },
    { id: 'fusionReactor', name: 'Fusion Reactor', icon: '⚛️' },
    { id: 'robotFactory', name: 'Robot Factory', icon: '🤖' },
    { id: 'shipyard', name: 'Shipyard', icon: '🚀' },
    { id: 'researchLab', name: 'Research Lab', icon: '🔬' },
  ];

  return (
    <div className="panel fade-in">
      <div className="panel-header"><span>🏗️</span> Buildings</div>
      <div className="panel-content">
        <div className="buildings-grid">
          {buildings.map(b => {
            const level = planet.buildings[b.id as keyof Buildings] || 0;
            const costs = getBuildingCost(b.id as keyof Buildings, level + 1);
            const canBuild = resources.metal >= costs.metal && resources.crystal >= costs.crystal;
            
            return (
              <div key={b.id} className={`building-card ${canBuild ? 'can-build' : ''}`} onClick={() => canBuild && onBuild(b.id as keyof Buildings)}>
                <div className="flex items-center gap-2 mb-2">
                  <span>{b.icon}</span>
                  <span className="building-name">{b.name}</span>
                </div>
                <div className="building-level">Level {level}</div>
                <div className="building-cost">
                  <div className="cost-item"><span className="cost-icon text-metal">⚙️</span><span className={`cost-value ${resources.metal >= costs.metal ? 'sufficient' : 'insufficient'}`}>{formatNumber(costs.metal)}</span></div>
                  <div className="cost-item"><span className="cost-icon text-crystal">💎</span><span className={`cost-value ${resources.crystal >= costs.crystal ? 'sufficient' : 'insufficient'}`}>{formatNumber(costs.crystal)}</span></div>
                </div>
                {canBuild && <button className="btn btn-success mt-2" style={{ width: '100%' }}>Build</button>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FleetPage({ resources }: { resources: Resources }) {
  const ships = [
    { id: 'cargoShip', name: 'Cargo Ship', icon: '🚢', count: 5 },
    { id: 'lightFighter', name: 'Light Fighter', icon: '✈️', count: 10 },
    { id: 'heavyFighter', name: 'Heavy Fighter', icon: '🛸', count: 5 },
    { id: 'cruiser', name: 'Cruiser', icon: '🚀', count: 2 },
    { id: 'battleship', name: 'Battleship', icon: '🛰️', count: 1 },
  ];

  return (
    <div className="panel fade-in">
      <div className="panel-header"><span>🚀</span> Fleet Command</div>
      <div className="panel-content">
        <div className="fleet-mission-form">
          <div className="flex gap-4 mb-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Mission</label>
              <select className="form-input">
                <option>Attack</option>
                <option>Transport</option>
                <option>Deploy</option>
                <option>Spy</option>
                <option>Colonize</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Target</label>
              <input className="form-input" placeholder="1:234:5" />
            </div>
          </div>
          <div className="panel-header mb-2">Ships</div>
          <div className="fleet-slots">
            {ships.map(s => (
              <div key={s.id} className="fleet-slot">
                <span className="fleet-slot-icon">{s.icon}</span>
                <span className="fleet-slot-name">{s.name}</span>
                <span className="fleet-slot-count">{s.count}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary mt-4">Send Fleet</button>
        </div>
      </div>
    </div>
  );
}

function DefensePage({ resources }: { resources: Resources }) {
  const defenses = [
    { id: 'rocketLauncher', name: 'Rocket Launcher', icon: '🎯', count: 0 },
    { id: 'lightLaser', name: 'Light Laser', icon: '🔫', count: 0 },
    { id: 'heavyLaser', name: 'Heavy Laser', icon: '🔦', count: 0 },
    { id: 'shieldDome', name: 'Shield Dome', icon: '🛡️', count: 0 },
  ];

  return (
    <div className="panel fade-in">
      <div className="panel-header"><span>🛡️</span> Defense</div>
      <div className="panel-content">
        <div className="buildings-grid">
          {defenses.map(d => (
            <div key={d.id} className="building-card">
              <div className="flex items-center gap-2 mb-2"><span>{d.icon}</span><span className="building-name">{d.name}</span></div>
              <div className="building-level">Count: {d.count}</div>
              <button className="btn btn-primary mt-2" style={{ width: '100%' }}>Build</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResearchPage({ resources }: { resources: Resources }) {
  const researches = [
    { id: 'energyTech', name: 'Energy Tech', icon: '⚡', level: 1 },
    { id: 'laserTech', name: 'Laser Tech', icon: '🔫', level: 1 },
    { id: 'ionTech', name: 'Ion Tech', icon: '⚛️', level: 0 },
    { id: 'hyperspaceTech', name: 'Hyperspace', icon: '🌌', level: 0 },
  ];

  return (
    <div className="panel fade-in">
      <div className="panel-header"><span>🔬</span> Research</div>
      <div className="panel-content">
        <div className="buildings-grid">
          {researches.map(r => (
            <div key={r.id} className="building-card">
              <div className="flex items-center gap-2 mb-2"><span>{r.icon}</span><span className="building-name">{r.name}</span></div>
              <div className="building-level">Level {r.level}</div>
              <button className="btn btn-primary mt-2" style={{ width: '100%' }}>Research</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalaxyPage({ aiPlayers }: { aiPlayers: AIPlayer[] }) {
  return (
    <div className="panel fade-in">
      <div className="panel-header"><span>🌌</span> Galaxy</div>
      <div className="panel-content">
        <div className="galaxy-map">
          <p className="text-muted mb-4">Galaxy Map - {aiPlayers.length} AI players in universe</p>
          <div className="ai-players-grid">
            {aiPlayers.slice(0, 6).map(ai => (
              <div key={ai.id} className="ai-player-card" style={{ borderColor: ai.color }}>
                <div className="ai-name" style={{ color: ai.color }}>{ai.name}</div>
                <div className="ai-stats">
                  <span>Fleet: {formatNumber(ai.fleetPower)}</span>
                  <span>Economy: {formatNumber(ai.economyPower)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIPage({ aiPlayers }: { aiPlayers: AIPlayer[] }) {
  return (
    <div className="panel fade-in">
      <div className="panel-header"><span>🤖</span> AI Opponents</div>
      <div className="panel-content">
        {aiPlayers.length === 0 ? (
          <p className="text-muted">Start a game to see AI opponents!</p>
        ) : (
          <div className="ai-list">
            {aiPlayers.map(ai => (
              <div key={ai.id} className="ai-card" style={{ borderLeftColor: ai.color }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="ai-name" style={{ color: ai.color, fontWeight: 'bold' }}>{ai.name}</div>
                    <div className="text-muted">{ai.strategy} • Difficulty {ai.difficulty}</div>
                  </div>
                  <div className="text-right">
                    <div>Fleet Power: {formatNumber(ai.fleetPower)}</div>
                    <div>Planets: {ai.planets.length}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AchievementsPage({ achievements, stats }: { achievements: Achievement[]; stats: PlayerStats }) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <div className="panel fade-in">
      <div className="panel-header"><span>🏆</span> Achievements ({unlockedCount}/{achievements.length})</div>
      <div className="panel-content">
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-name">{achievement.name}</div>
              <div className="achievement-desc">{achievement.description}</div>
              {!achievement.unlocked && (
                <div className="achievement-progress">
                  <div className="progress-bar" style={{ width: `${getAchievementProgress(achievement, stats)}%` }} />
                </div>
              )}
              {achievement.unlocked && <div className="text-green">✓ Unlocked</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MissionsPage() {
  return (
    <div className="panel fade-in">
      <div className="panel-header"><span>📋</span> Daily Missions</div>
      <div className="panel-content">
        <div className="mission-card">
          <div className="mission-icon">⛏️</div>
          <div className="mission-info">
            <div className="mission-name">Build 3 Buildings</div>
            <div className="mission-desc">Construct 3 new buildings today</div>
          </div>
          <div className="mission-reward text-green">+1000 Metal</div>
        </div>
        <div className="mission-card">
          <div className="mission-icon">⚔️</div>
          <div className="mission-info">
            <div className="mission-name">Win a Battle</div>
            <div className="mission-desc">Win your first battle of the day</div>
          </div>
          <div className="mission-reward text-green">+500 Crystal</div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ settings, onSettingsChange }: { settings: GameSettings; onSettingsChange: (s: GameSettings) => void }) {
  return (
    <div className="panel fade-in">
      <div className="panel-header"><span>⚙️</span> Settings</div>
      <div className="panel-content">
        <div className="setting-group">
          <label className="setting-label">Game Speed</label>
          <select 
            className="form-input" 
            value={settings.speed}
            onChange={(e) => onSettingsChange({ ...settings, speed: Number(e.target.value) })}
          >
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={5}>5x</option>
            <option value={10}>10x</option>
          </select>
        </div>
        
        <div className="setting-group">
          <label className="setting-label">Notifications</label>
          <div className="checkbox-group">
            <label><input type="checkbox" checked={settings.notifications.attack} onChange={(e) => onSettingsChange({ ...settings, notifications: { ...settings.notifications, attack: e.target.checked } })} /> Attack alerts</label>
            <label><input type="checkbox" checked={settings.notifications.missionComplete} onChange={(e) => onSettingsChange({ ...settings, notifications: { ...settings.notifications, missionComplete: e.target.checked } })} /> Mission complete</label>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Display</label>
          <div className="checkbox-group">
            <label><input type="checkbox" checked={settings.display.animations} onChange={(e) => onSettingsChange({ ...settings, display: { ...settings.display, animations: e.target.checked } })} /> Animations</label>
            <label><input type="checkbox" checked={settings.display.effects} onChange={(e) => onSettingsChange({ ...settings, display: { ...settings.display, effects: e.target.checked } })} /> Visual effects</label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getBuildingCost(buildingId: string, level: number): Resources {
  const costs: Record<string, number[]> = {
    metalMine: [60, 15, 0],
    crystalMine: [48, 24, 0],
    deuteriumSynthesizer: [225, 75, 0],
    solarPlant: [75, 30, 0],
    fusionReactor: [900, 360, 180],
    robotFactory: [400, 120, 200],
    shipyard: [400, 200, 100],
    researchLab: [200, 400, 200],
  };
  
  const base = costs[buildingId] || [0, 0, 0];
  const multiplier = Math.pow(1.5, level - 1);
  
  return {
    metal: Math.floor(base[0] * multiplier),
    crystal: Math.floor(base[1] * multiplier),
    deuterium: Math.floor(base[2] * multiplier),
    energy: 0,
  };
}

export default App;
