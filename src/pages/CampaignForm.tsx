import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2 } from "lucide-react";
import { useCampaigns } from "@/context/CampaignContext";
import { Campaign } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Updated schema to match backend model
const formSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "inactive", "deleted"]),
  leads: z.string().optional(), // LinkedIn URLs as a string, will be split later
  accountIDs: z.string().optional(), // Account IDs as a string, will be split later
});

type FormValues = z.infer<typeof formSchema>;

const CampaignForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCampaign, createCampaign, updateCampaign } = useCampaigns();
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [initialLoading, setInitialLoading] = useState(!!id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      leads: "",
      accountIDs: "",
    },
  });

  // Fetch campaign data if editing an existing campaign
  useEffect(() => {
    const fetchCampaign = async () => {
      if (id) {
        try {
          setInitialLoading(true);
          const campaignData = getCampaign(id);
          if (campaignData) {
            setCampaign(campaignData);
            
            // Format the data for the form
            form.reset({
              name: campaignData.name,
              description: campaignData.description,
              status: campaignData.status,
              leads: campaignData.leads?.join("\n") || "",
              accountIDs: campaignData.accountIDs?.join(", ") || "",
            });
          } else {
            navigate("/campaigns", { replace: true });
          }
        } catch (error) {
          console.error("Failed to fetch campaign:", error);
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchCampaign();
  }, [id, getCampaign, form, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const campaignData = {
        name: values.name,
        description: values.description,
        status: values.status,
        leads: values.leads ? values.leads.split("\n").map(url => url.trim()).filter(url => url) : [],
        accountIDs: values.accountIDs ? values.accountIDs.split(",").map(id => id.trim()).filter(id => id) : [],
      };

      if (id) {
        await updateCampaign(id, campaignData);
      } else {
        await createCampaign(campaignData);
      }

      navigate("/campaigns");
    } catch (error) {
      console.error("Failed to save campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-full max-w-sm" />
            <Skeleton className="h-4 w-full max-w-xs" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {id ? "Edit Campaign" : "Create Campaign"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>
            Enter the details of your outreach campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Q2 Sales Outreach" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Campaign
                        </FormLabel>
                        <FormDescription>
                          Activate or deactivate this campaign
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "active"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "ACTIVE" : "INACTIVE")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your campaign's goals and target audience"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leads"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URLs</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter LinkedIn profile URLs, one per line"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      <span>Add one LinkedIn URL per line</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountIDs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account IDs</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Account IDs (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      <span>Enter account IDs separated by commas</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/campaigns")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {id ? "Update Campaign" : "Create Campaign"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignForm;