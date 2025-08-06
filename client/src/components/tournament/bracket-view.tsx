interface Match {
  match: {
    id: string;
    round: number;
    matchNumber: number;
    status: string;
    score1?: number;
    score2?: number;
    scheduledAt?: string;
    startedAt?: string;
    completedAt?: string;
  };
  participant1?: {
    id: string;
    user?: string;
    team?: string;
  };
  participant2?: {
    id: string;
    user?: string;
    team?: string;
  };
  winner?: {
    id: string;
    user?: string;
    team?: string;
  };
}

interface BracketViewProps {
  tournamentId: string;
  matches: Match[];
  tournament: {
    format: string;
    maxParticipants: number;
  };
}

export default function BracketView({ tournamentId, matches, tournament }: BracketViewProps) {
  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.match.round;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const rounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds) return 'Finals';
    if (round === totalRounds - 1) return 'Semi Finals';
    if (round === totalRounds - 2) return 'Quarter Finals';
    return `Round ${round}`;
  };

  const getParticipantName = (participant?: { user?: string; team?: string }) => {
    if (!participant) return 'TBD';
    return participant.team || participant.user || 'Unknown';
  };

  const getMatchStatus = (match: Match) => {
    switch (match.match.status) {
      case 'in_progress': return { label: 'LIVE', color: 'text-red-400', indicator: true };
      case 'completed': return { label: 'COMPLETED', color: 'text-green-400', indicator: false };
      case 'scheduled': 
        if (match.match.scheduledAt) {
          return { 
            label: new Date(match.match.scheduledAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }), 
            color: 'text-yellow-400', 
            indicator: false 
          };
        }
        return { label: 'TBD', color: 'text-gaming-dark-500', indicator: false };
      default: return { label: 'SCHEDULED', color: 'text-gaming-dark-400', indicator: false };
    }
  };

  if (matches.length === 0) {
    return (
      <div className="bg-gaming-dark-850 rounded-xl border border-gaming-dark-700 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gaming-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gaming-dark-400 text-2xl">🏆</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Bracket Not Generated</h3>
          <p className="text-gaming-dark-400" data-testid="text-no-bracket">
            Tournament bracket will be available once matches are generated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gaming-dark-850 rounded-xl border border-gaming-dark-700 p-6 overflow-x-auto">
      <div className="min-w-[800px]" data-testid="bracket-container">
        {/* Round Headers */}
        <div className="grid gap-8 mb-6" style={{ gridTemplateColumns: `repeat(${rounds.length}, 1fr)` }}>
          {rounds.map((round) => (
            <div key={round} className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                {getRoundName(round, rounds.length)}
              </h3>
              <div className="text-sm text-gaming-dark-400">
                {matchesByRound[round]?.length} matches
              </div>
            </div>
          ))}
        </div>

        {/* Bracket Matches */}
        <div className="grid gap-8 items-start" style={{ gridTemplateColumns: `repeat(${rounds.length}, 1fr)` }}>
          {rounds.map((round) => {
            const roundMatches = matchesByRound[round] || [];
            const spacing = Math.pow(2, round - 1) * 4; // Increase spacing for later rounds
            
            return (
              <div 
                key={round} 
                className="space-y-4" 
                style={{ 
                  paddingTop: round > 1 ? `${spacing}rem` : '0',
                  gap: round > 1 ? `${spacing * 2}rem` : '1rem' 
                }}
              >
                {roundMatches.map((match) => {
                  const status = getMatchStatus(match);
                  const isWinner1 = match.winner?.id === match.participant1?.id;
                  const isWinner2 = match.winner?.id === match.participant2?.id;
                  
                  return (
                    <div
                      key={match.match.id}
                      className={`bracket-match ${match.match.status === 'in_progress' ? 'live' : ''}`}
                      data-testid={`match-${match.match.id}`}
                    >
                      {/* Match Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gaming-dark-400">
                          Match {match.match.matchNumber}
                        </span>
                        <span className={`text-xs font-medium ${status.color} flex items-center gap-1`}>
                          {status.indicator && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                          {status.label}
                        </span>
                      </div>

                      {/* Participant 1 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1">
                          <div className="w-6 h-6 rounded bg-gradient-to-br from-red-500 to-orange-500 flex-shrink-0"></div>
                          <span 
                            className={`text-sm font-medium truncate ${
                              isWinner1 ? 'text-white' : 
                              match.match.status === 'completed' ? 'text-gaming-dark-300' : 'text-white'
                            }`}
                            data-testid={`participant1-${match.match.id}`}
                          >
                            {getParticipantName(match.participant1)}
                          </span>
                        </div>
                        <span 
                          className={`font-bold ${
                            isWinner1 ? 'text-green-400' : 
                            match.match.status === 'completed' ? 'text-gaming-dark-400' : 'text-primary'
                          }`}
                        >
                          {match.match.score1 ?? (match.match.status === 'scheduled' ? '-' : '0')}
                        </span>
                      </div>

                      {/* Participant 2 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1">
                          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0"></div>
                          <span 
                            className={`text-sm font-medium truncate ${
                              isWinner2 ? 'text-white' : 
                              match.match.status === 'completed' ? 'text-gaming-dark-300' : 'text-white'
                            }`}
                            data-testid={`participant2-${match.match.id}`}
                          >
                            {getParticipantName(match.participant2)}
                          </span>
                        </div>
                        <span 
                          className={`font-bold ${
                            isWinner2 ? 'text-green-400' : 
                            match.match.status === 'completed' ? 'text-gaming-dark-400' : 'text-primary'
                          }`}
                        >
                          {match.match.score2 ?? (match.match.status === 'scheduled' ? '-' : '0')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Winner Section */}
        {rounds.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/50 rounded-lg p-6">
              <div className="text-yellow-400 text-3xl mb-2">🏆</div>
              <div className="text-yellow-400 text-lg font-bold mb-1">Champion</div>
              <div className="text-gaming-dark-500 text-sm" data-testid="text-champion">
                {/* Winner will be determined after finals */}
                TBD
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
