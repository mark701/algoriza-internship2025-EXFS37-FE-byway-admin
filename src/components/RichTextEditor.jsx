import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Calendar, Link, X } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = "Enter text...", disabled = false, rows = 4 }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    if (disabled) return;
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleBullets = () => execCommand('insertUnorderedList');
  const handleNumbering = () => execCommand('insertOrderedList');

  const handleCalendar = () => {
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    execCommand('insertHTML', `📅 ${today} `);
  };

  const handleLinkInsert = () => {
    if (linkText && linkUrl) {
      const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${linkText}</a>`;
      execCommand('insertHTML', linkHTML);
      setShowLinkModal(false);
      setLinkText('');
      setLinkUrl('');
    }
  };

  const ToolbarButton = ({ onClick, icon: Icon, title, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const minHeight = `${rows * 1.5}rem`;

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg border-b-0">
        <ToolbarButton onClick={handleBold} icon={Bold} title="Bold (Ctrl+B)" />
        <ToolbarButton onClick={handleItalic} icon={Italic} title="Italic (Ctrl+I)" />
        <ToolbarButton onClick={handleUnderline} icon={Underline} title="Underline (Ctrl+U)" />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={handleBullets} icon={List} title="Bullet List" />
        <ToolbarButton onClick={handleNumbering} icon={ListOrdered} title="Numbered List" />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={handleCalendar} icon={Calendar} title="Insert Date" />
        <ToolbarButton onClick={() => !disabled && setShowLinkModal(true)} icon={Link} title="Insert Link" />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        className={`w-full p-3 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none overflow-auto ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
        }`}
        style={{ minHeight }}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />

      <style>{`
        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
          position: absolute;
        }
        [contentEditable] {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        [contentEditable] ul, [contentEditable] ol {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        [contentEditable] li {
          margin-bottom: 0.25rem;
        }
      `}</style>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Insert Link</h3>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkText('');
                  setLinkUrl('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowLinkModal(false);
                    setLinkText('');
                    setLinkUrl('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLinkInsert}
                  disabled={!linkText || !linkUrl}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;