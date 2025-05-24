export type UserRole = 'investor' | 'advertiser' | 'admin' | 'municipality';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}
