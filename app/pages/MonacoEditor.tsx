'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import FileExplorer from '../components/FileExplorer';
import MonacoEditor from '../components/Editor';
import { X, Minimize2, Upload, FolderOpen, FilePlus, Rocket } from 'lucide-react';
import { getLanguage, getDefaultContent } from "../lib/files";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  openFile,
  updateFileContent,
  closeFile,
  saveFile,
  setActiveFileIndex,
  addFileToTree,
  FileSystemItem,
} from '../store/fileSlice';
import { Room } from 'livekit-client';
import { useDebounceFileSync } from '../hooks/liveKit';

interface IDEPageProps {
  room: Room;
}

const IDEPage: React.FC<IDEPageProps> = ({ room }) => {
  const sidebarWidth = 250;
  const [explorerCollapsed, setExplorerCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileExplorerRef = useRef<{ addFile: (file: FileSystemItem) => void; createNewFile: () => void; createNewFolder: () => void }>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const openFiles = useSelector((state: RootState) => state.file.openFiles);
  const activeFileIndex = useSelector((state: RootState) => state.file.activeFileIndex);
  
  // LiveKit sync for debounced content changes
  const debouncedSendContent = useDebounceFileSync(room, 500);

  // Handle file selection from explorer
  const handleFileSelect = async (file: FileSystemItem) => {
    if (file.type === 'file') {
      // Check if file is already open
      const existingIndex = openFiles.findIndex(f => f.item.path === file.path);
      
      if (existingIndex !== -1) {
        // File already open, just switch to it
        dispatch(setActiveFileIndex(existingIndex));
      } else {
        // Open new file - use the content from the file item or provide default content
        const content = file.content || getDefaultContent(file.name);
        
        dispatch(openFile({
          item: file,
          content,
          isDirty: false
        }));
      }
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Handle uploaded files
  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    Array.from(files).forEach(async (file) => {
      try {
        const content = await file.text();
        const fileItem: FileSystemItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'file',
          path: file.name,
          size: file.size,
          lastModified: file.lastModified,
          content: content
        };

        // Add file to Redux store
        dispatch(addFileToTree(fileItem));

        // Add file to explorer
        if (fileExplorerRef.current) {
          fileExplorerRef.current.addFile(fileItem);
        }

        // Auto-open the uploaded file
        dispatch(openFile({
          item: fileItem,
          content,
          isDirty: false
        }));

      } catch (error) {
        console.error('Error reading file:', error);
      }
    });

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file content change
  const handleContentChange = (newContent: string | undefined) => {
    if (activeFileIndex >= 0 && newContent !== undefined) {
      const activeFile = openFiles[activeFileIndex];
      
      // Update content in Redux store
      dispatch(updateFileContent({ index: activeFileIndex, newContent }));
      
      // Send content change to other participants via LiveKit
      if (activeFile) {
        debouncedSendContent(activeFile.item.path, newContent);
      }
    }
  };

  // Close file tab
  const closeFileHandler = (index: number) => {
    dispatch(closeFile(index));
  };

  
  
  // Create new file using file explorer
  const createNewFile = () => {
    if (fileExplorerRef.current) {
      fileExplorerRef.current.createNewFile();
    }
  };
  
  // Save current file with Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeFileIndex >= 0) {
          dispatch(saveFile(activeFileIndex));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeFileIndex, dispatch]);

  // Get language for syntax highlighting
  const language = useMemo(() => 
    getLanguage(activeFileIndex >= 0 ? openFiles[activeFileIndex].item.name : ''), 
    [activeFileIndex, openFiles]
  );

  const activeFile = activeFileIndex >= 0 ? openFiles[activeFileIndex] : null;
  
  return (
    <div className="h-screen bg-[#252526] flex flex-col">
      {/* Title Bar */}
      <div className="border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-[#007ACC] font-semibold flex"> <Rocket/> &nbsp; Code Fudji</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={createNewFile}
              className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              title="New File"
            >
              <FilePlus className="w-4 h-4" />
            </button>
            <button
              onClick={handleFileUpload}
              className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              title="Upload Files"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => setExplorerCollapsed(!explorerCollapsed)}
              className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              title={explorerCollapsed ? "Show Explorer" : "Hide Explorer"}
            >
              {explorerCollapsed ? <FolderOpen className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - File Explorer */}
        {!explorerCollapsed && (
          <div 
            className="bg-gray-800 border-r border-gray-700 flex-shrink-0"
            style={{ width: sidebarWidth }}
          >
            <FileExplorer 
              ref={fileExplorerRef}
              room={room}
              onFileSelect={handleFileSelect}
              onFolderOpen={(file) => handleFileSelect(file)}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          {openFiles.length > 0 && (
            <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto">
              {openFiles.map((file, index) => (
                <div
                  key={file.item.path}
                  className={`flex items-center px-4 py-2 border-r border-gray-700 cursor-pointer min-w-0 max-w-xs group ${
                    index === activeFileIndex 
                      ? 'bg-gray-900 text-white border-t-2 border-t-blue-400' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => dispatch(setActiveFileIndex(index))}
                >
                  <span className="truncate text-sm">
                    {file.item.name}
                    {file.isDirty && <span className="ml-1 text-yellow-400">●</span>}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFileHandler(index);
                    }}
                    className="ml-2 p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Editor Area */}
          <div className="flex-1">
            {activeFile ? (
              <MonacoEditor
                value={activeFile.content}
                onChange={handleContentChange}
                language={language}
                theme="vs-dark"
                width={`calc(100% - ${explorerCollapsed ? 0 : sidebarWidth - 290.8}px)`}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-[#252526] text-gray-400">
                <div className="text-center">
                  <div className=" mb-6 flex justify-center"><Rocket size={40}/></div>
                  <h2 className="text-2xl mb-4 text-white">Welcome to Code Fudji IDE</h2>
                  <p className="text-sm mb-6 max-w-md">
                    {explorerCollapsed 
                      ? 'Click the folder icon to open the file explorer and start coding' 
                      : 'Create a new file or upload existing files to start editing'}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleFileUpload}
                      className="px-4 py-2 bg-[#007ACC] text-white rounded-md hover:bg-[#005a9e] transition-colors flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Files</span>
                    </button>
                    {explorerCollapsed && (
                      <button
                        onClick={() => setExplorerCollapsed(false)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center space-x-2"
                      >
                        <FolderOpen className="w-4 h-4" />
                        <span>Open Explorer</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#007ACC] text-white px-4 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {activeFile && (
            <>
              <span className="capitalize">{language}</span>
              <span>UTF-8</span>
              {activeFile.isDirty && (
                <span className="text-yellow-200">● Unsaved</span>
              )}
            </>
          )}
          
        </div>
        <div className="flex items-center space-x-4">
          <span>{openFiles.length} file{openFiles.length !== 1 ? 's' : ''} open</span>
          {activeFile && (
            <span>Press Ctrl+S to save</span>
          )}
          <span>
            {room.remoteParticipants.size + 1} participant{room.remoteParticipants.size !== 0 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
        accept="*/*"
      />
    </div>
  );
};

export default IDEPage;