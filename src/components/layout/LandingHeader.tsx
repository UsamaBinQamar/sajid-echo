import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

interface LandingHeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({
  isDarkMode,
  toggleTheme,
}) => {
  return (
    <header className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-yellow-200/50 dark:border-gray-700/50 sticky top-0 transition-colors duration-500">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 object-contain rounded-xl bg-white shadow"
            style={{ background: "white" }}
          />
          <span
            className="text-2xl font-bold ml-2"
            style={{ color: "var(--landing-green)" }}
          >
            EchoStrong
          </span>
        </div>
        <nav className="hidden md:flex space-x-8 items-center">
          <a
            href="#features"
            className="text-gray-700 dark:text-gray-300 hover:text-red-800 dark:hover:text-red-400 transition-colors font-medium"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-gray-700 dark:text-gray-300 hover:text-red-800 dark:hover:text-red-400 transition-colors font-medium"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="text-gray-700 dark:text-gray-300 hover:text-red-800 dark:hover:text-red-400 transition-colors font-medium"
          >
            Reviews
          </a>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="p-2 h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </Button>
        </nav>
        <Button
          className="bg-gradient-to-r from-red-800 to-red-700 dark:from-red-600 dark:to-red-500 text-white hover:from-red-900 hover:to-red-800 dark:hover:from-red-700 dark:hover:to-red-600 shadow-lg transition-all duration-300"
          onClick={() => {
            window.location.href = "/auth";
          }}
        >
          Get Started
        </Button>
      </div>
    </header>
  );
};

export default LandingHeader;
