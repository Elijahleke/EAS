var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  chatMessageRelations: () => chatMessageRelations,
  chatMessages: () => chatMessages,
  gameRelations: () => gameRelations,
  gameTypeEnum: () => gameTypeEnum,
  games: () => games,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertMatchSchema: () => insertMatchSchema,
  insertTeamSchema: () => insertTeamSchema,
  insertTournamentParticipantSchema: () => insertTournamentParticipantSchema,
  insertTournamentSchema: () => insertTournamentSchema,
  matchRelations: () => matchRelations,
  matchStatusEnum: () => matchStatusEnum,
  matches: () => matches,
  sessions: () => sessions,
  teamMemberRelations: () => teamMemberRelations,
  teamMembers: () => teamMembers,
  teamRelations: () => teamRelations,
  teams: () => teams,
  tournamentFormatEnum: () => tournamentFormatEnum,
  tournamentParticipantRelations: () => tournamentParticipantRelations,
  tournamentParticipants: () => tournamentParticipants,
  tournamentRelations: () => tournamentRelations,
  tournamentStatusEnum: () => tournamentStatusEnum,
  tournaments: () => tournaments,
  userRelations: () => userRelations,
  userStats: () => userStats,
  userStatsRelations: () => userStatsRelations,
  users: () => users
});
import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").unique(),
  bio: text("bio"),
  region: varchar("region"),
  twitchUrl: varchar("twitch_url"),
  youtubeUrl: varchar("youtube_url"),
  discordTag: varchar("discord_tag"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var tournamentStatusEnum = pgEnum("tournament_status", [
  "draft",
  "registration_open",
  "registration_closed",
  "in_progress",
  "completed",
  "cancelled"
]);
var tournamentFormatEnum = pgEnum("tournament_format", [
  "single_elimination",
  "double_elimination",
  "round_robin",
  "swiss"
]);
var gameTypeEnum = pgEnum("game_type", [
  "fifa",
  "nba2k",
  "rocket_league",
  "cod",
  "valorant",
  "fortnite",
  "apex_legends",
  "csgo",
  "dota2",
  "lol",
  "overwatch",
  "pubg"
]);
var tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  format: tournamentFormatEnum("format").notNull(),
  status: tournamentStatusEnum("status").notNull().default("draft"),
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").notNull().default(0),
  prizePool: integer("prize_pool").default(0),
  registrationDeadline: timestamp("registration_deadline"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  region: varchar("region"),
  gameTitle: varchar("game_title"),
  gameType: gameTypeEnum("game_type").notNull().default("fifa"),
  entryFee: integer("entry_fee").default(0),
  requiresApproval: boolean("requires_approval").default(false),
  isPublic: boolean("is_public").default(true),
  streamingRequired: boolean("streaming_required").default(false),
  organizedBy: varchar("organized_by").notNull().references(() => users.id),
  bannerUrl: varchar("banner_url"),
  rules: text("rules"),
  streamUrl: varchar("stream_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  captainId: varchar("captain_id").notNull().references(() => users.id),
  region: varchar("region"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role").default("member"),
  // captain, co-captain, member
  joinedAt: timestamp("joined_at").defaultNow()
});
var tournamentParticipants = pgTable("tournament_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").notNull().references(() => tournaments.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  teamId: varchar("team_id").references(() => teams.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").defaultNow()
});
var matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled"
]);
var matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").notNull().references(() => tournaments.id, { onDelete: "cascade" }),
  round: integer("round").notNull(),
  matchNumber: integer("match_number").notNull(),
  participant1Id: varchar("participant1_id").references(() => tournamentParticipants.id),
  participant2Id: varchar("participant2_id").references(() => tournamentParticipants.id),
  winnerId: varchar("winner_id").references(() => tournamentParticipants.id),
  status: matchStatusEnum("status").notNull().default("scheduled"),
  scheduledAt: timestamp("scheduled_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  score1: integer("score1").default(0),
  score2: integer("score2").default(0),
  streamUrl: varchar("stream_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").references(() => tournaments.id, { onDelete: "cascade" }),
  matchId: varchar("match_id").references(() => matches.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var userRelations = relations(users, ({ many, one }) => ({
  organizedTournaments: many(tournaments),
  captainedTeams: many(teams),
  teamMemberships: many(teamMembers),
  tournamentParticipations: many(tournamentParticipants),
  chatMessages: many(chatMessages),
  stats: one(userStats)
}));
var tournamentRelations = relations(tournaments, ({ one, many }) => ({
  organizer: one(users, {
    fields: [tournaments.organizedBy],
    references: [users.id]
  }),
  participants: many(tournamentParticipants),
  matches: many(matches),
  chatMessages: many(chatMessages)
}));
var teamRelations = relations(teams, ({ one, many }) => ({
  captain: one(users, {
    fields: [teams.captainId],
    references: [users.id]
  }),
  members: many(teamMembers),
  tournamentParticipations: many(tournamentParticipants)
}));
var teamMemberRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id]
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id]
  })
}));
var tournamentParticipantRelations = relations(tournamentParticipants, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [tournamentParticipants.tournamentId],
    references: [tournaments.id]
  }),
  user: one(users, {
    fields: [tournamentParticipants.userId],
    references: [users.id]
  }),
  team: one(teams, {
    fields: [tournamentParticipants.teamId],
    references: [teams.id]
  })
}));
var matchRelations = relations(matches, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [matches.tournamentId],
    references: [tournaments.id]
  }),
  participant1: one(tournamentParticipants, {
    fields: [matches.participant1Id],
    references: [tournamentParticipants.id]
  }),
  participant2: one(tournamentParticipants, {
    fields: [matches.participant2Id],
    references: [tournamentParticipants.id]
  }),
  winner: one(tournamentParticipants, {
    fields: [matches.winnerId],
    references: [tournamentParticipants.id]
  })
}));
var chatMessageRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id]
  }),
  tournament: one(tournaments, {
    fields: [chatMessages.tournamentId],
    references: [tournaments.id]
  }),
  match: one(matches, {
    fields: [chatMessages.matchId],
    references: [matches.id]
  })
}));
var games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: gameTypeEnum("type").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  gameId: varchar("game_id").references(() => games.id, { onDelete: "cascade" }),
  totalMatches: integer("total_matches").default(0),
  matchesWon: integer("matches_won").default(0),
  matchesLost: integer("matches_lost").default(0),
  matchesDraw: integer("matches_draw").default(0),
  winRate: integer("win_rate").default(0),
  // percentage
  ranking: integer("ranking"),
  winPoints: integer("win_points").default(0),
  participationPoints: integer("participation_points").default(0),
  totalPoints: integer("total_points").default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id]
  }),
  game: one(games, {
    fields: [userStats.gameId],
    references: [games.id]
  })
}));
var gameRelations = relations(games, ({ many }) => ({
  tournaments: many(tournaments),
  userStats: many(userStats)
}));
var insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  currentParticipants: true,
  createdAt: true,
  updatedAt: true
});
var insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTournamentParticipantSchema = createInsertSchema(tournamentParticipants).omit({
  id: true,
  joinedAt: true
});
var insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and, or, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async getUserStats(userId) {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats;
  }
  async updateUserStats(userId, statsData) {
    const [stats] = await db.insert(userStats).values({ userId, ...statsData }).onConflictDoUpdate({
      target: userStats.userId,
      set: {
        ...statsData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return stats;
  }
  // Tournament operations
  async getTournaments(limit = 20, offset = 0) {
    return await db.select().from(tournaments).orderBy(desc(tournaments.createdAt)).limit(limit).offset(offset);
  }
  async getTournament(id) {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }
  async getTournamentWithDetails(id) {
    const [tournament] = await db.select({
      tournament: tournaments,
      organizer: users,
      participantCount: sql2`count(${tournamentParticipants.id})`
    }).from(tournaments).leftJoin(users, eq(tournaments.organizedBy, users.id)).leftJoin(tournamentParticipants, eq(tournaments.id, tournamentParticipants.tournamentId)).where(eq(tournaments.id, id)).groupBy(tournaments.id, users.id);
    return tournament;
  }
  async createTournament(tournamentData) {
    const [tournament] = await db.insert(tournaments).values(tournamentData).returning();
    return tournament;
  }
  async updateTournament(id, tournamentData) {
    const [tournament] = await db.update(tournaments).set({ ...tournamentData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tournaments.id, id)).returning();
    return tournament;
  }
  async deleteTournament(id) {
    await db.delete(tournaments).where(eq(tournaments.id, id));
  }
  async getFeaturedTournaments() {
    return await db.select().from(tournaments).where(
      or(
        eq(tournaments.status, "registration_open"),
        eq(tournaments.status, "in_progress")
      )
    ).orderBy(desc(tournaments.prizePool), desc(tournaments.createdAt)).limit(6);
  }
  async getUserTournaments(userId) {
    const results = await db.select({
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
      updatedAt: tournaments.updatedAt
    }).from(tournaments).innerJoin(tournamentParticipants, eq(tournaments.id, tournamentParticipants.tournamentId)).where(eq(tournamentParticipants.userId, userId)).orderBy(desc(tournaments.createdAt));
    return results;
  }
  // Team operations
  async getTeams(limit = 20, offset = 0) {
    return await db.select().from(teams).orderBy(desc(teams.createdAt)).limit(limit).offset(offset);
  }
  async getTeam(id) {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }
  async createTeam(teamData) {
    const [team] = await db.insert(teams).values(teamData).returning();
    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: team.captainId,
      role: "captain"
    });
    return team;
  }
  async updateTeam(id, teamData) {
    const [team] = await db.update(teams).set({ ...teamData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(teams.id, id)).returning();
    return team;
  }
  async deleteTeam(id) {
    await db.delete(teams).where(eq(teams.id, id));
  }
  async getUserTeams(userId) {
    const results = await db.select({
      id: teams.id,
      name: teams.name,
      description: teams.description,
      logoUrl: teams.logoUrl,
      captainId: teams.captainId,
      region: teams.region,
      createdAt: teams.createdAt,
      updatedAt: teams.updatedAt
    }).from(teams).innerJoin(teamMembers, eq(teams.id, teamMembers.teamId)).where(eq(teamMembers.userId, userId)).orderBy(desc(teams.createdAt));
    return results;
  }
  async addTeamMember(teamId, userId, role = "member") {
    await db.insert(teamMembers).values({
      teamId,
      userId,
      role
    });
  }
  async removeTeamMember(teamId, userId) {
    await db.delete(teamMembers).where(
      and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      )
    );
  }
  // Tournament participation
  async joinTournament(tournamentId, userId, teamId) {
    const [participant] = await db.insert(tournamentParticipants).values({
      tournamentId,
      userId,
      teamId
    }).returning();
    await db.update(tournaments).set({
      currentParticipants: sql2`${tournaments.currentParticipants} + 1`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(tournaments.id, tournamentId));
    return participant;
  }
  async leaveTournament(tournamentId, userId) {
    await db.delete(tournamentParticipants).where(
      and(
        eq(tournamentParticipants.tournamentId, tournamentId),
        eq(tournamentParticipants.userId, userId)
      )
    );
    await db.update(tournaments).set({
      currentParticipants: sql2`${tournaments.currentParticipants} - 1`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(tournaments.id, tournamentId));
  }
  async getTournamentParticipants(tournamentId) {
    return await db.select({
      participant: tournamentParticipants,
      user: users,
      team: teams
    }).from(tournamentParticipants).leftJoin(users, eq(tournamentParticipants.userId, users.id)).leftJoin(teams, eq(tournamentParticipants.teamId, teams.id)).where(eq(tournamentParticipants.tournamentId, tournamentId)).orderBy(tournamentParticipants.joinedAt);
  }
  // Match operations
  async getTournamentMatches(tournamentId) {
    return await db.select({
      match: matches,
      participant1: {
        id: sql2`p1.id`,
        user: sql2`u1.username`,
        team: sql2`t1.name`
      },
      participant2: {
        id: sql2`p2.id`,
        user: sql2`u2.username`,
        team: sql2`t2.name`
      },
      winner: {
        id: sql2`pw.id`,
        user: sql2`uw.username`,
        team: sql2`tw.name`
      }
    }).from(matches).leftJoin(sql2`tournament_participants p1`, sql2`matches.participant1_id = p1.id`).leftJoin(sql2`users u1`, sql2`p1.user_id = u1.id`).leftJoin(sql2`teams t1`, sql2`p1.team_id = t1.id`).leftJoin(sql2`tournament_participants p2`, sql2`matches.participant2_id = p2.id`).leftJoin(sql2`users u2`, sql2`p2.user_id = u2.id`).leftJoin(sql2`teams t2`, sql2`p2.team_id = t2.id`).leftJoin(sql2`tournament_participants pw`, sql2`matches.winner_id = pw.id`).leftJoin(sql2`users uw`, sql2`pw.user_id = uw.id`).leftJoin(sql2`teams tw`, sql2`pw.team_id = tw.id`).where(eq(matches.tournamentId, tournamentId)).orderBy(matches.round, matches.matchNumber);
  }
  async getMatch(id) {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }
  async updateMatch(id, matchData) {
    const [match] = await db.update(matches).set({ ...matchData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(matches.id, id)).returning();
    return match;
  }
  async createMatches(tournamentId) {
    const participants = await this.getTournamentParticipants(tournamentId);
    const tournament = await this.getTournament(tournamentId);
    if (!tournament || participants.length < 2) {
      throw new Error("Not enough participants to create matches");
    }
    if (tournament.format === "single_elimination") {
      const rounds = Math.ceil(Math.log2(participants.length));
      let currentRound = 1;
      let roundParticipants = [...participants];
      for (let i = 0; i < roundParticipants.length; i += 2) {
        if (i + 1 < roundParticipants.length) {
          await db.insert(matches).values({
            tournamentId,
            round: currentRound,
            matchNumber: Math.floor(i / 2) + 1,
            participant1Id: roundParticipants[i].participant.id,
            participant2Id: roundParticipants[i + 1].participant.id,
            status: "scheduled"
          });
        }
      }
      for (let round = 2; round <= rounds; round++) {
        const matchesInRound = Math.ceil(roundParticipants.length / Math.pow(2, round));
        for (let match = 1; match <= matchesInRound; match++) {
          await db.insert(matches).values({
            tournamentId,
            round,
            matchNumber: match,
            status: "scheduled"
          });
        }
      }
    }
  }
  // Chat operations
  async getTournamentChat(tournamentId, limit = 50) {
    return await db.select({
      message: chatMessages,
      user: users
    }).from(chatMessages).innerJoin(users, eq(chatMessages.userId, users.id)).where(eq(chatMessages.tournamentId, tournamentId)).orderBy(desc(chatMessages.createdAt)).limit(limit);
  }
  async getMatchChat(matchId, limit = 50) {
    return await db.select({
      message: chatMessages,
      user: users
    }).from(chatMessages).innerJoin(users, eq(chatMessages.userId, users.id)).where(eq(chatMessages.matchId, matchId)).orderBy(desc(chatMessages.createdAt)).limit(limit);
  }
  async createChatMessage(messageData) {
    const [message] = await db.insert(chatMessages).values(messageData).returning();
    return message;
  }
  // Games and leaderboard operations
  async getGames() {
    return await db.select().from(games).where(eq(games.isActive, true)).orderBy(games.name);
  }
  async getGame(id) {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }
  async createGame(gameData) {
    const [game] = await db.insert(games).values(gameData).returning();
    return game;
  }
  async getGlobalLeaderboard(gameType) {
    let query = db.select({
      user: users,
      stats: userStats,
      game: games
    }).from(userStats).innerJoin(users, eq(userStats.userId, users.id)).innerJoin(games, eq(userStats.gameId, games.id));
    if (gameType) {
      query = query.where(eq(games.type, gameType));
    }
    return await query.orderBy(desc(userStats.totalPoints)).limit(100);
  }
  async getFriendsLeaderboard(userId) {
    return [];
  }
  async getTournamentsByGame(gameType) {
    return await db.select().from(tournaments).where(eq(tournaments.gameType, gameType)).orderBy(desc(tournaments.createdAt)).limit(50);
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/tournaments", async (req, res) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const tournaments2 = await storage.getTournaments(
        parseInt(limit),
        parseInt(offset)
      );
      res.json(tournaments2);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });
  app2.get("/api/tournaments/featured", async (req, res) => {
    try {
      const tournaments2 = await storage.getFeaturedTournaments();
      res.json(tournaments2);
    } catch (error) {
      console.error("Error fetching featured tournaments:", error);
      res.status(500).json({ message: "Failed to fetch featured tournaments" });
    }
  });
  app2.get("/api/tournaments/:id", async (req, res) => {
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
  app2.post("/api/tournaments", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const tournamentData = insertTournamentSchema.parse({
        ...req.body,
        organizedBy: userId
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
  app2.put("/api/tournaments/:id", isAuthenticated, async (req, res) => {
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
  app2.delete("/api/tournaments/:id", isAuthenticated, async (req, res) => {
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
  app2.post("/api/tournaments/:id/join", isAuthenticated, async (req, res) => {
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
  app2.post("/api/tournaments/:id/leave", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.leaveTournament(req.params.id, userId);
      res.json({ message: "Left tournament successfully" });
    } catch (error) {
      console.error("Error leaving tournament:", error);
      res.status(500).json({ message: "Failed to leave tournament" });
    }
  });
  app2.get("/api/tournaments/:id/participants", async (req, res) => {
    try {
      const participants = await storage.getTournamentParticipants(req.params.id);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });
  app2.get("/api/tournaments/:id/matches", async (req, res) => {
    try {
      const matches2 = await storage.getTournamentMatches(req.params.id);
      res.json(matches2);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });
  app2.post("/api/tournaments/:id/generate-matches", isAuthenticated, async (req, res) => {
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
  app2.put("/api/matches/:id", isAuthenticated, async (req, res) => {
    try {
      const match = await storage.updateMatch(req.params.id, req.body);
      res.json(match);
    } catch (error) {
      console.error("Error updating match:", error);
      res.status(500).json({ message: "Failed to update match" });
    }
  });
  app2.get("/api/teams", async (req, res) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const teams2 = await storage.getTeams(
        parseInt(limit),
        parseInt(offset)
      );
      res.json(teams2);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });
  app2.get("/api/teams/:id", async (req, res) => {
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
  app2.post("/api/teams", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const teamData = insertTeamSchema.parse({
        ...req.body,
        captainId: userId
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
  app2.get("/api/users/:id/tournaments", async (req, res) => {
    try {
      const tournaments2 = await storage.getUserTournaments(req.params.id);
      res.json(tournaments2);
    } catch (error) {
      console.error("Error fetching user tournaments:", error);
      res.status(500).json({ message: "Failed to fetch user tournaments" });
    }
  });
  app2.get("/api/users/:id/teams", async (req, res) => {
    try {
      const teams2 = await storage.getUserTeams(req.params.id);
      res.json(teams2);
    } catch (error) {
      console.error("Error fetching user teams:", error);
      res.status(500).json({ message: "Failed to fetch user teams" });
    }
  });
  app2.get("/api/users/:id/stats", async (req, res) => {
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
  app2.get("/api/tournaments/:id/chat", async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const messages = await storage.getTournamentChat(
        req.params.id,
        parseInt(limit)
      );
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({ message: "Failed to fetch chat" });
    }
  });
  app2.post("/api/tournaments/:id/chat", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        userId,
        tournamentId: req.params.id
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
  app2.get("/api/games", async (req, res) => {
    try {
      const games2 = await storage.getGames();
      res.json(games2);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });
  app2.get("/api/leaderboard/global", async (req, res) => {
    try {
      const { game } = req.query;
      const leaderboard = await storage.getGlobalLeaderboard(game);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching global leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });
  app2.get("/api/leaderboard/friends", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const leaderboard = await storage.getFriendsLeaderboard(userId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching friends leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch friends leaderboard" });
    }
  });
  app2.get("/api/tournaments/by-game/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const tournaments2 = await storage.getTournamentsByGame(gameType);
      res.json(tournaments2);
    } catch (error) {
      console.error("Error fetching tournaments by game:", error);
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
