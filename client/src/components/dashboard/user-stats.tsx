import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, DollarSign, Award } from "lucide-react";

interface UserStats {
  matchesWon: number;
  matchesLost: number;
  tournamentsWon: number;
  tournamentsParticipated: number;
  totalEarnings: number;
  ranking: number | null;
}

interface UserStatsProps {
  userId: string;
}

export default function UserStats({ userId }: UserStatsProps) {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/users", userId, "stats"],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card className="tournament-card">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-20 w-20 bg-gaming-dark-700 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gaming-dark-700 rounded mb-2 mx-auto w-24"></div>
            <div className="h-3 bg-gaming-dark-700 rounded mb-4 mx-auto w-16"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 bg-gaming-dark-700 rounded w-20"></div>
                  <div className="h-3 bg-gaming-dark-700 rounded w-8"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const userStats = stats || {
    tournamentsWon: 0,
    tournamentsParticipated: 0,
    matchesWon: 0,
    matchesLost: 0,
    totalEarnings: 0,
    ranking: null
  };

  const winRate = userStats.matchesWon + userStats.matchesLost > 0 
    ? Math.round((userStats.matchesWon / (userStats.matchesWon + userStats.matchesLost)) * 100) 
    : 0;

  return (
    <Card className="tournament-card">
      <CardHeader>
        <CardTitle>Player Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Gaming Profile</h3>
          <p className="text-gaming-dark-400">Competitive Player</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-gaming-dark-400">Tournaments Won</span>
            </div>
            <span className="text-white font-semibold" data-testid="stat-tournaments-won">
              {userStats.tournamentsWon}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gaming-dark-400">Win Rate</span>
            </div>
            <span className="text-green-400 font-semibold" data-testid="stat-win-rate">
              {winRate}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-yellow-400" />
              <span className="text-gaming-dark-400">Total Earnings</span>
            </div>
            <span className="text-yellow-400 font-semibold" data-testid="stat-total-earnings">
              ${userStats.totalEarnings.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-gaming-dark-400">Global Ranking</span>
            </div>
            <span className="text-primary font-semibold" data-testid="stat-ranking">
              {userStats.ranking ? `#${userStats.ranking}` : 'Unranked'}
            </span>
          </div>

          <div className="pt-2 border-t border-gaming-dark-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-white" data-testid="stat-matches-won">
                  {userStats.matchesWon}
                </div>
                <div className="text-xs text-gaming-dark-400">Matches Won</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white" data-testid="stat-tournaments-total">
                  {userStats.tournamentsParticipated}
                </div>
                <div className="text-xs text-gaming-dark-400">Tournaments</div>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full mt-6 gaming-button"
          onClick={() => window.location.href = '/profile'}
          data-testid="button-view-full-profile"
        >
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  );
}
