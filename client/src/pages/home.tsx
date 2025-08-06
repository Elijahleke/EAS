import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import TournamentCard from "@/components/tournament/tournament-card";
import UserStats from "@/components/dashboard/user-stats";
import ActiveTournaments from "@/components/dashboard/active-tournaments";
import RecentActivity from "@/components/dashboard/recent-activity";
import type { Tournament } from "@shared/schema";

export default function Home() {
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

  const { data: featuredTournaments, isLoading: tournamentsLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments/featured"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-lg">E</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gaming-dark-850 via-gaming-dark-900 to-primary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to the{" "}
              <span className="text-gaming-gradient">Ultimate Arena</span>
            </h1>
            <p className="text-xl text-gaming-dark-300 mb-8 max-w-3xl mx-auto">
              Create, manage, and compete in esports tournaments. Connect with players worldwide, 
              stream your matches, and climb the leaderboards.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-16 bg-gaming-dark-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white" data-testid="text-featured-tournaments">
              Featured Tournaments
            </h2>
            <a 
              href="/tournaments" 
              className="text-primary hover:text-primary/80 font-medium"
              data-testid="link-view-all-tournaments"
            >
              View All →
            </a>
          </div>

          {tournamentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="tournament-card p-6">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gaming-dark-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gaming-dark-700 rounded mb-2"></div>
                    <div className="h-4 bg-gaming-dark-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredTournaments?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTournaments.map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gaming-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gaming-dark-400 text-2xl">🏆</span>
              </div>
              <p className="text-gaming-dark-400" data-testid="text-no-tournaments">
                No featured tournaments available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* User Dashboard */}
      {user && (
        <section className="py-16 bg-gaming-dark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Your Gaming Hub
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <UserStats userId={user.id} />
              <ActiveTournaments userId={user.id} />
              <RecentActivity userId={user.id} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
