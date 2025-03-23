export default () => ({
  port: process.env.PORT,
  database: {
    uri: process.env.MONGO_URI,
  },
});

export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export enum EnviromentEnum {
  PROD = 'prod',
  DEV = 'dev',
}

export enum EnviromentFileEnum {
  PROD = '.env.prod',
  DEV = '.env.dev',
}

export const PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[!@#$%/^&*])[a-zA-Z0-9!@#$%/^&*]{8,50}$/;
