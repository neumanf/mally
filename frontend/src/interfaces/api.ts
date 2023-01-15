export type ShortUrlRequest = {
  url: string;
};

export type ShortUrlResponse = {
  short_url: string;
};

export type ErrorResponse = {
  statusCode: number;
  message: string[];
  error: string;
};
