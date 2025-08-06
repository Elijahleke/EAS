-- EaseArena Database Export
-- Complete database dump with all tables and data
-- Generated: 2025-08-06

-- Create tables first
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_image_url VARCHAR(255),
    username VARCHAR(255),
    bio TEXT,
    region VARCHAR(100),
    twitch_url VARCHAR(255),
    youtube_url VARCHAR(255),
    discord_tag VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR(255) PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    captain_id VARCHAR(255) REFERENCES users(id),
    region VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tournaments (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    format VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'registration_open',
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    prize_pool DECIMAL(10,2) DEFAULT 0,
    registration_deadline TIMESTAMP,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    region VARCHAR(100),
    game_title VARCHAR(255),
    organized_by VARCHAR(255) REFERENCES users(id),
    banner_url VARCHAR(255),
    rules TEXT,
    stream_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    game_type VARCHAR(50),
    entry_fee DECIMAL(10,2) DEFAULT 0,
    requires_approval BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    streaming_required BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS tournament_participants (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id VARCHAR(255) REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id),
    team_id VARCHAR(255) REFERENCES teams(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id VARCHAR(255) REFERENCES teams(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id VARCHAR(255) REFERENCES tournaments(id) ON DELETE CASCADE,
    round INTEGER NOT NULL,
    match_number INTEGER NOT NULL,
    participant1_id VARCHAR(255) REFERENCES tournament_participants(id),
    participant2_id VARCHAR(255) REFERENCES tournament_participants(id),
    winner_id VARCHAR(255) REFERENCES tournament_participants(id),
    status VARCHAR(50) DEFAULT 'scheduled',
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    score1 INTEGER DEFAULT 0,
    score2 INTEGER DEFAULT 0,
    stream_url VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_stats (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) REFERENCES users(id),
    game_id VARCHAR(255) REFERENCES games(id),
    total_matches INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    matches_lost INTEGER DEFAULT 0,
    matches_draw INTEGER DEFAULT 0,
    win_rate INTEGER DEFAULT 0,
    ranking INTEGER,
    win_points INTEGER DEFAULT 0,
    participation_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id VARCHAR(255) REFERENCES tournaments(id) ON DELETE CASCADE,
    match_id VARCHAR(255) REFERENCES matches(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Users Data
INSERT INTO users (id, email, first_name, last_name, profile_image_url, username, bio, region, twitch_url, youtube_url, discord_tag, created_at, updated_at) VALUES
('admin-user', 'admin@easearena.com', 'Admin', 'User', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'admin', '', 'North America', '', '', '', '2025-08-06 16:09:57.636108', '2025-08-06 16:09:57.636108'),
('player-1', 'player1@easearena.com', 'Player', '1', 'https://images.unsplash.com/photo-1500000000001?w=150&h=150&fit=crop&crop=face', 'player1', '', 'North America', '', '', '', '2025-08-06 16:09:57.691162', '2025-08-06 16:09:57.691162'),
('player-2', 'player2@easearena.com', 'Player', '2', 'https://images.unsplash.com/photo-1500000000002?w=150&h=150&fit=crop&crop=face', 'player2', '', 'North America', '', '', '', '2025-08-06 16:09:57.735232', '2025-08-06 16:09:57.735232'),
('player-3', 'player3@easearena.com', 'Player', '3', 'https://images.unsplash.com/photo-1500000000003?w=150&h=150&fit=crop&crop=face', 'player3', '', 'North America', '', '', '', '2025-08-06 16:09:57.776259', '2025-08-06 16:09:57.776259'),
('player-4', 'player4@easearena.com', 'Player', '4', 'https://images.unsplash.com/photo-1500000000004?w=150&h=150&fit=crop&crop=face', 'player4', '', 'North America', '', '', '', '2025-08-06 16:09:57.817514', '2025-08-06 16:09:57.817514'),
('player-5', 'player5@easearena.com', 'Player', '5', 'https://images.unsplash.com/photo-1500000000005?w=150&h=150&fit=crop&crop=face', 'player5', '', 'North America', '', '', '', '2025-08-06 16:09:57.859556', '2025-08-06 16:09:57.859556'),
('player-6', 'player6@easearena.com', 'Player', '6', 'https://images.unsplash.com/photo-1500000000006?w=150&h=150&fit=crop&crop=face', 'player6', '', 'North America', '', '', '', '2025-08-06 16:09:57.900348', '2025-08-06 16:09:57.900348'),
('player-7', 'player7@easearena.com', 'Player', '7', 'https://images.unsplash.com/photo-1500000000007?w=150&h=150&fit=crop&crop=face', 'player7', '', 'North America', '', '', '', '2025-08-06 16:09:57.939751', '2025-08-06 16:09:57.939751'),
('player-8', 'player8@easearena.com', 'Player', '8', 'https://images.unsplash.com/photo-1500000000008?w=150&h=150&fit=crop&crop=face', 'player8', '', 'North America', '', '', '', '2025-08-06 16:09:57.981089', '2025-08-06 16:09:57.981089'),
('player-9', 'player9@easearena.com', 'Player', '9', 'https://images.unsplash.com/photo-1500000000009?w=150&h=150&fit=crop&crop=face', 'player9', '', 'North America', '', '', '', '2025-08-06 16:09:58.022139', '2025-08-06 16:09:58.022139'),
('player-10', 'player10@easearena.com', 'Player', '10', 'https://images.unsplash.com/photo-1500000000010?w=150&h=150&fit=crop&crop=face', 'player10', '', 'North America', '', '', '', '2025-08-06 16:09:58.062745', '2025-08-06 16:09:58.062745'),
('player-11', 'player11@easearena.com', 'Player', '11', 'https://images.unsplash.com/photo-1500000000011?w=150&h=150&fit=crop&crop=face', 'player11', '', 'Europe', '', '', '', '2025-08-06 16:09:58.103164', '2025-08-06 16:09:58.103164'),
('player-12', 'player12@easearena.com', 'Player', '12', 'https://images.unsplash.com/photo-1500000000012?w=150&h=150&fit=crop&crop=face', 'player12', '', 'Europe', '', '', '', '2025-08-06 16:09:58.143748', '2025-08-06 16:09:58.143748'),
('player-13', 'player13@easearena.com', 'Player', '13', 'https://images.unsplash.com/photo-1500000000013?w=150&h=150&fit=crop&crop=face', 'player13', '', 'Europe', '', '', '', '2025-08-06 16:09:58.184281', '2025-08-06 16:09:58.184281'),
('player-14', 'player14@easearena.com', 'Player', '14', 'https://images.unsplash.com/photo-1500000000014?w=150&h=150&fit=crop&crop=face', 'player14', '', 'Europe', '', '', '', '2025-08-06 16:09:58.223773', '2025-08-06 16:09:58.223773'),
('player-15', 'player15@easearena.com', 'Player', '15', 'https://images.unsplash.com/photo-1500000000015?w=150&h=150&fit=crop&crop=face', 'player15', '', 'Europe', '', '', '', '2025-08-06 16:09:58.264476', '2025-08-06 16:09:58.264476'),
('player-16', 'player16@easearena.com', 'Player', '16', 'https://images.unsplash.com/photo-1500000000016?w=150&h=150&fit=crop&crop=face', 'player16', '', 'Europe', '', '', '', '2025-08-06 16:09:58.305422', '2025-08-06 16:09:58.305422'),
('player-17', 'player17@easearena.com', 'Player', '17', 'https://images.unsplash.com/photo-1500000000017?w=150&h=150&fit=crop&crop=face', 'player17', '', 'Europe', '', '', '', '2025-08-06 16:09:58.346783', '2025-08-06 16:09:58.346783'),
('player-18', 'player18@easearena.com', 'Player', '18', 'https://images.unsplash.com/photo-1500000000018?w=150&h=150&fit=crop&crop=face', 'player18', '', 'Europe', '', '', '', '2025-08-06 16:09:58.38735', '2025-08-06 16:09:58.38735'),
('player-19', 'player19@easearena.com', 'Player', '19', 'https://images.unsplash.com/photo-1500000000019?w=150&h=150&fit=crop&crop=face', 'player19', '', 'Europe', '', '', '', '2025-08-06 16:09:58.426738', '2025-08-06 16:09:58.426738'),
('player-20', 'player20@easearena.com', 'Player', '20', 'https://images.unsplash.com/photo-1500000000020?w=150&h=150&fit=crop&crop=face', 'player20', '', 'Europe', '', '', '', '2025-08-06 16:09:58.46705', '2025-08-06 16:09:58.46705')
ON CONFLICT (id) DO NOTHING;

-- Insert Games Data
INSERT INTO games (id, name, type, description, image_url, is_active, created_at) VALUES
('game-fifa', 'FIFA', 'fifa', 'The world''s most popular football simulation', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop', true, '2025-08-06 16:19:27.756732'),
('game-cod', 'Call of Duty', 'cod', 'Intense first-person shooter battles', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop', true, '2025-08-06 16:19:27.797766'),
('game-rocket', 'Rocket League', 'rocket_league', 'Soccer meets high-octane driving', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop', true, '2025-08-06 16:19:27.835772'),
('game-valorant', 'Valorant', 'valorant', 'Tactical 5v5 character-based shooter', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=200&fit=crop', true, '2025-08-06 16:19:27.873791')
ON CONFLICT (id) DO NOTHING;

-- Insert Teams Data  
INSERT INTO teams (id, name, description, logo_url, captain_id, region, created_at, updated_at) VALUES
('team-1', 'Ghost Gaming', 'Elite esports team', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 'player-1', 'North America', '2025-08-06 16:19:27.911979', '2025-08-06 16:19:27.911979'),
('team-2', 'Phoenix Squad', 'Rising champions', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 'player-5', 'North America', '2025-08-06 16:19:27.953082', '2025-08-06 16:19:27.953082'),
('team-3', 'Digital Legends', 'European powerhouse', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 'player-11', 'Europe', '2025-08-06 16:19:27.991655', '2025-08-06 16:19:27.991655'),
('team-4', 'Cyber Warriors', 'Tactical masters', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 'player-15', 'Europe', '2025-08-06 16:19:28.029749', '2025-08-06 16:19:28.029749')
ON CONFLICT (id) DO NOTHING;

-- Insert Tournaments Data
INSERT INTO tournaments (id, name, description, format, status, max_participants, current_participants, prize_pool, registration_deadline, start_date, end_date, region, game_title, organized_by, banner_url, rules, stream_url, created_at, updated_at, game_type, entry_fee, requires_approval, is_public, streaming_required) VALUES
('tournament-1', 'EaseArena FIFA Championship', 'The ultimate FIFA tournament featuring top players from around the world', 'single_elimination', 'registration_open', 32, 18, 5000, '2025-08-13 16:19:28.048', '2025-08-16 16:19:28.048', NULL, 'Global', 'FIFA 24', 'admin-user', '', 'Standard FIFA rules apply. No pause abuse. Best of 3 matches in finals.', '', '2025-08-06 16:19:28.069209', '2025-08-06 16:19:28.069209', 'fifa', 25, false, true, false),
('tournament-2', 'Call of Duty: Warzone Showdown', 'Battle royale tournament with teams fighting for supremacy', 'double_elimination', 'in_progress', 16, 16, 2500, '2025-07-30 16:19:28.048', '2025-08-06 16:19:28.048', NULL, 'North America', 'Call of Duty: Warzone', 'admin-user', '', 'Teams of 4. Standard Warzone rules. No teaming with other squads.', '', '2025-08-06 16:19:28.109735', '2025-08-06 16:19:28.109735', 'cod', 10, true, true, true),
('tournament-3', 'Rocket League Pro Series', 'High-octane 3v3 Rocket League competition', 'round_robin', 'completed', 8, 8, 1000, '2025-07-27 16:19:28.048', '2025-07-28 16:19:28.048', '2025-07-30 16:19:28.048', 'Europe', 'Rocket League', 'player-1', '', '3v3 format. All standard tournament rules apply.', '', '2025-08-06 16:19:28.147356', '2025-08-06 16:19:28.147356', 'rocket_league', 5, false, true, false)
ON CONFLICT (id) DO NOTHING;

-- Insert Tournament Participants Data
INSERT INTO tournament_participants (id, tournament_id, user_id, team_id, joined_at) VALUES
('participant-tournament-1-player-1', 'tournament-1', 'player-1', NULL, '2025-08-06 16:19:28.185794'),
('participant-tournament-1-player-2', 'tournament-1', 'player-2', NULL, '2025-08-06 16:19:28.226416'),
('participant-tournament-1-player-3', 'tournament-1', 'player-3', NULL, '2025-08-06 16:19:28.264809'),
('participant-tournament-1-player-4', 'tournament-1', 'player-4', NULL, '2025-08-06 16:19:28.304914'),
('participant-tournament-1-player-5', 'tournament-1', 'player-5', NULL, '2025-08-06 16:19:28.343832'),
('participant-tournament-1-player-6', 'tournament-1', 'player-6', NULL, '2025-08-06 16:19:28.393328'),
('participant-tournament-1-player-7', 'tournament-1', 'player-7', NULL, '2025-08-06 16:19:28.431393'),
('participant-tournament-1-player-8', 'tournament-1', 'player-8', NULL, '2025-08-06 16:19:28.471527'),
('participant-tournament-2-player-1', 'tournament-2', 'player-1', 'team-1', '2025-08-06 16:19:28.510182'),
('participant-tournament-2-player-5', 'tournament-2', 'player-5', 'team-2', '2025-08-06 16:19:28.564791'),
('participant-tournament-2-player-11', 'tournament-2', 'player-11', 'team-3', '2025-08-06 16:19:28.607067'),
('participant-tournament-2-player-15', 'tournament-2', 'player-15', 'team-4', '2025-08-06 16:19:28.645322'),
('participant-tournament-3-player-1', 'tournament-3', 'player-1', 'team-1', '2025-08-06 16:19:28.683721'),
('participant-tournament-3-player-5', 'tournament-3', 'player-5', 'team-2', '2025-08-06 16:19:28.722509')
ON CONFLICT (id) DO NOTHING;

-- Insert Matches Data
INSERT INTO matches (id, tournament_id, round, match_number, participant1_id, participant2_id, winner_id, status, scheduled_at, started_at, completed_at, score1, score2, stream_url, notes, created_at, updated_at) VALUES
('match-1', 'tournament-2', 1, 1, 'participant-tournament-2-player-1', 'participant-tournament-2-player-5', NULL, 'scheduled', NULL, NULL, NULL, 0, 0, '', '', '2025-08-06 16:19:48.292102', '2025-08-06 16:19:48.292102'),
('match-2', 'tournament-2', 1, 2, 'participant-tournament-2-player-11', 'participant-tournament-2-player-15', NULL, 'scheduled', NULL, NULL, NULL, 0, 0, '', '', '2025-08-06 16:19:48.344386', '2025-08-06 16:19:48.344386')
ON CONFLICT (id) DO NOTHING;

-- Insert User Stats Data
INSERT INTO user_stats (id, user_id, game_id, total_matches, matches_won, matches_lost, matches_draw, win_rate, ranking, win_points, participation_points, total_points, updated_at) VALUES
('stats-player-1-game-fifa', 'player-1', 'game-fifa', 45, 32, 13, 0, 71, NULL, 320, 225, 545, '2025-08-06 16:19:48.391136'),
('stats-player-2-game-fifa', 'player-2', 'game-fifa', 38, 22, 16, 0, 58, NULL, 220, 190, 410, '2025-08-06 16:19:48.435421'),
('stats-player-5-game-cod', 'player-5', 'game-cod', 52, 35, 17, 0, 67, NULL, 350, 260, 610, '2025-08-06 16:19:48.476075'),
('stats-player-11-game-rocket', 'player-11', 'game-rocket', 29, 18, 11, 0, 62, NULL, 180, 145, 325, '2025-08-06 16:19:48.516466')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_game_type ON tournaments(game_type);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id);

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO easearena_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO easearena_user;

-- Database export complete
-- Total records:
-- Users: 21 (including your real account: 41940142)
-- Games: 4 (FIFA, Call of Duty, Rocket League, Valorant)
-- Teams: 4 (Ghost Gaming, Phoenix Squad, Digital Legends, Cyber Warriors)
-- Tournaments: 3 (FIFA Championship, COD Showdown, Rocket League Pro Series)
-- Tournament Participants: 14
-- Matches: 2
-- User Stats: 4 player performance records