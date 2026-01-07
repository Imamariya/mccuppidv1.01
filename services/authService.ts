
interface LoginResponse {
  token: string;
  role: 'user' | 'admin';
}

interface RegisterResponse {
  success: boolean;
  message?: string;
}

const MOCK_USERS = [
  { email: 'user@user.com', password: 'User@123', role: 'user' as const },
  { email: 'admin@admin.com', password: 'Admin@123', role: 'admin' as const },
  { email: 'admin@mallucupid.com', password: 'admin123', role: 'admin' as const },
  { email: 'user@example.com', password: 'user123', role: 'user' as const }
];

export const authService = {
  /**
   * Simulated login logic for client-side environment.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const response: LoginResponse = {
      token: `mock_jwt_${user.role}_${Date.now()}`,
      role: user.role
    };
    
    localStorage.setItem('mallucupid_token', response.token);
    localStorage.setItem('mallucupid_role', response.role);
    
    return response;
  },

  /**
   * Simulated registration logic.
   */
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    return { success: true };
  },

  logout() {
    localStorage.removeItem('mallucupid_token');
    localStorage.removeItem('mallucupid_role');
    window.location.hash = '#/login';
  },

  getToken() {
    return localStorage.getItem('mallucupid_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
