'use client';

/**
 * Email Editor Component
 *
 * Tiptap-based WYSIWYG editor for holiday email templates
 * Features:
 * - Bold, Italic, Underline
 * - Headings (H1, H2, H3)
 * - Text colors
 * - Links
 * - Images
 * - Text alignment
 * - Personalization token insertion
 */

import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TextAlign } from '@tiptap/extension-text-align';
import { mergeAttributes } from '@tiptap/core';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  MoveHorizontal,
  WrapText
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface EmailEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
  onInsertToken?: (token: string) => void;
}

// Custom Image extension that supports style attribute
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style'),
        renderHTML: (attributes) => {
          if (!attributes.style) {
            return {};
          }
          return {
            style: attributes.style,
          };
        },
      },
    };
  },
});

export function EmailEditor({ initialContent, onChange }: EmailEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageControls, setShowImageControls] = useState(false);
  const [imageWidth, setImageWidth] = useState('');
  const [imageAlign, setImageAlign] = useState('left');
  const [imageFloat, setImageFloat] = useState('none');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#00ff88] underline',
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'email-editor-image',
          loading: 'lazy',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialContent,
    immediatelyRender: false, // Prevent SSR hydration mismatch
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4 bg-[rgba(26,26,26,0.5)] border border-[#404040] rounded-lg text-[#e5e4dd]',
        style: 'color: #e5e4dd;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      // Show image controls when image is selected
      setShowImageControls(editor.isActive('image'));

      if (editor.isActive('image')) {
        const attrs = editor.getAttributes('image');
        const style = attrs.style || '';

        // Extract current width
        const widthMatch = style.match(/width:\s*(\d+)px/);
        if (widthMatch) {
          setImageWidth(widthMatch[1]);
        } else {
          setImageWidth('');
        }

        // Detect float
        if (style.includes('float: left')) {
          setImageFloat('left');
        } else if (style.includes('float: right')) {
          setImageFloat('right');
        } else {
          setImageFloat('none');

          // If no float, detect alignment
          if (style.includes('margin-left: auto') && style.includes('margin-right: auto')) {
            setImageAlign('center');
          } else if (style.includes('margin-left: auto')) {
            setImageAlign('right');
          } else {
            setImageAlign('left');
          }
        }
      }
    },
  });

  if (!editor) {
    return <div className="p-4 text-[#dcdbd5]">Loading editor...</div>;
  }

  const insertToken = (token: string) => {
    editor.chain().focus().insertContent(`{{${token}}}`).run();
  };

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      const cleanUrl = url.trim();
      if (cleanUrl) {
        // Insert image without alt text to avoid showing "image" text
        editor.chain().focus().setImage({ src: cleanUrl }).run();
      }
    }
  };

  const buildImageStyle = (width: string, align: string, float: string) => {
    let styles: string[] = [];

    // Add width - if specified, use it; otherwise use max-width for responsiveness
    const widthNum = parseInt(width);
    if (width && !isNaN(widthNum) && widthNum > 0) {
      styles.push(`width: ${widthNum}px`);
      styles.push('max-width: 100%'); // Ensure it doesn't overflow
    } else {
      styles.push('max-width: 100%');
    }

    // Always set height to auto
    styles.push('height: auto');

    // Add float or alignment
    if (float === 'left') {
      styles.push('float: left');
      styles.push('margin-right: 1rem');
      styles.push('margin-bottom: 0.5rem');
    } else if (float === 'right') {
      styles.push('float: right');
      styles.push('margin-left: 1rem');
      styles.push('margin-bottom: 0.5rem');
    } else {
      // No float, use block alignment
      styles.push('display: block');
      if (align === 'center') {
        styles.push('margin-left: auto');
        styles.push('margin-right: auto');
      } else if (align === 'right') {
        styles.push('margin-left: auto');
        styles.push('margin-right: 0');
      } else {
        // left alignment
        styles.push('margin-left: 0');
        styles.push('margin-right: auto');
      }
    }

    return styles.join('; ');
  };

  const updateImageWidth = (width: string) => {
    if (!editor.isActive('image')) return;

    const style = buildImageStyle(width, imageAlign, imageFloat);
    editor.commands.updateAttributes('image', { style });
    setImageWidth(width);
  };

  const updateImageAlignment = (alignment: string) => {
    if (!editor.isActive('image')) return;

    const style = buildImageStyle(imageWidth, alignment, imageFloat);
    editor.commands.updateAttributes('image', { style });
    setImageAlign(alignment);
  };

  const updateImageFloat = (float: string) => {
    if (!editor.isActive('image')) return;

    const style = buildImageStyle(imageWidth, imageAlign, float);
    editor.commands.updateAttributes('image', { style });
    setImageFloat(float);
  };

  return (
    <div className="space-y-3">
      <style jsx global>{`
        .tiptap {
          color: #e5e4dd !important;
        }
        .tiptap p,
        .tiptap h1,
        .tiptap h2,
        .tiptap h3,
        .tiptap h4,
        .tiptap h5,
        .tiptap h6,
        .tiptap li,
        .tiptap span {
          color: inherit;
        }
        .tiptap img {
          border-radius: 4px;
          cursor: pointer;
        }
        .tiptap img:hover {
          outline: 2px solid rgba(0, 255, 136, 0.5);
          outline-offset: 2px;
        }
        .tiptap img.ProseMirror-selectednode {
          outline: 2px solid #00ff88;
          outline-offset: 2px;
        }
      `}</style>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded-lg">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#404040]">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive('bold')
                ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive('italic')
                ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#404040]">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#404040]">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Text Color */}
        <div className="relative pr-2 border-r border-[#404040]">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded transition-colors hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]"
            title="Text Color"
          >
            <Type className="w-4 h-4" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-[#1a1a1a] border border-[#404040] rounded-lg shadow-xl z-10">
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['#ffd700', '#00ff88', '#e5e4dd', '#ffffff', '#ff4444', '#ff9900', '#4444ff', '#000000'].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                    className="w-8 h-8 rounded border-2 border-[#404040] hover:border-[#ffd700] transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="w-full text-xs px-2 py-1 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] rounded transition-colors text-[#dcdbd5]"
              >
                Reset Color
              </button>
            </div>
          )}
        </div>

        {/* Link */}
        <div className="relative pr-2 border-r border-[#404040]">
          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-2 rounded transition-colors ${
              editor.isActive('link')
                ? 'bg-[rgba(255,215,0,0.2)] text-[#ffd700]'
                : 'hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]'
            }`}
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </button>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-[#1a1a1a] border border-[#404040] rounded-lg shadow-xl z-10 w-64">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 bg-[rgba(64,64,64,0.5)] border border-[#404040] rounded text-[#e5e4dd] text-sm mb-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setLink();
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={setLink}
                  className="flex-1 px-3 py-1 bg-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.3)] rounded text-xs text-[#00ff88]"
                >
                  Insert
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    setShowLinkInput(false);
                  }}
                  className="px-3 py-1 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] rounded text-xs text-[#dcdbd5]"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Image */}
        <button
          onClick={addImage}
          className="p-2 rounded transition-colors hover:bg-[rgba(255,255,255,0.1)] text-[#dcdbd5]"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Image Controls - Show when image is selected */}
      {showImageControls && (
        <div className="p-3 bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] rounded-lg">
          <div className="flex items-center gap-6 flex-wrap">
            {/* Image Settings Label */}
            <div className="text-xs text-[#00ff88] font-medium">Image Settings:</div>

            {/* Image Width */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#dcdbd5]">Width:</label>
              <input
                type="number"
                value={imageWidth}
                onChange={(e) => {
                  setImageWidth(e.target.value);
                  updateImageWidth(e.target.value);
                }}
                placeholder="Auto"
                className="w-24 px-2 py-1 bg-[rgba(26,26,26,0.5)] border border-[#404040] rounded text-[#e5e4dd] text-xs"
              />
              <span className="text-xs text-[#999]">px</span>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-[rgba(0,255,136,0.3)]"></div>

            {/* Image Alignment */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#dcdbd5]">Align:</label>
              <div className="flex gap-1">
                <button
                  onClick={() => updateImageAlignment('left')}
                  className={`p-1.5 text-xs rounded transition-colors ${
                    imageAlign === 'left' && imageFloat === 'none'
                      ? 'bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.5)] text-[#00ff88]'
                      : 'bg-[rgba(64,64,64,0.5)] border border-[#404040] text-[#dcdbd5] hover:bg-[rgba(255,255,255,0.1)]'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateImageAlignment('center')}
                  className={`p-1.5 text-xs rounded transition-colors ${
                    imageAlign === 'center' && imageFloat === 'none'
                      ? 'bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.5)] text-[#00ff88]'
                      : 'bg-[rgba(64,64,64,0.5)] border border-[#404040] text-[#dcdbd5] hover:bg-[rgba(255,255,255,0.1)]'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateImageAlignment('right')}
                  className={`p-1.5 text-xs rounded transition-colors ${
                    imageAlign === 'right' && imageFloat === 'none'
                      ? 'bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.5)] text-[#00ff88]'
                      : 'bg-[rgba(64,64,64,0.5)] border border-[#404040] text-[#dcdbd5] hover:bg-[rgba(255,255,255,0.1)]'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-[rgba(0,255,136,0.3)]"></div>

            {/* Text Wrapping */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#dcdbd5]">Wrap:</label>
              <div className="flex gap-1">
                <button
                  onClick={() => updateImageFloat('none')}
                  className={`px-2 py-1.5 text-xs rounded transition-colors flex items-center gap-1 ${
                    imageFloat === 'none'
                      ? 'bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.5)] text-[#00ff88]'
                      : 'bg-[rgba(64,64,64,0.5)] border border-[#404040] text-[#dcdbd5] hover:bg-[rgba(255,255,255,0.1)]'
                  }`}
                  title="No text wrapping (block display)"
                >
                  <MoveHorizontal className="w-3.5 h-3.5" />
                  <span className="text-[10px]">None</span>
                </button>
                <button
                  onClick={() => updateImageFloat('left')}
                  className={`px-2 py-1.5 text-xs rounded transition-colors flex items-center gap-1 ${
                    imageFloat === 'left'
                      ? 'bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.5)] text-[#00ff88]'
                      : 'bg-[rgba(64,64,64,0.5)] border border-[#404040] text-[#dcdbd5] hover:bg-[rgba(255,255,255,0.1)]'
                  }`}
                  title="Float left with text wrapping on right"
                >
                  <WrapText className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Left</span>
                </button>
                <button
                  onClick={() => updateImageFloat('right')}
                  className={`px-2 py-1.5 text-xs rounded transition-colors flex items-center gap-1 ${
                    imageFloat === 'right'
                      ? 'bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.5)] text-[#00ff88]'
                      : 'bg-[rgba(64,64,64,0.5)] border border-[#404040] text-[#dcdbd5] hover:bg-[rgba(255,255,255,0.1)]'
                  }`}
                  title="Float right with text wrapping on left"
                >
                  <WrapText className="w-3.5 h-3.5" style={{ transform: 'scaleX(-1)' }} />
                  <span className="text-[10px]">Right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personalization Tokens */}
      <div className="p-3 bg-[rgba(64,64,64,0.3)] border border-[#404040] rounded-lg">
        <div className="text-xs text-[#dcdbd5] mb-2">Insert Personalization Token:</div>
        <div className="flex flex-wrap gap-2">
          {['firstName', 'lastName', 'email', 'phone'].map((token) => (
            <button
              key={token}
              onClick={() => insertToken(token)}
              className="px-3 py-1 text-xs bg-[rgba(255,215,0,0.1)] hover:bg-[rgba(255,215,0,0.2)] border border-[rgba(255,215,0,0.3)] rounded transition-colors text-[#ffd700]"
            >
              {`{{${token}}}`}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
