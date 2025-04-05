import { Campaign, LeadData, PersonalizedMessageResponse, ProfileData } from "@/types";
import axios from "axios";

// Base URL for API - adjust this to match your environment
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false
});

// API service with real API implementations
export const api = {
  // Campaign APIs
  getAllCampaigns: async (): Promise<Campaign[]> => {
    try {
      const response = await apiClient.get("/campaigns");
      return response.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      throw error;
    }
  },

  getCampaignById: async (id: string): Promise<Campaign> => {
    try {
      const response = await apiClient.get(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error);
      throw error;
    }
  },

  createCampaign: async (campaign: Omit<Campaign, "id">): Promise<Campaign> => {
    try {
      const response = await apiClient.post("/campaigns", campaign);
      return response.data;
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw error;
    }
  },

  updateCampaign: async (id: string, updates: Partial<Campaign>): Promise<Campaign> => {
    try {
      const response = await apiClient.put(`/campaigns/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating campaign ${id}:`, error);
      throw error;
    }
  },

  // Fix the deleteCampaign method
deleteCampaign: async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    if (!id) {
      throw new Error("Campaign ID is required");
    }
    
    const response = await apiClient.delete(`/campaigns/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting campaign ${id}:`, error);
    throw error;
  }
},

  // Message generator APIs
  generatePersonalizedMessage: async (profileData: ProfileData): Promise<PersonalizedMessageResponse> => {
    try {
      const response = await apiClient.post("/personalized-message", {
        name: profileData.name,
        jobTitle: profileData.jobTitle,
        currentCompany: profileData.currentCompany,
        location: profileData.location,
        summary: profileData.summary
      });
      return response.data;
    } catch (error) {
      console.error("Error generating personalized message:", error);
      throw error;
    }
  },

  // generateMessageFromUrl: async (url: string, sessionCookie?: string): Promise<PersonalizedMessageResponse> => {
  //   try {
  //     const response = await apiClient.post("/personalized-message/from-url", {
  //       linkedin_url: url,
  //       session_cookie: sessionCookie
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error generating message from URL:", error);
  //     throw error;
  //   }
  // },

  generateMessageFromUrlApi: async (url: string, sessionCookie?: string): Promise<PersonalizedMessageResponse> => {
    try {
      const response = await apiClient.post("/personalized-message/from-url-api", {
        linkedin_url: url,
        session_cookie: sessionCookie
      });
      return response.data;
    } catch (error) {
      console.error("Error generating message from URL API:", error);
      throw error;
    }
  },
  getAllLeads: async (): Promise<LeadData[]> => {
    try {
      const response = await apiClient.get("/leads");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      throw error;
    }
  },

  getLeadById: async (id: string): Promise<LeadData> => {
    try {
      const response = await apiClient.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch lead with id ${id}:`, error);
      throw error;
    }
  },

  getLeadByUrl: async (url: string): Promise<LeadData> => {
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await apiClient.get(`/leads/url/${encodedUrl}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch lead with URL ${url}:`, error);
      throw error;
    }
  }
};