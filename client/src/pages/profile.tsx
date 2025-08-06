import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Trophy, Users, Calendar, Settings, ExternalLink } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: userStats } = useQuery({
    queryKey: ["/api/users", user?.id, "stats"],
    enabled: !!user?.id,
  });

  const { data: userTournaments } = useQuery({
    queryKey: ["/api/users", user?.id, "tournaments"],
    enabled: !!user?.id,
  });

  const { data: userTeams } = useQuery({
    queryKey: ["/api/users", user?.id, "teams"],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-purple rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const stats = userStats || {
    tournamentsWon: 0,
    tournamentsParticipated: 0,
    matchesWon: 0,
    matchesLost: 0,
    totalEarnings: 0,
    ranking: null
  };

  const winRate = stats.matchesWon + stats.matchesLost > 0 
    ? Math.round((stats.matchesWon / (stats.matchesWon + stats.matchesLost)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gaming-dark-850 rounded-xl border border-gaming-dark-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent-purple rounded-full flex items-center justify-center">
                {user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {user.username?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-1" data-testid="text-profile-username">
                  {user.username || `${user.firstName} ${user.lastName}`}
                </h1>
                <div className="flex items-center space-x-4 text-gaming-dark-300">
                  {user.email && (
                    <span className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{user.email}</span>
                    </span>
                  )}
                  {user.region && (
                    <Badge variant="outline" data-testid="badge-user-region">
                      {user.region}
                    </Badge>
                  )}
                </div>
                {user.bio && (
                  <p className="text-gaming-dark-300 mt-2" data-testid="text-user-bio">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user.twitchUrl && (
                <Button variant="outline" size="sm" asChild data-testid="button-twitch-profile">
                  <a href={user.twitchUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Twitch
                  </a>
                </Button>
              )}
              {user.youtubeUrl && (
                <Button variant="outline" size="sm" asChild data-testid="button-youtube-profile">
                  <a href={user.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    YouTube
                  </a>
                </Button>
              )}
              <Button variant="outline" size="sm" data-testid="button-edit-profile">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="tournament-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1" data-testid="text-tournaments-won">
                {stats.tournamentsWon}
              </div>
              <div className="text-sm text-gaming-dark-400">Tournaments Won</div>
            </CardContent>
          </Card>
          
          <Card className="tournament-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent-cyan mb-1" data-testid="text-win-rate">
                {winRate}%
              </div>
              <div className="text-sm text-gaming-dark-400">Win Rate</div>
            </CardContent>
          </Card>
          
          <Card className="tournament-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1" data-testid="text-total-earnings">
                ${stats.totalEarnings.toLocaleString()}
              </div>
              <div className="text-sm text-gaming-dark-400">Total Earnings</div>
            </CardContent>
          </Card>
          
          <Card className="tournament-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-ranking">
                {stats.ranking ? `#${stats.ranking}` : 'Unranked'}
              </div>
              <div className="text-sm text-gaming-dark-400">Global Ranking</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="tournaments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tournaments" data-testid="tab-tournaments">
              <Trophy className="w-4 h-4 mr-2" />
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="teams" data-testid="tab-teams">
              <Users className="w-4 h-4 mr-2" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="activity" data-testid="tab-activity">
              <Calendar className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments">
            <Card className="tournament-card">
              <CardHeader>
                <CardTitle>Tournament History</CardTitle>
              </CardHeader>
              <CardContent>
                {userTournaments?.length > 0 ? (
                  <div className="space-y-4">
                    {userTournaments.map((tournamentData: any) => {
                      const tournament = tournamentData.tournament;
                      return (
                        <div 
                          key={tournament.id}
                          className="flex items-center justify-between p-4 bg-gaming-dark-900 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-purple rounded-lg flex items-center justify-center">
                              <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium" data-testid={`text-tournament-${tournament.id}`}>
                                {tournament.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-gaming-dark-400">
                                <span>{tournament.format.replace('_', ' ')}</span>
                                <span>•</span>
                                <span>{tournament.status.replace('_', ' ')}</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/tournaments/${tournament.id}`}
                            data-testid={`button-view-tournament-${tournament.id}`}
                          >
                            View
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gaming-dark-400 mx-auto mb-4" />
                    <p className="text-gaming-dark-400" data-testid="text-no-tournaments">
                      No tournaments participated yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card className="tournament-card">
              <CardHeader>
                <CardTitle>Team Memberships</CardTitle>
              </CardHeader>
              <CardContent>
                {userTeams?.length > 0 ? (
                  <div className="space-y-4">
                    {userTeams.map((teamData: any) => {
                      const team = teamData.team;
                      return (
                        <div 
                          key={team.id}
                          className="flex items-center justify-between p-4 bg-gaming-dark-900 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-accent-cyan to-primary rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">
                                {team.name[0]?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium" data-testid={`text-team-${team.id}`}>
                                {team.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-gaming-dark-400">
                                <span>Team Member</span>
                                {team.region && (
                                  <>
                                    <span>•</span>
                                    <span>{team.region}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            data-testid={`button-view-team-${team.id}`}
                          >
                            View Team
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gaming-dark-400 mx-auto mb-4" />
                    <p className="text-gaming-dark-400" data-testid="text-no-teams">
                      No team memberships yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="tournament-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gaming-dark-400 mx-auto mb-4" />
                  <p className="text-gaming-dark-400" data-testid="text-no-activity">
                    No recent activity to display.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
