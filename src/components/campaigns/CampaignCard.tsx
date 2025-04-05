
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Campaign } from "@/types";
import { useCampaigns } from "@/context/CampaignContext";
import { CalendarClock, Edit, Eye, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {  isValid } from "date-fns";
interface CampaignCardProps {
  campaign: Campaign;
  variant?: "default" | "list";
}
const formatSafeDate = (dateString: string | undefined, formatStr: string): string => {
  if (!dateString) return "No date";
  
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return "Invalid date";
    return format(date, formatStr);
  } catch (error) {
    return "Invalid date";
  }
};
export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  variant = "default",
}) => {
  const { deleteCampaign, toggleCampaignStatus } = useCampaigns();
  const [isLoading, setIsLoading] = useState(false);
  

  const handleStatusToggle = async () => {
    try {
      setIsLoading(true);
      await toggleCampaignStatus(campaign.id);
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (!campaign.id) {
        console.error("Campaign ID is missing");
        return;
      }
      await deleteCampaign(campaign.id);
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = campaign.status === "active";

  if (variant === "list") {
    return (
      <Card className={cn("card-hover", !isActive && "opacity-75")}>
        <div className="flex flex-col md:flex-row md:items-center p-4 md:p-6">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold mr-2">{campaign.name}</h3>
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {campaign.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarClock className="mr-1 h-4 w-4" />
                <span>
    Created: {formatSafeDate(campaign.createdAt, "MMM d, yyyy")}
  </span>
              </div>
              {campaign.metrics?.leads && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{campaign.metrics.leads} leads</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <div className="flex items-center">
              <Switch
                checked={isActive}
                onCheckedChange={handleStatusToggle}
                disabled={isLoading}
                aria-label={isActive ? "Deactivate campaign" : "Activate campaign"}
              />
            </div>
            <Link to={`/campaigns/${campaign.id}`}>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={`/campaigns/edit/${campaign.id}`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("card-hover h-full flex flex-col", !isActive && "opacity-80")}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle>{campaign.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {campaign.description}
            </CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <CalendarClock className="mr-2 h-4 w-4" />
            <span>
    Created: {formatSafeDate(campaign.createdAt, "MMM d, yyyy")}
  </span>
          </div>
          {campaign.metrics && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-muted/50 p-2 rounded-md text-center">
                <p className="text-muted-foreground text-xs">Leads</p>
                <p className="font-medium">{campaign.metrics.leads || 0}</p>
              </div>
              <div className="bg-muted/50 p-2 rounded-md text-center">
                <p className="text-muted-foreground text-xs">Responses</p>
                <p className="font-medium">{campaign.metrics.responses || 0}</p>
              </div>
              <div className="bg-muted/50 p-2 rounded-md text-center">
                <p className="text-muted-foreground text-xs">Meetings</p>
                <p className="font-medium">{campaign.metrics.meetings || 0}</p>
              </div>
              <div className="bg-muted/50 p-2 rounded-md text-center">
                <p className="text-muted-foreground text-xs">Rate</p>
                <p className="font-medium">
                  {campaign.metrics.leads
                    ? Math.round((campaign.metrics.responses || 0) / campaign.metrics.leads * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex items-center">
          <span className="text-sm mr-2">
            {isActive ? "Active" : "Inactive"}
          </span>
          <Switch
            checked={isActive}
            onCheckedChange={handleStatusToggle}
            disabled={isLoading}
            aria-label={isActive ? "Deactivate campaign" : "Activate campaign"}
          />
        </div>
        <div className="flex space-x-2">
          <Link to={`/campaigns/edit/${campaign.id}`}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};
