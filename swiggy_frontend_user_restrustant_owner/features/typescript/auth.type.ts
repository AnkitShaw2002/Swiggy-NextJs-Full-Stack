export interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  isVerified?: boolean;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data?: {
    user?: User;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    is_verified?: boolean;
    accessToken?: string;
    refreshToken?: string;
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface RegisterPayload {
  full_name: string;
  mobile_Number: string;
  email: string;
  address: string;
  password: string;
  confirm_password: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface VerifyOtpPayload {
  userId: string;
  otp: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;

  // Actions
  login: (credentials: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<AuthResponse>;
  logout: () => void;
  clearError: () => void;
}

export interface Props {
  children: React.ReactNode;
}