export interface IUserGitHub {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
  token: string;
  email: string;
}

export interface GitHubProfile {
  id: string;
  username: string;
  displayName: string;
  photos?: { value: string }[];
  emails?: { value: string }[];
}
