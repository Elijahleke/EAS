import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import BracketView from "@/components/tournament/bracket-view";
import LiveStream from "@/components/tournament/live-stream";
import Chat from "@/components/tournament/chat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Trophy, Settings, Play } from "lucide-react";

export default function TournamentDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("bracket");

  const { data: tournament, isLoading: tournamentLoading, error } = useQuery({
    queryKey: ["/api/tournaments", id],
    enabled: !!id,
  });

  const { data: participants } = useQuery({
    queryKey: ["/api/tournaments", id, "participants"],
    enabled: !!id,
  });

  const { data: matches } = useQuery({
    queryKey: ["/api/tournaments", id, "matches"],
    enabled: !!id,
  });

  const joinTournamentMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/tournaments/${id}/join`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully joined the tournament!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id, "participants"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to join tournament. Please try again.",
        variant: "destructive",
      });
    },
  });

  const leaveTournamentMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/tournaments/${id}/leave`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully left the tournament!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id, "participants"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to leave tournament. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Tournament Not Found</h2>
            <p className="text-gaming-dark-400 mb-4">The tournament you're looking for doesn't exist.</p>
            <Button onClick={() => window.location.href = '/tournaments'} data-testid="button-back-to-tournaments">
              Back to Tournaments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (tournamentLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gaming-dark-700 rounded w-1/3 mb-6"></div>
            <div className="h-32 bg-gaming-dark-700 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-gaming-dark-700 rounded-lg"></div>
              <div className="h-96 bg-gaming-dark-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return null;
  }

  const isOwner = user && tournament.tournament.organizedBy === user.id;
  const isParticipant = participants?.some((p: any) => p.user?.id === user?.id);
  const canJoin = tournament.tournament.status === 'registration_open' && 
                  tournament.tournament.currentParticipants < tournament.tournament.maxParticipants &&
                  !isParticipant;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration_open': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tournament Header */}
        <div className="bg-gaming-dark-850 rounded-xl border border-gaming-dark-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-purple rounded-xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1" data-testid="text-tournament-name">
                  {tournament.tournament.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(tournament.tournament.status)} data-testid="badge-tournament-status">
                    {tournament.tournament.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-gaming-dark-300">
                    {tournament.tournament.format.replace('_', ' ')} • {tournament.tournament.currentParticipants}/{tournament.tournament.maxParticipants} Players
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {tournament.tournament.prizePool > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="text-prize-pool">
                    ${tournament.tournament.prizePool.toLocaleString()}
                  </div>
                  <div className="text-sm text-gaming-dark-400">Prize Pool</div>
                </div>
              )}
              <div className="w-px h-12 bg-gaming-dark-700"></div>
              <div className="flex items-center space-x-2">
                {isOwner && (
                  <Button variant="outline" size="sm" data-testid="button-manage-tournament">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                )}
                
                {isAuthenticated && canJoin && (
                  <Button 
                    onClick={() => joinTournamentMutation.mutate()}
                    disabled={joinTournamentMutation.isPending}
                    className="gaming-button"
                    data-testid="button-join-tournament"
                  >
                    {joinTournamentMutation.isPending ? "Joining..." : "Join Tournament"}
                  </Button>
                )}
                
                {isAuthenticated && isParticipant && !isOwner && (
                  <Button 
                    onClick={() => leaveTournamentMutation.mutate()}
                    disabled={leaveTournamentMutation.isPending}
                    variant="outline"
                    data-testid="button-leave-tournament"
                  >
                    {leaveTournamentMutation.isPending ? "Leaving..." : "Leave Tournament"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bracket" data-testid="tab-bracket">Bracket</TabsTrigger>
            <TabsTrigger value="participants" data-testid="tab-participants">Participants</TabsTrigger>
            <TabsTrigger value="schedule" data-testid="tab-schedule">Schedule</TabsTrigger>
            <TabsTrigger value="chat" data-testid="tab-chat">Chat</TabsTrigger>
            <TabsTrigger value="info" data-testid="tab-info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="bracket" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BracketView 
                  tournamentId={id!} 
                  matches={matches || []} 
                  tournament={tournament.tournament}
                />
              </div>
              <div>
                <LiveStream tournament={tournament.tournament} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="mt-8">
            <div className="bg-gaming-dark-850 rounded-xl border border-gaming-dark-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Participants ({participants?.length || 0}/{tournament.tournament.maxParticipants})
              </h3>
              
              {participants?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {participants.map((participant: any, index: number) => (
                    <div key={participant.participant.id} className="bg-gaming-dark-900 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-purple rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {participant.user?.username?.[0]?.toUpperCase() || participant.team?.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium" data-testid={`text-participant-${index}`}>
                            {participant.user?.username || participant.team?.name}
                          </div>
                          <div className="text-gaming-dark-400 text-sm">
                            {participant.team ? 'Team' : 'Solo Player'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gaming-dark-400 mx-auto mb-4" />
                  <p className="text-gaming-dark-400" data-testid="text-no-participants">
                    No participants yet. Be the first to join!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-8">
            <div className="bg-gaming-dark-850 rounded-xl border border-gaming-dark-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tournament Schedule</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gaming-dark-900 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-white font-medium">Registration Deadline</div>
                    <div className="text-gaming-dark-400 text-sm">
                      {tournament.tournament.registrationDeadline 
                        ? new Date(tournament.tournament.registrationDeadline).toLocaleDateString()
                        : 'Not set'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gaming-dark-900 rounded-lg">
                  <Play className="w-5 h-5 text-accent-cyan" />
                  <div>
                    <div className="text-white font-medium">Tournament Start</div>
                    <div className="text-gaming-dark-400 text-sm">
                      {tournament.tournament.startDate 
                        ? new Date(tournament.tournament.startDate).toLocaleDateString()
                        : 'TBD'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-8">
            <Chat tournamentId={id!} />
          </TabsContent>

          <TabsContent value="info" className="mt-8">
            <div className="bg-gaming-dark-850 rounded-xl border border-gaming-dark-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tournament Information</h3>
              
              <div className="space-y-6">
                {tournament.tournament.description && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Description</h4>
                    <p className="text-gaming-dark-300" data-testid="text-tournament-description">
                      {tournament.tournament.description}
                    </p>
                  </div>
                )}
                
                {tournament.tournament.rules && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Rules</h4>
                    <div className="text-gaming-dark-300 whitespace-pre-wrap" data-testid="text-tournament-rules">
                      {tournament.tournament.rules}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-white font-medium mb-2">Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gaming-dark-400">Format:</span>
                      <span className="text-white ml-2">
                        {tournament.tournament.format.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gaming-dark-400">Max Participants:</span>
                      <span className="text-white ml-2">{tournament.tournament.maxParticipants}</span>
                    </div>
                    {tournament.tournament.gameTitle && (
                      <div>
                        <span className="text-gaming-dark-400">Game:</span>
                        <span className="text-white ml-2">{tournament.tournament.gameTitle}</span>
                      </div>
                    )}
                    {tournament.tournament.region && (
                      <div>
                        <span className="text-gaming-dark-400">Region:</span>
                        <span className="text-white ml-2">{tournament.tournament.region}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {tournament.organizer && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Organizer</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-purple rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {tournament.organizer.username?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white" data-testid="text-organizer-name">
                        {tournament.organizer.username || `${tournament.organizer.firstName} ${tournament.organizer.lastName}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
