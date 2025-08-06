import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Trophy, Users, Calendar } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'tournament_join' | 'tournament_win' | 'team_join' | 'match_win';
  description: string;
  timestamp: Date;
}

export default function RecentActivity() {
  // For now, we'll use empty state since we need real API data
  const activities: ActivityItem[] = [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tournament_join':
        return <Calendar className="h-4 w-4" />;
      case 'tournament_win':
        return <Trophy className="h-4 w-4" />;
      case 'team_join':
        return <Users className="h-4 w-4" />;
      case 'match_win':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'tournament_win':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'tournament_join':
        return 'bg-blue-500/10 text-blue-500';
      case 'team_join':
        return 'bg-green-500/10 text-green-500';
      case 'match_win':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Card data-testid="recent-activity-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" data-testid="no-activity">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Join tournaments and teams to see your activity here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3" data-testid={`activity-${activity.id}`}>
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}