import { useState, useEffect } from 'react';
import { Planet, Resources } from './types/game';
import { formatNumber } from './utils/calculations';

// Mock initial data - will connect to backend later
const mockPlanet: Planet = {
  id: '1',
  name: 'Home World',
  coordinates: '1:234:5',
  diameter: 12000,
  fields: { used: 12, max: 163 },
  resources: { metal: 50000, crystal: 30000, deuterium: 10000, energy: 100 },
  resourceRates: { metal: 30, crystal: 20, deuterium: 10, energy: 50 },
  buildings: {
    metalMine: 5,
    crystalMine: 4,
    deuteriumSynthesizer: 3,
    solarPlant: 5,
    fusionReactor: 1,
    robotFactory: 2,
    shipyard: 2,
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
};

const mockPlanets: Planet[] = [
  mockPlanet,
  { ...mockPlanet, id: '2', name: 'Colony Alpha', coordinates: '1:234:6', fields: { used: 3, max: 163 } },
];

type Page = 'overview' | 'buildings' | 'fleet' | 'defense' | 'research' | 'galaxy' | 'alliance' | 'messages';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [planets] = useState<Planet[]>(mockPlanets);
  const [activePlanet, setActivePlanet] = useState<Planet>(mockPlanet);
  const [resources, setResources] = useState<Resources>(mockPlanet.resources);

  // Update resources every second (simulating production)
  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prev => ({
        metal: Math.floor(prev.metal + activePlanet.resourceRates.metal / 3600),
        crystal: Math.floor(prev.crystal + activePlanet.resourceRates.crystal / 3600),
        deuterium: Math.floor(prev.deuterium + activePlanet.resourceRates.deuterium / 3600),
        energy: Math.max(0, prev.energy + activePlanet.resourceRates.energy / 3600),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [activePlanet]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="game-header">
        <div className="flex items-center">
          <span className="logo">OGAME</span>
          <span className="server-name">UNIVERSE 1</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted">Commander: Michael</span>
          <button className="btn btn-primary">Logout</button>
        </div>
      </header>

      {/* Resources Bar */}
      <div className="resources-bar">
        <ResourceBar 
          icon="⚙️" 
          value={resources.metal} 
          rate={activePlanet.resourceRates.metal} 
          colorClass="text-metal"
        />
        <ResourceBar 
          icon="💎" 
          value={resources.crystal} 
          rate={activePlanet.resourceRates.crystal} 
          colorClass="text-crystal"
        />
        <ResourceBar 
          icon="⛽" 
          value={resources.deuterium} 
          rate={activePlanet.resourceRates.deuterium} 
          colorClass="text-deuterium"
        />
        <ResourceBar 
          icon="⚡" 
          value={resources.energy} 
          rate={activePlanet.resourceRates.energy} 
          colorClass="text-energy"
          isEnergy
        />
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <NavButton active={currentPage === 'overview'} onClick={() => setCurrentPage('overview')}>
          Overview
        </NavButton>
        <NavButton active={currentPage === 'buildings'} onClick={() => setCurrentPage('buildings')}>
          Buildings
        </NavButton>
        <NavButton active={currentPage === 'fleet'} onClick={() => setCurrentPage('fleet')}>
          Fleet
        </NavButton>
        <NavButton active={currentPage === 'defense'} onClick={() => setCurrentPage('defense')}>
          Defense
        </NavButton>
        <NavButton active={currentPage === 'research'} onClick={() => setCurrentPage('research')}>
          Research
        </NavButton>
        <NavButton active={currentPage === 'galaxy'} onClick={() => setCurrentPage('galaxy')}>
          Galaxy
        </NavButton>
        <NavButton active={currentPage === 'alliance'} onClick={() => setCurrentPage('alliance')}>
          Alliance
        </NavButton>
        <NavButton active={currentPage === 'messages'} onClick={() => setCurrentPage('messages')}>
          Messages
        </NavButton>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Planet Sidebar */}
        <div className="planet-sidebar">
          {planets.map(planet => (
            <PlanetCard 
              key={planet.id} 
              planet={planet} 
              isActive={planet.id === activePlanet.id}
              onClick={() => setActivePlanet(planet)}
            />
          ))}
        </div>

        {/* Content Area */}
        <div className="content-area">
          {currentPage === 'overview' && <OverviewPage resources={resources} planet={activePlanet} />}
          {currentPage === 'buildings' && <BuildingsPage resources={resources} planet={activePlanet} />}
          {currentPage === 'fleet' && <FleetPage resources={resources} />}
          {currentPage === 'defense' && <DefensePage resources={resources} />}
          {currentPage === 'research' && <ResearchPage resources={resources} />}
          {currentPage === 'galaxy' && <GalaxyPage />}
          {currentPage === 'alliance' && <AlliancePage />}
          {currentPage === 'messages' && <MessagesPage />}
        </div>
      </div>

      {/* Footer */}
      <footer className="game-footer">
        <div>OGame Clone v1.0.0</div>
        <div className="flex gap-4">
          <span>Online: 1,247</span>
          <span>Day: 1</span>
        </div>
      </footer>
    </div>
  );
}

// Resource Bar Component
function ResourceBar({ 
  icon, 
  value, 
  rate, 
  colorClass, 
  isEnergy = false 
}: { 
  icon: string; 
  value: number; 
  rate: number; 
  colorClass: string; 
  isEnergy?: boolean;
}) {
  return (
    <div className="resource-item">
      <span className="resource-icon">{icon}</span>
      <div>
        <div className={`resource-value ${colorClass}`}>
          {formatNumber(value)}
        </div>
        {!isEnergy && (
          <div className={`resource-rate ${rate < 0 ? 'negative' : ''}`}>
            {rate >= 0 ? '+' : ''}{formatNumber(rate)}/h
          </div>
        )}
        {isEnergy && rate < 0 && (
          <div className="resource-rate negative">
            {rate}/h
          </div>
        )}
      </div>
    </div>
  );
}

// Nav Button Component
function NavButton({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button 
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Planet Card Component
function PlanetCard({ 
  planet, 
  isActive, 
  onClick 
}: { 
  planet: Planet; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <div className={`planet-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="planet-header">
        <span className="planet-name">{planet.name}</span>
        <span className="planet-coords">{planet.coordinates}</span>
      </div>
      <div className="planet-fields">
        <span>Fields: {planet.fields.used}/{planet.fields.max}</span>
      </div>
      <div className="planet-image">🌍</div>
    </div>
  );
}

// Page Components
function OverviewPage({ resources, planet }: { resources: Resources; planet: Planet }) {
  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <span>🏠</span> Planet Overview
      </div>
      <div className="panel-content">
        <div className="flex gap-4 mb-4">
          <div>
            <div className="text-muted">Planet</div>
            <div className="font-bold">{planet.name}</div>
          </div>
          <div>
            <div className="text-muted">Coordinates</div>
            <div className="font-bold">{planet.coordinates}</div>
          </div>
          <div>
            <div className="text-muted">Diameter</div>
            <div className="font-bold">{formatNumber(planet.diameter)} km</div>
          </div>
        </div>
        
        <div className="buildings-grid">
          {Object.entries(planet.buildings).map(([key, level]) => (
            level > 0 && (
              <div key={key} className="building-card">
                <div className="building-name">{formatBuildingName(key)}</div>
                <div className="building-level">Level {level}</div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

function BuildingsPage({ resources, planet }: { resources: Resources; planet: Planet }) {
  const buildings = [
    { id: 'metalMine', name: 'Metal Mine', icon: '⛏️' },
    { id: 'crystalMine', name: 'Crystal Mine', icon: '💎' },
    { id: 'deuteriumSynthesizer', name: 'Deuterium Synthesizer', icon: '⛽' },
    { id: 'solarPlant', name: 'Solar Plant', icon: '☀️' },
    { id: 'fusionReactor', name: 'Fusion Reactor', icon: '⚛️' },
    { id: 'robotFactory', name: 'Robot Factory', icon: '🤖' },
    { id: 'shipyard', name: 'Shipyard', icon: '🚀' },
    { id: 'researchLab', name: 'Research Lab', icon: '🔬' },
    { id: 'naniteFactory', name: 'Nanite Factory', icon: '🧬' },
    { id: 'terraformer', name: 'Terraformer', icon: '🌍' },
    { id: 'missileSilo', name: 'Missile Silo', icon: '🎯' },
  ];

  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <span>🏗️</span> Buildings
      </div>
      <div className="panel-content">
        <div className="buildings-grid">
          {buildings.map(building => {
            const level = planet.buildings[building.id as keyof typeof planet.buildings];
            const canBuild = resources.metal > 1000 && resources.crystal > 500;
            
            return (
              <div 
                key={building.id} 
                className={`building-card ${canBuild ? 'can-build' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{building.icon}</span>
                  <span className="building-name">{building.name}</span>
                </div>
                <div className="building-level">Level {level}</div>
                <div className="building-cost">
                  <div className="cost-item">
                    <span className="cost-icon text-metal">⚙️</span>
                    <span className="cost-value sufficient">{formatNumber(1000 + level * 500)}</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-icon text-crystal">💎</span>
                    <span className="cost-value sufficient">{formatNumber(500 + level * 250)}</span>
                  </div>
                </div>
                {canBuild && (
                  <button className="btn btn-success mt-2" style={{ width: '100%' }}>
                    Build
                  </button>
                )}
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
    { id: 'cargoShip', name: 'Cargo Ship', icon: '🚢', count: 10 },
    { id: 'lightFighter', name: 'Light Fighter', icon: '✈️', count: 50 },
    { id: 'heavyFighter', name: 'Heavy Fighter', icon: '🛸', count: 20 },
    { id: 'cruiser', name: 'Cruiser', icon: '🚀', count: 5 },
    { id: 'battleship', name: 'Battleship', icon: '🛰️', count: 2 },
    { id: 'colonyShip', name: 'Colony Ship', icon: '🏝️', count: 1 },
    { id: 'recycler', name: 'Recycler', icon: '♻️', count: 3 },
    { id: 'espionageProbe', name: 'Espionage Probe', icon: '🔭', count: 20 },
  ];

  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <span>🚀</span> Fleet
      </div>
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
                <option>Recycle</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Target Coordinates</label>
              <input className="form-input" placeholder="1:234:5" />
            </div>
          </div>
          
          <div className="panel-header mb-2">Available Ships</div>
          <div className="fleet-slots">
            {ships.map(ship => (
              <div key={ship.id} className="fleet-slot">
                <span className="fleet-slot-icon">{ship.icon}</span>
                <span className="fleet-slot-name">{ship.name}</span>
                <span className="fleet-slot-count">{ship.count}</span>
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
    { id: 'ionTurret', name: 'Ion Turret', icon: '⚡', count: 0 },
    { id: 'gaussCannon', name: 'Gauss Cannon', icon: '💥', count: 0 },
    { id: 'plasmaTurret', name: 'Plasma Turret', icon: '🔥', count: 0 },
    { id: 'shieldDome', name: 'Shield Dome', icon: '🛡️', count: 0 },
    { id: 'missileDefense', name: 'Missile Defense', icon: '🎇', count: 0 },
  ];

  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <span>🛡️</span> Defense Systems
      </div>
      <div className="panel-content">
        <div className="buildings-grid">
          {defenses.map(def => (
            <div key={def.id} className="building-card">
              <div className="flex items-center gap-2 mb-2">
                <span>{def.icon}</span>
                <span className="building-name">{def.name}</span>
              </div>
              <div className="building-level">Count: {def.count}</div>
              <div className="building-cost mt-2">
                <div className="cost-item">
                  <span className="cost-icon text-metal">⚙️</span>
                  <span className="cost-value">{formatNumber(2000)}</span>
                </div>
              </div>
              <button className="btn btn-primary mt-2" style={{ width: '100%' }}>
                Build
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResearchPage({ resources }: { resources: Resources }) {
  const researches = [
    { id: 'energyTech', name: 'Energy Technology', icon: '⚡', level: 3 },
    { id: 'laserTech', name: 'Laser Technology', icon: '🔫', level: 2 },
    { id: 'ionTech', name: 'Ion Technology', icon: '⚛️', level: 1 },
    { id: 'hyperspaceTech', name: 'Hyperspace Technology', icon: '🌌', level: 0 },
    { id: 'plasmaTech', name: 'Plasma Technology', icon: '🔥', level: 0 },
    { id: 'combustionDrive', name: 'Combustion Drive', icon: '💨', level: 2 },
    { id: 'impulseDrive', name: 'Impulse Drive', icon: '🚀', level: 1 },
    { id: 'hyperspaceDrive', name: 'Hyperspace Drive', icon: '🌀', level: 0 },
    { id: 'espionageTech', name: 'Espionage Technology', icon: '🔭', level: 1 },
    { id: 'computerTech', name: 'Computer Technology', icon: '💻', level: 2 },
    { id: 'astrophysics', name: 'Astrophysics', icon: '🌠', level: 0 },
  ];

  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <span>🔬</span> Research Lab
      </div>
      <div className="panel-content">
        <div className="buildings-grid">
          {researches.map(res => (
            <div key={res.id} className="building-card">
              <div className="flex items-center gap-2 mb-2">
                <span>{res.icon}</span>
                <span className="building-name">{res.name}</span>
              </div>
              <div className="building-level">Level {res.level}</div>
              <div className="building-cost mt-2">
                <div className="cost-item">
                  <span className="cost-icon text-metal">⚙️</span>
                  <span className="cost-value">{formatNumber(200 * Math.pow(1.5, res.level))}</span>
                </div>
                <div className="cost-item">
                  <span className="cost-icon text-crystal">💎</span>
                  <span className="cost-value">{formatNumber(400 * Math.pow(1.5, res.level))}</span>
                </div>
              </div>
              <button className="btn btn-primary mt-2" style={{ width: '100%' }}>
                Research
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalaxyPage() {
  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <span>🌌</span> Galaxy View
      </div>
      <div className="panel-content">
        <div className="form-group">
          <label className="form-label">Coordinates</label>
          <div className="flex gap-2">
            <input className="form-input" placeholder="Galaxy" defaultValue="1" style={{ width: '80px' }} />
            <input className="form-input" placeholder="System" defaultValue="234" style={{ width: '80px' }} />
          </div>
        </div>
        <div style={{ height: '400px', background: 'var(--bg-dark)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-muted">Galaxy Map Coming Soon</span>
        </div>
      </div>
    </div>
  );
}

function AlliancePage() {
  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <span>🤝</span> Alliance
      </div>
      <div className="panel-content">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏰</div>
          <div className="text-muted mb-4">You don't have an alliance yet</div>
          <button className="btn btn-primary">Create Alliance</button>
          <span style={{ margin: '0 10px' }}>or</span>
          <button className="btn btn-primary">Browse Alliances</button>
        </div>
      </div>
    </div>
  );
}

function MessagesPage() {
  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <span>📧</span> Messages
      </div>
      <div className="panel-content">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <div className="text-muted">No messages</div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format building names
function formatBuildingName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export default App;
