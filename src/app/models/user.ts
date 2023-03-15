export interface IUser {
  userId: string;
  nameId: string;
  identifier: string;
  role: UserRole[];
}

export interface IJwt {
  aud: string;
  iss: string;
  nbf: number;
  exp: number;
  iat: number;
}

export interface IToken {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginFormValues {
  login: string;
  password: string;
}

export interface IRegisterFormValues {
  identifier: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  branches: IUserBranches[];
  roles: string[];
}

export interface IUserBranches {
  branchIds: string[];
  positionId: string;
}

export interface IUserListItem {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  positions: string[];
}

export interface IChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
}

export interface IResetPasswordFormValues {
  userName: string;
  token: string;
  newPassword: string;
  confirmedNewPassword: string;
}

export interface IForgotPasswordFormValues {
  userName: string;
}

export enum UserRole {
  Admin = 'Admin',
  CreditManager = 'CreditManager',
  Jurist = 'Jurist',
  Pledger = 'Pledger',
  SecurityManager = 'SecurityManager',
  Purchaser = 'Purchaser',
  ComplianceManager = 'ComplianceManager',
}
