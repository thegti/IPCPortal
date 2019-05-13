export interface User{
    email: string;
    userId: string;
    token: string;
  }
  export interface AppResponse {
    status: number;
    message: string;
    data: object;
}
