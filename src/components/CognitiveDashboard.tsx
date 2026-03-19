import { useState, useEffect } from 'react';
import { Brain, TrendingUp, Clock, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';

interface DashboardProps {
  text: string;
  difficultParagraphs: number[];
  totalParagraphs: number;
  simplifiedCount: number;
  quizScore?: { score: number; total: number } | null;
}

const CognitiveDashboard = ({
  text,
  difficultParagraphs,
  totalParagraphs,
  simplifiedCount,
  quizScore
}: DashboardProps) => {
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const wordCount = text.split(/\s+/).filter(w => w.trim()).length;
  const readingSpeed = readingTime > 0 ? Math.round((wordCount / readingTime) * 60) : 0;
  const difficultyPercentage = totalParagraphs > 0
    ? Math.round((difficultParagraphs.length / totalParagraphs) * 100)
    : 0;
  const comprehensionScore = quizScore
    ? Math.round((quizScore.score / quizScore.total) * 100)
    : null;

  const focusScore = Math.max(0, 100
    - (difficultyPercentage * 0.5)
    - (simplifiedCount * 2)
  );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Cognitive Dashboard</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">

        {/* Reading Time */}
        <div className="rounded-lg bg-accent/50 p-3 space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Reading Time
          </div>
          <div className="text-xl font-bold text-foreground">
            {formatTime(readingTime)}
          </div>
        </div>

        {/* Reading Speed */}
        <div className="rounded-lg bg-accent/50 p-3 space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            Speed (WPM)
          </div>
          <div className="text-xl font-bold text-foreground">
            {readingSpeed}
          </div>
        </div>

        {/* Focus Score */}
        <div className="rounded-lg bg-accent/50 p-3 space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart2 className="h-3 w-3" />
            Focus Score
          </div>
          <div className={`text-xl font-bold ${getScoreColor(focusScore)}`}>
            {Math.round(focusScore)}%
          </div>
          <div className={`text-xs ${getScoreColor(focusScore)}`}>
            {getScoreLabel(focusScore)}
          </div>
        </div>

        {/* Difficulty */}
        <div className="rounded-lg bg-accent/50 p-3 space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <AlertTriangle className="h-3 w-3" />
            Difficulty
          </div>
          <div className={`text-xl font-bold ${getScoreColor(100 - difficultyPercentage)}`}>
            {difficultyPercentage}%
          </div>
          <div className="text-xs text-muted-foreground">
            {difficultParagraphs.length}/{totalParagraphs} paragraphs
          </div>
        </div>
      </div>

      {/* Comprehension Score from Quiz */}
      {comprehensionScore !== null && (
        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Comprehension</span>
            </div>
            <span className={`text-lg font-bold ${getScoreColor(comprehensionScore)}`}>
              {comprehensionScore}%
            </span>
          </div>
          <div className="mt-2 w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${comprehensionScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Simplified paragraphs */}
      <div className="text-xs text-muted-foreground border-t border-border pt-3 space-y-1">
        <div className="flex justify-between">
          <span>Words in text</span>
          <span className="font-medium">{wordCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Paragraphs simplified</span>
          <span className="font-medium">{simplifiedCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Difficult sections</span>
          <span className="font-medium text-red-500">{difficultParagraphs.length}</span>
        </div>
      </div>

      {/* ADHD/Dyslexia tip */}
      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          {difficultyPercentage > 50
            ? "💡 Many difficult sections detected. Try switching to Easy simplification mode."
            : focusScore < 50
            ? "💡 Focus seems low. Try enabling Focus Mode in settings."
            : "✅ You're reading well! Keep going."}
        </p>
      </div>
    </div>
  );
};

export default CognitiveDashboard;