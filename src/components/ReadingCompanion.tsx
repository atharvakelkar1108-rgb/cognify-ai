import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ReadingCompanionProps {
  text: string;
}

const QUICK_QUESTIONS = [
  "Explain this like I'm 10",
  "What is the main idea?",
  "Give me an example",
  "What are key points?",
];

const ReadingCompanion = ({ text }: ReadingCompanionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const askQuestion = async (question: string) => {
    if (!question.trim()) return;
    if (!text.trim()) {
      toast.error('No text to ask about!');
      return;
    }

    const userMessage = { role: 'user' as const, content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, question }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer
      }]);
    } catch {
      toast.error('Failed to get answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full"
        variant="outline"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Ask AI Companion 🤖
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">AI Reading Companion</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {/* Quick questions */}
      <div className="flex flex-wrap gap-1">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => askQuestion(q)}
            disabled={isLoading}
            className="text-xs px-2 py-1 rounded-full bg-accent hover:bg-accent/80 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <Bot className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              )}
              <div className={`rounded-lg px-3 py-2 max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 text-sm">
              <Bot className="h-4 w-4 text-primary mt-0.5" />
              <div className="bg-accent rounded-lg px-3 py-2 text-accent-foreground animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askQuestion(input)}
          placeholder="Ask anything about the text..."
          disabled={isLoading}
          className="flex-1 text-sm rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button
          size="icon"
          onClick={() => askQuestion(input)}
          disabled={isLoading || !input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReadingCompanion;