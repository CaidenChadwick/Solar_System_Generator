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

import {
  createSolarSystem,
  getSystem,
  getUserSystems,
} from './controllers/system/SolarSystemController';

import {
  addMember,
  goAddMember,
  removeMember,
  addGroupSystem,
  removeGroupSystem,
  getUserGroups,
  createGroup,
  getGroup,
} from './controllers/GroupController';

const app: Express = express();

const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);
app.set('view engine', 'ejs');
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
app.use(express.urlencoded({ extended: false }));

app.get('/api/users', getAllUsers);
app.post('/api/users', registerUser);
app.post('/api/login', logIn);

app.get('/profile/:userId', getUserProfileData);
app.post('/api/users/email', updateUserEmail);

app.post('/api/systems', createSolarSystem);
app.get('/api/systems/:systemId', getSystem);
app.get('/systems', getUserSystems);
app.get('/groups', getUserGroups);
app.post('/api/groups/:groupId', createGroup);
// app.post('/api/solarsystem/:solarSystemId/planets', updatePlanet);

app.get('/api/groups/:groupId', getGroup);
app.post('/api/groups/:groupId/systems', addGroupSystem);
app.post('/api/groups/:groupId/users', addMember);
app.get('/addMember/:groupId', goAddMember);

app.delete('/api/groups/:groupId/:systemId', removeGroupSystem);
app.delete('/api/groups/:groupId/:userId', removeMember);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
