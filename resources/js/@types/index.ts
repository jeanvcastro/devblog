export type User = {
  uuid: string;
  name: string;
  email: string;
  avatar: string | null;
  isAdmin: boolean;
};

export type Tag = {
  uuid: string;
  name: string;
  slug: string;
  postsCount?: number;
};

export type Post = {
  uuid: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  viewsCount: number;
  readingTime: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: User;
  tags: Tag[];
};

export type Comment = {
  uuid: string;
  content: string;
  approved: boolean;
  createdAt: string;
  user: User;
  replies?: Comment[];
};

export type PostView = {
  uuid: string;
  postUuid: string;
  visitedAt: string;
};

export type PaginationMeta = {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  from: number;
  to: number;
};

export type ApiResponse<T> = {
  data: T;
  meta?: PaginationMeta;
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
};
