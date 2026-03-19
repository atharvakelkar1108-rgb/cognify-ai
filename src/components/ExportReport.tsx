import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExportReportProps {
  text: string;
  difficultParagraphs: number[];
  totalParagraphs: number;
  simplifiedCount: number;
  quizScore?: { score: number; total: number } | null;
}

const ExportReport = ({
  text,
  difficultParagraphs,
  totalParagraphs,
  simplifiedCount,
  quizScore
}: ExportReportProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    if (!text.trim()) {
      toast.error('No reading session to export!');
      return;
    }

    setIsGenerating(true);
    try {
      const wordCount = text.split(/\s+/).filter(w => w.trim()).length;
      const focusScore = Math.max(0, 100
        - (difficultParagraphs.length * 10)
        - (simplifiedCount * 2)
      );

      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user123',
          text_preview: text.substring(0, 150),
          duration_seconds: 120,
          difficult_count: difficultParagraphs.length,
          total_paragraphs: totalParagraphs,
          simplified_count: simplifiedCount,
          focus_score: focusScore,
          quiz_score: quizScore?.score ?? 0,
          quiz_total: quizScore?.total ?? 0,
          reading_speed: wordCount > 0 ? Math.round(wordCount / 2) : 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate report');

      // Download PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cognify_report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded! 📄');
    } catch (e) {
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Export Report</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Download a PDF report of your reading session with AI recommendations!
      </p>
      <Button
        onClick={generateReport}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download PDF Report
          </>
        )}
      </Button>
    </div>
  );
};

export default ExportReport;