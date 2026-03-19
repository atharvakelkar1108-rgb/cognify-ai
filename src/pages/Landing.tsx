import { Brain, Zap, BarChart2, Volume2, MessageCircle, Trophy, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '@/components/ThemeSwitcher';

interface LandingProps {
  onGetStarted: () => void;
}

const features = [
  { icon: <Zap className="h-6 w-6 text-purple-500" />, title: "AI Text Simplification", description: "Click any difficult paragraph and AI instantly rewrites it in simpler language" },
  { icon: <BarChart2 className="h-6 w-6 text-blue-500" />, title: "Behavior Tracking", description: "Tracks your reading patterns to automatically detect difficult sections" },
  { icon: <Brain className="h-6 w-6 text-green-500" />, title: "Cognitive Dashboard", description: "Personal reading profile with focus score, speed and difficulty analysis" },
  { icon: <Trophy className="h-6 w-6 text-yellow-500" />, title: "Comprehension Quiz", description: "AI generates quiz questions to test your understanding after reading" },
  { icon: <Volume2 className="h-6 w-6 text-red-500" />, title: "Text to Speech", description: "Listen to any text with adjustable speed — perfect for dyslexia users" },
  { icon: <MessageCircle className="h-6 w-6 text-indigo-500" />, title: "AI Reading Companion", description: "Ask questions about the text and get instant simple explanations" },
];

const stats = [
  { value: "2x", label: "Faster Reading" },
  { value: "85%", label: "Better Comprehension" },
  { value: "6+", label: "AI Features" },
  { value: "100%", label: "Free to Use" },
];

const Landing = ({ onGetStarted }: LandingProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Cognify AI</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Adaptive reading for every mind</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Button onClick={onGetStarted}>Start Reading</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 pointer-events-none" />
        <div className="container max-w-6xl mx-auto px-4 pt-20 pb-16 text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            Built for ADHD & Dyslexia Users
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Read with
            <span className="text-primary"> Clarity</span>
            <br />& Confidence
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Cognify AI adapts to how YOU read. It detects difficult sections,
            simplifies them instantly, and helps you understand better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
              Start Reading Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6"
              onClick={() => window.open('https://github.com/atharvakelkar1108-rgb/cognify-ai', '_blank')}>
              View on GitHub
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-card border border-border p-4">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Everything you need to read better</h2>
          <p className="text-muted-foreground text-lg">Powered by AI, designed for accessibility</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="rounded-lg bg-accent/50 w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Who is it for */}
      <div className="bg-accent/30 py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Who is Cognify AI for?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: "🧠", title: "ADHD Users", points: ["Focus mode highlights one line", "Behavior tracking detects loss of focus", "Short simplified text reduces overwhelm"] },
              { emoji: "📚", title: "Dyslexia Users", points: ["Dyslexia-friendly fonts", "Text to speech support", "Simplified vocabulary"] },
              { emoji: "🎓", title: "Students", points: ["Quiz generator tests comprehension", "AI companion explains concepts", "Progress tracking over time"] },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-lg mb-4 text-foreground">{item.title}</h3>
                <ul className="space-y-2">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to read with clarity?</h2>
        <p className="text-muted-foreground mb-8 text-lg">Free forever. No signup required. Just paste your text and start!</p>
        <Button size="lg" onClick={onGetStarted} className="text-lg px-10 py-6">
          Get Started Now — It's Free!
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Cognify AI</span>
          </div>
          <p>Built with ❤️ for KodeMaster AI Hackathon 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;