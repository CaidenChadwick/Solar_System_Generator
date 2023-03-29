import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
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

const app: Express = express();
app.use(express.json());

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

app.get('/api/users', getAllUsers);
app.post('/api/users', registerUser);
app.post('/api/login', logIn);

app.get('/api/users/:userId', getUserProfileData);
app.post('/api/users/:userId/email', updateUserEmail);

app.get('/api/solarsystem/:solarSystemId', getSolarSystem);
app.post('/api/solarsystem/:solarSystemId/planets', updatePlanet);
app.post('/api/planet/:planetID/moons', updateMoons);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
