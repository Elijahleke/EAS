import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Volume2, Users, ExternalLink } from "lucide-react";

interface LiveStreamProps {
  tournament: {
    id: string;
    name: string;
    streamUrl?: string;
    status: string;
  };
}

export default function LiveStream({ tournament }: LiveStreamProps) {
  const isLive = tournament.status === 'in_progress';
  const hasStreamUrl = tournament.streamUrl;

  return (
    <div className="space-y-6">
      {/* Live Stream Panel */}
      <Card className="tournament-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Stream</span>
            {isLive && (
              <Badge className="bg-red-500/20 text-red-400" data-testid="badge-live-stream">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                LIVE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Stream Player */}
          <div className="aspect-video bg-gradient-to-br from-gaming-dark-700 to-gaming-dark-800 flex items-center justify-center relative rounded-b-lg overflow-hidden">
            {hasStreamUrl && isLive ? (
              // In a real implementation, you would embed the actual stream here
              <div className="text-center w-full h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <div className="text-white font-medium mb-2" data-testid="text-stream-title">
                  {tournament.name} - Live Match
                </div>
                <div className="text-gaming-dark-400 text-sm mb-4">
                  Tournament stream is live
                </div>
                <Button 
                  className="gaming-button" 
                  asChild
                  data-testid="button-watch-stream"
                >
                  <a href={tournament.streamUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch on Platform
                  </a>
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gaming-dark-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Play className="w-8 h-8 text-gaming-dark-400" />
                </div>
                <div className="text-white font-medium mb-2">No Live Stream</div>
                <div className="text-gaming-dark-400 text-sm" data-testid="text-no-stream">
                  {!hasStreamUrl 
                    ? "Stream not configured for this tournament"
                    : "Tournament is not currently live"
                  }
                </div>
              </div>
            )}

            {/* Mock Stream Controls */}
            {hasStreamUrl && isLive && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 rounded-lg p-3">
                  <div className="flex items-center space-x-4">
                    <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">
                      <Play className="w-4 h-4" />
                    </button>
                    <div className="flex-1 bg-white/20 h-1 rounded">
                      <div className="bg-primary h-1 rounded w-1/3"></div>
                    </div>
                    <span className="text-white text-sm">24:56 / 1:15:30</span>
                    <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stream Info */}
          {hasStreamUrl && (
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500"></div>
                <div>
                  <div className="text-white font-medium">Tournament Official</div>
                  <div className="text-gaming-dark-400 text-sm">
                    {tournament.streamUrl?.includes('twitch.tv') ? 'Streaming on Twitch' :
                     tournament.streamUrl?.includes('youtube.com') ? 'Streaming on YouTube' :
                     'Live Stream'}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto" data-testid="button-follow-streamer">
                  Follow
                </Button>
              </div>
              <p className="text-gaming-dark-300 text-sm">
                Official tournament stream featuring live matches, commentary, and analysis.
                Don't miss the action!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Details */}
      <Card className="tournament-card">
        <CardHeader>
          <CardTitle>Current Match</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gaming-dark-400">Tournament</span>
              <span className="text-white" data-testid="text-tournament-name">{tournament.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gaming-dark-400">Status</span>
              <span className="text-white">
                {isLive ? 'Live' : 'Not Started'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gaming-dark-400">Format</span>
              <span className="text-white">Best of 5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gaming-dark-400">Viewers</span>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gaming-dark-400" />
                <span className="text-white" data-testid="text-viewer-count">
                  {isLive ? '1,247' : '0'}
                </span>
              </div>
            </div>
          </div>

          {isLive && (
            <div className="mt-6 pt-4 border-t border-gaming-dark-700">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-primary">2 - 2</div>
                <div className="text-gaming-dark-400 text-sm">Current Score</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-500 to-orange-500"></div>
                    <span className="text-white text-sm">Player 1</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gaming-dark-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gaming-dark-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gaming-dark-600 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-blue-500"></div>
                    <span className="text-white text-sm">Player 2</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gaming-dark-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gaming-dark-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gaming-dark-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
