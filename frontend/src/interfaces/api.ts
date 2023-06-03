import { DateTime } from "luxon";

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
  slug: string;
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

export type CreateShortUrlResponse = Url;

export type GetShortUrlsResponse = Url[];

export type DeleteShortUrlRequest = {
  id: number;
};

export type CreatePastebinRequest = {
  title?: string;
  content: string;
  syntax: string;
  expiresAt?: DateTime;
};

export type CreatePastebinResponse = {
  id: number;
  createdAt: string;
  title?: string;
  content: string;
  syntax: string;
  slug: string;
};

export type GetPastesResponse = Paste[];

export type DeletePastebinRequest = {
  id: number;
};

export type GetStatsResponse = {
  urls: {
    count: number;
  };
  pastes: {
    count: number;
  };
};
