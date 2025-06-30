import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
  quickMode: boolean;
  focusMode: boolean;
  onToggleQuick: (enabled: boolean) => void;
  onToggleFocus: (enabled: boolean) => void;
}

const WelcomeHeader = ({
  userName,
  quickMode,
  focusMode,
  onToggleQuick,
  onToggleFocus,
}: WelcomeHeaderProps) => {
  const [streak, setStreak] = useState(0);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="rounded-2xl p-8 shadow-xl bg-white dark:bg-gray-900 mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-display font-bold tracking-tight text-[#8A1503] dark:text-[#8A1503] mb-3">
            {getTimeBasedGreeting()}, {userName}{" "}
            <span className="ml-1 text-3xl">👋</span>
          </h1>

          <p className="text-lg mb-4 font-body leading-relaxed max-w-2xl text-gray-700 dark:text-gray-300">
            Ready to check in with yourself today? Your authentic leadership
            journey matters.
          </p>

          {streak > 0 && (
            <div className="flex items-center gap-3">
              <Badge className="px-3 py-1 bg-[#8A1503] text-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <Flame className="h-4 w-4 mr-2 text-yellow-300" />
                {streak} day streak
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Keep up the great work!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
