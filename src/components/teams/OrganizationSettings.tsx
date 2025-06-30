
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Users, Mail } from "lucide-react";

interface OrganizationSettingsProps {
  organization: any;
}

const OrganizationSettings = ({ organization }: OrganizationSettingsProps) => {
  const [formData, setFormData] = useState({
    name: organization.name || "",
    description: organization.description || "",
    slug: organization.slug || "",
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDepartment, setInviteDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateOrganization = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("organizations")
        .update({
          name: formData.name,
          description: formData.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", organization.id);

      if (error) throw error;

      toast({
        title: "Organization updated",
        description: "Organization settings have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating organization",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("organization_invitations")
        .insert({
          organization_id: organization.id,
          email: inviteEmail,
          department: inviteDepartment || null,
          invited_by: user.id,
        });

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: `Invitation has been sent to ${inviteEmail}`,
      });

      setInviteEmail("");
      setInviteDepartment("");
    } catch (error: any) {
      toast({
        title: "Error sending invitation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Organization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter organization name"
            />
          </div>
          
          <div>
            <Label htmlFor="org-description">Description</Label>
            <Textarea
              id="org-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your organization's mission and goals"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="org-slug">Organization Slug</Label>
            <Input
              id="org-slug"
              value={formData.slug}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-600 mt-1">
              The organization slug cannot be changed after creation.
            </p>
          </div>

          <Button 
            onClick={updateOrganization}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Team Invitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Invite Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="invite-email">Email Address</Label>
            <Input
              id="invite-email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
            />
          </div>
          
          <div>
            <Label htmlFor="invite-department">Department (Optional)</Label>
            <Input
              id="invite-department"
              value={inviteDepartment}
              onChange={(e) => setInviteDepartment(e.target.value)}
              placeholder="e.g., Engineering, Marketing, Sales"
            />
          </div>

          <Button 
            onClick={sendInvitation}
            disabled={loading || !inviteEmail}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </CardContent>
      </Card>

      {/* Privacy & Data Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Anonymous Analytics</h4>
                <p className="text-sm text-gray-600">Allow anonymous aggregation of team wellness data</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Data Export</h4>
                <p className="text-sm text-gray-600">Export organizational wellness data for compliance</p>
              </div>
              <Button variant="outline" size="sm">Export Data</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSettings;
