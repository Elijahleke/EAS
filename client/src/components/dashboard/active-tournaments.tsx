import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Users } from "lucide-react";
import type { Tournament } from "@shared/schema";

interface ActiveTournamentsProps {
  userId: string;
}

export default function ActiveTournaments({ userId }: ActiveTournamentsProps) {
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/users", userId, "tournaments"],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card className="tournament-card">
        <CardHeader>
          <CardTitle>Active Tournaments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gaming-dark-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gaming-dark-700 rounded w-32"></div>
                  <div className="h-5 bg-gaming-dark-700 rounded w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gaming-dark-700 rounded w-20"></div>
                  <div className="h-3 bg-gaming-dark-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeTournaments = tournaments?.filter((tournament) => 
    tournament.status === 'registration_open' || tournament.status === 'in_progress'
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration_open': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'registration_open': return 'Registration Open';
      case 'in_progress': return 'Live';
      default: return status.replace('_', ' ');
    }
  };

  return (
    <Card className="tournament-card">
      <CardHeader>
        <CardTitle>Active Tournaments</CardTitle>
      </CardHeader>
      <CardContent>
        {activeTournaments.length > 0 ? (
          <div className="space-y-4">
            {activeTournaments.slice(0, 3).map((tournament) => {
              return (
                <div 
                  key={tournament.id} 
                  className="bg-gaming-dark-900 rounded-lg p-4"
                  data-testid={`active-tournament-${tournament.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-white font-medium truncate pr-2">
                      {tournament.name}
                    </h5>
                    <Badge className={getStatusColor(tournament.status)}>
                      {getStatusLabel(tournament.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gaming-dark-400">
                      <Users className="w-3 h-3" />
                      <span>{tournament.format.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gaming-dark-400">
                      {tournament.status === 'in_progress' ? (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-400">Live</span>
                        </>
                      ) : tournament.startDate ? (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                        </>
                      ) : (
                        <span>TBD</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gaming-dark-400 mx-auto mb-3" />
            <p className="text-gaming-dark-400 text-sm mb-4" data-testid="text-no-active-tournaments">
              No active tournaments
            </p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 gaming-button-outline"
          onClick={() => window.location.href = '/tournaments'}
          data-testid="button-browse-tournaments"
        >
          Browse Tournaments
        </Button>
      </CardContent>
    </Card>
  );
}
