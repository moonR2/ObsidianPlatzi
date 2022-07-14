export interface FrontMatter {
  [key: string]: string | string[];
}

export interface Course {
  title: string;
  author: string;
  url: string;
  coverUrl: string;
  status: string;
  rating: number | string;
  //contentTime: number | string;
}
