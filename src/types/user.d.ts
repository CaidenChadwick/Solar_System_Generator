type NewUserRequest = {
  email: string;
  username: string;
  password: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

type UserIdParam = {
  userId: string;
};

type NewEmailBody = {
  email: string;
};
