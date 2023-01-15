export type ShortUrlResponse = {
  short_url: string;
};

export type ErrorResponse = {
  statusCode: 400;
  message: string[];
  error: string;
};
