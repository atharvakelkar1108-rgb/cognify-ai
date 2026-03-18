import { ReadingSettings, FontFamily, SimplificationLevel, FONT_LABELS } from '@/types/reading';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, Type, ALargeSmall, SpaceIcon } from 'lucide-react';

interface ControlPanelProps {
  settings: ReadingSettings;
  onChange: (settings: ReadingSettings) => void;
}

const ControlPanel = ({ settings, onChange }: ControlPanelProps) => {
  const update = (partial: Partial<ReadingSettings>) =>
    onChange({ ...settings, ...partial });

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Reading Controls
      </h3>

      {/* Font Size */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ALargeSmall className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Font Size: {settings.fontSize}px</Label>
        </div>
        <Slider
          value={[settings.fontSize]}
          onValueChange={([v]) => update({ fontSize: v })}
          min={14}
          max={32}
          step={1}
          className="w-full"
        />
      </div>

      {/* Line Spacing */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <SpaceIcon className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Line Spacing: {settings.lineSpacing.toFixed(1)}</Label>
        </div>
        <Slider
          value={[settings.lineSpacing * 10]}
          onValueChange={([v]) => update({ lineSpacing: v / 10 })}
          min={12}
          max={30}
          step={1}
          className="w-full"
        />
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Font</Label>
        </div>
        <Select
          value={settings.fontFamily}
          onValueChange={(v) => update({ fontFamily: v as FontFamily })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(FONT_LABELS) as FontFamily[]).map((key) => (
              <SelectItem key={key} value={key}>
                {FONT_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Simplification Level */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Simplification Level</Label>
        <Select
          value={settings.simplificationLevel}
          onValueChange={(v) => update({ simplificationLevel: v as SimplificationLevel })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Focus Mode */}
      <div className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium cursor-pointer">Focus Mode</Label>
        </div>
        <Switch
          checked={settings.focusMode}
          onCheckedChange={(v) => update({ focusMode: v })}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
