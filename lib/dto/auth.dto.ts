export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface VerifyCodeData {
  code: string;
  email: string;
}

export interface ForgotPasswordEmailData {
  email: string;
}

export interface ResetPasswordData {
  newPassword: string;
  newPasswordConfirmation: string;
}