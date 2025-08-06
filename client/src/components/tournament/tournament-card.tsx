import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Calendar } from "lucide-react";

interface TournamentCardProps {
  tournament: {
    id: string;
    name: string;
    description?: string;
    format: string;
    status: string;
    maxParticipants: number;
    currentParticipants: number;
    prizePool?: number;
    startDate?: string;
    gameTitle?: string;
    region?: string;
  };
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration_open': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'registration_open': return 'Registration Open';
      case 'in_progress': return 'Live';
      case 'completed': return 'Completed';
      default: return status.replace('_', ' ').toUpperCase();
    }
  };

  const gradientClasses = [
    'from-primary-600 to-accent-purple',
    'from-accent-purple to-pink-600',
    'from-accent-cyan to-blue-600',
    'from-green-500 to-emerald-600',
    'from-yellow-500 to-orange-500',
    'from-red-500 to-pink-500',
  ];

  const gradientClass = gradientClasses[tournament.id.length % gradientClasses.length];

  return (
    <Card className="tournament-card group" data-testid={`tournament-card-${tournament.id}`}>
      {/* Tournament Banner */}
      <div className={`h-48 bg-gradient-to-br ${gradientClass} relative`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 left-4">
          <Badge 
            className={getStatusColor(tournament.status)}
            data-testid={`badge-status-${tournament.id}`}
          >
            {getStatusLabel(tournament.status)}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1" data-testid={`text-name-${tournament.id}`}>
            {tournament.name}
          </h3>
          <p className="text-white/80 text-sm">
            {tournament.format.replace('_', ' ')} • {tournament.currentParticipants}/{tournament.maxParticipants} Players
          </p>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Tournament Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-accent-cyan/20 flex items-center justify-center">
              <Trophy className="w-3 h-3 text-accent-cyan" />
            </div>
            <span className="text-gaming-dark-300 text-sm">
              {tournament.prizePool ? `Prize Pool: $${tournament.prizePool.toLocaleString()}` : 'No Prize Pool'}
            </span>
          </div>
          <span className="text-primary text-sm font-medium" data-testid={`text-participants-${tournament.id}`}>
            {tournament.currentParticipants}/{tournament.maxParticipants} joined
          </span>
        </div>

        {/* Tournament Details */}
        {(tournament.gameTitle || tournament.region || tournament.startDate) && (
          <div className="mb-4 space-y-1">
            {tournament.gameTitle && (
              <div className="flex items-center space-x-2 text-sm text-gaming-dark-400">
                <span>Game:</span>
                <span className="text-white" data-testid={`text-game-${tournament.id}`}>
                  {tournament.gameTitle}
                </span>
              </div>
            )}
            {tournament.region && (
              <div className="flex items-center space-x-2 text-sm text-gaming-dark-400">
                <span>Region:</span>
                <span className="text-white" data-testid={`text-region-${tournament.id}`}>
                  {tournament.region}
                </span>
              </div>
            )}
            {tournament.startDate && (
              <div className="flex items-center space-x-2 text-sm text-gaming-dark-400">
                <Calendar className="w-3 h-3" />
                <span className="text-white">
                  {new Date(tournament.startDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {tournament.description && (
          <p className="text-gaming-dark-300 text-sm mb-4 line-clamp-2" data-testid={`text-description-${tournament.id}`}>
            {tournament.description}
          </p>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {/* Mock participant avatars */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 border-2 border-gaming-dark-900"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-gaming-dark-900"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-gaming-dark-900"></div>
            {tournament.currentParticipants > 3 && (
              <div className="w-8 h-8 rounded-full bg-gaming-dark-700 border-2 border-gaming-dark-900 flex items-center justify-center">
                <span className="text-gaming-dark-300 text-xs">
                  +{tournament.currentParticipants - 3}
                </span>
              </div>
            )}
          </div>
          
          <Button 
            size="sm"
            className="gaming-button"
            onClick={() => window.location.href = `/tournaments/${tournament.id}`}
            data-testid={`button-view-${tournament.id}`}
          >
            {tournament.status === 'registration_open' ? 'Join Tournament' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
