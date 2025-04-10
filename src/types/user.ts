export interface User {
  id: string;
  email: string;
  role: 'admin' | 'charity' | 'volunteer' | 'donor' | 'restaurant';
  name?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
} 