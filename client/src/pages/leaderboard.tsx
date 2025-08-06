import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import { Trophy, Medal, Target, Users, Gamepad2 } from "lucide-react";

interface LeaderboardUser {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  totalPoints: number;
  winPoints: number;
  participationPoints: number;
  totalMatches: number;
  matchesWon: number;
  winRate: number;
  ranking: number;
  gameType?: string;
}

export default function Leaderboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string>("all");

  const { data: globalLeaderboard, isLoading: globalLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ["/api/leaderboard/global", selectedGame],
  });

  const { data: friendsLeaderboard, isLoading: friendsLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ["/api/leaderboard/friends"],
    enabled: isAuthenticated,
  });

  const gameOptions = [
    { value: "all", label: "All Games", icon: "🏆" },
    { value: "fifa", label: "FIFA", icon: "⚽" },
    { value: "nba2k", label: "NBA 2K", icon: "🏀" },
    { value: "rocket_league", label: "Rocket League", icon: "🚗" },
    { value: "cod", label: "Call of Duty", icon: "🎯" },
    { value: "valorant", label: "Valorant", icon: "🔫" },
    { value: "fortnite", label: "Fortnite", icon: "🏗️" },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-gaming-dark-400 font-bold">#{rank}</span>;
  };

  const LeaderboardCard = ({ user: leaderboardUser, rank }: { user: LeaderboardUser; rank: number }) => (
    <div className="flex items-center justify-between p-4 bg-gaming-dark-900 rounded-lg border border-gaming-dark-700 hover:border-primary/50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {getRankIcon(rank)}
        </div>
        
        <div className="flex items-center space-x-3">
          {leaderboardUser.profileImageUrl ? (
            <img 
              src={leaderboardUser.profileImageUrl} 
              alt={leaderboardUser.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-white" data-testid={`text-username-${leaderboardUser.id}`}>
              {leaderboardUser.username}
            </h3>
            <p className="text-sm text-gaming-dark-400">
              {leaderboardUser.firstName} {leaderboardUser.lastName}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-6 text-right">
        <div>
          <p className="font-bold text-primary" data-testid={`text-total-points-${leaderboardUser.id}`}>
            {leaderboardUser.totalPoints}
          </p>
          <p className="text-xs text-gaming-dark-400">Total Points</p>
        </div>
        
        <div>
          <p className="font-semibold text-green-400">
            {leaderboardUser.winRate}%
          </p>
          <p className="text-xs text-gaming-dark-400">Win Rate</p>
        </div>
        
        <div>
          <p className="font-semibold text-blue-400">
            {leaderboardUser.totalMatches}
          </p>
          <p className="text-xs text-gaming-dark-400">Matches</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Leaderboards
            </h1>
            <p className="text-gaming-dark-300">
              Compete with the best players across all games
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-48 bg-gaming-dark-900 border-gaming-dark-700">
                <SelectValue placeholder="Select game" />
              </SelectTrigger>
              <SelectContent>
                {gameOptions.map((game) => (
                  <SelectItem key={game.value} value={game.value}>
                    <div className="flex items-center space-x-2">
                      <span>{game.icon}</span>
                      <span>{game.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="global">Global Leaderboard</TabsTrigger>
            <TabsTrigger value="friends" disabled={!isAuthenticated}>
              Friends Only
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-6">
            <Card className="tournament-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>Global Rankings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {globalLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse bg-gaming-dark-900 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-5 h-5 bg-gaming-dark-700 rounded"></div>
                            <div className="w-10 h-10 bg-gaming-dark-700 rounded-full"></div>
                            <div className="space-y-1">
                              <div className="w-24 h-4 bg-gaming-dark-700 rounded"></div>
                              <div className="w-16 h-3 bg-gaming-dark-700 rounded"></div>
                            </div>
                          </div>
                          <div className="flex space-x-6">
                            <div className="w-12 h-4 bg-gaming-dark-700 rounded"></div>
                            <div className="w-12 h-4 bg-gaming-dark-700 rounded"></div>
                            <div className="w-12 h-4 bg-gaming-dark-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : globalLeaderboard && globalLeaderboard.length > 0 ? (
                  <div className="space-y-4">
                    {globalLeaderboard.map((leaderboardUser, index) => (
                      <LeaderboardCard 
                        key={leaderboardUser.id}
                        user={leaderboardUser}
                        rank={index + 1}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gaming-dark-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gaming-dark-300 mb-2">
                      No Rankings Yet
                    </h3>
                    <p className="text-gaming-dark-400">
                      Be the first to compete and claim the top spot!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends" className="mt-6">
            <Card className="tournament-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Friends Rankings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isAuthenticated ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gaming-dark-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gaming-dark-300 mb-2">
                      Login Required
                    </h3>
                    <p className="text-gaming-dark-400 mb-4">
                      Login to see how you compare with your friends
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/api/login'}
                      className="gaming-button"
                    >
                      Login Now
                    </Button>
                  </div>
                ) : friendsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gaming-dark-900 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-5 h-5 bg-gaming-dark-700 rounded"></div>
                            <div className="w-10 h-10 bg-gaming-dark-700 rounded-full"></div>
                            <div className="space-y-1">
                              <div className="w-24 h-4 bg-gaming-dark-700 rounded"></div>
                              <div className="w-16 h-3 bg-gaming-dark-700 rounded"></div>
                            </div>
                          </div>
                          <div className="flex space-x-6">
                            <div className="w-12 h-4 bg-gaming-dark-700 rounded"></div>
                            <div className="w-12 h-4 bg-gaming-dark-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : friendsLeaderboard && friendsLeaderboard.length > 0 ? (
                  <div className="space-y-4">
                    {friendsLeaderboard.map((leaderboardUser, index) => (
                      <LeaderboardCard 
                        key={leaderboardUser.id}
                        user={leaderboardUser}
                        rank={index + 1}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gaming-dark-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gaming-dark-300 mb-2">
                      No Friends Yet
                    </h3>
                    <p className="text-gaming-dark-400">
                      Add friends to see how you rank against them!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Points System Info */}
        <Card className="tournament-card mt-8">
          <CardHeader>
            <CardTitle>Points System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">Match Won</h3>
                <p className="text-green-400 font-bold text-xl">+10 Points</p>
                <p className="text-gaming-dark-400 text-sm">Win matches to climb the ranks</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">Match Played</h3>
                <p className="text-blue-400 font-bold text-xl">+5 Points</p>
                <p className="text-gaming-dark-400 text-sm">Participate to earn points</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Medal className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">Match Draw</h3>
                <p className="text-yellow-400 font-bold text-xl">+3 Points</p>
                <p className="text-gaming-dark-400 text-sm">Even draws count!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}