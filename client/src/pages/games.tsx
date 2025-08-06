import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/navbar";
import { Search, Gamepad2, Trophy, Users, Clock } from "lucide-react";

interface Game {
  id: string;
  name: string;
  type: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  activeTournaments: number;
  totalPlayers: number;
  totalTournaments: number;
}

export default function Games() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const gameTypeLabels: Record<string, { name: string; icon: string; color: string }> = {
    fifa: { name: "FIFA", icon: "⚽", color: "bg-green-500" },
    nba2k: { name: "NBA 2K", icon: "🏀", color: "bg-orange-500" },
    rocket_league: { name: "Rocket League", icon: "🚗", color: "bg-blue-500" },
    cod: { name: "Call of Duty", icon: "🎯", color: "bg-red-500" },
    valorant: { name: "Valorant", icon: "🔫", color: "bg-red-600" },
    fortnite: { name: "Fortnite", icon: "🏗️", color: "bg-purple-500" },
    apex_legends: { name: "Apex Legends", icon: "🏔️", color: "bg-orange-600" },
    csgo: { name: "CS:GO", icon: "💥", color: "bg-yellow-500" },
    dota2: { name: "Dota 2", icon: "🗡️", color: "bg-red-700" },
    lol: { name: "League of Legends", icon: "⚔️", color: "bg-blue-600" },
    overwatch: { name: "Overwatch", icon: "🦸", color: "bg-orange-400" },
    pubg: { name: "PUBG", icon: "🪖", color: "bg-yellow-600" },
  };

  const filteredGames = games?.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const GameCard = ({ game }: { game: Game }) => {
    const gameInfo = gameTypeLabels[game.type] || { 
      name: game.name, 
      icon: "🎮", 
      color: "bg-gray-500" 
    };

    return (
      <Card className="tournament-card group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${gameInfo.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                {gameInfo.icon}
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-primary transition-colors" data-testid={`text-game-name-${game.id}`}>
                  {gameInfo.name}
                </h3>
                <p className="text-gaming-dark-400 text-sm">{game.description}</p>
              </div>
            </div>
            
            <Badge 
              variant={game.isActive ? "default" : "secondary"}
              className={game.isActive ? "bg-green-500/20 text-green-400" : ""}
            >
              {game.isActive ? "Active" : "Coming Soon"}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-white font-semibold" data-testid={`text-tournaments-${game.id}`}>
                  {game.activeTournaments}
                </span>
              </div>
              <p className="text-xs text-gaming-dark-400">Live Tournaments</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-blue-400 mr-1" />
                <span className="text-white font-semibold">
                  {game.totalPlayers}
                </span>
              </div>
              <p className="text-xs text-gaming-dark-400">Players</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-purple-400 mr-1" />
                <span className="text-white font-semibold">
                  {game.totalTournaments}
                </span>
              </div>
              <p className="text-xs text-gaming-dark-400">Total Events</p>
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <Button 
              size="sm" 
              className="flex-1 gaming-button"
              disabled={!game.isActive}
              data-testid={`button-view-tournaments-${game.id}`}
            >
              View Tournaments
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 gaming-button-outline"
              disabled={!game.isActive}
            >
              Create Tournament
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Supported Games
            </h1>
            <p className="text-gaming-dark-300">
              Compete in tournaments across multiple gaming platforms
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gaming-dark-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search games..."
            className="pl-10 bg-gaming-dark-900 border-gaming-dark-700 text-white placeholder-gaming-dark-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-games"
          />
        </div>

        {/* Games Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <Card className="tournament-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gaming-dark-700 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="w-20 h-4 bg-gaming-dark-700 rounded"></div>
                          <div className="w-32 h-3 bg-gaming-dark-700 rounded"></div>
                        </div>
                      </div>
                      <div className="w-16 h-5 bg-gaming-dark-700 rounded"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="text-center">
                          <div className="w-8 h-4 bg-gaming-dark-700 rounded mx-auto mb-1"></div>
                          <div className="w-12 h-3 bg-gaming-dark-700 rounded mx-auto"></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 h-8 bg-gaming-dark-700 rounded"></div>
                      <div className="flex-1 h-8 bg-gaming-dark-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Gamepad2 className="w-16 h-16 text-gaming-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gaming-dark-300 mb-2">
              {searchQuery ? "No games found" : "No games available"}
            </h3>
            <p className="text-gaming-dark-400">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "Check back later for new game additions!"
              }
            </p>
          </div>
        )}

        {/* Game Request Section */}
        <Card className="tournament-card mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gamepad2 className="w-5 h-5 text-primary" />
              <span>Don't see your game?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-gaming-dark-300 mb-4">
                We're always adding new games to EaseArena. Request your favorite game and we'll consider adding it!
              </p>
              <Button className="gaming-button" data-testid="button-request-game">
                Request a Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}