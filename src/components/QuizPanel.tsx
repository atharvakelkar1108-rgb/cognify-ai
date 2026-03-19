import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

interface QuizPanelProps {
  text: string;
}

const QuizPanel = ({ text }: QuizPanelProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const generateQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, num_questions: 5 }),
      });
      const data = await response.json();
      setQuestions(data.questions);
      setIsStarted(true);
      setCurrentIndex(0);
      setScore(0);
      setIsFinished(false);
    } catch {
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    const letter = option.charAt(0);
    setSelectedAnswer(letter);
    setIsAnswered(true);
    if (letter === questions[currentIndex].correct) {
      setScore(prev => prev + 1);
      toast.success('Correct! 🎉');
    } else {
      toast.error('Wrong answer!');
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setIsStarted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const getOptionStyle = (option: string) => {
    if (!isAnswered) return 'hover:bg-accent cursor-pointer';
    const letter = option.charAt(0);
    if (letter === questions[currentIndex].correct) return 'bg-green-100 border-green-500 text-green-800';
    if (letter === selectedAnswer) return 'bg-red-100 border-red-500 text-red-800';
    return 'opacity-50';
  };

  // Not started yet
  if (!isStarted) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Comprehension Quiz</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Test your understanding with AI-generated questions!
        </p>
        <Button onClick={generateQuiz} disabled={isLoading} className="w-full">
          {isLoading ? 'Generating Quiz...' : 'Generate Quiz 🧠'}
        </Button>
      </div>
    );
  }

  // Finished
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center space-y-4">
        <Trophy className="h-12 w-12 text-yellow-500 mx-auto" />
        <h3 className="text-xl font-bold">Quiz Complete!</h3>
        <div className="text-4xl font-bold text-primary">{percentage}%</div>
        <p className="text-muted-foreground">
          You got {score} out of {questions.length} correct!
        </p>
        <div className={`text-sm font-medium ${percentage >= 70 ? 'text-green-600' : 'text-red-500'}`}>
          {percentage >= 70 ? '🎉 Great understanding!' : '📚 Try reading again!'}
        </div>
        <Button onClick={handleRestart} variant="outline" className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Quiz</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1}/{questions.length} · Score: {score}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <p className="font-medium text-foreground">{currentQuestion.question}</p>

      {/* Options */}
      <div className="space-y-2">
        {currentQuestion.options.map((option, idx) => (
          <div
            key={idx}
            onClick={() => handleAnswer(option)}
            className={`p-3 rounded-lg border transition-all text-sm ${getOptionStyle(option)}`}
          >
            {option}
          </div>
        ))}
      </div>

      {/* Explanation after answer */}
      {isAnswered && (
        <div className="p-3 rounded-lg bg-accent text-sm">
          <div className="flex items-center gap-2 mb-1">
            {selectedAnswer === currentQuestion.correct
              ? <CheckCircle className="h-4 w-4 text-green-500" />
              : <XCircle className="h-4 w-4 text-red-500" />
            }
            <span className="font-medium">
              {selectedAnswer === currentQuestion.correct ? 'Correct!' : `Correct answer: ${currentQuestion.correct}`}
            </span>
          </div>
          <p className="text-muted-foreground">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <Button onClick={handleNext} className="w-full">
          {currentIndex + 1 >= questions.length ? 'See Results 🏆' : 'Next Question →'}
        </Button>
      )}
    </div>
  );
};

export default QuizPanel;