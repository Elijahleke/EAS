import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle } from "lucide-react";

interface ChatProps {
  tournamentId: string;
}

interface ChatMessage {
  message: {
    id: string;
    message: string;
    createdAt: string;
  };
  user: {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };
}

export default function Chat({ tournamentId }: ChatProps) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/tournaments", tournamentId, "chat"],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time feel
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      await apiRequest("POST", `/api/tournaments/${tournamentId}/chat`, {
        message: message.trim(),
      });
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({
        queryKey: ["/api/tournaments", tournamentId, "chat"],
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isAuthenticated) return;
    sendMessageMutation.mutate(newMessage);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserDisplayName = (user: ChatMessage['user']) => {
    return user.username || `${user.firstName} ${user.lastName}`.trim() || 'Anonymous';
  };

  const getUserInitials = (user: ChatMessage['user']) => {
    if (user.username) return user.username[0]?.toUpperCase();
    if (user.firstName) return user.firstName[0]?.toUpperCase();
    return 'U';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="tournament-card h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>Tournament Chat</span>
          <span className="text-sm font-normal text-gaming-dark-400">
            ({messages.length} messages)
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4" data-testid="chat-messages">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="text-gaming-dark-400">Loading messages...</div>
            </div>
          ) : messages.length > 0 ? (
            messages.map((chatMessage: ChatMessage) => (
              <div 
                key={chatMessage.message.id} 
                className="flex items-start space-x-3"
                data-testid={`chat-message-${chatMessage.message.id}`}
              >
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  {chatMessage.user.profileImageUrl ? (
                    <img 
                      src={chatMessage.user.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full rounded object-cover"
                    />
                  ) : (
                    <span className="text-white text-xs font-medium">
                      {getUserInitials(chatMessage.user)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span 
                      className="text-primary text-sm font-medium"
                      data-testid={`chat-username-${chatMessage.message.id}`}
                    >
                      {getUserDisplayName(chatMessage.user)}
                    </span>
                    <span className="text-gaming-dark-500 text-xs">
                      {formatTime(chatMessage.message.createdAt)}
                    </span>
                  </div>
                  <p 
                    className="text-gaming-dark-200 text-sm break-words"
                    data-testid={`chat-message-text-${chatMessage.message.id}`}
                  >
                    {chatMessage.message.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gaming-dark-400 mx-auto mb-3" />
              <p className="text-gaming-dark-400 text-sm" data-testid="text-no-messages">
                No messages yet. Be the first to start the conversation!
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
              maxLength={500}
              data-testid="input-chat-message"
            />
            <Button 
              type="submit"
              size="sm"
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className="gaming-button px-3"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 border-t border-gaming-dark-700">
            <p className="text-gaming-dark-400 text-sm mb-2">
              Please log in to join the conversation
            </p>
            <Button 
              size="sm" 
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login-to-chat"
            >
              Login to Chat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
