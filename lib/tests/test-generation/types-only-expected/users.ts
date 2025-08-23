type User = Timestamp & {
  id: number;
  name: string;
  email: string;
  status: Status;
  profileImage?: (string | null) | undefined;
};
type CreateUserRequest = {
  name: string;
  email: string;
  profileImage?: string | undefined;
};
