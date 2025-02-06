export interface Widget {
  [key: string]: Array<{
    title: string;
    link: string;
    color?: string;
    disabled?: boolean;
  }>;
}
