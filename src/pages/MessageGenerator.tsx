import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Copy, Loader2, MessageSquare, Wand2 } from "lucide-react";
import { api } from "@/services/api";
import { PersonalizedMessageResponse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  currentCompany: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  summary: z.string().optional(),
  linkedInUrl: z.string().url("Must be a valid LinkedIn URL").optional(),
});

const urlFormSchema = z.object({
  linkedInUrl: z.string().url("Must be a valid LinkedIn URL"),
  session_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type UrlFormValues = z.infer<typeof urlFormSchema>;

const MessageGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [editedMessage, setEditedMessage] = useState("");
  const { toast } = useToast();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      jobTitle: "",
      currentCompany: "",
      location: "",
      summary: "",
      linkedInUrl: "",
    },
  });

  const urlForm = useForm<UrlFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      linkedInUrl: "",
      session_url: "",
    },
  });

  const onProfileSubmit = async (values: ProfileFormValues) => {
    try {
      setLoading(true);
      // Ensure all required fields are present before calling the API
      const profileData = {
        name: values.name,
        jobTitle: values.jobTitle,
        currentCompany: values.currentCompany,
        location: values.location || "",
        summary: values.summary || "",
        linkedInUrl: values.linkedInUrl || "",
      };

      const response = await api.generatePersonalizedMessage(profileData);
      handleGeneratedMessage(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onUrlSubmit = async (values: UrlFormValues) => {
    try {
      setLoading(true);
      const response = await api.generateMessageFromUrlApi(
        values.linkedInUrl,
        values.session_url
      );
      handleGeneratedMessage(response);

      // If profile data is returned, populate the form fields
      if (response.profileData) {
        profileForm.reset(response.profileData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate message from URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratedMessage = (response: PersonalizedMessageResponse) => {
    setGeneratedMessage(response.message);
    setEditedMessage(response.message);
    toast({
      title: "Message Generated",
      description: "Your personalized message has been created.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedMessage);
      toast({
        title: "Copied to clipboard",
        description: "Message has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        LinkedIn Message Generator
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="url">LinkedIn URL</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    Enter the LinkedIn profile details to generate a
                    personalized outreach message.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Marketing Director"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="currentCompany"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Acme Inc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="San Francisco, CA"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="linkedInUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://linkedin.com/in/johndoe"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="summary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Summary</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief summary or key points from their profile"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="url">
              <Card>
                <CardHeader>
                  <CardTitle>LinkedIn URL</CardTitle>
                  <CardDescription>
                    Enter a LinkedIn profile URL to automatically extract
                    profile information and generate a message.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...urlForm}>
                    <form
                      onSubmit={urlForm.handleSubmit(onUrlSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={urlForm.control}
                        name="linkedInUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn Profile URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://linkedin.com/in/johndoe"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Add session_url field */}
                      <FormField
                        control={urlForm.control}
                        name="session_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              LinkedIn Session Cookie (Optional)
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Paste your LinkedIn session cookie here for authenticated access"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground mt-1">
                              Session cookie helps access private profiles. Only
                              required for restricted profiles.
                            </p>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate from URL
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Generated Message
              </CardTitle>
              <CardDescription>
                Here's your AI-generated personalized outreach message.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {generatedMessage ? (
                <>
                  <Textarea
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    className="flex-1 min-h-[200px]"
                    placeholder="Your generated message will appear here..."
                  />
                  <div className="mt-4 flex justify-end">
                    <Button onClick={copyToClipboard} variant="secondary">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>
                      Fill out the form and click "Generate Message" to create a
                      personalized outreach message.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator;
