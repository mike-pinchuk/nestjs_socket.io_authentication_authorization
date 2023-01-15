export const userRepository = 'USER_REPOSITORY';
export const messageRepository = 'MESSAGE_REPOSITORY';
export const dataSource = 'DATA_SOURCE';

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRATION_TIME,
};

export const refreshConstants = {
  secret: process.env.JWT_REFRESH,
  expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
};
