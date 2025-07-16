type Login = {
  access: string;
  refresh: string;
  accessExpiration: string;
  refreshExpiration: string;
  user: UserDetails;
};
type LoginRequest = {
  email: string;
  password: string;
};
type UserDetails = {
  pk: number;
  email: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
};
type PasswordChangeRequest = {
  newPassword1: string;
  newPassword2: string;
};
type PasswordResetConfirmRequest = {
  newPassword1: string;
  newPassword2: string;
  uid: string;
  token: string;
};
type RegisterRequest = {
  email: string;
  password1: string;
  password2: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
};
type PaginatedSocialAccountList = {
  count: number;
  next?: (string | null) | undefined;
  previous?: (string | null) | undefined;
  results: Array<SocialAccount>;
};
type SocialAccount = {
  id: number;
  provider: string;
  uid: string;
  lastLogin: string;
  dateJoined: string;
};
type CookieTokenRefresh = {
  access: string;
  accessExpiration: string;
};
type UserDetailsRequest = Partial<{
  firstName: string;
  lastName: string;
}>;
type PatchedUserDetailsRequest = Partial<{
  firstName: string;
  lastName: string;
}>;
