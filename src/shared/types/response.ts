export interface Response<T> {
  status: number;
  message: string;
  data?: T;
  error?: {
    message: string;
    details?: string[] | Record<string, unknown>;
  };
}