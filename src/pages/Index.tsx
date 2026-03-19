import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import TextInputPanel from '@/components/TextInputPanel';
import ControlPanel from '@/components/ControlPanel';
import ReadingView from '@/components/ReadingView';
import BehaviorPanel from '@/components/BehaviorPanel';
import QuizPanel from '@/components/QuizPanel';
import CognitiveDashboard from '@/components/CognitiveDashboard';
import TextToSpeech from '@/components/TextToSpeech';
import ReadingCompanion from '@/components/ReadingCompanion';
import ProgressHistory from '@/components/ProgressHistory';
import { ReadingSettings, DEFAULT_SETTINGS } from '@/types/reading';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Flame } from 'lucide-react';

const Index = () => {
  const [text, setText] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [difficultParagraphs, setDifficultParagraphs] = useState<number[]>([]);
  const [simplifiedCount, setSimplifiedCount] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const paragraphCount = text.split(/\n\s*\n/).filter((p) => p.trim()).length;

  const saveSession = useCallback(async () => {
    if (!text.trim()) return;
    try {
      await fetch('/api/history/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user123',
          text_preview: text.substring(0, 100),
          duration_seconds: 60,
          difficult_count: difficultParagraphs.length,
          total_paragraphs: paragraphCount,
          simplified_count: simplifiedCount,
          quiz_score: 0,
          quiz_total: 0,
        }),
      });
    } catch {
      console.error('Failed to save session');
    }
  }, [text, difficultParagraphs, simplifiedCount, paragraphCount]);

  const handleTextSubmit = useCallback((t: string) => {
    setText(t);
    setIsReading(true);
    setDifficultParagraphs([]);
    setSimplifiedCount(0);
    setShowHeatmap(false);
  }, []);

  const handleBack = useCallback(() => {
    saveSession();
    setIsReading(false);
    setDifficultParagraphs([]);
    setSimplifiedCount(0);
    setShowHeatmap(false);
  }, [saveSession]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8 max-w-7xl">
        {!isReading ? (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Read with clarity
              </h2>
              <p className="text-muted-foreground text-lg">
                Paste your text below. Cognify adapts to how you read and highlights what's difficult.
              </p>
            </div>
            <ProgressHistory />
            <div className="mt-6">
              <TextInputPanel onTextSubmit={handleTextSubmit} />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Top bar */}
            <div className="mb-6 flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to input
              </Button>
              <Button
                variant={showHeatmap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowHeatmap(prev => !prev)}
              >
                <Flame className="h-4 w-4 mr-2" />
                {showHeatmap ? 'Hide Heatmap 🔥' : 'Show Heatmap'}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              <ReadingView
                text={text}
                settings={settings}
                onBehaviorUpdate={setDifficultParagraphs}
                showHeatmap={showHeatmap}
              />
              <aside className="space-y-6">
                <ControlPanel settings={settings} onChange={setSettings} />
                <CognitiveDashboard
                  text={text}
                  difficultParagraphs={difficultParagraphs}
                  totalParagraphs={paragraphCount}
                  simplifiedCount={simplifiedCount}
                  quizScore={null}
                />
                <BehaviorPanel
                  difficultParagraphs={difficultParagraphs}
                  totalParagraphs={paragraphCount}
                />
                <QuizPanel text={text} />
                <TextToSpeech text={text} />
                <ReadingCompanion text={text} />
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;