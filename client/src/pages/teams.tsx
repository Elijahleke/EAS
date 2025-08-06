import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { Plus, Search, Users, Crown } from "lucide-react";
import type { Team } from "@shared/schema";

export default function Teams() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: teams, isLoading, error } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    enabled: true,
  });

  if (error && error.message.includes('401')) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  const filteredTeams = teams?.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2" data-testid="text-teams-title">
              Teams
            </h1>
            <p className="text-gaming-dark-300">
              Discover and join competitive gaming teams
            </p>
          </div>
          
          {isAuthenticated && (
            <Button 
              className="gaming-button mt-4 sm:mt-0"
              data-testid="button-create-team"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="bg-gaming-dark-850 rounded-lg p-6 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gaming-dark-400" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-teams"
            />
          </div>
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="tournament-card">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-16 w-16 bg-gaming-dark-700 rounded-full mb-4"></div>
                    <div className="h-4 bg-gaming-dark-700 rounded mb-2"></div>
                    <div className="h-4 bg-gaming-dark-700 rounded w-2/3 mb-4"></div>
                    <div className="h-8 bg-gaming-dark-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team: any) => (
              <Card key={team.id} className="tournament-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-purple rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">
                        {team.name[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1" data-testid={`text-team-name-${team.id}`}>
                        {team.name}
                      </h3>
                      {team.region && (
                        <p className="text-gaming-dark-400 text-sm">{team.region}</p>
                      )}
                    </div>
                  </div>

                  {team.description && (
                    <p className="text-gaming-dark-300 text-sm mb-4 line-clamp-2" data-testid={`text-team-description-${team.id}`}>
                      {team.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gaming-dark-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>5 members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Crown className="w-4 h-4" />
                        <span>Captain</span>
                      </div>
                    </div>
                    
                    <Button size="sm" variant="outline" data-testid={`button-view-team-${team.id}`}>
                      View Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gaming-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-gaming-dark-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No teams found</h3>
            <p className="text-gaming-dark-400 mb-6" data-testid="text-no-teams">
              {searchQuery
                ? "Try adjusting your search query"
                : "Be the first to create a team!"}
            </p>
            {isAuthenticated && !searchQuery && (
              <Button className="gaming-button" data-testid="button-create-first-team">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
