import { UserRole } from '../enums/user-role.enum';

export interface IAuthUser {
  id: string;
  username: string;
  role: UserRole;
  email: string;
  gitHubId: string;
}
