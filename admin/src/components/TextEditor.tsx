import React, { useState, useRef, useEffect } from "react";

import {
  FaBold,
  FaItalic,
  FaLink,
  FaList,
  FaListOl,
  FaUnderline,
} from "react-icons/fa6";
import { IoMdRedo, IoMdUndo } from "react-icons/io";
import Button from "./Buttons/Button";

interface TextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Function to check which formats are active at cursor position
  const updateActiveFormats = () => {
    const formats = new Set<string>();

    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      if (document.queryCommandState("insertUnorderedList"))
        formats.add("insertUnorderedList");
      if (document.queryCommandState("insertOrderedList"))
        formats.add("insertOrderedList");
    } catch (e) {
      // Ignore errors from queryCommandState
    }

    setActiveFormats(formats);
  };

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();

    // Update active formats after command execution
    setTimeout(updateActiveFormats, 0);
  };

  const updateContent = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLinkClick = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
      setLinkText(selection.toString());
    } else {
      setSelectedText("");
      setLinkText("");
    }
    setShowLinkDialog(true);
  };

  const insertLink = () => {
    if (linkUrl) {
      if (selectedText) {
        handleCommand("createLink", linkUrl);
      } else if (linkText) {
        // Store current selection/cursor position
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (range && editorRef.current) {
          // Create the link element
          const linkElement = document.createElement("a");
          linkElement.href = linkUrl;
          linkElement.target = "_blank";
          linkElement.rel = "noopener noreferrer";
          linkElement.textContent = linkText;

          // Insert the link at cursor position
          range.deleteContents();
          range.insertNode(linkElement);

          // Move cursor after the link
          range.setStartAfter(linkElement);
          range.setEndAfter(linkElement);
          selection?.removeAllRanges();
          selection?.addRange(range);

          updateContent();
        }
      }
    }
    setShowLinkDialog(false);
    setLinkUrl("");
    setLinkText("");
    setSelectedText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          handleCommand("bold");
          break;
        case "i":
          e.preventDefault();
          handleCommand("italic");
          break;
        case "u":
          e.preventDefault();
          handleCommand("underline");
          break;
        case "k":
          e.preventDefault();
          handleLinkClick();
          break;
        case "z":
          e.preventDefault();
          if (e.shiftKey) {
            handleCommand("redo");
          } else {
            handleCommand("undo");
          }
          break;
      }
    }
  };

  // Handle selection change and input to update active formats
  const handleSelectionChange = () => {
    updateActiveFormats();
  };

  const handleInput = () => {
    updateContent();
    updateActiveFormats();
  };

  // Add event listener for selection changes
  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    command: string;
    value?: string;
    isActive?: boolean;
    onClick?: () => void;
    title: string;
  }> = ({ icon, command, value, isActive, onClick, title }) => {
    const active = isActive || activeFormats.has(command);

    return (
      <button
        type="button"
        onClick={onClick || (() => handleCommand(command, value))}
        className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-off-white hover:text-off-black ${
          active ? "bg-off-white text-off-black" : "text-cold-gray"
        }`}
        title={title}
      >
        {icon}
      </button>
    );
  };

  return (
    <div
      className={`border border-cold-gray/70 rounded-sm overflow-hidden shadow-sm ${className}`}
    >
      {/* Toolbar */}
      <div className="border-b border-cold-gray/70 p-3">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 mr-3">
            <ToolbarButton
              icon={<FaBold className="w-4 h-4" />}
              command="bold"
              title="Bold (Ctrl+B)"
            />
            <ToolbarButton
              icon={<FaItalic className="w-4 h-4" />}
              command="italic"
              title="Italic (Ctrl+I)"
            />
            <ToolbarButton
              icon={<FaUnderline className="w-4 h-4" />}
              command="underline"
              title="Underline (Ctrl+U)"
            />
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Lists */}
          <div className="flex items-center gap-1 mr-3">
            <ToolbarButton
              icon={<FaList className="w-4 h-4" />}
              command="insertUnorderedList"
              title="Bullet List"
            />
            <ToolbarButton
              icon={<FaListOl className="w-4 h-4" />}
              command="insertOrderedList"
              title="Numbered List"
            />
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Link */}
          <div className="flex items-center gap-1 mr-3">
            <ToolbarButton
              icon={<FaLink className="w-4 h-4" />}
              command=""
              onClick={handleLinkClick}
              title="Insert Link (Ctrl+K)"
            />
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              icon={<IoMdUndo className="w-4 h-4" />}
              command="undo"
              title="Undo (Ctrl+Z)"
            />
            <ToolbarButton
              icon={<IoMdRedo className="w-4 h-4" />}
              command="redo"
              title="Redo (Ctrl+Shift+Z)"
            />
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto focus:outline-none"
        style={{ caretColor: "#3B82F6" }}
        data-placeholder={placeholder}
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-off-black rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaLink className="w-5 h-5" />
              Insert Link
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cold-gray mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 text-off-black bg-off-white py-2 rounded-sm shadow-off-white/10 focus:shadow-lg"
                  autoFocus
                />
              </div>

              {!selectedText && (
                <div>
                  <label className="block text-sm font-medium text-cold-gray mb-2">
                    Link Text
                  </label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Link text"
                    className="w-full px-3 text-off-black bg-off-white py-2 rounded-sm shadow-off-white/10 focus:shadow-lg"
                  />
                </div>
              )}

              {selectedText && (
                <div>
                  <label className="block text-sm font-medium text-cold-gray mb-2">
                    Selected Text
                  </label>
                  <div className="px-3 py-2 bg-off-white rounded-lg border text-off-black">
                    "{selectedText}"
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                content="Cancel"
                action={() => setShowLinkDialog(false)}
                variant="secondary"
              />
              <Button
                content="Insert Link"
                action={insertLink}
                variant="cta"
                disabled={!linkUrl || (!selectedText && !linkText)}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }

        [contenteditable] {
          line-height: 1.6;
        }

        [contenteditable] strong {
          font-weight: bold;
        }

        [contenteditable] em {
          font-style: italic;
        }

        [contenteditable] u {
          text-decoration: underline;
        }

        [contenteditable] ul {
          list-style: disc;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        [contenteditable] ol {
          list-style: decimal;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        [contenteditable] li {
          margin-bottom: 0.25rem;
        }

        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }

        [contenteditable] a:hover {
          color: #1d4ed8;
        }

        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;
