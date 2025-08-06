# EaseArena

## Overview

EaseArena is a modern tournament management and esports platform built for competitive gaming communities. The application provides comprehensive tournament creation and management capabilities, team organization, live streaming integration, and real-time communication features. Built as a full-stack web application, it supports user authentication, tournament brackets, match scheduling, and community features like chat and forums.

## User Preferences

Preferred communication style: Simple, everyday language.

## Business Context
- Domain: easearena.com (already owned)
- Social Media: @easeArena on X, TikTok, Instagram, Twitch; @easearena1 on YouTube
- Competition targets: BracketHQ, Battlefy, Challonge, Toornament, TourneyMachine, VirtualProGaming
- Goal: Build a comprehensive multi-sport tournament platform to supersede existing competitors

## System Architecture

### Frontend Architecture
The client-side is built with React and TypeScript, utilizing a modern component-based architecture:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: TailwindCSS with a custom gaming-themed design system using shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Component Library**: Comprehensive UI components using Radix UI primitives

The frontend follows a page-based routing structure with dedicated pages for tournaments, teams, user profiles, and tournament details. Authentication state is managed globally with automatic redirects for protected routes.

### Backend Architecture
The server-side implements a RESTful API using Express.js:

- **Framework**: Node.js with Express.js for HTTP server functionality
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with session-based authentication
- **API Structure**: Modular route handlers with proper error handling and logging middleware
- **Session Management**: PostgreSQL-backed session storage using connect-pg-simple

The backend follows a storage abstraction pattern where database operations are encapsulated in a storage interface, making the codebase more maintainable and testable.

### Database Design
PostgreSQL database with comprehensive schema for esports platform features:

- **User Management**: Complete user profiles with gaming-specific fields (Twitch, Discord, regions)
- **Tournament System**: Flexible tournament structure supporting multiple formats (single/double elimination, round-robin)
- **Team Organization**: Team creation, membership management, and hierarchical structures
- **Match Management**: Match scheduling, scoring, and bracket progression
- **Communication**: Chat system for tournaments and general messaging
- **Statistics Tracking**: User performance metrics and tournament history

The schema uses proper relationships and constraints to maintain data integrity while supporting complex tournament bracket logic.

### Authentication & Authorization
Session-based authentication system integrated with Replit's OAuth service:

- **Session Storage**: PostgreSQL-backed sessions with automatic cleanup
- **User Management**: Automatic user creation/updates on login
- **Protected Routes**: Middleware-based route protection with automatic redirects
- **Profile Management**: Support for multiple OAuth providers (Google, Discord, Twitch planned)

### Real-time Features
While WebSocket implementation is prepared for, the current architecture supports real-time-like features through:

- **Polling-based Updates**: Tournament chat refreshes every 5 seconds
- **Optimistic Updates**: Immediate UI feedback with server synchronization
- **Live Tournament Status**: Real-time tournament state management

### Development & Deployment
The application is configured for both development and production environments:

- **Build System**: Vite for frontend bundling with hot module replacement
- **Development Tools**: TypeScript strict mode, ESLint integration, and development error overlays
- **Production Build**: Optimized builds with proper asset handling and server-side rendering preparation
- **Database Migrations**: Drizzle Kit for schema management and database migrations

## External Dependencies

### Database & Storage
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL for scalable data storage
- **Drizzle ORM**: Type-safe database operations with automatic migration support

### Authentication Services
- **Replit Auth**: Primary authentication provider with OAuth integration
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Frontend Libraries
- **React Ecosystem**: React 18 with TypeScript, TanStack Query for data fetching
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **Styling**: TailwindCSS with custom gaming theme variables
- **Forms**: React Hook Form with Zod schema validation

### Development Tools
- **Build Tools**: Vite for development and production builds
- **TypeScript**: Strict type checking across the entire codebase
- **Development Integrations**: Replit-specific development plugins for enhanced debugging

### Planned Integrations
- **Streaming Platforms**: Twitch and YouTube API integration for live stream embedding
- **Real-time Communication**: WebSocket implementation for instant messaging and live updates
- **Payment Processing**: Prize pool and tournament fee handling
- **AI Services**: Match analysis and player performance insights