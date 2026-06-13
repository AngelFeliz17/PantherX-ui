export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface VerifyCodeData {
  code: string;
  email: string;
}