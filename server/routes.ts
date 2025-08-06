import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertTournamentSchema, 
  insertTeamSchema, 
  insertTournamentParticipantSchema,
  insertChatMessageSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tournament routes
  app.get('/api/tournaments', async (req, res) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const tournaments = await storage.getTournaments(
        parseInt(limit as string), 
        parseInt(offset as string)
      );
      res.json(tournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.get('/api/tournaments/featured', async (req, res) => {
    try {
      const tournaments = await storage.getFeaturedTournaments();
      res.json(tournaments);
    } catch (error) {
      console.error("Error fetching featured tournaments:", error);
      res.status(500).json({ message: "Failed to fetch featured tournaments" });
    }
  });

  app.get('/api/tournaments/:id', async (req, res) => {
    try {
      const tournament = await storage.getTournamentWithDetails(req.params.id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });

  app.post('/api/tournaments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tournamentData = insertTournamentSchema.parse({
        ...req.body,
        organizedBy: userId,
      });
      
      const tournament = await storage.createTournament(tournamentData);
      res.status(201).json(tournament);
    } catch (error) {
      console.error("Error creating tournament:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tournament data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });

  app.put('/api/tournaments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tournament = await storage.getTournament(req.params.id);
      
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      if (tournament.organizedBy !== userId) {
        return res.status(403).json({ message: "Not authorized to update this tournament" });
      }

      const updatedTournament = await storage.updateTournament(req.params.id, req.body);
      res.json(updatedTournament);
    } catch (error) {
      console.error("Error updating tournament:", error);
      res.status(500).json({ message: "Failed to update tournament" });
    }
  });

  app.delete('/api/tournaments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tournament = await storage.getTournament(req.params.id);
      
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      if (tournament.organizedBy !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this tournament" });
      }

      await storage.deleteTournament(req.params.id);
      res.json({ message: "Tournament deleted successfully" });
    } catch (error) {
      console.error("Error deleting tournament:", error);
      res.status(500).json({ message: "Failed to delete tournament" });
    }
  });

  // Tournament participation routes
  app.post('/api/tournaments/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { teamId } = req.body;
      
      const participant = await storage.joinTournament(req.params.id, userId, teamId);
      res.status(201).json(participant);
    } catch (error) {
      console.error("Error joining tournament:", error);
      res.status(500).json({ message: "Failed to join tournament" });
    }
  });

  app.post('/api/tournaments/:id/leave', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.leaveTournament(req.params.id, userId);
      res.json({ message: "Left tournament successfully" });
    } catch (error) {
      console.error("Error leaving tournament:", error);
      res.status(500).json({ message: "Failed to leave tournament" });
    }
  });

  app.get('/api/tournaments/:id/participants', async (req, res) => {
    try {
      const participants = await storage.getTournamentParticipants(req.params.id);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  // Match routes
  app.get('/api/tournaments/:id/matches', async (req, res) => {
    try {
      const matches = await storage.getTournamentMatches(req.params.id);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.post('/api/tournaments/:id/generate-matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tournament = await storage.getTournament(req.params.id);
      
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      if (tournament.organizedBy !== userId) {
        return res.status(403).json({ message: "Not authorized to generate matches" });
      }

      await storage.createMatches(req.params.id);
      res.json({ message: "Matches generated successfully" });
    } catch (error) {
      console.error("Error generating matches:", error);
      res.status(500).json({ message: "Failed to generate matches" });
    }
  });

  app.put('/api/matches/:id', isAuthenticated, async (req: any, res) => {
    try {
      const match = await storage.updateMatch(req.params.id, req.body);
      res.json(match);
    } catch (error) {
      console.error("Error updating match:", error);
      res.status(500).json({ message: "Failed to update match" });
    }
  });

  // Team routes
  app.get('/api/teams', async (req, res) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const teams = await storage.getTeams(
        parseInt(limit as string), 
        parseInt(offset as string)
      );
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get('/api/teams/:id', async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teamData = insertTeamSchema.parse({
        ...req.body,
        captainId: userId,
      });
      
      const team = await storage.createTeam(teamData);
      res.status(201).json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create team" });
    }
  });

  // User routes
  app.get('/api/users/:id/tournaments', async (req, res) => {
    try {
      const tournaments = await storage.getUserTournaments(req.params.id);
      res.json(tournaments);
    } catch (error) {
      console.error("Error fetching user tournaments:", error);
      res.status(500).json({ message: "Failed to fetch user tournaments" });
    }
  });

  app.get('/api/users/:id/teams', async (req, res) => {
    try {
      const teams = await storage.getUserTeams(req.params.id);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching user teams:", error);
      res.status(500).json({ message: "Failed to fetch user teams" });
    }
  });

  app.get('/api/users/:id/stats', async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.id);
      res.json(stats || {
        tournamentsWon: 0,
        tournamentsParticipated: 0,
        matchesWon: 0,
        matchesLost: 0,
        totalEarnings: 0,
        ranking: null
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Chat routes
  app.get('/api/tournaments/:id/chat', async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const messages = await storage.getTournamentChat(
        req.params.id, 
        parseInt(limit as string)
      );
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({ message: "Failed to fetch chat" });
    }
  });

  app.post('/api/tournaments/:id/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        userId,
        tournamentId: req.params.id,
      });
      
      const message = await storage.createChatMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating chat message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create chat message" });
    }
  });

  // Games routes
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getGames();
      res.json(games);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard/global", async (req, res) => {
    try {
      const { game } = req.query;
      const leaderboard = await storage.getGlobalLeaderboard(game as string);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching global leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/leaderboard/friends", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const leaderboard = await storage.getFriendsLeaderboard(userId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching friends leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch friends leaderboard" });
    }
  });

  // Enhanced tournament routes with game types
  app.get("/api/tournaments/by-game/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const tournaments = await storage.getTournamentsByGame(gameType);
      res.json(tournaments);
    } catch (error) {
      console.error("Error fetching tournaments by game:", error);
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
