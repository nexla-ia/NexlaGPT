export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'inicial' | 'profissional' | 'empresarial';
  tokensUsed: number;
  tokensLimit: number;
  messagesUsed: number;
  messagesLimit: number;
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'trial';
  subscriptionEnd: Date;
  createdAt: Date;
  lastLogin: Date;
  notificationPreferences: {
    tokenWarnings: boolean;
    usageReports: boolean;
    planUpgrades: boolean;
  };
  autoUpgrade: boolean;
  preferredUpgradePlan?: string;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  conversationId: string;
  tokens: number;
  responseTime: number;
  model: string;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  messages: Message[];
  totalTokens: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  tokensLimit: number;
  messagesLimit: number;
  maxResponseTime: number;
  features: string[];
  support: string;
  popular?: boolean;
  aiModel: string;
  priority: 'standard' | 'high' | 'premium';
}

export interface TokenUsage {
  userId: string;
  date: string;
  tokensUsed: number;
  messagesCount: number;
  averageTokensPerMessage: number;
  peakHour: number;
}

export interface Usage {
  userId: string;
  date: string;
  messagesCount: number;
  tokensUsed: number;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  planId: string;
  paymentMethod: string;
  createdAt: Date;
  paidAt?: Date;
  autoRenewal: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'token_warning' | 'token_limit' | 'plan_upgrade' | 'payment_due' | 'usage_report';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updates: Partial<User>) => void;
}