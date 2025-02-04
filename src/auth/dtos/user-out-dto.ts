import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserOutDTO {
  @Expose()
  avatar: string;

  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  displayName: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  gitHubId: string;

  @Exclude()
  token: string;
}
