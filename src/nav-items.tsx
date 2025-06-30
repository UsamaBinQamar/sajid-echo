import { HomeIcon, BookOpen, BarChart3, MessageCircle } from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "Journal",
    to: "/journal",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: "Leadership Sssssimulator",
    to: "/dialogue-simulator",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    title: "Insights",
    to: "/insights",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];
