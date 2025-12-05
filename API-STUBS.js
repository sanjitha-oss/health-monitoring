// Optional backend stubs for integrating with server.js
// Add these routes to your Express server for full functionality

// ============================================
// EXAMPLE API ROUTES (Add to server.js)
// ============================================

/*

// POST /api/auth/signup
app.post('/api/auth/signup', (req, res) => {
  const { fullname, email, password, phone, dob, nhs } = req.body;
  
  // Validate input
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if user exists (in real DB, query database)
  const users = JSON.parse(fs.readFileSync('data/users.json', 'utf8'));
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  // Create user
  const newUser = {
    id: Date.now().toString(),
    fullname,
    email,
    password, // IMPORTANT: Hash this in production!
    phone,
    dob,
    nhs,
    registeredAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));
  
  res.status(201).json({ message: 'User created', user: newUser });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const users = JSON.parse(fs.readFileSync('data/users.json', 'utf8'));
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Return JWT token in production
  res.json({ message: 'Login successful', user });
});

// POST /api/patients - Save patient details
app.post('/api/patients', (req, res) => {
  const { userId, fullname, age, gender, nhs, address, condition, wantConsult, wantMonitor } = req.body;
  
  const patients = JSON.parse(fs.readFileSync('data/patients.json', 'utf8'));
  const newPatient = {
    id: Date.now().toString(),
    userId,
    fullname,
    age,
    gender,
    nhs,
    address,
    condition,
    wantConsult,
    wantMonitor,
    savedAt: new Date().toISOString(),
  };
  
  patients.push(newPatient);
  fs.writeFileSync('data/patients.json', JSON.stringify(patients, null, 2));
  
  res.status(201).json({ message: 'Patient saved', patient: newPatient });
});

// GET /api/patients/:id
app.get('/api/patients/:id', (req, res) => {
  const patients = JSON.parse(fs.readFileSync('data/patients.json', 'utf8'));
  const patient = patients.find(p => p.userId === req.params.id);
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  res.json(patient);
});

// POST /api/monitoring - Add vital reading
app.post('/api/monitoring/:patientId', (req, res) => {
  const { hr, bp_sys, bp_dia, spo2, temp, rr, stress } = req.body;
  
  const readings = JSON.parse(fs.readFileSync('data/monitoring.json', 'utf8'));
  const newReading = {
    id: Date.now().toString(),
    patientId: req.params.patientId,
    timestamp: new Date().toISOString(),
    hr,
    bp_sys,
    bp_dia,
    spo2,
    temp,
    rr,
    stress,
  };
  
  readings.push(newReading);
  fs.writeFileSync('data/monitoring.json', JSON.stringify(readings, null, 2));
  
  res.status(201).json({ message: 'Reading saved', reading: newReading });
});

// GET /api/monitoring/:patientId - Get patient's vitals history
app.get('/api/monitoring/:patientId', (req, res) => {
  const { range } = req.query; // e.g., ?range=24h
  
  const readings = JSON.parse(fs.readFileSync('data/monitoring.json', 'utf8'));
  let patientReadings = readings.filter(r => r.patientId === req.params.patientId);
  
  // Filter by time range if specified
  if (range === '24h') {
    const oneDay = 24 * 60 * 60 * 1000;
    const cutoff = new Date(Date.now() - oneDay);
    patientReadings = patientReadings.filter(r => new Date(r.timestamp) > cutoff);
  }
  
  res.json(patientReadings);
});

// GET /api/doctors - List all doctors
app.get('/api/doctors', (req, res) => {
  const doctors = [
    { id: 1, name: 'Dr. Ahmed Hassan', specialty: 'General Practice', rating: 4.8, reviews: 234, available: true, wait: 5 },
    { id: 2, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', rating: 4.9, reviews: 512, available: true, wait: 15 },
    { id: 3, name: 'Dr. Raj Patel', specialty: 'Endocrinology', rating: 4.7, reviews: 189, available: true, wait: 30 },
  ];
  res.json(doctors);
});

// POST /api/consults - Create consultation request
app.post('/api/consults', (req, res) => {
  const { patientId, doctorId, channel } = req.body; // channel: chat, video, audio
  
  const consultation = {
    id: Date.now().toString(),
    patientId,
    doctorId,
    channel,
    status: 'waiting',
    createdAt: new Date().toISOString(),
    estimatedWait: 5, // minutes
  };
  
  res.status(201).json(consultation);
});

// WebSocket for real-time monitoring (example with ws library)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send live vitals every 5 seconds (mock data)
  const interval = setInterval(() => {
    const mockVital = {
      hr: Math.floor(Math.random() * 40 + 60),
      spo2: Math.floor(Math.random() * 5 + 95),
      timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(mockVital));
  }, 5000);
  
  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

*/

module.exports = {};
