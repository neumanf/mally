export type Paste = {
  id: number;
  createdAt: string;
  content: string;
  syntax: string;
  slug: string;
  userId: number;
};

export type Url = {
  id: number;
  createdAt: string;
  url: string;
  shortUrl: string;
  userId: number;
};

export type User = {
  id: number;
  email: string;
};

export type ErrorResponse = {
  statusCode: number;
  message: string[] | string;
  error: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  sub: number;
  email: string;
  accessToken: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export type SignUpResponse = {
  ok: boolean;
};

export type CreateShortUrlRequest = {
  url: string;
};

export type CreateShortUrlResponse = {
  short_url: string;
};

export type CreatePastebinRequest = {
  content: string;
  syntax: string;
};

export type CreatePastebinResponse = {
  id: number;
  createdAt: Date;
  content: string;
  syntax: string;
  slug: string;
};

export type GetPastesResponse = Paste[];

export type GetShortUrlsResponse = Url[];

export type GetStatsResponse = {
  urls: {
    count: number;
  };
  pastes: {
    count: number;
  };
};
