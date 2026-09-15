export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  targetExam: string;
  createdAt: string;
  isGuest?: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
}
