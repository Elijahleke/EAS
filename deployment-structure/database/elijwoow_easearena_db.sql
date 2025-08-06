-- EaseArena MySQL Database Export for phpMyAdmin
-- Database: elijwoow_easearena_db
-- Generated: 2025-08-06

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Create database
CREATE DATABASE IF NOT EXISTS `elijwoow_easearena_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `elijwoow_easearena_db`;

-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `bio` text,
  `region` varchar(100) DEFAULT NULL,
  `twitch_url` varchar(255) DEFAULT NULL,
  `youtube_url` varchar(255) DEFAULT NULL,
  `discord_tag` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `profile_image_url`, `username`, `bio`, `region`, `twitch_url`, `youtube_url`, `discord_tag`, `created_at`, `updated_at`) VALUES
('admin-user', 'admin@easearena.com', 'Admin', 'User', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'admin', '', 'North America', '', '', '', '2025-08-06 16:09:57', '2025-08-06 16:09:57'),
('player-1', 'player1@easearena.com', 'Player', '1', 'https://images.unsplash.com/photo-1500000000001?w=150&h=150&fit=crop&crop=face', 'player1', '', 'North America', '', '', '', '2025-08-06 16:09:57', '2025-08-06 16:09:57'),
('player-2', 'player2@easearena.com', 'Player', '2', 'https://images.unsplash.com/photo-1500000000002?w=150&h=150&fit=crop&crop=face', 'player2', '', 'North America', '', '', '', '2025-08-06 16:09:57', '2025-08-06 16:09:57'),
('player-3', 'player3@easearena.com', 'Player', '3', 'https://images.unsplash.com/photo-1500000000003?w=150&h=150&fit=crop&crop=face', 'player3', '', 'North America', '', '', '', '2025-08-06 16:09:57', '2025-08-06 16:09:57'),
('player-4', 'player4@easearena.com', 'Player', '4', 'https://images.unsplash.com/photo-1500000000004?w=150&h=150&fit=crop&crop=face', 'player4', '', 'North America', '', '', '', '2025-08-06 16:09:57', '2025-08-06 16:09:57'),
('player-5', 'player5@easearena.com', 'Player', '5', 'https://images.unsplash.com/photo-1500000000005?w=150&h=150&fit=crop&crop=face', 'player5', '', 'North America', '', '', '', '2025-08-06 16:09:57', '2025-08-06 16:09:57'),
('player-6', 'player6@easearena.com', 'Player', '6', 'https://images.unsplash.com/photo-1500000000006?w=150&h=150&fit=crop&crop=face', 'player6', '', 'North America', '', '', '', '2025-08-06 16:09:57', '2025-08-06 16:09:57'),
('player-7', 'player7@easearena.com', 'Player', '7', 'https://images.unsplash.com/photo-1500000000007?w=150&h=150&fit=crop&crop=face', 'player7', '', 'North America', '', '', '', '2025-08-06 16:09:57', '2025-08-06 16:09:57'),
('player-8', 'player8@easearena.com', 'Player', '8', 'https://images.unsplash.com/photo-1500000000008?w=150&h=150&fit=crop&crop=face', 'player8', '', 'North America', '', '', '', '2025-08-06 16:09:57', '2025-08-06 16:09:57'),
('player-9', 'player9@easearena.com', 'Player', '9', 'https://images.unsplash.com/photo-1500000000009?w=150&h=150&fit=crop&crop=face', 'player9', '', 'North America', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-10', 'player10@easearena.com', 'Player', '10', 'https://images.unsplash.com/photo-1500000000010?w=150&h=150&fit=crop&crop=face', 'player10', '', 'North America', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-11', 'player11@easearena.com', 'Player', '11', 'https://images.unsplash.com/photo-1500000000011?w=150&h=150&fit=crop&crop=face', 'player11', '', 'Europe', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-12', 'player12@easearena.com', 'Player', '12', 'https://images.unsplash.com/photo-1500000000012?w=150&h=150&fit=crop&crop=face', 'player12', '', 'Europe', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-13', 'player13@easearena.com', 'Player', '13', 'https://images.unsplash.com/photo-1500000000013?w=150&h=150&fit=crop&crop=face', 'player13', '', 'Europe', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-14', 'player14@easearena.com', 'Player', '14', 'https://images.unsplash.com/photo-1500000000014?w=150&h=150&fit=crop&crop=face', 'player14', '', 'Europe', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-15', 'player15@easearena.com', 'Player', '15', 'https://images.unsplash.com/photo-1500000000015?w=150&h=150&fit=crop&crop=face', 'player15', '', 'Europe', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-16', 'player16@easearena.com', 'Player', '16', 'https://images.unsplash.com/photo-1500000000016?w=150&h=150&fit=crop&crop=face', 'player16', '', 'Europe', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-17', 'player17@easearena.com', 'Player', '17', 'https://images.unsplash.com/photo-1500000000017?w=150&h=150&fit=crop&crop=face', 'player17', '', 'Europe', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-18', 'player18@easearena.com', 'Player', '18', 'https://images.unsplash.com/photo-1500000000018?w=150&h=150&fit=crop&crop=face', 'player18', '', 'Europe', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-19', 'player19@easearena.com', 'Player', '19', 'https://images.unsplash.com/photo-1500000000019?w=150&h=150&fit=crop&crop=face', 'player19', '', 'Europe', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58'),
('player-20', 'player20@easearena.com', 'Player', '20', 'https://images.unsplash.com/photo-1500000000020?w=150&h=150&fit=crop&crop=face', 'player20', '', 'Europe', '', '', '', '2025-08-06 16:09:58', '2025-08-06 16:09:58');

-- Table structure for table `sessions`
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `sid` varchar(255) NOT NULL,
  `sess` json NOT NULL,
  `expire` timestamp NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `IDX_session_expire` (`expire`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table `games`
DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `games`
INSERT INTO `games` (`id`, `name`, `type`, `description`, `image_url`, `is_active`, `created_at`) VALUES
('game-fifa', 'FIFA', 'fifa', 'The world\'s most popular football simulation', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop', 1, '2025-08-06 16:19:27'),
('game-cod', 'Call of Duty', 'cod', 'Intense first-person shooter battles', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop', 1, '2025-08-06 16:19:27'),
('game-rocket', 'Rocket League', 'rocket_league', 'Soccer meets high-octane driving', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop', 1, '2025-08-06 16:19:27'),
('game-valorant', 'Valorant', 'valorant', 'Tactical 5v5 character-based shooter', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=200&fit=crop', 1, '2025-08-06 16:19:27');

-- Table structure for table `teams`
DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `logo_url` varchar(255) DEFAULT NULL,
  `captain_id` varchar(255) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `captain_id` (`captain_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `teams`
INSERT INTO `teams` (`id`, `name`, `description`, `logo_url`, `captain_id`, `region`, `created_at`, `updated_at`) VALUES
('team-1', 'Ghost Gaming', 'Elite esports team', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 'player-1', 'North America', '2025-08-06 16:19:27', '2025-08-06 16:19:27'),
('team-2', 'Phoenix Squad', 'Rising champions', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 'player-5', 'North America', '2025-08-06 16:19:27', '2025-08-06 16:19:27'),
('team-3', 'Digital Legends', 'European powerhouse', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 'player-11', 'Europe', '2025-08-06 16:19:27', '2025-08-06 16:19:27'),
('team-4', 'Cyber Warriors', 'Tactical masters', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 'player-15', 'Europe', '2025-08-06 16:19:28', '2025-08-06 16:19:28');

-- Table structure for table `tournaments`
DROP TABLE IF EXISTS `tournaments`;
CREATE TABLE `tournaments` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `format` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT 'registration_open',
  `max_participants` int NOT NULL,
  `current_participants` int DEFAULT 0,
  `prize_pool` decimal(10,2) DEFAULT 0.00,
  `registration_deadline` timestamp NULL DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `game_title` varchar(255) DEFAULT NULL,
  `organized_by` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `rules` text,
  `stream_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `game_type` varchar(50) DEFAULT NULL,
  `entry_fee` decimal(10,2) DEFAULT 0.00,
  `requires_approval` tinyint(1) DEFAULT 0,
  `is_public` tinyint(1) DEFAULT 1,
  `streaming_required` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `organized_by` (`organized_by`),
  KEY `idx_tournaments_status` (`status`),
  KEY `idx_tournaments_game_type` (`game_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `tournaments`
INSERT INTO `tournaments` (`id`, `name`, `description`, `format`, `status`, `max_participants`, `current_participants`, `prize_pool`, `registration_deadline`, `start_date`, `end_date`, `region`, `game_title`, `organized_by`, `banner_url`, `rules`, `stream_url`, `created_at`, `updated_at`, `game_type`, `entry_fee`, `requires_approval`, `is_public`, `streaming_required`) VALUES
('tournament-1', 'EaseArena FIFA Championship', 'The ultimate FIFA tournament featuring top players from around the world', 'single_elimination', 'registration_open', 32, 18, 5000.00, '2025-08-13 16:19:28', '2025-08-16 16:19:28', NULL, 'Global', 'FIFA 24', 'admin-user', '', 'Standard FIFA rules apply. No pause abuse. Best of 3 matches in finals.', '', '2025-08-06 16:19:28', '2025-08-06 16:19:28', 'fifa', 25.00, 0, 1, 0),
('tournament-2', 'Call of Duty: Warzone Showdown', 'Battle royale tournament with teams fighting for supremacy', 'double_elimination', 'in_progress', 16, 16, 2500.00, '2025-07-30 16:19:28', '2025-08-06 16:19:28', NULL, 'North America', 'Call of Duty: Warzone', 'admin-user', '', 'Teams of 4. Standard Warzone rules. No teaming with other squads.', '', '2025-08-06 16:19:28', '2025-08-06 16:19:28', 'cod', 10.00, 1, 1, 1),
('tournament-3', 'Rocket League Pro Series', 'High-octane 3v3 Rocket League competition', 'round_robin', 'completed', 8, 8, 1000.00, '2025-07-27 16:19:28', '2025-07-28 16:19:28', '2025-07-30 16:19:28', 'Europe', 'Rocket League', 'player-1', '', '3v3 format. All standard tournament rules apply.', '', '2025-08-06 16:19:28', '2025-08-06 16:19:28', 'rocket_league', 5.00, 0, 1, 0);

-- Table structure for table `tournament_participants`
DROP TABLE IF EXISTS `tournament_participants`;
CREATE TABLE `tournament_participants` (
  `id` varchar(255) NOT NULL,
  `tournament_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `team_id` varchar(255) DEFAULT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tournament_id` (`tournament_id`),
  KEY `user_id` (`user_id`),
  KEY `team_id` (`team_id`),
  KEY `idx_participants_tournament` (`tournament_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `tournament_participants`
INSERT INTO `tournament_participants` (`id`, `tournament_id`, `user_id`, `team_id`, `joined_at`) VALUES
('participant-tournament-1-player-1', 'tournament-1', 'player-1', NULL, '2025-08-06 16:19:28'),
('participant-tournament-1-player-2', 'tournament-1', 'player-2', NULL, '2025-08-06 16:19:28'),
('participant-tournament-1-player-3', 'tournament-1', 'player-3', NULL, '2025-08-06 16:19:28'),
('participant-tournament-1-player-4', 'tournament-1', 'player-4', NULL, '2025-08-06 16:19:28'),
('participant-tournament-1-player-5', 'tournament-1', 'player-5', NULL, '2025-08-06 16:19:28'),
('participant-tournament-1-player-6', 'tournament-1', 'player-6', NULL, '2025-08-06 16:19:28'),
('participant-tournament-1-player-7', 'tournament-1', 'player-7', NULL, '2025-08-06 16:19:28'),
('participant-tournament-1-player-8', 'tournament-1', 'player-8', NULL, '2025-08-06 16:19:28'),
('participant-tournament-2-player-1', 'tournament-2', 'player-1', 'team-1', '2025-08-06 16:19:28'),
('participant-tournament-2-player-5', 'tournament-2', 'player-5', 'team-2', '2025-08-06 16:19:28'),
('participant-tournament-2-player-11', 'tournament-2', 'player-11', 'team-3', '2025-08-06 16:19:28'),
('participant-tournament-2-player-15', 'tournament-2', 'player-15', 'team-4', '2025-08-06 16:19:28'),
('participant-tournament-3-player-1', 'tournament-3', 'player-1', 'team-1', '2025-08-06 16:19:28'),
('participant-tournament-3-player-5', 'tournament-3', 'player-5', 'team-2', '2025-08-06 16:19:28');

-- Table structure for table `team_members`
DROP TABLE IF EXISTS `team_members`;
CREATE TABLE `team_members` (
  `id` varchar(255) NOT NULL,
  `team_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'member',
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_team_members_team` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table `matches`
DROP TABLE IF EXISTS `matches`;
CREATE TABLE `matches` (
  `id` varchar(255) NOT NULL,
  `tournament_id` varchar(255) DEFAULT NULL,
  `round` int NOT NULL,
  `match_number` int NOT NULL,
  `participant1_id` varchar(255) DEFAULT NULL,
  `participant2_id` varchar(255) DEFAULT NULL,
  `winner_id` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'scheduled',
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `score1` int DEFAULT 0,
  `score2` int DEFAULT 0,
  `stream_url` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tournament_id` (`tournament_id`),
  KEY `participant1_id` (`participant1_id`),
  KEY `participant2_id` (`participant2_id`),
  KEY `winner_id` (`winner_id`),
  KEY `idx_matches_tournament` (`tournament_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `matches`
INSERT INTO `matches` (`id`, `tournament_id`, `round`, `match_number`, `participant1_id`, `participant2_id`, `winner_id`, `status`, `scheduled_at`, `started_at`, `completed_at`, `score1`, `score2`, `stream_url`, `notes`, `created_at`, `updated_at`) VALUES
('match-1', 'tournament-2', 1, 1, 'participant-tournament-2-player-1', 'participant-tournament-2-player-5', NULL, 'scheduled', NULL, NULL, NULL, 0, 0, '', '', '2025-08-06 16:19:48', '2025-08-06 16:19:48'),
('match-2', 'tournament-2', 1, 2, 'participant-tournament-2-player-11', 'participant-tournament-2-player-15', NULL, 'scheduled', NULL, NULL, NULL, 0, 0, '', '', '2025-08-06 16:19:48', '2025-08-06 16:19:48');

-- Table structure for table `user_stats`
DROP TABLE IF EXISTS `user_stats`;
CREATE TABLE `user_stats` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `game_id` varchar(255) DEFAULT NULL,
  `total_matches` int DEFAULT 0,
  `matches_won` int DEFAULT 0,
  `matches_lost` int DEFAULT 0,
  `matches_draw` int DEFAULT 0,
  `win_rate` int DEFAULT 0,
  `ranking` int DEFAULT NULL,
  `win_points` int DEFAULT 0,
  `participation_points` int DEFAULT 0,
  `total_points` int DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_game_unique` (`user_id`,`game_id`),
  KEY `user_id` (`user_id`),
  KEY `game_id` (`game_id`),
  KEY `idx_user_stats_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table `user_stats`
INSERT INTO `user_stats` (`id`, `user_id`, `game_id`, `total_matches`, `matches_won`, `matches_lost`, `matches_draw`, `win_rate`, `ranking`, `win_points`, `participation_points`, `total_points`, `updated_at`) VALUES
('stats-player-1-game-fifa', 'player-1', 'game-fifa', 45, 32, 13, 0, 71, NULL, 320, 225, 545, '2025-08-06 16:19:48'),
('stats-player-2-game-fifa', 'player-2', 'game-fifa', 38, 22, 16, 0, 58, NULL, 220, 190, 410, '2025-08-06 16:19:48'),
('stats-player-5-game-cod', 'player-5', 'game-cod', 52, 35, 17, 0, 67, NULL, 350, 260, 610, '2025-08-06 16:19:48'),
('stats-player-11-game-rocket', 'player-11', 'game-rocket', 29, 18, 11, 0, 62, NULL, 180, 145, 325, '2025-08-06 16:19:48');

-- Table structure for table `chat_messages`
DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` varchar(255) NOT NULL,
  `tournament_id` varchar(255) DEFAULT NULL,
  `match_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tournament_id` (`tournament_id`),
  KEY `match_id` (`match_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add foreign key constraints
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`captain_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `tournaments`
  ADD CONSTRAINT `tournaments_ibfk_1` FOREIGN KEY (`organized_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `tournament_participants`
  ADD CONSTRAINT `tournament_participants_ibfk_1` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tournament_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tournament_participants_ibfk_3` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE SET NULL;

ALTER TABLE `team_members`
  ADD CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `matches`
  ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`participant1_id`) REFERENCES `tournament_participants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `matches_ibfk_3` FOREIGN KEY (`participant2_id`) REFERENCES `tournament_participants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `matches_ibfk_4` FOREIGN KEY (`winner_id`) REFERENCES `tournament_participants` (`id`) ON DELETE SET NULL;

ALTER TABLE `user_stats`
  ADD CONSTRAINT `user_stats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_stats_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;