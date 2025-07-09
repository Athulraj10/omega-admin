export interface UserDetailsType {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  [key: string]: any; // Allow additional properties
}
  