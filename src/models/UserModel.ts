import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function addUser(email: string, username: string, passwordHash: string): Promise<User> {
  let newUser = new User();
  newUser.email = email;
  newUser.username = username;
  newUser.passwordHash = passwordHash;
  newUser = await userRepository.save(newUser);
  return newUser;
}

async function allUserData(): Promise<User[]> {
  return userRepository.find();
}

async function getAllUnverifiedUsers(): Promise<User[]> {
  return userRepository.find({
    select: { email: true, userId: true },
    where: { verifiedEmail: false },
  });
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await userRepository.findOne({
    select: { email: true, userId: true, passwordHash: true },
    where: { email },
  });
  return user;
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({
    select: {
      email: true,
      userId: true,
      verifiedEmail: true,
      profileViews: true,
      groups: true,
      systems: true,
    },
    where: { userId },
  });
  return user;
}

async function getViralUsers(): Promise<User[]> {
  const viralUsers = await userRepository
    .createQueryBuilder('user')
    .where('profileViews >= :viralAmount', { viralAmount: 1000 })
    .select(['user.email', 'user.profileViews'])
    .getMany();
  return viralUsers;
}

async function getUserByViews(minViews: number): Promise<User[]> {
  const users = await userRepository
    .createQueryBuilder('user')
    .where('profileViews >= :minViews and verifiedEmail = true', { minViews })
    .select(['user.email', 'user.userId', 'user.profileViews', 'user.joinedOn'])
    .getMany();
  return users;
}

async function resetAllUnverifiedProfileViews(): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ profileViews: 0 })
    .where('unverified <> true')
    .execute();
}

async function incrementProfileViews(userData: User): Promise<User> {
  const updatedUser = userData;
  updatedUser.profileViews += 1;

  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ profileViews: updatedUser.profileViews })
    .where({ userId: updatedUser.userId })
    .execute();

  return updatedUser;
}

async function updateEmailAddress(userId: string, newEmail: string, userData: User): Promise<User> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ email: newEmail })
    .where({ userId })
    .execute();

  const updatedUser = userData;
  updatedUser.email = newEmail;
  return updatedUser;
}

export {
  addUser,
  allUserData,
  getAllUnverifiedUsers,
  getUserByEmail,
  getUserById,
  getViralUsers,
  getUserByViews,
  incrementProfileViews,
  updateEmailAddress,
  resetAllUnverifiedProfileViews,
};
