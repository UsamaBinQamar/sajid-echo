import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Edit3 } from "lucide-react";
import { useForm } from "react-hook-form";

interface ProfileData {
  full_name: string;
  preferred_name: string;
  pronouns: string;
}

const ProfileSection = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileData>({
    defaultValues: {
      full_name: "",
      preferred_name: "",
      pronouns: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, preferred_name, pronouns")
          .eq("id", user.id)
          .single();

        if (profile) {
          form.reset({
            full_name: profile.full_name || "",
            preferred_name: profile.preferred_name || "",
            pronouns: profile.pronouns || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    if (open) {
      loadProfile();
    }
  }, [open, form]);

  const onSubmit = async (data: ProfileData) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          preferred_name: data.preferred_name,
          pronouns: data.pronouns,
        })
        .eq("id", user.id);

      toast({
        title: "Profile Updated! ✅",
        description: "Your profile information has been saved successfully.",
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start h-auto p-3">
          <User className="h-4 w-4 mr-3" />
          <div className="flex-1 text-left">
            <div className="font-medium">Edit Profile</div>
            <div className="text-xs text-muted-foreground">
              Update your name and pronouns
            </div>
          </div>
          <Edit3 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-accent text-accent-foreground">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="How would you like to be addressed?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pronouns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pronouns</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., they/them, she/her, he/him"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSection;
