import { User } from '../types';

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface RegisterResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

class AuthService {
  private baseUrl = '/api/auth';

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      if (email === 'demo@nexla.com' && password === 'demo123') {
        const user: User = {
          id: '1',
          email: 'demo@nexla.com',
          name: 'Usuário Demo',
          plan: 'inicial',
          tokensUsed: 12500,
          tokensLimit: 50000,
          messagesUsed: 150,
          messagesLimit: 1000,
          subscriptionStatus: 'active',
          subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date(),
          notificationPreferences: {
            tokenWarnings: true,
            usageReports: true,
            planUpgrades: true
          },
          autoUpgrade: false
        };

        return {
          success: true,
          user,
          token: 'mock_jwt_token_' + Date.now()
        };
      }

      return {
        success: false,
        error: 'Credenciais inválidas'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  async register(email: string, password: string, name: string): Promise<RegisterResponse> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful registration
      const user: User = {
        id: Date.now().toString(),
        email,
        name,
        plan: 'inicial',
        tokensUsed: 0,
        tokensLimit: 50000,
        messagesUsed: 0,
        messagesLimit: 1000,
        subscriptionStatus: 'active',
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        lastLogin: new Date(),
        notificationPreferences: {
          tokenWarnings: true,
          usageReports: true,
          planUpgrades: true
        },
        autoUpgrade: false
      };

      return {
        success: true,
        user,
        token: 'mock_jwt_token_' + Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao criar conta'
      };
    }
  }

  async validateToken(token: string): Promise<User> {
    // Simulate token validation
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock user data
    return {
      id: '1',
      email: 'demo@nexla.com',
      name: 'Usuário Demo',
      plan: 'inicial',
      tokensUsed: 12500,
      tokensLimit: 50000,
      messagesUsed: 150,
      messagesLimit: 1000,
      subscriptionStatus: 'active',
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
      notificationPreferences: {
        tokenWarnings: true,
        usageReports: true,
        planUpgrades: true
      },
      autoUpgrade: false
    };
  }

  logout(): void {
    // Perform any cleanup needed
    console.log('User logged out');
  }
}

export const authService = new AuthService();