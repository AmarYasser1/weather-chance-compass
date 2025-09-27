import { z } from "zod";

const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type User = z.infer<typeof userSchema>;

const USERS_KEY = "users";
const SESSION_KEY = "session";

const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const register = (user: Omit<User, "password"> & { password?: string }) => {
  const users = getUsers();
  if (users.find((u) => u.email === user.email)) {
    throw new Error("User with this email already exists.");
  }

  const newUser = userSchema.parse({
    ...user,
    password: user.password,
  });

  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return newUser;
};

export const login = (credentials: Pick<User, "email" | "password">) => {
  const users = getUsers();
  const user = users.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const isAuthenticated = () => {
  return localStorage.getItem(SESSION_KEY) !== null;
};

export const getCurrentUser = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};