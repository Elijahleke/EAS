-- EaseArena Database Setup for cPanel
-- Run these SQL commands in your cPanel PostgreSQL or through phpPgAdmin

-- Create database (if not already created through cPanel interface)
-- CREATE DATABASE easearena_db;

-- Connect to your database and run these table creation commands:

-- Users table (required for authentication)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table (required for authentication)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR(255) PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Games table
CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    captain_id VARCHAR(255) REFERENCES users(id),
    logo_url VARCHAR(255),
    max_members INTEGER DEFAULT 5,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    game_type VARCHAR(50) NOT NULL,
    format VARCHAR(50) NOT NULL,
    max_participants INTEGER NOT NULL,
    prize_pool DECIMAL(10,2) DEFAULT 0,
    entry_fee DECIMAL(10,2) DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    registration_deadline TIMESTAMP,
    status VARCHAR(50) DEFAULT 'open',
    organized_by VARCHAR(255) REFERENCES users(id),
    rules TEXT,
    stream_url VARCHAR(255),
    banner_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournament participants table
CREATE TABLE IF NOT EXISTS tournament_participants (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id VARCHAR(255) REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id),
    team_id VARCHAR(255) REFERENCES teams(id),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'registered'
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id VARCHAR(255) REFERENCES teams(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id VARCHAR(255) REFERENCES tournaments(id) ON DELETE CASCADE,
    participant1_id VARCHAR(255) REFERENCES tournament_participants(id),
    participant2_id VARCHAR(255) REFERENCES tournament_participants(id),
    round INTEGER NOT NULL,
    match_number INTEGER NOT NULL,
    bracket VARCHAR(50) DEFAULT 'winners',
    scheduled_for TIMESTAMP,
    score1 INTEGER DEFAULT 0,
    score2 INTEGER DEFAULT 0,
    winner_id VARCHAR(255) REFERENCES tournament_participants(id),
    status VARCHAR(50) DEFAULT 'scheduled',
    stream_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id VARCHAR(255) REFERENCES tournaments(id) ON DELETE CASCADE,
    match_id VARCHAR(255) REFERENCES matches(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User statistics table
CREATE TABLE IF NOT EXISTS user_stats (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) REFERENCES users(id),
    game_id VARCHAR(255) REFERENCES games(id),
    total_matches INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    matches_lost INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0,
    win_points INTEGER DEFAULT 0,
    participation_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id)
);

-- Insert sample games
INSERT INTO games (id, name, type, description, is_active) VALUES 
('game-fifa', 'FIFA 24', 'sports', 'The worlds most popular football simulation game', true),
('game-cod', 'Call of Duty', 'fps', 'First-person shooter battle royale and multiplayer', true),
('game-rocket', 'Rocket League', 'sports', 'Soccer meets racing in this physics-based game', true),
('game-valorant', 'Valorant', 'fps', 'Tactical 5v5 character-based shooter', true)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_game_type ON tournaments(game_type);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_chat_tournament ON chat_messages(tournament_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id);

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO easearena_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO easearena_user;