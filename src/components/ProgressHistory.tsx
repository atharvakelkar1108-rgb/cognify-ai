import { useState, useEffect } from 'react';
import { TrendingUp, Clock, BookOpen, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Session {
  id: number;
  timestamp: string;
  text_preview: string;
  duration_seconds: number;
  difficult_count: number;
  total_paragraphs: number;
  simplified_count: number;
  quiz_score: number;
  quiz_total: number;
  focus_score: number;
}

const ProgressHistory = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/history/user123');
      const data = await response.json();
      setSessions(data.sessions.reverse());
    } catch {
      console.error('Failed to fetch history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  const avgFocusScore = sessions.length > 0
    ? Math.round(sessions.reduce((a, b) => a + b.focus_score, 0) / sessions.length)
    : 0;

  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((a, b) => a + b.duration_seconds, 0);

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Header */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Progress History</h3>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <>
          {/* Summary stats */}
          {sessions.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-accent/50 p-2 text-center">
                <div className="text-lg font-bold text-primary">{totalSessions}</div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
              <div className="rounded-lg bg-accent/50 p-2 text-center">
                <div className="text-lg font-bold text-primary">{avgFocusScore}%</div>
                <div className="text-xs text-muted-foreground">Avg Focus</div>
              </div>
              <div className="rounded-lg bg-accent/50 p-2 text-center">
                <div className="text-lg font-bold text-primary">{formatTime(totalTime)}</div>
                <div className="text-xs text-muted-foreground">Total Time</div>
              </div>
            </div>
          )}

          {/* Sessions list */}
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              Loading history...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No sessions yet! Start reading to track progress 📚
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-lg border border-border p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(session.timestamp)}
                    </span>
                    <span className={`text-xs font-medium ${
                      session.focus_score >= 70 ? 'text-green-500' :
                      session.focus_score >= 40 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      Focus: {session.focus_score}%
                    </span>
                  </div>
                  <p className="text-xs text-foreground truncate">
                    "{session.text_preview}..."
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(session.duration_seconds)}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {session.difficult_count} difficult
                    </span>
                    {session.quiz_total > 0 && (
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {session.quiz_score}/{session.quiz_total}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressHistory;