import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, ClipboardPaste } from 'lucide-react';

interface TextInputPanelProps {
  onTextSubmit: (text: string) => void;
}

const TextInputPanel = ({ onTextSubmit }: TextInputPanelProps) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain') {
      const content = await file.text();
      setText(content);
    } else if (file.type === 'application/pdf') {
      // Basic PDF text extraction - in production you'd use pdf.js
      const content = await file.text();
      setText(`[PDF uploaded: ${file.name}]\n\nPDF text extraction will be enhanced with AI integration. For now, please paste the text content directly.`);
    } else {
      setText(`Unsupported file type. Please use .txt or .pdf files.`);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch {
      // Clipboard API not available
    }
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Add Your Text</h2>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        className="min-h-[200px] bg-background text-base leading-relaxed resize-y"
      />

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => onTextSubmit(text)} disabled={!text.trim()} size="lg">
          Start Reading
        </Button>

        <Button variant="outline" onClick={handlePaste}>
          <ClipboardPaste className="h-4 w-4 mr-2" />
          Paste from Clipboard
        </Button>

        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default TextInputPanel;
