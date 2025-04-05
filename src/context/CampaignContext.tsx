
import React, { createContext, useContext, useEffect, useState } from "react";
import { Campaign, CampaignStatus } from "@/types";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useApi } from "@/hooks/useApi";

interface CampaignContextType {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
  getCampaign: (id: string) => Campaign | undefined;
  createCampaign: (campaign: Omit<Campaign, "id">) => Promise<Campaign>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<Campaign>;
  deleteCampaign: (id: string) => Promise<void>;
  toggleCampaignStatus: (id: string) => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError("Failed to fetch campaigns. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch campaigns. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const getCampaign = (id: string) => {
    return campaigns.find(campaign => campaign.id === id);
  };

  const createCampaign = async (campaign: Omit<Campaign, "id">) => {
    try {
      setError(null);
      const newCampaign = await api.createCampaign(campaign);
      setCampaigns(prev => [...prev, newCampaign]);
      toast({
        title: "Success",
        description: "Campaign created successfully!",
      });
      return newCampaign;
    } catch (err) {
      setError("Failed to create campaign. Please try again.");
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      setError(null);
      const updatedCampaign = await api.updateCampaign(id, updates);
      setCampaigns(prev =>
        prev.map(campaign => (campaign.id === id ? updatedCampaign : campaign))
      );
      toast({
        title: "Success",
        description: "Campaign updated successfully!",
      });
      return updatedCampaign;
    } catch (err) {
      setError("Failed to update campaign. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update campaign. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      setError(null);
      await api.deleteCampaign(id);
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      toast({
        title: "Success",
        description: "Campaign deleted successfully!",
      });
    } catch (err) {
      setError("Failed to delete campaign. Please try again.");
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

// Update the campaign status toggle logic
const toggleCampaignStatus = async (id: string) => {
  if (!id) {
    console.error("Campaign ID is required for toggling status");
    return;
  }
  
  const campaign = campaigns.find(c => c.id === id);
  if (campaign) {
    const newStatus = campaign.status === "active" ? "inactive" : "active"; // Use lowercase status
    await updateCampaign(id, { status: newStatus });
  }
};
  const value = {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    toggleCampaignStatus,
  };

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error("useCampaigns must be used within a CampaignProvider");
  }
  return context;
};
