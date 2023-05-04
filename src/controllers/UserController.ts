import { Request, Response } from 'express';
import argon2 from 'argon2';
import { parseISO, isBefore, formatDistanceToNow } from 'date-fns';
import {
  addUser,
  getUserByEmail,
  allUserData,
  getUserById,
  incrementProfileViews,
  updateEmailAddress,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, username, password } = req.body as NewUserRequest;

  const passwordHash = await argon2.hash(password);

  try {
    const newUser = await addUser(email, username, passwordHash);
    console.log(newUser);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
    // res.redirect('/register');
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  console.log(req.session);

  const now = new Date();

  const logInTimeout = parseISO(req.session.logInTimeout);

  if (logInTimeout && isBefore(now, logInTimeout)) {
    const timeRemaining = formatDistanceToNow(logInTimeout);
    const message = `You have ${timeRemaining} remaining`;

    res.status(429).send(message); // 429 Too Many Requests
    return;
  }

  const { email, password } = req.body as LoginRequest;
  const user = await getUserByEmail(email);

  if (!user) {
    res.redirect('/login'); // 404 Not Found - email doesn't exist
    return;
  }

  const { passwordHash } = user;
  if (!(await argon2.verify(passwordHash, password))) {
    if (!req.session.logInAttempts) {
      req.session.logInAttempts = 1; // First attempt
    } else {
      req.session.logInAttempts += 1; // increment their attempts
    }
    res.redirect('/login'); // 403 Forbidden - invalid password
    return;
  }

  await req.session.clearSession();
  req.session.authenticatedUser = {
    userId: user.userId,
    email: user.email,
  };
  req.session.isLoggedIn = true;

  res.redirect(`/profile/${user.userId}`);
}

async function getAllUsers(req: Request, res: Response): Promise<void> {
  const users = await allUserData();

  res.json(users);
}

async function getUserProfileData(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  // Get the user account
  let user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }
  // Now update their profile views
  user = await incrementProfileViews(user);
  // res.json(user); // Send back the user's data
  res.render('profile', { user });
}

async function updateUserEmail(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login'); // 403 Forbidden
    return;
  }

  const { email } = req.body as { email: string };

  // Get the user account
  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  try {
    await updateEmailAddress(authenticatedUser.userId, email, user);
    // res.json(updatedUser);
    res.redirect(`/profile/${user.userId}`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { registerUser, logIn, getAllUsers, getUserProfileData, updateUserEmail };
