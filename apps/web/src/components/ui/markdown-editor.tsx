import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Markdown } from './markdown';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, maxLength = 10000, placeholder }: MarkdownEditorProps) {
  return (
    <Tabs defaultValue="write" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="write" className="flex-1">入力</TabsTrigger>
        <TabsTrigger value="preview" className="flex-1">プレビュー</TabsTrigger>
      </TabsList>
      <TabsContent value="write">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          maxLength={maxLength}
        />
        <p className="mt-1 text-xs text-muted-foreground text-right">
          {value.length} / {maxLength.toLocaleString()}
        </p>
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-[130px] rounded-md border p-3">
          {value ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-sm text-muted-foreground">プレビューなし</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
