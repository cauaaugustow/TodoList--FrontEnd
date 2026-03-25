export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    lastname?: string;
    email: string;
    password: string;
    cpf?: string;
  };
}
