import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/navbar";
import TournamentCard from "@/components/tournament/tournament-card";
import { Plus, Search, Filter } from "lucide-react";
import type { Tournament } from "@shared/schema";

export default function Tournaments() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");

  const { data: tournaments, isLoading, error } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments", searchQuery, statusFilter, formatFilter],
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2" data-testid="text-tournaments-title">
              Tournaments
            </h1>
            <p className="text-gaming-dark-300">
              Discover and join competitive gaming tournaments
            </p>
          </div>
          
          {isAuthenticated && (
            <Button 
              onClick={() => window.location.href = '/tournaments/create'}
              className="gaming-button mt-4 sm:mt-0"
              data-testid="button-create-tournament"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-gaming-dark-850 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gaming-dark-400" />
              <Input
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-tournaments"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="registration_open">Registration Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger data-testid="select-format-filter">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="single_elimination">Single Elimination</SelectItem>
                <SelectItem value="double_elimination">Double Elimination</SelectItem>
                <SelectItem value="round_robin">Round Robin</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="gaming-button-outline"
              data-testid="button-clear-filters"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setFormatFilter("all");
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Tournament Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="tournament-card p-6">
                <div className="animate-pulse">
                  <div className="h-48 bg-gaming-dark-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gaming-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-gaming-dark-700 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-gaming-dark-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tournaments?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard 
                key={tournament.id} 
                tournament={tournament}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gaming-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gaming-dark-400 text-3xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No tournaments found</h3>
            <p className="text-gaming-dark-400 mb-6" data-testid="text-no-tournaments">
              {searchQuery || statusFilter !== "all" || formatFilter !== "all"
                ? "Try adjusting your search filters"
                : "Be the first to create a tournament!"}
            </p>
            {isAuthenticated && (
              <Button 
                onClick={() => window.location.href = '/tournaments/create'}
                className="gaming-button"
                data-testid="button-create-first-tournament"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
