
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, MessageSquare, PlusCircle, Settings, Users,UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: BarChart,
    },
    {
      name: "Campaigns",
      href: "/campaigns",
      icon: Users,
    },
    {
      name: "Message Generator",
      href: "/message-generator",
      icon: MessageSquare,
    },
    {
      name: "Leads", 
      href: "/leads",
      icon: UserPlus, 
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-sidebar flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
            <span className="text-white font-semibold">CM</span>
          </div>
          <h1 className="text-white font-bold text-xl">CampaignHub</h1>
        </div>
      </div>

      <div className="px-3 mb-6">
        <Link to="/campaigns/new">
          <Button className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 gap-2">
            <PlusCircle className="h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-accent/30">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-brand-600">JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-gray-400">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Import Avatar component to avoid errors
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
