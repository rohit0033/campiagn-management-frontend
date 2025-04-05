
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BellRing, Edit2, Key, User } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Manage your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue="Sales and marketing professional with 8+ years of experience."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="daily-digest" className="flex flex-col space-y-1">
                    <span>Dark Mode</span>
                    <span className="font-normal text-muted-foreground text-sm">
                      Enable dark mode for the application
                    </span>
                  </Label>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="analytics-data" className="flex flex-col space-y-1">
                    <span>Share Analytics Data</span>
                    <span className="font-normal text-muted-foreground text-sm">
                      Help us improve by sharing anonymous usage data
                    </span>
                  </Label>
                  <Switch id="analytics-data" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="two-factor" className="flex flex-col space-y-1">
                    <span>Two-Factor Authentication</span>
                    <span className="font-normal text-muted-foreground text-sm">
                      Add an extra layer of security to your account
                    </span>
                  </Label>
                  <Switch id="two-factor" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>Manage your API keys for integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin-api">LinkedIn API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="linkedin-api"
                    type="password"
                    defaultValue="sk_test_linkedinkey123456789"
                  />
                  <Button variant="outline">Show</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openai-api">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="openai-api"
                    type="password"
                    defaultValue="sk_test_openai987654321"
                  />
                  <Button variant="outline">Show</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  defaultValue="https://example.com/webhook/linkedin"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Regenerate Keys</Button>
              <Button>
                <Edit2 className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notifs" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="font-normal text-muted-foreground text-sm">
                    Receive campaign updates via email
                  </span>
                </Label>
                <Switch id="email-notifs" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="browser-notifs" className="flex flex-col space-y-1">
                  <span>Browser Notifications</span>
                  <span className="font-normal text-muted-foreground text-sm">
                    Get notified in your browser when campaigns update
                  </span>
                </Label>
                <Switch id="browser-notifs" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="daily-digest" className="flex flex-col space-y-1">
                  <span>Daily Digest</span>
                  <span className="font-normal text-muted-foreground text-sm">
                    Get a summary of your campaign performance daily
                  </span>
                </Label>
                <Switch id="daily-digest" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="response-alert" className="flex flex-col space-y-1">
                  <span>Response Alerts</span>
                  <span className="font-normal text-muted-foreground text-sm">
                    Get notified immediately when you receive responses
                  </span>
                </Label>
                <Switch id="response-alert" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Notification Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
