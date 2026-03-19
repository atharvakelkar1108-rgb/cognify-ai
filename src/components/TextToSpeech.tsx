import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Pause, Play, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech = ({ text }: TextToSpeechProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [speed, setSpeed] = useState(0.9);
  const [pitch, setPitch] = useState(1);

  const speak = useCallback(() => {
    if (!text.trim()) {
      toast.error('No text to read!');
      return;
    }

    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = speed;
    utt.pitch = pitch;
    utt.lang = 'en-US';

    // Pick a clear voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('Natural')
    );
    if (preferred) utt.voice = preferred;

    utt.onstart = () => { setIsPlaying(true); setIsPaused(false); };
    utt.onend = () => { setIsPlaying(false); setIsPaused(false); };
    utt.onerror = () => { setIsPlaying(false); toast.error('Speech error!'); };

    setUtterance(utt);
    window.speechSynthesis.speak(utt);
  }, [text, speed, pitch]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Volume2 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Text to Speech</h3>
      </div>

      {/* Speed Control */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Reading Speed</span>
          <span>{speed}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Pitch Control */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Voice Pitch</span>
          <span>{pitch}</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isPlaying ? (
          <Button onClick={speak} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Read Aloud
          </Button>
        ) : (
          <>
            {isPaused ? (
              <Button onClick={resume} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            ) : (
              <Button onClick={pause} variant="outline" className="flex-1">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={stop} variant="destructive" size="icon">
              <StopCircle className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Status */}
      {isPlaying && (
        <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
          <Volume2 className="h-3 w-3" />
          {isPaused ? 'Paused' : 'Reading aloud...'}
        </div>
      )}

      {/* ADHD tip */}
      <p className="text-xs text-muted-foreground border-t border-border pt-3">
        💡 Tip: Slower speed (0.7-0.8x) helps with comprehension for dyslexia users.
      </p>
    </div>
  );
};

export default TextToSpeech;