export interface Response<T> {
  status: number;
  message: string;
  data?: T;
  error?: string | string[] | object;
}