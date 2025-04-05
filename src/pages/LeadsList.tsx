import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Building,
  MapPin,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import { LeadData } from "@/types";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const LeadsList = () => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllLeads();
      setLeads(data);
    } catch (err) {
      setError("Failed to fetch leads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Format date safely
  const formatSafeDate = (dateString?: string) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const searchStr = [
      lead.name,
      lead.jobTitle,
      lead.currentCompany,
      lead.location,
      lead.linkedInUrl,
      lead.summary,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchStr.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <Button onClick={fetchLeads} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="w-full max-w-md relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={`skeleton-${i}`} className="rounded-lg border p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-6" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={fetchLeads}>
              Try Again
            </Button>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No leads found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "No leads match your search."
                : "No leads available yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {lead.name || "Unknown Name"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lead.jobTitle || "No Title"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {lead.currentCompany && (
                      <div className="flex items-center text-muted-foreground">
                        <Building className="mr-2 h-4 w-4" />
                        <span>{lead.currentCompany}</span>
                      </div>
                    )}
                    {lead.location && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{lead.location}</span>
                      </div>
                    )}
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Added: {formatSafeDate(lead.createdAt)}</span>
                    </div>

                    {/* LinkedIn URL with icon */}
                    {lead.linkedInUrl && (
                      <div className="flex items-center text-muted-foreground">
                        <LinkIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <a
                          href={lead.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:text-primary"
                        >
                          {lead.linkedInUrl}
                        </a>
                      </div>
                    )}

                    {/* Summary with truncation */}
                    {lead.summary && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Summary:</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {lead.summary}
                        </p>
                      </div>
                    )}

                    <div className="mt-4">
                      {lead.linkedInUrl ? (
                        <a
                          href={lead.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <LinkIcon className="mr-2 h-4 w-4" />
                            View LinkedIn
                          </Button>
                        </a>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled
                        >
                          <LinkIcon className="mr-2 h-4 w-4" />
                          No LinkedIn URL
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsList;
