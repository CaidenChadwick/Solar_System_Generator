import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';

import {
  registerUser,
  logIn,
  getAllUsers,
  getUserProfileData,
  updateUserEmail,
} from './controllers/UserController';

import { createSolarSystem } from './controllers/system/SolarSystemController';

import {
  addMember,
  removeMember,
  addGroupSystem,
  removeGroupSystem,
} from './controllers/GroupController';

const app: Express = express();

const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static('public', { extensions: ['html'] }));

app.use(express.json());

app.get('/api/users', getAllUsers);
app.post('/api/users', registerUser);
app.post('/api/login', logIn);

app.get('/api/users/:userId', getUserProfileData);
app.post('/api/users/:userId/email', updateUserEmail);

app.post('/api/systems', createSolarSystem);
// app.get('/api/solarsystem/:solarSystemId', getSolarSystem);
// app.post('/api/solarsystem/:solarSystemId/planets', updatePlanet);
// app.post('/api/planet/:planetID/moons', updateMoons);

// app.get('api/groups/:groupId', getGroup);
app.post('/api/groups/:groupId/systems/:systemId', addGroupSystem);
app.post('/api/groups/:groupId/members/', addMember);

app.delete('/api/groups/:groupId/:systemId', removeGroupSystem);
app.delete('/api/groups/:groupId/:userId', removeMember);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
