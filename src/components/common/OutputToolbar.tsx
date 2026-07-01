import { Copy, Download, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadText, wordCount } from "@/lib/format";

export function OutputToolbar({
  text,
  filename,
  onRegenerate,
  onClear,
  disabled,
}: {
  text: string;
  filename: string;
  onRegenerate?: () => void;
  onClear?: () => void;
  disabled?: boolean;
}) {
  const empty = !text.trim();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
      <div className="text-xs text-muted-foreground">
        {wordCount(text)} words • {text.length} characters
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={empty || disabled}
          onClick={() => {
            navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="h-3.5 w-3.5" /> Copy
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={empty || disabled}
          onClick={() => downloadText(filename, text)}
        >
          <Download className="h-3.5 w-3.5" /> Download
        </Button>
        {onRegenerate && (
          <Button
            size="sm"
            variant="outline"
            disabled={disabled}
            onClick={onRegenerate}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Regenerate
          </Button>
        )}
        {onClear && (
          <Button size="sm" variant="ghost" disabled={empty || disabled} onClick={onClear}>
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
}
