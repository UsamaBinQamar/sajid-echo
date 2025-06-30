
import { toast } from "@/components/ui/use-toast";

export const validateAuthForm = (
  email: string,
  password: string,
  fullName: string,
  isSignUp: boolean
): boolean => {
  if (!email.trim()) {
    toast({
      title: "Email required",
      description: "Please enter your email address.",
      variant: "destructive",
    });
    return false;
  }

  if (!email.includes("@")) {
    toast({
      title: "Invalid email",
      description: "Please enter a valid email address.",
      variant: "destructive",
    });
    return false;
  }

  if (!password.trim()) {
    toast({
      title: "Password required",
      description: "Please enter your password.",
      variant: "destructive",
    });
    return false;
  }

  if (password.length < 6) {
    toast({
      title: "Password too short",
      description: "Password must be at least 6 characters long.",
      variant: "destructive",
    });
    return false;
  }

  if (isSignUp && !fullName.trim()) {
    toast({
      title: "Name required",
      description: "Please enter your full name.",
      variant: "destructive",
    });
    return false;
  }

  return true;
};
