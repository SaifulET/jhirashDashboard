export interface Admin {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  role: string;
  status: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponseData {
  admin: Admin;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
}

export interface VerifyCodeResponseData {
  message: string;
  resetToken: string;
}

export interface SetNewPasswordPayload {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangeNamePayload {
  name: string;
}

export interface ChangeNameResponseData {
  admin?: Admin;
  name?: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken?: string;
  admin?: Admin;
}
