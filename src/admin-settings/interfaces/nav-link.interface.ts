export interface NavLink {
  [key: string]: string | boolean | NavLink;
}

export interface INavLinkStaticData {
  access: 'public' | 'admin';
  link: string | INavLinkStaticData;
  sort: number;
  title: string;
}
