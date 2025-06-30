import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      onClick={() => navigate("/")}
      className="font-display text-xl font-bold hover:bg-muted px-3 py-2 text-primary"
    >
      EchoStrong
    </Button>
  );
};

export default Logo;
