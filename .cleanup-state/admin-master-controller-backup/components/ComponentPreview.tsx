'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import type { ShadCNComponent } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@saa/shared/components/ui/dialog';
import { getPreviewComponent, hasPreview, FallbackPreview } from './previews/shadcn/previewRegistry';

interface ComponentPreviewProps {
  component: ShadCNComponent;
  isOpen: boolean;
  onClose: () => void;
}

export function ComponentPreview({ component, isOpen, onClose }: ComponentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const usageCode = getUsageCode(component.id);
  const PreviewComponent = getPreviewComponent(component.id);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(usageCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#191818] border-[#404040]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl text-[#e5e4dd]">{component.name}</DialogTitle>
              <DialogDescription className="mt-1 text-[#dcdbd5]">
                {component.description}
              </DialogDescription>
            </div>
            <a
              href={`https://ui.shadcn.com/docs/components/${component.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#00ff88] hover:bg-[#00ff88]/10 border border-transparent hover:border-[#00ff88]/30 rounded-md transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              Docs
            </a>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#404040]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 font-medium text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'preview'
                ? 'border-[#00ff88] text-[#00ff88]'
                : 'border-transparent text-[#dcdbd5] hover:text-[#e5e4dd]'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 font-medium text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'code'
                ? 'border-[#00ff88] text-[#00ff88]'
                : 'border-transparent text-[#dcdbd5] hover:text-[#e5e4dd]'
            }`}
          >
            Code
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">
          {activeTab === 'preview' ? (
            <div className="p-8 bg-[#404040]/20 rounded-lg border border-[#404040]">
              <div className="flex items-center justify-center min-h-[200px]">
                {PreviewComponent ? <PreviewComponent /> : <FallbackPreview componentName={component.name} />}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-[#e5e4dd]">Usage Example</h4>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#dcdbd5] hover:text-[#00ff88] hover:bg-[#00ff88]/10 border border-transparent hover:border-[#00ff88]/30 rounded-md transition-all duration-200"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#00ff88]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-[#404040]/50 text-[#00ff88] rounded-lg overflow-x-auto border border-[#404040]">
                <code className="text-sm font-mono">{usageCode}</code>
              </pre>

              <div className="p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg">
                <p className="text-sm text-[#00ff88]">
                  <strong>Note:</strong> Make sure to import the component from{' '}
                  <code className="px-1.5 py-0.5 bg-[#404040]/50 rounded">
                    @/components/ui/{component.id}
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Preview Status Badge */}
        {!hasPreview(component.id) && activeTab === 'preview' && (
          <div className="mt-4 p-3 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg">
            <p className="text-sm text-[#ffd700]">
              ℹ️ Interactive preview coming soon. Check the Code tab for usage examples.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper functions for examples and code snippets

function getExampleCode(componentId: string): string {
  const examples: Record<string, string> = {
    button: '<button class="px-4 py-2 bg-blue-600 text-white rounded-md">Click me</button>',
    dialog: '<div class="p-6 bg-white rounded-lg shadow-lg"><h2 class="text-xl font-bold">Dialog Title</h2><p class="mt-2 text-gray-600">Dialog content goes here.</p></div>',
    separator: '<hr class="border-gray-200 my-4" />',
    avatar: '<div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">AB</div>',
    'navigation-menu': '<nav class="flex gap-4"><a href="#" class="text-blue-600 hover:underline">Home</a><a href="#" class="text-gray-600 hover:underline">About</a></nav>',
  };

  return examples[componentId] || '<div class="text-gray-500">Preview not available</div>';
}

function getUsageCode(componentId: string): string {
  const usageExamples: Record<string, string> = {
    button: `import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Button variant="default" size="default">
      Click me
    </Button>
  )
}`,
    dialog: `import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Example() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            Dialog content goes here.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}`,
    separator: `import { Separator } from "@/components/ui/separator"

export function Example() {
  return (
    <div>
      <p>Section 1</p>
      <Separator className="my-4" />
      <p>Section 2</p>
    </div>
  )
}`,
    avatar: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Example() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}`,
  };

  return usageExamples[componentId] || `import { ${componentId} } from "@/components/ui/${componentId}"

// Usage example coming soon...`;
}

function hasVariants(componentId: string): boolean {
  return ['button', 'badge', 'alert'].includes(componentId);
}

function getVariants(componentId: string): string[] {
  const variants: Record<string, string[]> = {
    button: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    badge: ['default', 'secondary', 'destructive', 'outline'],
    alert: ['default', 'destructive'],
  };

  return variants[componentId] || [];
}
