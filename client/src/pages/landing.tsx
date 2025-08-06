import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark-850 via-gaming-dark-900 to-primary/20">
      {/* Header */}
      <nav className="bg-gaming-dark-850 border-b border-gaming-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-white">EaseArena</span>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="gaming-button"
              data-testid="button-login"
            >
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="gaming-button"
                size="lg"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="gaming-button-outline"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gaming-dark-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need for Esports
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="tournament-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Tournament Management</h3>
                <p className="text-gaming-dark-300">
                  Create and organize tournaments with multiple formats. Manage brackets, 
                  schedule matches, and track results effortlessly.
                </p>
              </CardContent>
            </Card>

            <Card className="tournament-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent-cyan/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-accent-cyan text-2xl">📺</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Live Streaming</h3>
                <p className="text-gaming-dark-300">
                  Integrate with Twitch and YouTube. Stream your matches live 
                  and build an audience around your tournaments.
                </p>
              </CardContent>
            </Card>

            <Card className="tournament-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent-purple/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-accent-purple text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Team & Community</h3>
                <p className="text-gaming-dark-300">
                  Form teams, connect with players, and engage in tournament 
                  discussions. Build lasting gaming relationships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gaming-dark-850 border-t border-gaming-dark-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-lg font-bold text-white">EaseArena</span>
            </div>
          </div>
          <p className="text-gaming-dark-500 text-sm text-center mt-4">
            © 2024 EaseArena. All rights reserved. Built for the competitive gaming community.
          </p>
        </div>
      </footer>
    </div>
  );
}
