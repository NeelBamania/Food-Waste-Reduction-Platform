export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'charity' | 'volunteer' | 'restaurant';
  phone?: string;
  address?: string;
  organization?: string;
}

export const demoUsers: DemoUser[] = [
  {
    id: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '123-456-7890',
    address: '123 Admin St, Admin City'
  },
  {
    id: 'user123',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    phone: '123-456-7891',
    address: '456 User Ave, User City'
  },
  {
    id: 'charity123',
    name: 'Charity Organization',
    email: 'charity@example.com',
    password: 'charity123',
    role: 'charity',
    phone: '123-456-7892',
    address: '789 Charity Blvd, Charity City',
    organization: 'Food Rescue Charity'
  },
  {
    id: 'volunteer123',
    name: 'Volunteer User',
    email: 'volunteer@example.com',
    password: 'volunteer123',
    role: 'volunteer',
    phone: '123-456-7893',
    address: '321 Volunteer Rd, Volunteer City'
  },
  {
    id: 'restaurant123',
    name: 'Restaurant Owner',
    email: 'restaurant@example.com',
    password: 'restaurant123',
    role: 'restaurant',
    phone: '123-456-7894',
    address: '654 Restaurant Ln, Restaurant City',
    organization: 'Tasty Bites Restaurant'
  }
]; 