import { db } from "./db";
import { users, tournaments, teams, games, userStats, tournamentParticipants, matches, chatMessages } from "@shared/schema";
import { eq } from "drizzle-orm";

// Seed data for EaseArena platform
export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Create test users (admin + players 1-20)
    const testUsers = [
      {
        id: "admin-user",
        email: "admin@easearena.com",
        firstName: "Admin",
        lastName: "User",
        username: "admin",
        region: "North America",
        twitchUsername: "easearena_admin",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      }
    ];

    // Generate player accounts 1-20
    for (let i = 1; i <= 20; i++) {
      testUsers.push({
        id: `player-${i}`,
        email: `player${i}@easearena.com`,
        firstName: `Player`,
        lastName: `${i}`,
        username: `player${i}`,
        region: i <= 10 ? "North America" : "Europe",
        twitchUsername: i % 3 === 0 ? `player${i}_twitch` : undefined,
        profileImageUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?w=150&h=150&fit=crop&crop=face`
      });
    }

    // Insert users
    for (const user of testUsers) {
      await db.insert(users).values(user).onConflictDoNothing();
    }

    // Create sample games
    const gameData = [
      { id: "game-fifa", name: "FIFA", type: "fifa", description: "The world's most popular football simulation", imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop" },
      { id: "game-cod", name: "Call of Duty", type: "cod", description: "Intense first-person shooter battles", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop" },
      { id: "game-rocket", name: "Rocket League", type: "rocket_league", description: "Soccer meets high-octane driving", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop" },
      { id: "game-valorant", name: "Valorant", type: "valorant", description: "Tactical 5v5 character-based shooter", imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=200&fit=crop" }
    ];

    for (const game of gameData) {
      await db.insert(games).values(game).onConflictDoNothing();
    }

    // Create sample teams
    const teamData = [
      { id: "team-1", name: "Ghost Gaming", description: "Elite esports team", captainId: "player-1", region: "North America", logoUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop" },
      { id: "team-2", name: "Phoenix Squad", description: "Rising champions", captainId: "player-5", region: "North America", logoUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop" },
      { id: "team-3", name: "Digital Legends", description: "European powerhouse", captainId: "player-11", region: "Europe", logoUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop" },
      { id: "team-4", name: "Cyber Warriors", description: "Tactical masters", captainId: "player-15", region: "Europe", logoUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop" }
    ];

    for (const team of teamData) {
      await db.insert(teams).values(team).onConflictDoNothing();
    }

    // Create sample tournaments
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    const pastDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago

    const tournamentData = [
      {
        id: "tournament-1",
        name: "EaseArena FIFA Championship",
        description: "The ultimate FIFA tournament featuring top players from around the world",
        format: "single_elimination" as const,
        status: "registration_open" as const,
        gameType: "fifa" as const,
        gameTitle: "FIFA 24",
        maxParticipants: 32,
        currentParticipants: 18,
        prizePool: 5000,
        entryFee: 25,
        registrationDeadline: futureDate,
        startDate: new Date(futureDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        region: "Global",
        organizedBy: "admin-user",
        rules: "Standard FIFA rules apply. No pause abuse. Best of 3 matches in finals.",
        isPublic: true,
        requiresApproval: false,
        streamingRequired: false
      },
      {
        id: "tournament-2", 
        name: "Call of Duty: Warzone Showdown",
        description: "Battle royale tournament with teams fighting for supremacy",
        format: "double_elimination" as const,
        status: "in_progress" as const,
        gameType: "cod" as const,
        gameTitle: "Call of Duty: Warzone",
        maxParticipants: 16,
        currentParticipants: 16,
        prizePool: 2500,
        entryFee: 10,
        registrationDeadline: pastDate,
        startDate: currentDate,
        region: "North America",
        organizedBy: "admin-user",
        rules: "Teams of 4. Standard Warzone rules. No teaming with other squads.",
        isPublic: true,
        requiresApproval: true,
        streamingRequired: true
      },
      {
        id: "tournament-3",
        name: "Rocket League Pro Series",
        description: "High-octane 3v3 Rocket League competition",
        format: "round_robin" as const,
        status: "completed" as const,
        gameType: "rocket_league" as const,
        gameTitle: "Rocket League",
        maxParticipants: 8,
        currentParticipants: 8,
        prizePool: 1000,
        entryFee: 5,
        registrationDeadline: new Date(pastDate.getTime() - 3 * 24 * 60 * 60 * 1000),
        startDate: new Date(pastDate.getTime() - 2 * 24 * 60 * 60 * 1000),
        endDate: pastDate,
        region: "Europe",
        organizedBy: "player-1",
        rules: "3v3 format. All standard tournament rules apply.",
        isPublic: true,
        requiresApproval: false,
        streamingRequired: false
      }
    ];

    for (const tournament of tournamentData) {
      await db.insert(tournaments).values(tournament).onConflictDoNothing();
    }

    // Create sample tournament participants
    const participants = [
      // FIFA Championship participants
      { tournamentId: "tournament-1", userId: "player-1" },
      { tournamentId: "tournament-1", userId: "player-2" },
      { tournamentId: "tournament-1", userId: "player-3" },
      { tournamentId: "tournament-1", userId: "player-4" },
      { tournamentId: "tournament-1", userId: "player-5" },
      { tournamentId: "tournament-1", userId: "player-6" },
      { tournamentId: "tournament-1", userId: "player-7" },
      { tournamentId: "tournament-1", userId: "player-8" },
      // COD Warzone participants
      { tournamentId: "tournament-2", userId: "player-1", teamId: "team-1" },
      { tournamentId: "tournament-2", userId: "player-5", teamId: "team-2" },
      { tournamentId: "tournament-2", userId: "player-11", teamId: "team-3" },
      { tournamentId: "tournament-2", userId: "player-15", teamId: "team-4" },
      // Rocket League participants
      { tournamentId: "tournament-3", userId: "player-1", teamId: "team-1" },
      { tournamentId: "tournament-3", userId: "player-5", teamId: "team-2" }
    ];

    for (const participant of participants) {
      await db.insert(tournamentParticipants).values({
        id: `participant-${participant.tournamentId}-${participant.userId}`,
        ...participant
      }).onConflictDoNothing();
    }

    // Create sample matches for in-progress tournament
    const matchData = [
      {
        id: "match-1",
        tournamentId: "tournament-2",
        participant1Id: "participant-tournament-2-player-1",
        participant2Id: "participant-tournament-2-player-5", 
        round: 1,
        bracket: "winners",
        scheduledFor: new Date(currentDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        status: "scheduled" as const
      },
      {
        id: "match-2",
        tournamentId: "tournament-2",
        participant1Id: "participant-tournament-2-player-11",
        participant2Id: "participant-tournament-2-player-15",
        round: 1,
        bracket: "winners", 
        scheduledFor: new Date(currentDate.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
        status: "scheduled" as const
      }
    ];

    for (const match of matchData) {
      await db.insert(matches).values(match).onConflictDoNothing();
    }

    // Create sample user stats
    const statsData = [
      { userId: "player-1", gameId: "game-fifa", totalMatches: 45, matchesWon: 32, matchesLost: 13, winRate: 71, winPoints: 320, participationPoints: 225, totalPoints: 545 },
      { userId: "player-2", gameId: "game-fifa", totalMatches: 38, matchesWon: 22, matchesLost: 16, winRate: 58, winPoints: 220, participationPoints: 190, totalPoints: 410 },
      { userId: "player-5", gameId: "game-cod", totalMatches: 52, matchesWon: 35, matchesLost: 17, winRate: 67, winPoints: 350, participationPoints: 260, totalPoints: 610 },
      { userId: "player-11", gameId: "game-rocket", totalMatches: 29, matchesWon: 18, matchesLost: 11, winRate: 62, winPoints: 180, participationPoints: 145, totalPoints: 325 }
    ];

    for (const stat of statsData) {
      await db.insert(userStats).values({
        id: `stats-${stat.userId}-${stat.gameId}`,
        ...stat
      }).onConflictDoNothing();
    }

    // Create sample chat messages
    const chatData = [
      {
        id: "chat-1",
        tournamentId: "tournament-1",
        userId: "player-1",
        message: "Looking forward to this tournament! Good luck everyone 🔥",
        createdAt: new Date(currentDate.getTime() - 2 * 60 * 60 * 1000)
      },
      {
        id: "chat-2", 
        tournamentId: "tournament-1",
        userId: "player-3",
        message: "This prize pool is insane! Time to bring my A-game ⚽",
        createdAt: new Date(currentDate.getTime() - 1 * 60 * 60 * 1000)
      },
      {
        id: "chat-3",
        tournamentId: "tournament-2", 
        userId: "player-5",
        message: "Team comms are key in this one. Let's coordinate drops!",
        createdAt: new Date(currentDate.getTime() - 30 * 60 * 1000)
      }
    ];

    for (const chat of chatData) {
      await db.insert(chatMessages).values(chat).onConflictDoNothing();
    }

    console.log("✅ Database seeded successfully!");
    console.log("📊 Created:");
    console.log("  - 21 users (1 admin + 20 players)");
    console.log("  - 4 games (FIFA, COD, Rocket League, Valorant)");
    console.log("  - 4 teams");
    console.log("  - 3 tournaments (1 open, 1 in progress, 1 completed)"); 
    console.log("  - Tournament participants and matches");
    console.log("  - User statistics and chat messages");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeds if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}