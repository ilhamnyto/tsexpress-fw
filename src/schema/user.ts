export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  salt: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  updatedAt?: Date;
}

export interface UpdatePasswordRequest {
  password: string;
  confirmPassword: string;
  salt?: string;
  updatedAt?: Date;
}
