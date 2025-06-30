
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Crown, ExternalLink } from "lucide-react";

const AccountSettings = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start h-auto p-3"
      onClick={() => navigate('/subscription')}
    >
      <Crown className="h-4 w-4 mr-3" />
      <div className="flex-1 text-left">
        <div className="font-medium">Account Settings</div>
        <div className="text-xs text-muted-foreground">Manage subscription and billing</div>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
};

export default AccountSettings;
