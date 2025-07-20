export interface Identity {
  created_at: string;
  email: string;
  id: string;
  identity_data: any;
  identity_id: string;
  last_sign_in_at: string;
  provider: string;
  updated_at: string;
  user_id: string;
}

export interface UserMetadata {
  avatar_url?: string;
  colorTheme?: string;
  email?: string;
  email_verified?: boolean;
  full_name?: string;
  iss?: string;
  name?: string;
  phone_verified?: boolean;
  picture?: string;
  provider_id?: string;
  sub?: string;
  theme?: string;
  [key: string]: any;
}

export interface AppMetadata {
  provider?: string;
  providers?: string[];
  [key: string]: any;
}

export interface User {
  app_metadata?: AppMetadata;
  aud?: string;
  avatar_url?: string;
  confirmed_at?: string;
  created_at?: string;
  email: string;
  email_confirmed_at?: string;
  full_name?: string;
  id: string;
  identities?: Identity[];
  is_anonymous?: boolean;
  last_sign_in_at?: string;
  phone?: string;
  recovery_sent_at?: string;
  role?: string;
  updated_at?: string;
  user_metadata?: UserMetadata;
} 