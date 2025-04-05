export type CampaignStatus = 'active' | 'inactive' | 'deleted';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  leads?: string[];  // LinkedIn URLs
  accountIDs?: string[];  // MongoDB ObjectIds as strings
  createdAt?: string;
  updatedAt?: string;
  metrics?: {
    leads: number;
    responses: number;
    meetings: number;
  };
}

export interface ProfileData {
  name: string;
  jobTitle: string;
  currentCompany: string;
  location?: string;
  summary?: string;
}

export interface PersonalizedMessageResponse {
  profileData?: ProfileData;
  message: string;
  limited?: boolean;
  source?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface LeadData {
  id: string;
  linkedInUrl: string;
  name?: string;
  jobTitle?: string;
  currentCompany?: string;
  location?: string;
  summary?: string;
  createdAt?: string;
  updatedAt?: string;
}