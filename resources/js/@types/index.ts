export type User = {
  uuid: string;
  name: string;
  email: string;
  avatar: string | null;
  is_admin: boolean;
};

export type Tag = {
  uuid: string;
  name: string;
  slug: string;
  posts_count?: number;
};

export type Post = {
  uuid: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  views_count: number;
  reading_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: User;
  tags?: Tag[];
};

export type Comment = {
  uuid: string;
  content: string;
  approved: boolean;
  created_at: string;
  user: User;
  replies?: Comment[];
};

export type PostView = {
  uuid: string;
  post_uuid: string;
  visited_at: string;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
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
