export type ErrorResponse = {
  statusCode: number;
  message: string[];
  error: string;
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
