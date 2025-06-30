
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background theme-transition">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="font-body text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <p className="font-body text-muted-foreground mb-6">
          The page <code className="bg-muted px-2 py-1 rounded text-foreground">{location.pathname}</code> does not exist.
        </p>
        <Button 
          asChild
          size="lg"
        >
          <Link to="/">
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
