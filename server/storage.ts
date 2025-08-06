import {
  users,
  tournaments,
  teams,
  teamMembers,
  tournamentParticipants,
  matches,
  chatMessages,
  userStats,
  type User,
  type UpsertUser,
  type Tournament,
  type InsertTournament,
  type Team,
  type InsertTeam,
  type TournamentParticipant,
  type InsertTournamentParticipant,
  type Match,
  type InsertMatch,
  type ChatMessage,
  type InsertChatMessage,
  type UserStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats>;

  // Tournament operations
  getTournaments(limit?: number, offset?: number): Promise<Tournament[]>;
  getTournament(id: string): Promise<Tournament | undefined>;
  getTournamentWithDetails(id: string): Promise<any>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: string, tournament: Partial<InsertTournament>): Promise<Tournament>;
  deleteTournament(id: string): Promise<void>;
  getFeaturedTournaments(): Promise<Tournament[]>;
  getUserTournaments(userId: string): Promise<Tournament[]>;

  // Team operations
  getTeams(limit?: number, offset?: number): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, team: Partial<InsertTeam>): Promise<Team>;
  deleteTeam(id: string): Promise<void>;
  getUserTeams(userId: string): Promise<Team[]>;
  addTeamMember(teamId: string, userId: string, role?: string): Promise<void>;
  removeTeamMember(teamId: string, userId: string): Promise<void>;

  // Tournament participation
  joinTournament(tournamentId: string, userId: string, teamId?: string): Promise<TournamentParticipant>;
  leaveTournament(tournamentId: string, userId: string): Promise<void>;
  getTournamentParticipants(tournamentId: string): Promise<any[]>;

  // Match operations
  getTournamentMatches(tournamentId: string): Promise<any[]>;
  getMatch(id: string): Promise<Match | undefined>;
  updateMatch(id: string, match: Partial<InsertMatch>): Promise<Match>;
  createMatches(tournamentId: string): Promise<void>;

  // Chat operations
  getTournamentChat(tournamentId: string, limit?: number): Promise<any[]>;
  getMatchChat(matchId: string, limit?: number): Promise<any[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats;
  }

  async updateUserStats(userId: string, statsData: Partial<UserStats>): Promise<UserStats> {
    const [stats] = await db
      .insert(userStats)
      .values({ userId, ...statsData })
      .onConflictDoUpdate({
        target: userStats.userId,
        set: {
          ...statsData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return stats;
  }

  // Tournament operations
  async getTournaments(limit = 20, offset = 0): Promise<Tournament[]> {
    return await db
      .select()
      .from(tournaments)
      .orderBy(desc(tournaments.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async getTournamentWithDetails(id: string): Promise<any> {
    const [tournament] = await db
      .select({
        tournament: tournaments,
        organizer: users,
        participantCount: sql<number>`count(${tournamentParticipants.id})`,
      })
      .from(tournaments)
      .leftJoin(users, eq(tournaments.organizedBy, users.id))
      .leftJoin(tournamentParticipants, eq(tournaments.id, tournamentParticipants.tournamentId))
      .where(eq(tournaments.id, id))
      .groupBy(tournaments.id, users.id);
    
    return tournament;
  }

  async createTournament(tournamentData: InsertTournament): Promise<Tournament> {
    const [tournament] = await db
      .insert(tournaments)
      .values(tournamentData)
      .returning();
    return tournament;
  }

  async updateTournament(id: string, tournamentData: Partial<InsertTournament>): Promise<Tournament> {
    const [tournament] = await db
      .update(tournaments)
      .set({ ...tournamentData, updatedAt: new Date() })
      .where(eq(tournaments.id, id))
      .returning();
    return tournament;
  }

  async deleteTournament(id: string): Promise<void> {
    await db.delete(tournaments).where(eq(tournaments.id, id));
  }

  async getFeaturedTournaments(): Promise<Tournament[]> {
    return await db
      .select()
      .from(tournaments)
      .where(
        or(
          eq(tournaments.status, 'registration_open'),
          eq(tournaments.status, 'in_progress')
        )
      )
      .orderBy(desc(tournaments.prizePool), desc(tournaments.createdAt))
      .limit(6);
  }

  async getUserTournaments(userId: string): Promise<Tournament[]> {
    const results = await db
      .select({
        id: tournaments.id,
        name: tournaments.name,
        description: tournaments.description,
        format: tournaments.format,
        status: tournaments.status,
        maxParticipants: tournaments.maxParticipants,
        currentParticipants: tournaments.currentParticipants,
        prizePool: tournaments.prizePool,
        registrationDeadline: tournaments.registrationDeadline,
        startDate: tournaments.startDate,
        endDate: tournaments.endDate,
        region: tournaments.region,
        gameTitle: tournaments.gameTitle,
        organizedBy: tournaments.organizedBy,
        bannerUrl: tournaments.bannerUrl,
        rules: tournaments.rules,
        streamUrl: tournaments.streamUrl,
        createdAt: tournaments.createdAt,
        updatedAt: tournaments.updatedAt,
      })
      .from(tournaments)
      .innerJoin(tournamentParticipants, eq(tournaments.id, tournamentParticipants.tournamentId))
      .where(eq(tournamentParticipants.userId, userId))
      .orderBy(desc(tournaments.createdAt));
    return results;
  }

  // Team operations
  async getTeams(limit = 20, offset = 0): Promise<Team[]> {
    return await db
      .select()
      .from(teams)
      .orderBy(desc(teams.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(teamData: InsertTeam): Promise<Team> {
    const [team] = await db
      .insert(teams)
      .values(teamData)
      .returning();
    
    // Add captain as team member
    await db
      .insert(teamMembers)
      .values({
        teamId: team.id,
        userId: team.captainId,
        role: 'captain',
      });

    return team;
  }

  async updateTeam(id: string, teamData: Partial<InsertTeam>): Promise<Team> {
    const [team] = await db
      .update(teams)
      .set({ ...teamData, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return team;
  }

  async deleteTeam(id: string): Promise<void> {
    await db.delete(teams).where(eq(teams.id, id));
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    const results = await db
      .select({
        id: teams.id,
        name: teams.name,
        description: teams.description,
        logoUrl: teams.logoUrl,
        captainId: teams.captainId,
        region: teams.region,
        createdAt: teams.createdAt,
        updatedAt: teams.updatedAt,
      })
      .from(teams)
      .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .where(eq(teamMembers.userId, userId))
      .orderBy(desc(teams.createdAt));
    return results;
  }

  async addTeamMember(teamId: string, userId: string, role = 'member'): Promise<void> {
    await db
      .insert(teamMembers)
      .values({
        teamId,
        userId,
        role,
      });
  }

  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    await db
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, userId)
        )
      );
  }

  // Tournament participation
  async joinTournament(tournamentId: string, userId: string, teamId?: string): Promise<TournamentParticipant> {
    const [participant] = await db
      .insert(tournamentParticipants)
      .values({
        tournamentId,
        userId,
        teamId,
      })
      .returning();

    // Update tournament participant count
    await db
      .update(tournaments)
      .set({
        currentParticipants: sql`${tournaments.currentParticipants} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(tournaments.id, tournamentId));

    return participant;
  }

  async leaveTournament(tournamentId: string, userId: string): Promise<void> {
    await db
      .delete(tournamentParticipants)
      .where(
        and(
          eq(tournamentParticipants.tournamentId, tournamentId),
          eq(tournamentParticipants.userId, userId)
        )
      );

    // Update tournament participant count
    await db
      .update(tournaments)
      .set({
        currentParticipants: sql`${tournaments.currentParticipants} - 1`,
        updatedAt: new Date(),
      })
      .where(eq(tournaments.id, tournamentId));
  }

  async getTournamentParticipants(tournamentId: string): Promise<any[]> {
    return await db
      .select({
        participant: tournamentParticipants,
        user: users,
        team: teams,
      })
      .from(tournamentParticipants)
      .leftJoin(users, eq(tournamentParticipants.userId, users.id))
      .leftJoin(teams, eq(tournamentParticipants.teamId, teams.id))
      .where(eq(tournamentParticipants.tournamentId, tournamentId))
      .orderBy(tournamentParticipants.joinedAt);
  }

  // Match operations
  async getTournamentMatches(tournamentId: string): Promise<any[]> {
    return await db
      .select({
        match: matches,
        participant1: {
          id: sql`p1.id`,
          user: sql`u1.username`,
          team: sql`t1.name`,
        },
        participant2: {
          id: sql`p2.id`,
          user: sql`u2.username`,
          team: sql`t2.name`,
        },
        winner: {
          id: sql`pw.id`,
          user: sql`uw.username`,
          team: sql`tw.name`,
        },
      })
      .from(matches)
      .leftJoin(sql`tournament_participants p1`, sql`matches.participant1_id = p1.id`)
      .leftJoin(sql`users u1`, sql`p1.user_id = u1.id`)
      .leftJoin(sql`teams t1`, sql`p1.team_id = t1.id`)
      .leftJoin(sql`tournament_participants p2`, sql`matches.participant2_id = p2.id`)
      .leftJoin(sql`users u2`, sql`p2.user_id = u2.id`)
      .leftJoin(sql`teams t2`, sql`p2.team_id = t2.id`)
      .leftJoin(sql`tournament_participants pw`, sql`matches.winner_id = pw.id`)
      .leftJoin(sql`users uw`, sql`pw.user_id = uw.id`)
      .leftJoin(sql`teams tw`, sql`pw.team_id = tw.id`)
      .where(eq(matches.tournamentId, tournamentId))
      .orderBy(matches.round, matches.matchNumber);
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }

  async updateMatch(id: string, matchData: Partial<InsertMatch>): Promise<Match> {
    const [match] = await db
      .update(matches)
      .set({ ...matchData, updatedAt: new Date() })
      .where(eq(matches.id, id))
      .returning();
    return match;
  }

  async createMatches(tournamentId: string): Promise<void> {
    const participants = await this.getTournamentParticipants(tournamentId);
    const tournament = await this.getTournament(tournamentId);
    
    if (!tournament || participants.length < 2) {
      throw new Error('Not enough participants to create matches');
    }

    // Simple single elimination bracket generation
    if (tournament.format === 'single_elimination') {
      const rounds = Math.ceil(Math.log2(participants.length));
      let currentRound = 1;
      let roundParticipants = [...participants];

      // Create first round matches
      for (let i = 0; i < roundParticipants.length; i += 2) {
        if (i + 1 < roundParticipants.length) {
          await db.insert(matches).values({
            tournamentId,
            round: currentRound,
            matchNumber: Math.floor(i / 2) + 1,
            participant1Id: roundParticipants[i].participant.id,
            participant2Id: roundParticipants[i + 1].participant.id,
            status: 'scheduled',
          });
        }
      }

      // Create placeholder matches for subsequent rounds
      for (let round = 2; round <= rounds; round++) {
        const matchesInRound = Math.ceil(roundParticipants.length / Math.pow(2, round));
        for (let match = 1; match <= matchesInRound; match++) {
          await db.insert(matches).values({
            tournamentId,
            round,
            matchNumber: match,
            status: 'scheduled',
          });
        }
      }
    }
  }

  // Chat operations
  async getTournamentChat(tournamentId: string, limit = 50): Promise<any[]> {
    return await db
      .select({
        message: chatMessages,
        user: users,
      })
      .from(chatMessages)
      .innerJoin(users, eq(chatMessages.userId, users.id))
      .where(eq(chatMessages.tournamentId, tournamentId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async getMatchChat(matchId: string, limit = 50): Promise<any[]> {
    return await db
      .select({
        message: chatMessages,
        user: users,
      })
      .from(chatMessages)
      .innerJoin(users, eq(chatMessages.userId, users.id))
      .where(eq(chatMessages.matchId, matchId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(messageData)
      .returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
