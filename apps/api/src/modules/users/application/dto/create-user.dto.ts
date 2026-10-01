export interface CreateUserInput {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export interface CreateUserOutput {
  id: string;
  username: string;
  displayName: string;
  email: string;
  createdAt: string;
}
