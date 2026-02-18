import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'ogame-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real DB in production)
interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  planets: any[];
  resources: any;
  ships: any;
  research: any;
  allianceId?: string;
  createdAt: number;
}

interface Planet {
  id: string;
  userId: string;
  name: string;
  coordinates: string;
  buildings: any;
  resources: any;
}

const users: Map<string, User> = new Map();
const planets: Map<string, Planet> = new Map();
const activeSessions: Map<string, string> = new Map(); // token -> userId

// Helper to create default planet
function createDefaultPlanet(userId: string, coords: string): Planet {
  return {
    id: uuidv4(),
    userId,
    name: 'Home World',
    coordinates: coords,
    buildings: {
      metalMine: 1,
      crystalMine: 1,
      deuteriumSynthesizer: 1,
      solarPlant: 1,
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
    resources: {
      metal: 500,
      crystal: 300,
      deuterium: 100,
      energy: 10,
    }
  };
}

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    for (const user of users.values()) {
      if (user.username === username || user.email === email) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    // Create user with starting planet
    const user: User = {
      id: userId,
      username,
      email,
      passwordHash,
      planets: [],
      resources: { metal: 1000, crystal: 500, deuterium: 200, energy: 50 },
      ships: {},
      research: {},
      createdAt: Date.now(),
    };
    
    // Create initial planet
    const planet = createDefaultPlanet(userId, '1:1:1');
    planets.set(planet.id, planet);
    user.planets.push(planet.id);
    
    users.set(userId, user);
    
    // Generate token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    activeSessions.set(token, userId);
    
    res.json({ token, user: { id: userId, username, email, planets: user.planets } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    let foundUser: User | undefined;
    for (const user of users.values()) {
      if (user.username === username || user.email === username) {
        foundUser = user;
        break;
      }
    }
    
    if (!foundUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, foundUser.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: foundUser.id }, JWT_SECRET, { expiresIn: '7d' });
    activeSessions.set(token, foundUser.id);
    
    res.json({ 
      token, 
      user: { 
        id: foundUser.id, 
        username: foundUser.username, 
        email: foundUser.email,
        planets: foundUser.planets 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Middleware to verify token
function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = activeSessions.get(token);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Protected Routes
app.get('/api/user', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    planets: user.planets,
    resources: user.resources,
    research: user.research,
    allianceId: user.allianceId,
  });
});

app.get('/api/planets', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const userPlanets = user.planets.map(id => planets.get(id)).filter(Boolean);
  res.json(userPlanets);
});

app.get('/api/planets/:id', verifyToken, (req, res) => {
  const planet = planets.get(req.params.id);
  if (!planet || planet.userId !== req.userId) {
    return res.status(404).json({ error: 'Planet not found' });
  }
  
  res.json(planet);
});

// Buildings API
app.post('/api/planets/:id/buildings/:building', verifyToken, (req, res) => {
  const planet = planets.get(req.params.id);
  if (!planet || planet.userId !== req.userId) {
    return res.status(404).json({ error: 'Planet not found' });
  }
  
  // In a real implementation, we would:
  // 1. Check if player has enough resources
  // 2. Check if building requirements are met
  // 3. Check if there's space for more buildings
  // 4. Start construction (with queue)
  
  const building = req.params.building as keyof typeof planet.buildings;
  if (building in planet.buildings) {
    planet.buildings[building]++;
    res.json({ success: true, building: planet.buildings });
  } else {
    res.status(400).json({ error: 'Invalid building' });
  }
});

// Fleet Routes
app.get('/api/fleet', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ ships: user.ships });
});

app.post('/api/fleet/mission', verifyToken, (req, res) => {
  const { mission, targetCoords, ships, resources } = req.body;
  
  // Create fleet mission
  const fleetMission = {
    id: uuidv4(),
    userId: req.userId,
    mission,
    targetCoords,
    ships,
    resources,
    status: 'pending',
    createdAt: Date.now(),
  };
  
  // In a real implementation, this would be stored and processed
  // For now, just acknowledge the mission
  
  res.json({ success: true, mission: fleetMission });
});

// Research Routes
app.post('/api/research/:tech', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const tech = req.params.tech as keyof typeof user.research;
  if (!(tech in user.research)) {
    user.research[tech] = 0;
  }
  
  user.research[tech]++;
  
  res.json({ success: true, research: user.research });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Resource update loop (every second)
setInterval(() => {
  // Calculate production for each planet and update
  for (const planet of planets.values()) {
    const user = users.get(planet.userId);
    if (!user) continue;
    
    // Simple production calculation
    // In a real game, this would be more complex
    const metalProduction = planet.buildings.metalMine * 30;
    const crystalProduction = planet.buildings.crystalMine * 20;
    const deuteriumProduction = planet.buildings.deuteriumSynthesizer * 10;
    
    planet.resources.metal += Math.floor(metalProduction / 3600);
    planet.resources.crystal += Math.floor(crystalProduction / 3600);
    planet.resources.deuterium += Math.floor(deuteriumProduction / 3600);
    
    // Emit updates to the user
    io.to(`user:${planet.userId}`).emit('resources:update', planet.resources);
  }
}, 1000);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 OGame Server running on port ${PORT}`);
});
