
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface AchievementBadgesProps {
  badges: string[];
}

const AchievementBadges: React.FC<AchievementBadgesProps> = ({ badges }) => {
  if (!badges || badges.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-yellow-700">
          <Trophy className="h-5 w-5 mr-2" />
          Achievements Unlocked
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} className="bg-yellow-100 text-yellow-800">
              🏆 {badge}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
