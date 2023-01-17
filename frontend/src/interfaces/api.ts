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
  access_token: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

export type SignUpResponse = {
  ok: boolean;
};

export type ShortUrlRequest = {
  url: string;
};

export type ShortUrlResponse = {
  short_url: string;
};

export type PastebinRequest = {
  content: string;
  syntax: string;
};

export type PastebinResponse = {
  id: number;
  createdAt: Date;
  content: string;
  syntax: string;
  slug: string;
};
