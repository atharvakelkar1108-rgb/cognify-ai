import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import TextInputPanel from '@/components/TextInputPanel';
import ControlPanel from '@/components/ControlPanel';
import ReadingView from '@/components/ReadingView';
import BehaviorPanel from '@/components/BehaviorPanel';
import { ReadingSettings, DEFAULT_SETTINGS } from '@/types/reading';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Index = () => {
  const [text, setText] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [difficultParagraphs, setDifficultParagraphs] = useState<number[]>([]);

  const handleTextSubmit = useCallback((t: string) => {
    setText(t);
    setIsReading(true);
    setDifficultParagraphs([]);
  }, []);

  const handleBack = useCallback(() => {
    setIsReading(false);
    setDifficultParagraphs([]);
  }, []);

  const paragraphCount = text.split(/\n\s*\n/).filter((p) => p.trim()).length;

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
            <TextInputPanel onTextSubmit={handleTextSubmit} />
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-6">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to input
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              <ReadingView
                text={text}
                settings={settings}
                onBehaviorUpdate={setDifficultParagraphs}
              />

              <aside className="space-y-6">
                <ControlPanel settings={settings} onChange={setSettings} />
                <BehaviorPanel
                  difficultParagraphs={difficultParagraphs}
                  totalParagraphs={paragraphCount}
                />
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
